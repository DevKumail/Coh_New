
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { ClinicalApiService } from '../clinical.api.service';



@Component({
  selector: 'app-allergies',
  imports: [ CommonModule,
    ReactiveFormsModule,
    FormsModule,],
  templateUrl: './allergies.component.html',
  styleUrl: './allergies.component.scss'
})

export class AllergiesComponent implements OnInit {

  allergyForm!: FormGroup;

  // Dropdown Options
  allergyTypes: string[] = ['Food', 'Drug', 'Environmental', 'Other'];
  severityOptions: string[] = ['Low', 'Moderate', 'High', 'Critical'];
  statusOptions: string[] = ['Active', 'Inactive', 'Resolved'];

  allergyData: any[] = [];

  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  pageSizes: number[] = [5, 10, 20];
  start = 0;
  end = this.pageSize;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clinicalApi: ClinicalApiService)
    {}
  


  ngOnInit() {
    this.initForm();
    this.loadDummyData();
    this.updatePagination();
  }

  initForm() {
    this.allergyForm = this.fb.group({
      providerName: [''],
      allergyType: [''],
      allergen: [''],
      severity: [''],
      reaction: [''],
      startDate: [''],
      endDate: [''],
      status: ['']
    });
  }



  loadDummyData() {
    this.allergyData = [
      {
        providerName: 'Dr. Smith',
        allergyType: 'Food',
        allergen: 'Peanuts',
        severity: 'High',
        reaction: 'Anaphylaxis',
        startDate: '2023-01-01',
        endDate: '2023-06-01',
        status: 'Active'
      },
      {
        providerName: 'Dr. Johnson',
        allergyType: 'Drug',
        allergen: 'Penicillin',
        severity: 'Moderate',
        reaction: 'Rash',
        startDate: '2022-03-15',
        endDate: '2022-10-20',
        status: 'Resolved'
      },
      {
        providerName: 'Dr. Brown',
        allergyType: 'Environmental',
        allergen: 'Dust',
        severity: 'Low',
        reaction: 'Sneezing',
        startDate: '2024-02-01',
        endDate: '2024-07-01',
        status: 'Active'
      },
      // Add more dummy items if needed
    ];
    this.updatePagination();
  }

  get MyAlllergyData(): any[] {
    return this.allergyData.slice(this.start, this.end);
  }

  get totalPages(): number {
    return Math.ceil(this.allergyData.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  updatePagination() {
    this.start = (this.currentPage - 1) * this.pageSize;
    this.end = this.start + this.pageSize;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
    this.updatePagination();
  }

  submitAllergyForm() {
    if (this.allergyForm.valid) {
      this.allergyData.push(this.allergyForm.value);
      this.allergyForm.reset();
      this.updatePagination();
    }
  }

  editAllergy(index: number) {
    const globalIndex = this.start + index;
    const selected = this.allergyData[globalIndex];
    this.allergyForm.patchValue(selected);
    this.allergyData.splice(globalIndex, 1);
    this.updatePagination();
  }

  deleteAllergy(index: number) {
    const globalIndex = this.start + index;
    this.allergyData.splice(globalIndex, 1);
    this.updatePagination();
  }

  resetForm() {
    this.allergyForm.reset();
  }


//   submitAllergyForm() {
//   if (this.allergyForm.valid) {
//     const formData = this.allergyForm.value;

//     this.clinicalApi.submitPatientAllergy(formData).subscribe({
//       next: (response) => {
//         console.log('Allergy submitted successfully:', response);
//         this.allergyData.push(formData);
//         this.allergyForm.reset();
//         this.updatePagination();
//       },
//       error: (error) => {
//         console.error('Error submitting allergy:', error);
//       }
//     });
//   }
// }

submitAllergyForm1() {
  if (this.allergyForm.valid) {
    const formData = this.allergyForm.value;
    this.clinicalApi.submitPatientAllergy(formData).subscribe({
      next: (response:any) => {
        console.log('Submitted', response);
        this.allergyData.push(formData);
        this.allergyForm.reset();
        this.updatePagination();
      },
      error: (err: any) => console.error(err)
    });
  }

}
}

