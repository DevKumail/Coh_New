import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { PageTitleComponent} from '@app/components/page-title.component';
import { UiCardComponent} from '@app/components/ui-card.component';
import { NgIcon} from '@ng-icons/core';
import { NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coverage-list',
  standalone: true,
  templateUrl: './coverage-list.component.html',
  styleUrl: './coverage-list.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgIconComponent,
  ]
})
export class CoverageListComponent {
  coverages: any[] = []; // Original complete data
  pagedCoverages: any[] = []; // Visible data for current page

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  pageSizes: number[] = [5, 10, 25, 50];
  start: number = 0;
  end: number = 0;
  pageNumbers: number[] = [];

  constructor(private fb: FormBuilder, public router: Router,) {

  }

  ngOnInit(): void {
    this.loadData(); // Initial data load
  }

  loadData() {
    // 🔁 Replace this with API call
    this.coverages = [
      {
        subscriberId: 'SUB001',
        subscriberName: 'John Doe',
        mrNo: 'MR123',
        insuranceCarrier: 'Carrier A',
        insuranceIDNo: 'INS123',
        type: 'Primary',
        active: true,
      },
      {
        subscriberId: 'SUB002',
        subscriberName: 'Jane Smith',
        mrNo: 'MR456',
        insuranceCarrier: 'Carrier B',
        insuranceIDNo: 'INS456',
        type: 'Secondary',
        active: false,
      },
      // ➕ Add more mock or real data here
    ];

    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.coverages.length / this.pageSize);
    this.pageNumbers = Array(this.totalPages).fill(0).map((_, i) => i + 1);
    this.start = (this.currentPage - 1) * this.pageSize;
    this.end = Math.min(this.start + this.pageSize, this.coverages.length);
    this.pagedCoverages = this.coverages.slice(this.start, this.end);
  }

  onPageSizeChange(event: any) {
    this.currentPage = 1;
    this.pageSize = parseInt(event.target.value);
    this.updatePagination();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  reloadData() {
    this.loadData();
  }
}
