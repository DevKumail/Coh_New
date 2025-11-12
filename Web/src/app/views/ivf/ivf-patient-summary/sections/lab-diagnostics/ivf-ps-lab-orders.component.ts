import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { IvfLabOrderModalComponent } from './ivf-lab-order-modal.component';
import { IvfConfirmDialogComponent } from './ivf-confirm-dialog.component';

@Component({
  selector: 'app-ivf-ps-lab-orders',
  standalone: true,
  imports: [CommonModule, GenericPaginationComponent, IvfLabOrderModalComponent, IvfConfirmDialogComponent],
  styles: [`
    .skeleton-loader { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation: loading 1.5s ease-in-out infinite; border-radius:4px; }
    @keyframes loading { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  `],
  template: `
    <div class="px-2 py-2">
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
                  <th>Note</th>
                  <th>Parameter</th>
                  <th>Material</th>
                  <th>Laboratory</th>
                  <th>States</th>
                  <th>Pat. status</th>
                  <th>Comment</th>
                  <th style="width:60px">Actions</th>
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
                    <td>{{ o.note }}</td>
                    <td>{{ o.parameter }}</td>
                    <td>{{ o.material }}</td>
                    <td>{{ o.laboratory }}</td>
                    <td>{{ o.states }}</td>
                    <td>{{ o.patientStatus }}</td>
                    <td>{{ o.comment }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" (click)="openEdit(o)">Open</button>
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

    <!-- Create/Edit Modal -->
    <app-ivf-lab-order-modal
      [open]="showOrderModal"
      [mrNo]="currentMrNo"
      [mode]="modalMode"
      (cancel)="closeOrderModal()"
      (save)="onOrderModalSave($event)"></app-ivf-lab-order-modal>

    <!-- Duplicate Confirmation -->
    <app-ivf-confirm-dialog
      [open]="showDuplicateDialog"
      title="Investigations"
      [message]="duplicateMessage"
      (yes)="onDuplicateYes()"
      (no)="onDuplicateNo()"
      (cancel)="onDuplicateCancel()"
    ></app-ivf-confirm-dialog>
  `
})
export class IvfPsLabOrdersComponent {
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  currentMrNo: string | null = null; // plug actual MRN via PatientBanner later

  // Modal state
  showOrderModal = false;
  modalMode: 'create' | 'edit' = 'create';
  editingRow: any = null;

  // Duplicate confirmation state
  showDuplicateDialog = false;
  duplicateMessage = 'Some tests are already ordered. Do you want to order again?';
  pendingPayload: { tests: any[]; details: any } | null = null;
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

  get pagedRows() {
    this.totalItems = this.ordersRows.length;
    const start = (this.currentPage - 1) * this.pageSize;
    return this.ordersRows.slice(start, start + this.pageSize);
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }

  addOrder() {
    this.modalMode = 'create';
    this.editingRow = null;
    this.showOrderModal = true;
  }

  openEdit(row: any) {
    this.modalMode = 'edit';
    this.editingRow = row;
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
  }

  onOrderModalSave(payload: { tests: any[]; details: any }) {
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
    // For demo: append new rows to ordersRows
    const now = new Date();
    const date = now.toLocaleDateString('en-GB');
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    payload.tests.forEach((t, idx) => {
      const newRow = {
        orderNumber: (Math.floor(Math.random()*900000)+100000).toString(),
        sampleDate: date,
        time: time,
        clinician: payload.details?.refPhysician || '—',
        name: t.name,
        note: payload.details?.comments || '',
        parameter: t.name,
        material: 'Serum',
        laboratory: 'Internal',
        states: '—',
        patientStatus: '—',
        comment: ''
      };
      this.ordersRows.unshift(newRow);
    });
    this.closeOrderModal();
  }
}
