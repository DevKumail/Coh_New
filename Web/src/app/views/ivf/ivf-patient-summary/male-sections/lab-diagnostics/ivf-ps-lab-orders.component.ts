import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { IvfConfirmDialogComponent } from './ivf-confirm-dialog.component';
import { AddLabOrderComponent } from './add-lab-order.component';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { IvfCreateLabOrderDto } from '@/app/shared/Services/IVF/dtos/ivf-lab-orders.dto';

@Component({
  selector: 'app-ivf-ps-lab-orders',
  standalone: true,
  imports: [CommonModule, GenericPaginationComponent, AddLabOrderComponent, IvfConfirmDialogComponent],
  styles: [`
    .skeleton-loader { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation: loading 1.5s ease-in-out infinite; border-radius:4px; }
    @keyframes loading { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  `],
  template: `
    <div class="px-2 py-2" *ngIf="!showOrderPage; else addOrderPage">
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
                  <th style="width:120px">Actions</th>
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
                    <td>{{ o.states }}</td>
                    <td>{{ o.comment }}</td>
                    <td>
                      <div class="d-flex gap-1 justify-content-center">
                        <button class="btn btn-sm btn-outline-primary" (click)="openEdit(o)" title="Edit" aria-label="Edit">
                          ✎
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
      <app-add-lab-order
        [mrNo]="currentMrNo"
        [mode]="modalMode"
        [orderId]="editingRow?.orderSetId"
        [initialOrder]="editingOrder"
        (cancel)="closeOrderPage()"
        (save)="onOrderModalSave($event)">
      </app-add-lab-order>
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

  // Duplicate confirmation state
  showDuplicateDialog = false;
  duplicateMessage = 'Some tests are already ordered. Do you want to order again?';
  pendingPayload: { tests: any[]; details: any } | null = null;

  // Delete confirmation state
  showDeleteDialog = false;
  deleteMessage = 'Are you sure you want to delete this lab order?';
  pendingDelete: { orderSetId?: number | string } | null = null;
  ordersRows: any[] = [
    {
      orderNumber: '0000002040', sampleDate: '30.01.2025', time: '10:00', clinician: 'Mr JF',
      name: 'E2', note: '', parameter: 'E2', material: 'Serum', laboratory: 'Internal',
      states: '—', patientStatus: '—', comment: ''
    },
    {
      orderNumber: '0000002289', sampleDate: '14.01.2025', time: '12:29', clinician: 'Doe, John Dr.',
      name: 'Cycling Hormons', note: '', parameter: 'FSH', material: 'Serum', laboratory: 'Internal',
      states: '✔', patientStatus: '—', comment: ''
    },
    {
      orderNumber: '0000002290', sampleDate: '14.01.2025', time: '12:31', clinician: 'Doe, Jane Dr.',
      name: 'Blood count', note: '', parameter: 'CBC', material: 'EDTA blood', laboratory: 'Internal',
      states: '⛔', patientStatus: '—', comment: ''
    }
  ];

  constructor(private ivfApi: IVFApiService) {}

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

  loadOrders(mrno: string | number) {
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
          states: r.state,
          comment: r.comment
        }));
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

  onOrderModalSave(payload: { tests: any[]; details: any; header?: any }) {
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
        orderStatus: 'NEW',
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
        billOnOrder: 0
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
