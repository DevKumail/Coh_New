import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { IvfConfirmDialogComponent } from './ivf-confirm-dialog.component';
import { AddLabOrderComponent } from './add-lab-order.component';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { IvfCreateLabOrderDto } from '@/app/shared/Services/IVF/dtos/ivf-lab-orders.dto';
import { SampleCollectionComponent } from './sample-collection.component';
import { OrderCompletionComponent } from './order-completion.component';
import { forkJoin, of } from 'rxjs';
import { NgbToast, NgbToastModule, NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ivf-ps-lab-orders',
  standalone: true,
  imports: [
    CommonModule, 
    GenericPaginationComponent, 
    AddLabOrderComponent, 
    IvfConfirmDialogComponent, 
    SampleCollectionComponent, 
    OrderCompletionComponent,
    NgbToast,
    NgbToastModule,
    NgbModalModule
  ],
  styles: [`
    .skeleton-loader { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation: loading 1.5s ease-in-out infinite; border-radius:4px; }
    @keyframes loading { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  `],
  template: `
    <!-- Toast Notifications -->
    <div aria-live="polite" aria-atomic="true" style="position: fixed; top: 70px; right: 20px; z-index: 1050;">
      <ngb-toast 
        *ngIf="showToast" 
        [autohide]="true" 
        [delay]="5000" 
        (hidden)="showToast = false"
        [class.bg-success]="toastType === 'success'"
        [class.bg-danger]="toastType === 'danger'"
        [class.bg-warning]="toastType === 'warning'"
        [class.bg-info]="toastType === 'info'"
        class="text-white">
        <div class="d-flex">
          <div class="toast-body">
            {{ toastMessage }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="showToast = false"></button>
        </div>
      </ngb-toast>
    </div>

    <div class="px-2 py-2" *ngIf="!showOrderPage && !showCompletePage; else addOrderPage">
      <div class="card shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>Lab orders</span>
          <button type="button" class="btn btn-sm btn-primary" (click)="addOrder()">Add order</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered text-center table-striped table-sm mb-0">
              <thead>
                <tr>
                  <th>Order number</th>
                  <th>Sample dep date</th>
                  <th>Time</th>
                  <th>Clinician</th>
                  <th>Name</th>
                  <th>Material</th>
                  <th>Laboratory</th>
                  <th>Status</th>
                  <th>Comment</th>
                  <th style="width:220px">Actions</th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                <ng-container *ngIf="isLoading">
                  <tr *ngFor="let i of [1,2,3]">
                    <td colspan="12"><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                  </tr>
                </ng-container>
                <ng-container *ngIf="!isLoading">
                  <tr *ngFor="let o of pagedRows">
                    <td>{{ o.orderNumber }}</td>
                    <td>{{ o.sampleDate }}</td>
                    <td>{{ o.time }}</td>
                    <td>{{ o.clinician }}</td>
                    <td>{{ o.name }}</td>
                    <td>{{ o.material }}</td>
                    <td>{{ o.laboratory }}</td>
                    <td>{{ o.status }}</td>
                    <td>{{ o.comment }}</td>
                    <td>
                      <div class="d-flex gap-1 justify-content-center">
                        <button class="btn btn-sm btn-outline-primary" (click)="openEdit(o)" title="Edit" aria-label="Edit">
                          ✎
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" (click)="openCollect(o)" [disabled]="isCollectDisabled(o)" title="Collect sample" aria-label="Collect sample">
                          🧪
                        </button>
                        <button class="btn btn-sm btn-outline-success" (click)="openComplete(o)" title="Complete order" aria-label="Complete order">
                          ✔
                        </button>
                        <button class="btn btn-sm btn-outline-danger" [disabled]="!o.orderSetId" (click)="confirmDelete(o)" title="Delete" aria-label="Delete">
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="totalItems === 0">
                    <td colspan="12">No data found</td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>
          <app-generic-pagination
            [totalItems]="totalItems"
            [pageSize]="pageSize"
            [currentPage]="currentPage"
            (pageChanged)="onPageChanged($event)">
          </app-generic-pagination>
        </div>
      </div>
    </div>

    <ng-template #addOrderPage>
      <ng-container *ngIf="showOrderPage">
        <app-add-lab-order
          [mrNo]="currentMrNo"
          [mode]="modalMode"
          [orderId]="editingRow?.orderSetId"
          [initialOrder]="editingOrder"
          (cancel)="closeOrderPage()"
          (save)="onOrderModalSave($event)">
        </app-add-lab-order>
      </ng-container>
      <ng-container *ngIf="showCompletePage">
        <app-order-completion
          [order]="editingRow"
          [tests]="editingTests"
          (cancel)="closeCompletePage()"
          (completed)="onCompleted($event)">
        </app-order-completion>
      </ng-container>
    </ng-template>

    <!-- Sample Collection Modal Content -->
    <ng-template #collectModal>
      <app-sample-collection
        [order]="editingRow"
        [tests]="editingTests"
        (cancel)="closeCollectPage()"
        (collected)="onCollected($event)">
      </app-sample-collection>
    </ng-template>

    <!-- Duplicate Confirmation -->
    <app-ivf-confirm-dialog
      [open]="showDuplicateDialog"
      title="Investigations"
      [message]="duplicateMessage"
      (yes)="onDuplicateYes()"
      (no)="onDuplicateNo()"
      (cancel)="onDuplicateCancel()"
    ></app-ivf-confirm-dialog>

    <!-- Delete Confirmation -->
    <app-ivf-confirm-dialog
      [open]="showDeleteDialog"
      title="Delete Lab Order"
      [message]="deleteMessage"
      (yes)="onDeleteYes()"
      (no)="onDeleteNo()"
      (cancel)="onDeleteCancel()"
    ></app-ivf-confirm-dialog>
  `
})
export class IvfPsLabOrdersComponent implements OnInit {
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  currentMrNo: string | null = '1006'; // plug actual MRN via PatientBanner later

