import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sample-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .h-56 { max-height: 56vh; }
  `],
  template: `
    <div class="card shadow">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-bold">Sample collection</div>
          <div class="small text-muted">Order #: {{ order?.orderNumber || order?.orderSetId || '-' }}</div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-secondary btn-sm" (click)="cancel.emit()">Back</button>
          <button class="btn btn-primary btn-sm" (click)="onCollect()" [disabled]="!canCollect()">Collect</button>
        </div>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label form-label-sm">Sample type</label>
            <select class="form-select form-select-sm" [(ngModel)]="form.sampleTypeId">
              <option [ngValue]="null">Select...</option>
              <option *ngFor="let s of sampleTypes" [ngValue]="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label form-label-sm">Collection date</label>
            <input type="date" class="form-control form-control-sm" [(ngModel)]="form.collectionDate">
          </div>
          <div class="col-md-4">
            <label class="form-label form-label-sm">Collection time</label>
            <input type="time" class="form-control form-control-sm" [(ngModel)]="form.collectionTime">
          </div>
          <div class="col-md-4">
            <label class="form-label form-label-sm">Collector</label>
            <select class="form-select form-select-sm" [(ngModel)]="form.collectorId">
              <option [ngValue]="null">Select...</option>
              <option *ngFor="let c of collectors" [ngValue]="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label form-label-sm">Priority</label>
            <select class="form-select form-select-sm" [(ngModel)]="form.priority">
              <option value="Routine">Routine</option>
              <option value="Urgent">Urgent</option>
              <option value="STAT">STAT</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label form-label-sm">Accession/Label count</label>
            <input type="number" min="1" class="form-control form-control-sm" [(ngModel)]="form.labelCount">
          </div>
          <div class="col-12">
            <label class="form-label form-label-sm">Notes</label>
            <textarea rows="2" class="form-control form-control-sm" [(ngModel)]="form.notes"></textarea>
          </div>
        </div>

        <div class="mt-3">
          <div class="fw-semibold mb-2">Tests in this order</div>
          <div class="table-responsive h-56 overflow-auto border rounded">
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
                <tr *ngFor="let t of tests; let i = index">
                  <td>
                    <input type="checkbox" class="form-check-input" [(ngModel)]="t.selected">
                  </td>
                  <td class="text-truncate">{{ t.name || t.cpt }}</td>
                  <td class="text-truncate">{{ t.sampleTypeName || '-' }}</td>
                  <td>{{ t.status || 'New' }}</td>
                </tr>
                <tr *ngIf="tests.length===0">
                  <td colspan="4" class="text-center text-muted">No tests</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SampleCollectionComponent {
  @Input() order: any;
  @Input() tests: Array<any> = [];
  @Output() cancel = new EventEmitter<void>();
  @Output() collected = new EventEmitter<any>();

  sampleTypes = [
    { id: 1, name: 'Serum' },
    { id: 2, name: 'EDTA Blood' },
    { id: 3, name: 'Urine' }
  ];

  collectors = [
    { id: 101, name: 'Nurse A' },
    { id: 102, name: 'Nurse B' }
  ];

  form: any = {
    sampleTypeId: null,
    collectionDate: new Date().toISOString().slice(0,10),
    collectionTime: '09:00',
    collectorId: null,
    priority: 'Routine',
    labelCount: 1,
    notes: ''
  };

  canCollect() {
    return this.form.sampleTypeId && this.form.collectionDate && this.form.collectionTime && (this.tests || []).some(t => t.selected);
  }

  onCollect() {
    const payload = {
      order: this.order,
      selectedTests: (this.tests || []).filter(t => t.selected),
      form: this.form
    };
    this.collected.emit(payload);
  }
}
