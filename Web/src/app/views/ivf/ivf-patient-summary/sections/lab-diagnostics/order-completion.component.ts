import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-completion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card shadow">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-bold">Order completion</div>
          <div class="small text-muted">Order #: {{ order?.orderNumber || order?.orderSetId || '-' }}</div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-secondary btn-sm" (click)="cancel.emit()">Back</button>
          <button class="btn btn-success btn-sm" (click)="onComplete()" [disabled]="tests.length===0">Mark Completed</button>
        </div>
      </div>

      <div class="card-body">
        <div class="table-responsive border rounded">
          <table class="table table-sm table-bordered align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width:36px"></th>
                <th>Test</th>
                <th>Material</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of tests">
                <td><input type="checkbox" class="form-check-input" [(ngModel)]="t.done"></td>
                <td class="text-truncate">{{ t.name || t.cpt }}</td>
                <td class="text-truncate">{{ t.sampleTypeName || '-' }}</td>
                <td>{{ t.done ? 'Ready to complete' : (t.status || 'In Progress') }}</td>
              </tr>
              <tr *ngIf="tests.length===0">
                <td colspan="4" class="text-center text-muted">No tests</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row g-3 mt-3">
          <div class="col-md-6">
            <label class="form-label form-label-sm">Final remarks</label>
            <textarea rows="3" class="form-control form-control-sm" [(ngModel)]="remarks"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label form-label-sm">Verification</label>
            <div class="form-check">
              <input id="v1" type="checkbox" class="form-check-input" [(ngModel)]="verifiedByPhysician">
              <label for="v1" class="form-check-label small">Verified by physician</label>
            </div>
            <div class="form-check">
              <input id="v2" type="checkbox" class="form-check-input" [(ngModel)]="approved">
              <label for="v2" class="form-check-label small">Approved</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderCompletionComponent {
  @Input() order: any;
  @Input() tests: Array<any> = [];
  @Output() cancel = new EventEmitter<void>();
  @Output() completed = new EventEmitter<any>();

  remarks = '';
  verifiedByPhysician = false;
  approved = false;

  onComplete() {
    const payload = {
      order: this.order,
      completedTests: (this.tests || []).filter(t => t.done),
      remarks: this.remarks,
      verifiedByPhysician: this.verifiedByPhysician,
      approved: this.approved
    };
    this.completed.emit(payload);
  }
}