  // Add Order page state
  showOrderPage = false;
  modalMode: 'create' | 'edit' = 'create';
  editingRow: any = null;
  editingOrder: any = null;
  // Collection/Completion UI state
  showCollectPage = false;
  showCompletePage = false;
  editingTests: any[] = [];
  // Temporary: current user id (replace with actual auth user)
  currentUserId: number = 1234;

  // Duplicate confirmation state
  showDuplicateDialog = false;
  duplicateMessage = 'Some tests are already ordered. Do you want to order again?';
  pendingPayload: { tests: any[]; details: any } | null = null;

  // Delete confirmation state
  showDeleteDialog = false;
  deleteMessage = 'Are you sure you want to delete this lab order?';
  pendingDelete: { orderSetId?: number | string } | null = null;
  ordersRows: any[] = [];

  // Toast notifications
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'info';

  // Sample collection modal
  @ViewChild('collectModal') collectModalTpl!: TemplateRef<any>;
  private collectModalRef: NgbModalRef | null = null;

  constructor(private ivfApi: IVFApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    if (this.currentMrNo) {
      this.loadOrders(this.currentMrNo);
    }
  }

  get pagedRows() {
    this.totalItems = this.ordersRows.length;
    const start = (this.currentPage - 1) * this.pageSize;
    return this.ordersRows.slice(start, start + this.pageSize);
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }

  isCollectDisabled(row: any): boolean {
    const status = (row?.status || '').toString().toUpperCase();
    return status === 'COLLECTED' || status === 'COMPLETED' || status === 'CANCELLED';
  }

  loadOrders(mrno: string | number) {
    debugger;
    this.isLoading = true;
    this.ivfApi.getLabOrdersByMrNo(mrno, 'grid').subscribe({
      next: (rows: any[]) => {
        const mapped = (rows || []).map(r => ({
          orderSetId: r.orderSetId,
          orderNumber: r.orderNumber,
          sampleDate: r.sampleDepDate,
          time: r.time,
          clinician: r.clinician,
          name: r.name,
          material: r.material,
          laboratory: r.laboratory,
          status: r.status,
          comment: r.comment
        }));
        debugger
        this.ordersRows = mapped;
        this.totalItems = this.ordersRows.length;
      },
      error: () => {},
      complete: () => { this.isLoading = false; }
    });
  }

