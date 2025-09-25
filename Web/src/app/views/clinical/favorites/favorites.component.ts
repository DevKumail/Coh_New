import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIconComponent, FormsModule,TranslatePipe ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',

})
export class FavoritesComponent implements OnInit {
  favoritesForm!: FormGroup;
  @Output() searchICD9Code = new EventEmitter<any>();
  @Output() selectIcdCode = new EventEmitter<any>();

  icdVersionList: string[] = ['ICD-9-CM', 'ICD-10-CM', 'SNOMED'];
  searchResults: any[] = [];
  favoritesData = [
    {
      providerName: 'Dr. Ahmed Ali',
      code: '002.0',
      problem: 'Typhoid fever',
      icdVersion: 'ICD-9-CM',
      confidential: true,
      status: 'Active',
      startDate: '2024-06-12',
      endDate: '2024-06-15',
      comments: 'comments123'
    }
  ];

  selectedYear!: number;
  searchText: string = '';
  selectedCode: string = '';
  selectedVersion: string = '';
  selectedStartCode: string = '';
  years: number[] = [];
  currentPage: number = 1;
  ProviderId: any=0;
  pageSize: number = 10;
  pageSizes = [5, 10, 25, 50];
 pageNumbers: number[] = [];
  totalPages: number = 0;
    ICT9Group: any[] = [];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ClinicalApiService: ClinicalApiService // Assuming you have a ClinicalService to handle API calls

  ) {}

  ngOnInit(): void {
    this.favoritesForm = this.fb.group({
      icdVersion: [''],
      searchCode: [''],
      startingCode: ['']
    });

    this.loadYears();
  }

loadICD9Group() {
  this.ClinicalApiService.GetICD9CMGroupByProvider(this.ProviderId).then((response) => {
    console.log(response, 'Group');

    this.ICT9Group = response as { groupId: any; groupName: any }[];

    this.ICT9Group = this.ICT9Group.map((item) => {
      return {
        name: item.groupName,
        code: item.groupId,
      };
    });

    const item = {
      name: 'ALL',
      code: 0,
    };
    this.ICT9Group.push(item);
  }).catch(error => {
    //this.ClinicalApiService.add({ severity: 'error', summary: 'Error', detail: error.message });
  });
}

  loadYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  }

  onSearch(): void {
    const formData = this.favoritesForm.value;
    this.searchICD9Code.emit({
      version: formData.icdVersion,
      code: formData.searchCode,
      startCode: formData.startingCode
    });

    // Dummy search result to simulate API response
    this.searchResults = [
      {
        code: '002.0',
        icdVersion: formData.icdVersion || 'ICD-9-CM',
        description: 'Typhoid fever'
      }
    ];
  }

  onSelectCode(code: string): void {
    this.selectIcdCode.emit(code);
  }

  get start(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get end(): number {
    const endValue = this.start + this.pageSize;
    return endValue > this.favoritesData.length ? this.favoritesData.length : endValue;
  }

  get paginatedData() {
    return this.favoritesData.slice(this.start, this.end);
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.end < this.favoritesData.length) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }


}
