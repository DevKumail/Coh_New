import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';

@Component({
  selector: 'app-ivf-ps-pathology-results',
  standalone: true,
  imports: [CommonModule, GenericPaginationComponent],
  styles: [`
    .skeleton-loader { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation: loading 1.5s ease-in-out infinite; border-radius:4px; }
    @keyframes loading { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  `],
  template: `
    <div class="px-2 py-2">
      <div class="card shadow-sm">
        <div class="card-header">Pathology results</div>
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
                  <tr *ngFor="let r of pagedRows">
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
  resultsRows: any[] = [
    {
      date: '30.01.2025', type: 'Hormones', group: 'General', sample: 'Serum',
      parameter: 'E2', abbrev: 'E2', value: 100, unit: 'pg/ml', note: '',
      clinician: 'Doe, John Dr.', findingStatus: '✔', approvalStatus: '✔', attentionFor: '', attachment: ''
    },
    {
      date: '29.01.2025', type: 'Serology', group: 'General', sample: 'Serum',
      parameter: 'HbsAg', abbrev: 'HBSAG', value: 'negative', unit: '', note: '',
      clinician: '', findingStatus: '☐', approvalStatus: '', attentionFor: '', attachment: ''
    },
    {
      date: '28.01.2025', type: 'Serology', group: 'HIV', sample: 'Serum',
      parameter: 'HIV1 Ab (Westernblot)', abbrev: 'HIV1W', value: 'positive', unit: '', note: '',
      clinician: 'Doe, Jane Dr.', findingStatus: '☐', approvalStatus: '✔', attentionFor: '', attachment: ''
    }
  ];

  get pagedRows() {
    this.totalItems = this.resultsRows.length;
    const start = (this.currentPage - 1) * this.pageSize;
    return this.resultsRows.slice(start, start + this.pageSize);
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
