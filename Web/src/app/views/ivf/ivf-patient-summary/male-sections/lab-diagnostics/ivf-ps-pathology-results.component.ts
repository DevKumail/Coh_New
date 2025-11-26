import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { LucideAngularModule, CheckCircle, Square, Plus } from 'lucide-angular';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { OrderCompletionComponent } from './order-completion.component';

@Component({
  selector: 'app-ivf-ps-pathology-results',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericPaginationComponent, LucideAngularModule, OrderCompletionComponent],
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
  `],    
  template: `
    <div class="px-2 py-2" *ngIf="!showCompletePage; else completePage">
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
                  <th>Perform Date</th>
                  <th>Test Name</th>
                  <th>Test Abbreviation</th>
                  <th>CPT Code</th>
                  <th>Sample</th>
                  <th>Clinician</th>
                  <th style="width:100px">Actions</th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                <ng-container *ngIf="isLoading">
                  <tr *ngFor="let i of [1,2,3]">
                    <td colspan="7"><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                  </tr>
                </ng-container>
                <ng-container *ngIf="!isLoading">
                  <ng-container *ngFor="let r of pagedRows; let i = index">
                    <!-- Parent row -->
                    <tr class="cursor-pointer" (click)="toggleExpand(r)" [class.table-active]="expandedRow === r">
                      <td>{{ r.performDate | date:'dd.MM.yyyy' }}</td>
                      <td>{{ r.testName }}</td>
                      <td>{{ r.testAbbreviation }}</td>
                      <td>{{ r.cptCode }}</td>
                      <td>{{ r.sample }}</td>
                      <td>{{ r.clinician }}</td>
                      <td>
                        <button class="btn btn-sm btn-link text-primary p-1" (click)="addObservations(r); $event.stopPropagation()" title="Add Observations" aria-label="Add Observations">
                          <i-lucide [img]="Plus" [size]="16"></i-lucide>
                        </button>
                      </td>
                    </tr>
                    <!-- Child row: observations (always in DOM, show/hide via CSS) -->
                    <tr class="child-row-bg" [class.show]="expandedRow === r">
                      <td colspan="7" class="text-start">
                        <div class="child-container">
                          <ng-container *ngIf="r.observations?.length; else noObs">
                          <div class="fw-semibold mb-2">Observations for {{ r.testName }}</div>
                          <div class="table-responsive">
                            <table class="table table-sm mb-0">
                              <thead>
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
                                  <td>{{ o.sequenceNo }}</td>
                                  <td>{{ o.observation }}</td>
                                  <td>{{ o.abbreviation }}</td>
                                  <td>{{ o.value }}</td>
                                  <td>{{ o.unit }}</td>
                                  <td>{{ o.referenceRangeMin }} - {{ o.referenceRangeMax }}</td>
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
                    <td colspan="7">No data found</td>
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

    <ng-template #completePage>
      <app-order-completion
        [order]="selectedResult"
        [tests]="selectedTests"
        (cancel)="closeCompletePage()"
        (completed)="onCompleted($event)">
      </app-order-completion>
    </ng-template>
  `
})
export class IvfPsPathologyResultsComponent implements OnInit {
  // Lucide icons
  readonly CheckCircle = CheckCircle;
  readonly Square = Square;
  readonly Plus = Plus;

  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  expandedRow: any | null = null;
  searchTerm: string = '';
  resultsRows: any[] = [];
  currentMrNo: string | number = 1006;
  showCompletePage = false;
  selectedResult: any = null;
  selectedTests: any[] = [];

  constructor(private ivfApi: IVFApiService) {}

  ngOnInit(): void {
    this.loadPathologyResults();
  }

  loadPathologyResults() {
    debugger
    if (!this.currentMrNo) return;
    this.isLoading = true;
    this.ivfApi.getPathologyResults(this.currentMrNo).subscribe({
      next: (data: any[]) => {
        this.resultsRows = (data || []).map(r => ({
          ...r,
          status: r.observations?.length > 0 ? r.observations[0].status : ''
        }));
      },
      error: (err) => {
        console.error('Error loading pathology results:', err);
        this.resultsRows = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  get filteredRows() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (!term) {
      return this.resultsRows;
    }
    return this.resultsRows.filter(r => {
      const testName = (r.testName || '').toLowerCase();
      const abbrev = (r.testAbbreviation || '').toLowerCase();
      const cptCode = (r.cptCode || '').toLowerCase();
      return testName.includes(term) || abbrev.includes(term) || cptCode.includes(term);
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

  addObservations(row: any) {
    debugger
    this.selectedResult = {
      orderSetId: row.orderSetDetailId,
      orderNumber: row.cptCode,
      testName: row.testName,
      performDate: row.performDate,
      sample: row.sample,
      clinician: row.clinician
    };
    
    // Convert the pathology result to test format expected by OrderCompletionComponent
    this.selectedTests = [{
      id: row.orderSetDetailId,
      orderSetDetailId: row.orderSetDetailId,
      name: row.testName,
      testName: row.testName,
      cpt: row.cptCode,
      cptCode: row.cptCode,
      sampleTypeName: row.sample,
      material: row.sample,
      status: 'New'
    }];
    
    this.showCompletePage = true;
  }

  closeCompletePage() {
    this.showCompletePage = false;
    this.selectedResult = null;
    this.selectedTests = [];
  }

  onCompleted(payload: any) {
    console.log('Observations completed:', payload);
    // TODO: Call API to save observations
    // After successful save, reload the pathology results
    this.closeCompletePage();
    this.loadPathologyResults();
  }
}
