import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';

@Component({
  selector: 'app-ivf-ps-pathology-results',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericPaginationComponent],
  styles: [`
    .skeleton-loader { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation: loading 1.5s ease-in-out infinite; border-radius:4px; }
    @keyframes loading { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .cursor-pointer { cursor: pointer; }
    .child-row-bg { background-color: #f9fafb; }
    .child-container { max-height: 0; overflow: hidden; transition: max-height 0.5s ease-in-out; }
    .child-row-bg.show .child-container { max-height: 500px; }
  `],
  template: `
    <div class="px-2 py-2">
      <div class="card shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>Pathology results</span>
          <div class="d-flex align-items-center gap-2">
            <label class="mb-0 small text-muted">Search:</label>
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="Parameter or CPT/Abbrev"
              [(ngModel)]="searchTerm"
            />
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered text-center table-striped table-sm mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Group</th>
                  <th>Sample</th>
                  <th>Parameter</th>
                  <th>Param. abbreviation</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>Note</th>
                  <th>Clinician</th>
                  <th>Finding status</th>
                  <th>Approval status</th>
                  <th>Attention for</th>
                  <th>Attachment</th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                <ng-container *ngIf="isLoading">
                  <tr *ngFor="let i of [1,2,3]">
                    <td colspan="14"><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                  </tr>
                </ng-container>
                <ng-container *ngIf="!isLoading">
                  <ng-container *ngFor="let r of pagedRows; let i = index">
                    <!-- Parent row -->
                    <tr class="cursor-pointer" (click)="toggleExpand(r)" [class.table-active]="expandedRow === r">
                      <td>{{ r.date }}</td>
                      <td>{{ r.type }}</td>
                      <td>{{ r.group }}</td>
                      <td>{{ r.sample }}</td>
                      <td>{{ r.parameter }}</td>
                      <td>{{ r.abbrev }}</td>
                      <td>{{ r.value }}</td>
                      <td>{{ r.unit }}</td>
                      <td>{{ r.note }}</td>
                      <td>{{ r.clinician }}</td>
                      <td>{{ r.findingStatus }}</td>
                      <td>{{ r.approvalStatus }}</td>
                      <td>{{ r.attentionFor }}</td>
                      <td>{{ r.attachment }}</td>
                    </tr>
                    <!-- Child row: observations (always in DOM, show/hide via CSS) -->
                    <tr class="child-row-bg" [class.show]="expandedRow === r">
                      <td colspan="14" class="text-start">
                        <div class="child-container">
                          <ng-container *ngIf="r.observations?.length; else noObs">
                          <div class="fw-semibold mb-2">Observations for {{ r.parameter }}</div>
                          <div class="table-responsive">
                            <table class="table table-sm table-bordered mb-0">
                              <thead class="table-light">
                                <tr>
                                  <th style="width: 40px;">#</th>
                                  <th>Observation</th>
                                  <th>Abbreviation</th>
                                  <th>Value</th>
                                  <th>Unit</th>
                                  <th>Reference Range</th>
                                  <th>Status</th>
                                  <th>Note</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr *ngFor="let o of r.observations; let j = index">
                                  <td>{{ j + 1 }}</td>
                                  <td>{{ o.name }}</td>
                                  <td>{{ o.abbrev }}</td>
                                  <td>{{ o.value }}</td>
                                  <td>{{ o.unit }}</td>
                                  <td>{{ o.refRange }}</td>
                                  <td>{{ o.status }}</td>
                                  <td>{{ o.note }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </ng-container>
                        <ng-template #noObs>
                          <span class="text-muted">No observations available for this parameter.</span>
                        </ng-template>
                        </div>
                      </td>
                    </tr>
                  </ng-container>
                  <tr *ngIf="totalItems === 0">
                    <td colspan="14">No data found</td>
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
  `
})
export class IvfPsPathologyResultsComponent {
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  expandedRow: any | null = null;
  searchTerm: string = '';
  resultsRows: any[] = [
    {
      date: '30.01.2025', type: 'Hormones', group: 'General', sample: 'Serum',
      parameter: 'E2', abbrev: 'E2', value: 100, unit: 'pg/ml', note: '',
      clinician: 'Doe, John Dr.', findingStatus: '✔', approvalStatus: '✔', attentionFor: '', attachment: '',
      observations: [
        { name: 'E2 Level', abbrev: 'E2', value: 100, unit: 'pg/ml', refRange: '0 - 200', status: 'Normal', note: '' },
        { name: 'Comment', abbrev: 'CMT', value: '', unit: '', refRange: '', status: 'Reviewed', note: 'Within expected range.' }
      ]
    },
    {
      date: '29.01.2025', type: 'Serology', group: 'General', sample: 'Serum',
      parameter: 'HbsAg', abbrev: 'HBSAG', value: 'negative', unit: '', note: '',
      clinician: '', findingStatus: '☐', approvalStatus: '', attentionFor: '', attachment: '',
      observations: [
        { name: 'HbsAg Screen', abbrev: 'HBSAG', value: 'negative', unit: '', refRange: 'negative', status: 'Normal', note: '' }
      ]
    },
    {
      date: '28.01.2025', type: 'Serology', group: 'HIV', sample: 'Serum',
      parameter: 'HIV1 Ab (Westernblot)', abbrev: 'HIV1W', value: 'positive', unit: '', note: '',
      clinician: 'Doe, Jane Dr.', findingStatus: '☐', approvalStatus: '✔', attentionFor: '', attachment: '',
      observations: [
        { name: 'HIV1 Ab', abbrev: 'HIV1W', value: 'positive', unit: '', refRange: 'negative', status: 'Abnormal', note: 'Confirmatory test advised.' }
      ]
    }
  ];

  get filteredRows() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (!term) {
      return this.resultsRows;
    }
    return this.resultsRows.filter(r => {
      const param = (r.parameter || '').toLowerCase();
      const abbrev = (r.abbrev || '').toLowerCase();
      return param.includes(term) || abbrev.includes(term);
    });
  }

  get pagedRows() {
    const rows = this.filteredRows;
    this.totalItems = rows.length;
    const start = (this.currentPage - 1) * this.pageSize;
    return rows.slice(start, start + this.pageSize);
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }

  toggleExpand(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }
}