  addOrder() {
    this.modalMode = 'create';
    this.editingRow = null;
    this.showOrderPage = true;
  }

  openEdit(row: any) {
    this.modalMode = 'edit';
    this.editingRow = row;
    if (!row?.orderSetId) { return; }
    this.isLoading = true;
    this.ivfApi.getLabOrderById(row.orderSetId).subscribe({
      next: (res: any) => {
        this.editingOrder = res;
        this.showOrderPage = true;
      },
      error: () => {},
      complete: () => { this.isLoading = false; }
    });
  }

  closeOrderPage() { this.showOrderPage = false; this.editingOrder = null; }

  // Sample collection flow (UI only)
  openCollect(row: any) {
    if (this.isCollectDisabled(row)) {
      this.showNotification('Sample already collected for this order', 'warning');
      return;
    }
    this.editingRow = row;
    this.isLoading = true;
    const finish = (tests: any[]) => {
      this.editingTests = (tests || []).map(t => ({ ...t, selected: true }));
      this.isLoading = false;
      // Open sample collection inside a modal
      if (this.collectModalRef) {
        this.collectModalRef.close();
      }
      this.collectModalRef = this.modalService.open(this.collectModalTpl, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });
    };
    if (row?.orderSetId) {
      // Try new collection-details endpoint for full test name/material; fallback to getLabOrderById
      this.ivfApi.getOrderCollectionDetails(row.orderSetId).subscribe({
        next: (res: any) => {
          const details = Array.isArray(res) ? res : Array.isArray(res?.details) ? res.details : [];
          const mapped = details.map((d: any) => ({
            id: d.labTestId ?? d.testId,
            orderSetDetailId: d.orderSetDetailId ?? d.id ?? d.labOrderSetDetailId,
            cpt: d.cptCode ?? d.cpt,
            name: d.testName ?? d.name ?? d.cptCode,
            sampleTypeName: d.materialName ?? d.material ?? d.sampleTypeName ?? d.sampleType,
            status: d.status
          }));
          finish(mapped);
        },
        error: () => {
          this.ivfApi.getLabOrderById(row.orderSetId).subscribe({
            next: (res: any) => {
              const details = Array.isArray(res?.details) ? res.details : [];
              const mapped = details.map((d: any) => ({
                id: d.labTestId,
                orderSetDetailId: d.orderSetDetailId ?? d.id ?? d.labOrderSetDetailId,
                cpt: d.cptCode,
                name: d.testName ?? d.cptCode,
                sampleTypeName: d.sampleTypeName,
                status: d.status
              }));
              finish(mapped);
            },
            error: () => { finish([]); },
            complete: () => {}
          });
        },
        complete: () => {}
      });
    } else {
      finish([]);
    }
  }
  closeCollectPage() {
    this.showCollectPage = false;
    this.editingTests = [];
    if (this.collectModalRef) {
      this.collectModalRef.close();
      this.collectModalRef = null;
    }
  }
  onCollected(payload: any) {
    // Order-level collect per new endpoint
    const orderSetId = this.editingRow?.orderSetId;
    if (!orderSetId) { this.closeCollectPage(); return; }
    const date = payload?.form?.collectionDate;
    const time = payload?.form?.collectionTime;
    const collectDateIso = this.composeIso(date, time);
    const userId = Number(payload?.form?.collectorId) || this.currentUserId;
    this.isLoading = true;
    this.ivfApi.collectLabOrder(orderSetId, { collectDate: collectDateIso, userId }).subscribe({
      next: () => {},
      error: () => {},
      complete: () => {
        this.isLoading = false;
        this.closeCollectPage();
        if (this.currentMrNo) this.loadOrders(this.currentMrNo);
      }
    });
  }

  // Order completion flow (UI only)
  openComplete(row: any) {
    this.editingRow = row;
    this.isLoading = true;
    const finish = (tests: any[]) => {
      this.editingTests = (tests || []).map(t => ({ ...t, done: false }));
      this.showCompletePage = true;
      this.isLoading = false;
    };
    if (row?.orderSetId) {
      // Prefer new collection-details endpoint so Test Details grid matches collection screen
      this.ivfApi.getOrderCollectionDetails(row.orderSetId).subscribe({
        next: (res: any) => {
          const details = Array.isArray(res) ? res : Array.isArray(res?.details) ? res.details : [];
          const mapped = details.map((d: any) => ({
            id: d.labTestId ?? d.testId,
            orderSetDetailId: d.orderSetDetailId ?? d.id ?? d.labOrderSetDetailId,
            cpt: d.cptCode ?? d.cpt,
            name: d.testName ?? d.name ?? d.cptCode,
            sampleTypeName: d.materialName ?? d.material ?? d.sampleTypeName ?? d.sampleType,
            status: d.status
          }));
          finish(mapped);
        },
        error: () => {
          // Fallback to existing getLabOrderById if collection-details is not available
          this.ivfApi.getLabOrderById(row.orderSetId).subscribe({
            next: (res: any) => {
              const details = Array.isArray(res?.details) ? res.details : [];
              const mapped = details.map((d: any) => ({
                id: d.labTestId,
                orderSetDetailId: d.orderSetDetailId ?? d.id ?? d.labOrderSetDetailId,
                cpt: d.cptCode,
                name: d.testName ?? d.cptCode,
                sampleTypeName: d.sampleTypeName,
                status: d.status
              }));
              finish(mapped);
            },
            error: () => { finish([]); },
            complete: () => {}
          });
        },
        complete: () => {}
      });
    } else {
      finish([]);
    }
  }
  closeCompletePage() { this.showCompletePage = false; this.editingTests = []; }
  onCompleted(payload: any) {
    // Call Complete API for each test in the order
    // OrderCompletionComponent emits { order, completedTests, completionData }
    const completionData = payload?.completionData;
    const tests = payload?.completedTests ?? payload?.tests;
    
    if (!completionData || !Array.isArray(tests) || tests.length === 0) { 
      this.showNotification('No tests selected for completion', 'warning');
      this.closeCompletePage(); 
      return; 
    }
    
    this.isLoading = true;
    
    // Set the userId from current user
    completionData.userId = this.currentUserId;
    
    // For each test, call the complete API with the completion data
    const apiCalls = tests.map((test: any) => {
      if (!test.orderSetDetailId) return of(null);
      
      // Create a copy of the completion data for this test
      const testCompletion = { ...completionData };
      
      // If this is the first test, use the main completion data
      // Otherwise, create a new completion with some fields reset
      if (tests.indexOf(test) > 0) {
        testCompletion.accessionNumber = `${testCompletion.accessionNumber}-${tests.indexOf(test) + 1}`;
        testCompletion.observations = testCompletion.observations.map((obs: any) => ({
          ...obs,
          observationIdentifierFullName: `${obs.observationIdentifierFullName} (${test.name || test.testName || test.cpt})`,
          observationIdentifierShortName: `${obs.observationIdentifierShortName}_${tests.indexOf(test) + 1}`,
          sequenceNo: obs.sequenceNo + (tests.indexOf(test) * 100) // Keep sequence numbers unique
        }));
      }
      
      return this.ivfApi.completeLabOrderDetail(test.orderSetDetailId, testCompletion);
    }).filter(Boolean);
    
    if (apiCalls.length === 0) {
      this.isLoading = false;
      this.showNotification('No valid tests found to complete', 'warning');
      this.closeCompletePage();
      return;
    }
    
    forkJoin(apiCalls).subscribe({
      next: () => {
        this.showNotification('Order completed successfully', 'success');
      },
      error: (error) => {
        console.error('Error completing order:', error);
        this.showNotification('Failed to complete order: ' + (error.error?.message || 'Unknown error'), 'danger');
      },
      complete: () => {
        this.isLoading = false;
        this.closeCompletePage();
        if (this.currentMrNo) this.loadOrders(this.currentMrNo);
      }
    });
  }

  // Show toast notification
  showNotification(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  // Compose ISO date from date and time strings
  private composeIso(dateStr?: string, timeStr?: string): string {
    const date = (dateStr || '').trim();
    const time = (timeStr || '').trim();
    if (!date) return new Date().toISOString();
    const iso = time ? `${date}T${time}:00` : `${date}T00:00:00`;
    return new Date(iso).toISOString();
  }

  onOrderModalSave(payload: { tests: any[]; details: any; header?: any }): void {
    // Mock duplicate check: assume any test with name containing 'E2' is duplicate
    const duplicates = payload.tests.filter(t => (t.name || '').toLowerCase().includes('e2'));
    if (duplicates.length > 0) {
      this.pendingPayload = payload;
      this.showDuplicateDialog = true;
      return;
    }
    this.persistOrder(payload, { includeDuplicates: true });
  }

  onDuplicateYes() {
    if (this.pendingPayload) {
      this.persistOrder(this.pendingPayload, { includeDuplicates: true });
    }
    this.resetDuplicateDialog();
  }

  onDuplicateNo() {
    if (this.pendingPayload) {
      const filtered = { ...this.pendingPayload, tests: this.pendingPayload.tests.filter(t => !(t.name || '').toLowerCase().includes('e2')) };
      this.persistOrder(filtered, { includeDuplicates: false });
    }
    this.resetDuplicateDialog();
  }

  onDuplicateCancel() { this.resetDuplicateDialog(); }

  private resetDuplicateDialog() {
    this.showDuplicateDialog = false;
    this.pendingPayload = null;
  }

  private persistOrder(payload: { tests: any[]; details: any }, opts: { includeDuplicates: boolean }) {
    const nowIso = new Date().toISOString();
    const mrNoNum = Number(this.currentMrNo) || 0;
    const providerFromPhysician = Number((payload.tests || []).find(t => (t?.details?.refPhysicianId ?? null) !== null && (t?.details?.refPhysicianId ?? undefined) !== undefined)?.details?.refPhysicianId ?? 0);
    const body: IvfCreateLabOrderDto = {
      header: {
        mrNo: mrNoNum,
        providerId: providerFromPhysician,
        orderDate: nowIso,
        visitAccountNo: 0,
        createdBy: 0,
        createdDate: nowIso,
        orderControlCode: 'NW',
        orderStatus: 'OPEN',
        isHL7MsgCreated: false,
        isHL7MessageGeneratedForPhilips: false,
        isSigned: false,
        updatedBy: 0,
        updatedDate: nowIso,
        oldMRNo: null,
        hL7MessageId: null
      },
      details: (payload.tests || []).map(t => ({
        labTestId: t.id,
        cptCode: t.cpt,
        orderQuantity: 1,
        investigationTypeId: 23,
        billOnOrder: 0,
        sampleTypeId: (t?.sampleTypeId ?? null),
        status: (t?.details?.status ?? 'NEW')
      }))
    };

    this.isLoading = true;
    this.ivfApi.createLabOrder(body).subscribe({
      next: () => {
        if (mrNoNum) { this.loadOrders(mrNoNum); }
        this.closeOrderPage();
      },
      error: () => {},
      complete: () => { this.isLoading = false; }
    });
  }

  confirmDelete(row: any) {
    this.pendingDelete = { orderSetId: row?.orderSetId };
    this.showDeleteDialog = true;
  }

  onDeleteYes() {
    const id = this.pendingDelete?.orderSetId;
    if (!id) { this.onDeleteCancel(); return; }
    this.isLoading = true;
    this.ivfApi.deleteLabOrder(id, false).subscribe({
      next: () => {
        if (this.currentMrNo) this.loadOrders(this.currentMrNo);
      },
      error: () => {},
      complete: () => { this.isLoading = false; this.onDeleteCancel(); }
    });
  }

  onDeleteNo() { this.onDeleteCancel(); }
  onDeleteCancel() { this.showDeleteDialog = false; this.pendingDelete = null; }
}
