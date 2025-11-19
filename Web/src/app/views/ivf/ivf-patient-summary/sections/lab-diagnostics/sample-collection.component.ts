import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';

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
          <button class="btn btn-secondary btn-sm" (click)="cancel.emit()">Close</button>
          <button class="btn btn-primary btn-sm" (click)="onCollect()" [disabled]="!canCollect()">Collect</button>
        </div>
      </div>
      <div class="card-body">
        <div class="row g-3">
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
        </div>

        <div class="mt-3">
          <div class="fw-semibold mb-2">Tests in this order</div>
          <div class="table-responsive h-56 overflow-auto border rounded">
            <table class="table table-sm table-bordered align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Test</th>
                  <th>Material</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of tests; let i = index">
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
export class SampleCollectionComponent implements OnInit {
  @Input() order: any;
  @Input() tests: Array<any> = [];
  @Output() cancel = new EventEmitter<void>();
  @Output() collected = new EventEmitter<any>();

  collectors: Array<{ id: number; name: string }> = [];

  form: any = {
    collectionDate: new Date().toISOString().slice(0,10),
    collectionTime: '09:00',
    collectorId: null,
    notes: ''
  };

  constructor(private ivfApi: IVFApiService) {}

  ngOnInit(): void {
    this.loadCollectors();
  }

  private loadCollectors() {
    // EmployeeTypeId = 1 as requested
    this.ivfApi.getRefPhysicians(1).subscribe({
      next: (rows: any[]) => { this.collectors = Array.isArray(rows) ? rows : []; },
      error: () => { this.collectors = []; }
    });
  }

  canCollect() {
    return !!this.form.collectorId && !!this.form.collectionDate && !!this.form.collectionTime && (this.tests || []).length > 0;
  }

  onCollect() {
    const payload = {
      order: this.order,
      tests: this.tests || [],
      form: this.form
    };
    this.collected.emit(payload);
  }
}
