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
import Swal from 'sweetalert2';
import { LucideAngularModule, Edit, TestTube, Check, Trash2, XCircle } from 'lucide-angular';
    
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
    NgbModalModule,
    LucideAngularModule
  ],
  styles: [`
    .skeleton-loader { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation: loading 1.5s ease-in-out infinite; border-radius:4px; }
    @keyframes loading { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .cursor-pointer { cursor: pointer; }
    .child-row-bg { background-color: transparent !important; border: none !important; }
    .child-container { max-height: 0; overflow: hidden; transition: max-height 0.5s ease-in-out; }
    .child-row-bg.show .child-container { max-height: 500px; }
    .child-container .table { background-color: transparent; color: var(--bs-body-color); border: none; }
    .child-container .table thead th { background-color: transparent; color: var(--bs-body-color); border: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .child-container .table tbody td { background-color: transparent; color: var(--bs-body-color); border: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .btn-link { text-decoration: none; }
    .btn-link:hover { text-decoration: none; }
    .btn-link:disabled { opacity: 0.3; cursor: not-allowed; }
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
                  <th>Material</th>
                  <th>Laboratory</th>
                  <th>Status</th>
                  <th>Comment</th>
                  <th style="width:250px">Actions</th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                <ng-container *ngIf="isLoading">
                  <tr *ngFor="let i of [1,2,3]">
                    <td colspan="9"><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                  </tr>
                </ng-container>
                <ng-container *ngIf="!isLoading">
                  <ng-container *ngFor="let o of pagedRows">
                    <!-- Parent row -->
                    <tr class="cursor-pointer" (click)="toggleExpand(o)" [class.table-active]="expandedRow === o">
                      <td>{{ o.orderNumber }}</td>
                      <td>{{ o.sampleDate }}</td>
                      <td>{{ o.time }}</td>
                      <td>{{ o.clinician }}</td>
                      <td>{{ o.material }}</td>
                      <td>{{ o.laboratory }}</td>
                      <td>{{ o.status }}</td>
                      <td>{{ o.comment }}</td>
                      <td>
                        <div class="d-flex gap-1 justify-content-center">
                          <button class="btn btn-sm btn-link text-primary p-1" (click)="openEdit(o); $event.stopPropagation()" title="Edit" aria-label="Edit">
                            <i-lucide [img]="Edit" [size]="16"></i-lucide>
                          </button>
                          <button class="btn btn-sm btn-link text-warning p-1" [disabled]="!o.orderSetId" (click)="cancelOrder(o); $event.stopPropagation()" title="Cancel" aria-label="Cancel">
                            <i-lucide [img]="XCircle" [size]="16"></i-lucide>
                          </button>
                          <button class="btn btn-sm btn-link text-danger p-1" [disabled]="!o.orderSetId" (click)="confirmDelete(o); $event.stopPropagation()" title="Delete" aria-label="Delete">
                            <i-lucide [img]="Trash2" [size]="16"></i-lucide>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <!-- Child row: tests for this order -->
                    <tr class="child-row-bg" [class.show]="expandedRow === o">
                      <td colspan="9" class="text-start p-0">
                        <div class="child-container">
                          <ng-container *ngIf="o.tests?.length; else noTests">
                            <div class="fw-semibold mb-2 px-3 pt-3">Tests in this order</div>
                            <div class="table-responsive">
                              <table class="table table-sm mb-0">
                                <thead>
                                  <tr>
                                    <th style="width: 40px;">#</th>
                                    <th>Test</th>
                                    <th>Material</th>
                                    <th style="width: 200px;">Status</th>
                                    <th style="width: 140px;">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr *ngFor="let t of o.tests; let i = index">
                                    <td>{{ i + 1 }}</td>
                                    <td class="text-truncate">{{ t.name || t.cpt }}</td>
                                    <td class="text-truncate">{{ t.sampleTypeName || '-' }}</td>
                                    <td>{{ t.status || 'New' }}</td>
                                    <td>
                                      <div class="d-flex gap-1 justify-content-center">
                                        <button
                                          type="button"
                                          class="btn btn-sm btn-link text-secondary p-1"
                                          (click)="openCollectForTest(o, t); $event.stopPropagation()"
                                          [disabled]="isTestCollected(t)"
                                          title="Sample Collection">
                                          <i-lucide [img]="TestTube" [size]="16"></i-lucide>
                                        </button>
                                        <button
                                          type="button"
                                          class="btn btn-sm btn-link text-success p-1"
                                          (click)="markTestComplete(o, t); $event.stopPropagation()"
                                          [disabled]="isTestCompleted(t)"
                                          title="Mark as Complete">
                                          <i-lucide [img]="Check" [size]="16"></i-lucide>
                                        </button>
                                        <button
                                          type="button"
                                          class="btn btn-sm btn-link text-primary p-1"
                                          (click)="openCompleteForTest(o, t); $event.stopPropagation()"
                                          title="Add Observation">
                                          <i-lucide [img]="Edit" [size]="16"></i-lucide>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </ng-container>
                          <ng-template #noTests>
                            <div class="px-3 py-3">
                              <span class="text-muted">No tests found for this order.</span>
                            </div>
                          </ng-template>
                        </div>
                      </td>
                    </tr>
                  </ng-container>
                  <tr *ngIf="totalItems === 0">
                    <td colspan="9">No data found</td>
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
  // Lucide icons
  readonly Edit = Edit;
  readonly TestTube = TestTube;
  readonly Check = Check;
  readonly Trash2 = Trash2;
  readonly XCircle = XCircle;

  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  expandedRow: any | null = null;
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

  toggleExpand(row: any) {
    if (this.expandedRow === row) {
      this.expandedRow = null;
      return;
    }
    this.expandedRow = row;

    // Lazy-load tests for this order when first expanded
    if (!row?.tests && row?.orderSetId) {
      this.ivfApi.getOrderCollectionDetails(row.orderSetId).subscribe({
        next: (res: any) => {
          const details = Array.isArray(res)
            ? res
            : Array.isArray(res?.details) ? res.details : [];
          row.tests = details.map((d: any) => ({
            id: d.labTestId ?? d.testId,
            orderSetDetailId: d.orderSetDetailId ?? d.id ?? d.labOrderSetDetailId,
            cpt: d.cptCode ?? d.cpt,
            name: d.testName ?? d.name ?? d.cptCode,
            sampleTypeName: d.materialName ?? d.material ?? d.sampleTypeName ?? d.sampleType,
            status: d.status
          }));
        },
        error: () => {
          row.tests = [];
        }
      });
    }
  }

  isCollectDisabled(row: any): boolean {
    const statusId = (row?.statusId || '').toString();
    // Do not allow collecting on completed/cancelled orders at row level (status 4 = Completed, status 5 = Cancelled)
    return statusId === '4' || statusId === '5';
  }

  isMarkCompleteDisabled(row: any): boolean {
    const statusId = (row?.statusId || '').toString();
    // Block mark complete only for already completed/cancelled orders (status 4 = Completed, status 5 = Cancelled)
    return statusId === '4' || statusId === '5';
  }

  private isCollectedStatus(status: any): boolean {
    const s = (status || '').toString().toUpperCase();
    // Handle 'COLLECTED', 'SAMPLE COLLECTED', status id 3 or 4, etc.
    return s === '3' || s === '4' || 
           s.includes('COLLECT') || 
           s.includes('SAMPLE COLLECTED') ||
           s === 'SAMPLE COLLECTED';
  }

  // Per-test helper methods
  isTestCollected(test: any): boolean {
    // Disable collection if already collected OR completed
    return this.isCollectedStatus(test?.status) || this.isTestCompleted(test);
  }

  isTestCompleted(test: any): boolean {
    const status = (test?.status || '').toString().toUpperCase();
    return status === 'COMPLETED' || status === 'MARKED AS COMPLETED' || status.includes('COMPLETED');
  }

  // Open sample collection for a single test
  openCollectForTest(order: any, test: any) {
    if (this.isTestCollected(test)) {
      const message = this.isTestCompleted(test) 
        ? 'This test is already completed' 
        : 'Sample already collected for this test';
      this.showNotification(message, 'warning');
      return;
    }
    this.editingRow = order;
    this.editingTests = [{ ...test, selected: true }];
    
    if (this.collectModalRef) {
      this.collectModalRef.close();
    }
    this.collectModalRef = this.modalService.open(this.collectModalTpl, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  // Mark a single test as complete
  markTestComplete(order: any, test: any) {
    const detailId = test?.orderSetDetailId;
    if (!detailId) {
      this.showNotification('Test detail ID is missing', 'warning');
      return;
    }

    if (this.isTestCompleted(test)) {
      this.showNotification('This test is already marked as completed', 'info');
      return;
    }

    if (!this.isTestCollected(test)) {
      this.showNotification('Sample must be collected before marking as complete', 'warning');
      return;
    }

    this.isLoading = true;
    const status = 4; // Completed
    this.ivfApi.markLabOrderComplete(detailId, status).subscribe({
      next: () => {
        this.showNotification('Test marked as complete', 'success');
      },
      error: (error) => {
        console.error('Error marking test complete:', error);
        const errorMsg = error.error?.message || error.error || 'Unknown error';
        this.showNotification('Failed to mark test complete: ' + errorMsg, 'danger');
      },
      complete: () => {
        this.isLoading = false;
        if (this.currentMrNo) this.loadOrders(this.currentMrNo);
      }
    });
  }

  // Open observation form for a single test
  openCompleteForTest(order: any, test: any) {
    this.editingRow = order;
    this.editingTests = [{ ...test, done: false }];
    this.showCompletePage = true;
  }

  loadOrders(mrno: string | number) {
    debugger;
    this.isLoading = true;
    this.ivfApi.getLabOrdersByMrNo(mrno, 'grid').subscribe({
      next: (rows: any[]) => {
        const mapped = (rows || []).map(r => {
          const children = Array.isArray(r.children) ? r.children : [];

          const tests = children.map((c: any) => ({
            id: c.labTestId ?? c.labTestID ?? c.id ?? null,
            orderSetDetailId: c.orderSetDetailId ?? c.orderSetDetailID ?? c.id,
            cpt: c.cptCode ?? c.cpt,
            name: c.name ?? c.testName ?? c.cptCode,
            sampleTypeName: c.material ?? c.sampleTypeName,
            status: c.status,
            comment: c.comment
          }));

          const firstTest = tests[0];

          const name = r.name
            ?? (tests.length === 1 ? firstTest?.name
              : tests.length > 1 ? `${tests.length} tests` : '');

          const material = r.material
            ?? (firstTest?.sampleTypeName ?? '');

          return {
            orderSetId: r.orderSetId,
            orderNumber: r.orderNumber,
            sampleDate: r.sampleDepDate,
            time: r.time,
            clinician: r.clinician,
            name,
            material,
            laboratory: r.laboratory,
            status: r.status,
            statusId: r.statusId,
            comment: r.comment,
            tests
          };
        });
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
    const finish = (tests: any[]) => {
      this.editingTests = (tests || []).map(t => ({ ...t, selected: true }));
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

    // If tests are already present on the row (from backend children), reuse them
    if (Array.isArray(row.tests) && row.tests.length) {
      finish(row.tests);
      return;
    }

    this.isLoading = true;
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
          this.isLoading = false;
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
              this.isLoading = false;
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
    // Per-test sample collection: collect against each test/detail
    const orderSetId = this.editingRow?.orderSetId;
    if (!orderSetId) { this.closeCollectPage(); return; }

    const date = payload?.form?.collectionDate;
    const time = payload?.form?.collectionTime;
    const collectDateIso = this.composeIso(date, time);
    const userId = Number(payload?.form?.collectorId) || this.currentUserId;
    const tests = this.editingTests || [];

    // Only collect for tests that are not already collected (e.g. 'Sample Collected')
    const toCollect = tests.filter(t => {
      return !this.isCollectedStatus(t?.status);
    });

    if (toCollect.length === 0) {
      this.showNotification('All tests are already collected for this order', 'info');
      this.closeCollectPage();
      return;
    }

    this.isLoading = true;
    const apiCalls = toCollect.map(t => {
      const detailId = t?.orderSetDetailId;
      if (!detailId) { return of(null); }
      return this.ivfApi.collectLabOrderDetail(detailId, {
        CollectDate: collectDateIso,
        UserId: userId
      });
    }).filter(Boolean);

    if (apiCalls.length === 0) {
      this.isLoading = false;
      this.showNotification('No valid tests found to collect', 'warning');
      this.closeCollectPage();
      return;
    }

    forkJoin(apiCalls).subscribe({
      next: (responses) => {
        this.isLoading = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Sample collected successfully',
          showConfirmButton: true,
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        });
        
        this.closeCollectPage();
        if (this.currentMrNo) this.loadOrders(this.currentMrNo);
      },
      error: (error) => {
        this.isLoading = false;
        
        console.error('Error collecting samples:', error);
        
        // Extract error message
        let errorMessage = 'Failed to collect sample';
        
        if (error?.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }
        } else if (error?.statusText && error?.statusText !== 'Unknown Error') {
          errorMessage = error.statusText;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          showConfirmButton: true,
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        
        this.closeCollectPage();
        if (this.currentMrNo) this.loadOrders(this.currentMrNo);
      }
    });
  }

  // Order completion flow (UI only)
  markOrderComplete(row: any) {
    debugger
    const orderSetId = row?.orderSetId;
    if (!orderSetId) {
      this.showNotification('Order id is missing; cannot mark complete', 'warning');
      return;
    }

    // Check if already completed or cancelled
    const rowStatus = (row?.statusId || '').toString();
    if (rowStatus === '4') {
      this.showNotification('This order is already marked as completed', 'info');
      return;
    }
    if (rowStatus === '5') {
      this.showNotification('This order has been cancelled and cannot be completed', 'warning');
      return;
    }

    // Check if sample is collected (status must be 3)
    if (rowStatus !== '3') {
      this.showNotification('Sample must be collected before marking as complete', 'warning');
      return;
    }

    // Mark order as complete with status 4
    this.isLoading = true;
    const status = 4; // Completed
    this.ivfApi.markLabOrderComplete(orderSetId, status).subscribe({
      next: () => {
        this.showNotification('Order marked as complete', 'success');
      },
      error: (error) => {
        console.error('Error marking order complete:', error);
        const errorMsg = error.error?.message || error.error || 'Unknown error';
        this.showNotification('Failed to mark order complete: ' + errorMsg, 'danger');
      },
      complete: () => {
        this.isLoading = false;
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
      
      return this.ivfApi.addLabOrderObservations(test.orderSetDetailId, testCompletion);
    }).filter(Boolean);
    
    if (apiCalls.length === 0) {
      this.isLoading = false;
      this.showNotification('No valid tests found to complete', 'warning');
      this.closeCompletePage();
      return;
    }
    
    forkJoin(apiCalls).subscribe({
      next: (responses) => {
        this.isLoading = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Observations added successfully',
          showConfirmButton: true,
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        });
        
        this.closeCompletePage();
        if (this.currentMrNo) this.loadOrders(this.currentMrNo);
      },
      error: (error) => {
        this.isLoading = false;
        
        console.error('Error completing order:', error);
        
        // Extract error message
        let errorMessage = 'Failed to add observations';
        
        if (error?.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }
        } else if (error?.statusText && error?.statusText !== 'Unknown Error') {
          errorMessage = error.statusText;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          showConfirmButton: true,
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        
        this.closeCompletePage();
        if (this.currentMrNo) this.loadOrders(this.currentMrNo);
      }
    });
  }

  // Show notification using SweetAlert (theme standard)
  showNotification(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
    const icon: 'success' | 'error' | 'warning' | 'info' =
      type === 'danger' ? 'error' :
      type === 'warning' ? 'warning' :
      type === 'info' ? 'info' : 'success';

    Swal.fire({
      icon,
      title: icon === 'success' ? 'Success' : icon === 'error' ? 'Error' : 'Notice',
      text: message,
      showConfirmButton: false,
      timer: 2000,
      buttonsStyling: false
    });
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
      next: (response) => {
        this.isLoading = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Order created successfully',
          showConfirmButton: true,
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        });
        
        if (mrNoNum) { this.loadOrders(mrNoNum); }
        this.closeOrderPage();
      },
      error: (error) => {
        this.isLoading = false;
        
        // Extract error message
        let errorMessage = 'Failed to create order';
        
        if (error?.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }
        } else if (error?.statusText && error?.statusText !== 'Unknown Error') {
          errorMessage = error.statusText;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          showConfirmButton: true,
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
      }
    });
  }

  cancelOrder(row: any) {
    if (!row?.orderSetId) return;
    debugger
    Swal.fire({
      title: 'Cancel Order',
      text: `Are you sure you want to cancel order #${row.orderNumber}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-warning me-2',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.ivfApi.cancelLabOrder(row.orderSetId).subscribe({
          next: (response) => {
            this.isLoading = false;
            
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Order cancelled successfully',
              showConfirmButton: true,
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            });
            
            // Reload orders grid
            if (this.currentMrNo) this.loadOrders(this.currentMrNo);
          },
          error: (error) => {
            this.isLoading = false;
            
            // Extract only the meaningful error message from response
            let errorMessage = 'Failed to cancel order';
            
            if (error?.error) {
              if (typeof error.error === 'string') {
                errorMessage = error.error;
              } else if (error.error?.message) {
                errorMessage = error.error.message;
              } else if (error.error?.error) {
                errorMessage = error.error.error;
              }
            } else if (error?.statusText && error?.statusText !== 'Unknown Error') {
              errorMessage = error.statusText;
            }
            
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage,
              showConfirmButton: true,
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            });
            
            // Reload orders grid even on error
            if (this.currentMrNo) this.loadOrders(this.currentMrNo);
          }
        });
      }
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
