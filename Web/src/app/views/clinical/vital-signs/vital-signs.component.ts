import { routes } from './../../../app.routes';
import { EmailItemType } from '@/app/views/apps/email/types';
import { Component, AfterViewInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { PageTitleComponent } from '@app/components/page-title.component';
import { UiCardComponent } from '@app/components/ui-card.component';
import { NgIcon } from '@ng-icons/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FilePondModule } from 'ngx-filepond';
import { OnInit } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { ViewChild } from '@angular/core';
import { NgxDaterangepickerBootstrapDirective } from 'ngx-daterangepicker-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CounterDirective } from '@core/directive/counter.directive';
import { vitalsingsDto } from '@/app/shared/Models/Clinical/vitalsings.model';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { LoaderService } from '@core/services/loader.service';
import { error } from 'console';
import { TheaterIcon } from 'lucide-angular';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';



declare var flatpickr: any;

@Component({
    selector: 'app-vital-signs',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
        FilePondModule,
        NgbNavModule,
        GenericPaginationComponent
    ],
    templateUrl: './vital-signs.component.html',
    styleUrl: './vital-signs.component.scss',
})


// export class VitalSignsComponent implements OnInit {
//     @ViewChild('picker') picker!: NgxDaterangepickerBootstrapDirective;

//     @ViewChild('pulseCounter') pulseCounter!: CounterDirective;

//     vitalSignsForm!: FormGroup;

//     vitalSignsList: any[] = [];

//     bpSystolic = 0;
//     bpDiastolic = 0;
//     heartRate = 0;
//     respirationRate = 0;
//     temperature = 0;
//     weight = 0;
//     height = 0;
//     bmi = 0;
//     spo2 = 0;
//     glucose = 0;

//     // Pagination properties
//     currentPage = 1;
//     pageSize = 5;
//     pageSizes: number[] = [5, 10, 20, 50];
//     start = 0;
//     end = this.pageSize;

//     isSubmitting: boolean = false;

//     constructor(
//         private fb: FormBuilder,
//         private router: Router,
//         private ClinicalApiService: ClinicalApiService,
//         public Loader: LoaderService
//     ) {}

//     ngOnInit(): void {
//         this.vitalSignsForm = this.fb.group({
//             entryDate: [null, Validators.required],
//             dailyStartTime: [null, Validators.required],
//             bpArm: ['left', Validators.required],
//             comment: [''],
//             bpSystolic: [null],
//             bpDiastolic: [null],
//             heartRate: [null],
//             respirationRate: [null],
//             temperature: [null],
//             weight: [null],
//             height: [null],
//             bmi: [null],
//             spo2: [null],
//             glucose: [null],
//         });

//         flatpickr('#entryDate', {
//             dateFormat: 'Y-m-d',
//             maxDate: 'today',
//             onChange: (selectedDates: any, dateStr: string) => {
//                 this.vitalSignsForm.get('entryDate')?.setValue(dateStr);
//             },
//         });

//         //this.vitalSign('1006');
//     }

//     calculateBMI() {
//         if (this.height > 0) {
//             const heightInMeters = this.height / 100;
//             this.bmi = +(
//                 this.weight /
//                 (heightInMeters * heightInMeters)
//             ).toFixed(2);
//         }
//     }

//     // onSubmit() {
//     //     this.isSubmitting = true;
//     //     debugger;
//     //     if (this.vitalSignsForm.invalid) {
//     //         this.vitalSignsForm.markAllAsTouched();
//     //         Swal.fire({
//     //             icon: 'warning',
//     //             title: 'Form Incomplete',
//     //             text: 'Please fill all required fields.',
//     //         });
//     //         return;
//     //     }

//     //     const mrNo = '1006';
//     //     const appointmentId = 104080;

//     //     const payload: vitalsingsDto = {
//     //         MRNo: mrNo,
//     //         AppointmentId: appointmentId,
//     //         VisitAccountNo: 123456,
//     //         EntryDate: this.vitalSignsForm.value.entryDate,
//     //         UpdateDate: new Date(),
//     //         UpdateBy: 'admin',
//     //         BPSystolic: this.vitalSignsForm.value.bpSystolic,
//     //         BPDiastolic: this.vitalSignsForm.value.bpDiastolic,
//     //         BPArm: this.vitalSignsForm.value.bpArm === 'right' ? 1 : 0,
//     //         PulseRate: this.vitalSignsForm.value.heartRate,
//     //         HeartRate: this.vitalSignsForm.value.heartRate,
//     //         RespirationRate: this.vitalSignsForm.value.respirationRate,
//     //         Temperature: this.temperature,
//     //         Weight: this.weight,
//     //         Height: this.height,
//     //         BMI: this.bmi,
//     //         SPO2: this.spo2,
//     //         Glucose: this.vitalSignsForm.value.glucose,
//     //         Comment: this.vitalSignsForm.value.comment,
//     //     };

//     //     console.log('🚀 Submitting payload:', payload);

//     //     this.ClinicalApiService.VitalSignInsert(payload)
//     //         .then(() => {
//     //             Swal.fire({
//     //                 icon: 'success',
//     //                 title: 'Saved',
//     //                 text: 'Vital signs saved successfully!',
//     //                 confirmButtonText: 'OK',
//     //             }).then(() => {
//     //                 this.router.navigate(['/clinical/summary-sheet']);
//     //             });
//     //         })
//     //         .catch((err: any) => {
//     //             Swal.fire({
//     //                 icon: 'error',
//     //                 title: 'Error',
//     //                 text: err?.message || 'Failed to save vital signs.',
//     //             });
//     //         });
//     // }

//     onSubmit() {
//       this.isSubmitting = true; // ✅ Start loading
//       debugger;

//       if (this.vitalSignsForm.invalid) {
//         this.vitalSignsForm.markAllAsTouched();
//         Swal.fire({
//           icon: 'warning',
//           title: 'Form Incomplete',
//           text: 'Please fill all required fields.',
//         });
//         this.isSubmitting = false; // ✅ Stop loading if form invalid
//         return;
//       }

//       const mrNo = "1006";
//       const appointmentId = 104080;

//       const payload: vitalsingsDto = {
//         MRNo: mrNo,
//         AppointmentId: appointmentId,
//         VisitAccountNo: 123456,
//         EntryDate: this.vitalSignsForm.value.entryDate,
//         UpdateDate: new Date(),
//         UpdateBy: 'admin',
//         BPSystolic: this.vitalSignsForm.value.bpSystolic,
//         BPDiastolic: this.vitalSignsForm.value.bpDiastolic,
//         BPArm: this.vitalSignsForm.value.bpArm === 'right' ? 1 : 0,
//         PulseRate: this.vitalSignsForm.value.heartRate,
//         HeartRate: this.vitalSignsForm.value.heartRate,
//         RespirationRate: this.vitalSignsForm.value.respirationRate,
//         Temperature: this.vitalSignsForm.value.temperature,
//         Weight: this.vitalSignsForm.value.weight,
//         Height: this.vitalSignsForm.value.height,
//         BMI: this.vitalSignsForm.value.bmi,
//         SPO2: this.vitalSignsForm.value.spo2,
//         Glucose: this.vitalSignsForm.value.glucose,
//         Comment: this.vitalSignsForm.value.comment,
//       };

//       console.log('🚀 Submitting payload:', payload);

//       this.ClinicalApiService.VitalSignInsert(payload)
//         .then(() => {
//           Swal.fire({
//             icon: 'success',
//             title: 'Saved',
//             text: 'Vital signs saved successfully!',
//             confirmButtonText: 'OK'
//           }).then(() => {
//              this.vitalSignsForm.reset();
//             this.isSubmitting = false;
//             this.router.navigate(['/clinical/summary-sheet']);
//           });
//         })
//         .catch((err: any) => {
//           this.isSubmitting = false; // ✅ Stop loading if error occurs
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: err?.message || 'Failed to save vital signs.',
//           });
//         });
//     }

//     deleteVital(index: number) {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: 'You are about to delete this vital sign entry.',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#d33',
//             cancelButtonColor: '#6c757d',
//             confirmButtonText: 'Yes, delete it!',
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 this.vitalSignsList.splice(index, 1);
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Deleted!',
//                     text: 'The vital sign entry has been removed.',
//                 });
//             }
//         });
//     }

//     vitalSign(mrNo: string) {
//         this.ClinicalApiService.SummarySheet(mrNo).then((res: any) => {
//             this.vitalSignsList = res?.vitalSigns || [];
//             this.vitalSignsPagedData = this.vitalSignsList || [];
//             this.VitalTotalItems = this.vitalSignsList.length || 0;
//             console.log('vital Sign RESULT: ', res);

//             debugger;
//         });
//     }
//     // onPageSizeChange(event: any) {
//     //     this.pageSize = +event.target.value;
//     //     this.currentPage = 1;
//     //     this.updatePagination();
//     // }
//     // updatePagination() {
//     //     this.start = (this.currentPage - 1) * this.pageSize;
//     //     this.end = this.start + this.pageSize;
//     // }

//     // goToPage(page: number) {
//     //     this.currentPage = page;
//     //     this.updatePagination();
//     // }

//     // nextPage() {
//     //     if (this.currentPage < this.totalPages) {
//     //         this.currentPage++;
//     //         this.updatePagination();
//     //     }
//     // }

//     // prevPage() {
//     //     if (this.currentPage > 1) {
//     //         this.currentPage--;
//     //         this.updatePagination();
//     //     }
//     // }

//     // get totalPages(): number {
//     //     return Math.ceil(this.vitalSignsList.length / this.pageSize);
//     // }

//     // get pageNumbers(): number[] {
//     //     return Array(this.totalPages)
//     //         .fill(0)
//     //         .map((x, i) => i + 1);
//     // }

//     //   onSubmit() {
//     //     if (this.vitalSignsForm.invalid) {
//     //       this.vitalSignsForm.markAllAsTouched();
//     //       return;
//     //     }

//     //     const Demographicsinfo = localStorage.getItem('Demographics');
//     //     const visitInfo = localStorage.getItem('LoadvisitDetail');
//     //     if (!Demographicsinfo || !visitInfo) {
//     //       this.ClinicalApiService.add({ severity: 'error', summary: 'Missing Info', detail: 'Demographics or Visit Info missing' });
//     //       return;
//     //     }

//     //     const Demographics = JSON.parse(Demographicsinfo);
//     //     const Visit = JSON.parse(visitInfo);

//     //     const mrNo = Demographics?.table2?.[0]?.mrNo;
//     //     const appointmentId = Visit?.appointmentId;

//     //     if (!mrNo || !appointmentId) {
//     //       this.ClinicalApiService.add({ severity: 'error', summary: 'Missing Data', detail: 'MR No or Appointment ID missing' });
//     //       return;
//     //     }

//     //     // Set BMI
//     //     this.calculateBMI();

//     //     const payload: vitalsingsDto = {
//     //       mrNo,
//     //       appointmentId,
//     //       entryDate: this.vitalSignsForm.value.entryDate,
//     //       dailyStartTime: this.vitalSignsForm.value.dailyStartTime,
//     //       bpSystolic: this.bpSystolic,
//     //       bpDiastolic: this.bpDiastolic,
//     //       bpArm: this.vitalSignsForm.value.bpArm === 'right' ? 1 : 0,
//     //       heartRate: this.heartRate,
//     //       respirationRate: this.respirationRate,
//     //       temperature: this.temperature,
//     //       weight: this.weight,
//     //       height: this.height,
//     //       bmi: this.bmi,
//     //       spo2: this.spo2,
//     //       glucose: this.glucose,
//     //       comment: this.vitalSignsForm.value.comment,
//     //       updateDate: new Date()
//     //     };

//     //     console.log('🚀 Submitting payload:', payload);

//     //     this.ClinicalApiService.VitalSignInsert(payload).then(() => {
//     //       this.ClinicalApiService.add({ severity: 'success', summary: 'Saved', detail: 'Vital signs saved successfully' });
//     //       this.router.navigate(['/clinical/summary-sheet']);
//     //     });
//     //   }
//     // onSubmit() {
//     //   if (this.vitalSignsForm.invalid) {
//     //     this.vitalSignsForm.markAllAsTouched();
//     //     Swal.fire({
//     //       icon: 'warning',
//     //       title: 'Form Incomplete',
//     //       text: 'Please fill all required fields.',
//     //     });
//     //     return;
//     //   }

//     //   // Hardcoded values
//     //   const mrNo = "1004"; // Replace with actual test MR No
//     //   const appointmentId = 104080; // Replace with actual test Appointment ID

//     //   // Set BMI
//     //   this.calculateBMI();

//     //   const payload: vitalsingsDto = {
//     //     mrNo,
//     //     appointmentId,
//     //     entryDate: this.vitalSignsForm.value.entryDate,
//     //     dailyStartTime: this.vitalSignsForm.value.dailyStartTime,
//     //     bpSystolic: this.bpSystolic,
//     //     bpDiastolic: this.bpDiastolic,
//     //     bpArm: this.vitalSignsForm.value.bpArm === 'right' ? 1 : 0,
//     //     heartRate: this.heartRate,
//     //     respirationRate: this.respirationRate,
//     //     temperature: this.temperature,
//     //     weight: this.weight,
//     //     height: this.height,
//     //     bmi: this.bmi,
//     //     spo2: this.spo2,
//     //     glucose: this.glucose,
//     //     comment: this.vitalSignsForm.value.comment,
//     //     updateDate: new Date()
//     //   };

//     //   console.log('🚀 Submitting payload:', payload);

//     //   this.ClinicalApiService.VitalSignInsert(payload)
//     //     .then(() => {
//     //       Swal.fire({
//     //         icon: 'success',
//     //         title: 'Saved',
//     //         text: 'Vital signs saved successfully!',
//     //       });
//     //       this.router.navigate(['/clinical/summary-sheet']);
//     //     })
//     //     .catch((err: any) => {
//     //       Swal.fire({
//     //         icon: 'error',
//     //         title: 'Error',
//     //         text: err?.message || 'Failed to save vital signs.',
//     //       });
//     //     });
//     // }

//     vitalSignsPagedData: any[] = [];
//     VitalCurrentPage = 1;
//     VitalPageSize = 10;
//     VitalTotalItems = 0;
//     FilterData: any = {};

//     get VitalTotalPages(): number {
//         return Math.ceil(this.VitalTotalItems / this.VitalPageSize);
//     }

//     get VitalStart(): number {
//         return (this.VitalCurrentPage - 1) * this.VitalPageSize;
//     }

//     get VitalEnd(): number {
//         return Math.min(
//             this.VitalStart + this.VitalPageSize,
//             this.VitalTotalItems
//         );
//     }

//     get VitalPageNumbers(): (number | string)[] {
//         const total = this.VitalTotalPages;
//         const current = this.VitalCurrentPage;
//         const delta = 2;

//         const range: (number | string)[] = [];
//         const left = Math.max(2, current - delta);
//         const right = Math.min(total - 1, current + delta);

//         range.push(1);
//         if (left > 2) range.push('...');
//         for (let i = left; i <= right; i++) range.push(i);
//         if (right < total - 1) range.push('...');
//         if (total > 1) range.push(total);

//         return range;
//     }
//     VitalGoToPage(page: number) {
//         if (typeof page !== 'number' || page < 1 || page > this.VitalTotalPages)
//             return;
//         this.VitalCurrentPage = page;
//         this.FetchVitalSigns();
//     }

//     VitalNextPage() {
//         if (this.VitalCurrentPage < this.VitalTotalPages) {
//             this.VitalCurrentPage++;
//             this.FetchVitalSigns();
//         }
//     }

//     VitalPrevPage() {
//         if (this.VitalCurrentPage > 1) {
//             this.VitalCurrentPage--;
//             this.FetchVitalSigns();
//         }
//     }

//     onVitalPageSizeChange(event: any) {
//         this.VitalPageSize = +event.target.value;
//         this.VitalCurrentPage = 1;
//         this.FetchVitalSigns();
//     }
//    FetchVitalSigns() {
//   const paginationInfo = {
//     Page: this.VitalCurrentPage,
//     RowsPerPage: this.VitalPageSize
//   };

//   const mrNo = '1006';
//   this.Loader.show();

//   this.ClinicalApiService.SummarySheet(mrNo).then((res: any) => {
//     this.vitalSignsPagedData = res?.table1 || [];
//     this.VitalTotalItems = res?.table2?.[0]?.totalCount || 0;
//     this.Loader.hide();
//   }).catch((error: any) => {
//     this.Loader.hide();
//     Swal.fire({ icon: 'error', title: 'Error', text: error.message });
//   });
// }

// }
export class VitalSignsComponent implements OnInit {
  vitalSignsForm!: FormGroup;
  SearchPatientData: any;
  patientDataSubscription!: Subscription;

  vitalSignsPagedData: any[] = [];
  VitalCurrentPage = 1;
  VitalPageSize = 10;
  VitalTotalItems = 0;
isSubmitting: any;
VitalStart: any;
bpSystolic = 0;
    bpDiastolic = 0;
    heartRate = 0;
    respirationRate = 0;
    temperature = 0;
    weight = 0;
    height = 0;
    bmi = 0;
    spo2 = 0;
    glucose = 0;


  get VitalTotalPages(): number {
    return Math.ceil(this.VitalTotalItems / this.VitalPageSize);
  }

  constructor(
    private fb: FormBuilder,
    private ClinicalApiService: ClinicalApiService,
    public Loader: LoaderService,
    private PatientData: PatientBannerService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Dynamic MRNO from banner
    this.patientDataSubscription = this.PatientData.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) => prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo)
      )
      .subscribe((data: any) => {
        this.SearchPatientData = data;
        const mrNo = this.SearchPatientData?.table2[0]?.mrNo;
        this.vitalSign(mrNo);
      });

    this.vitalSign(this.SearchPatientData?.table2[0]?.mrNo || '' );

    this.vitalSignsForm = this.fb.group({
      entryDate: [null, Validators.required],
      dailyStartTime: [null, Validators.required],
      bpArm: ['left', Validators.required],
      comment: [''],
      bpSystolic: [null],
      bpDiastolic: [null],
      heartRate: [null],
      respirationRate: [null],
      temperature: [null],
      weight: [null],
      height: [null],
      bmi: [null],
      spo2: [null],
      glucose: [null],
    });

    flatpickr('#entryDate', {
      dateFormat: 'Y-m-d',
      maxDate: 'today',
      onChange: (selectedDates: any, dateStr: string) => {
        this.vitalSignsForm.get('entryDate')?.setValue(dateStr);
      },
    });


  }

//   onSubmit() {
//     if (this.vitalSignsForm.invalid) {
//       this.vitalSignsForm.markAllAsTouched();
//       Swal.fire({
//         icon: 'warning',
//         title: 'Form Incomplete',
//         text: 'Please fill all required fields.',
//       });
//       return;
//     }

//     if (!this.SearchPatientData?.table2?.[0]?.mrNo) {
//       Swal.fire('Validation Error', 'MRNo is missing. Please select a patient.', 'warning');
//       return;
//     }

//     const mrNo = this.SearchPatientData.table2[0].mrNo;
//     const payload = {
//       mrNo: mrNo,
//       ...this.vitalSignsForm.value
//     };

//     console.log("Submitting payload", payload);


//   }
// onSubmit() {
//   if (this.vitalSignsForm.invalid) {
//     this.vitalSignsForm.markAllAsTouched();
//     Swal.fire({
//       icon: 'warning',
//       title: 'Form Incomplete',
//       text: 'Please fill all required fields.',
//     });
//     return;
//   }

//   if (!this.SearchPatientData?.table2?.[0]?.mrNo) {
//     Swal.fire('Validation Error', 'MRNo is missing. Please select a patient.', 'warning');
//     return;
//   }

//   const mrNo = this.SearchPatientData.table2[0].mrNo;




//  const payload: vitalsingsDto = {
//   MRNo: mrNo,
//   AppointmentId: this.SearchPatientData?.table2?.[0]?.appointmentId || 0,
//   EntryDate: this.vitalSignsForm.value.entryDate,
//   DailyStartTime: this.vitalSignsForm.value.dailyStartTime,
//   BPSystolic: this.bpSystolic,
//   BPDiastolic: this.bpDiastolic,
//   BPArm: this.vitalSignsForm.value.bpArm === 'right' ? 1 : 0,
//   HeartRate: this.heartRate,
//   RespirationRate: this.respirationRate,
//   Temperature: this.temperature,
//   Weight: this.weight,
//   Height: this.height,
//   BMI: this.bmi,
//   SPO2: this.spo2,
//   Glucose: this.glucose,
//   Comment: this.vitalSignsForm.value.comment,
//   UpdateDate: new Date()
// };


//   console.log('🚀 Submitting payload:', payload);

//   this.ClinicalApiService.VitalSignInsert(payload)
//     .then(() => {
//       Swal.fire({
//         icon: 'success',
//         title: 'Saved',
//         text: 'Vital signs saved successfully!',
//       });
//       this.router.navigate(['/clinical/summary-sheet']);
//     })
//     .catch((err: any) => {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: err?.message || 'Failed to save vital signs.',
//       });
//     });
// }
onSubmit() {
      this.isSubmitting = true;


      if (this.vitalSignsForm.invalid) {
        this.vitalSignsForm.markAllAsTouched();
        Swal.fire({
          icon: 'warning',
          title: 'Form Incomplete',
          text: 'Please fill all required fields.',
        });
        this.isSubmitting = false;
        return;
      }

      const payload: vitalsingsDto = {
        MRNo: this.SearchPatientData.table2[0].mrNo || '',
        EntryDate: this.vitalSignsForm?.value?.entryDate,
        UpdateDate: new Date(),
        UpdateBy: 'admin',
        BPSystolic: this.vitalSignsForm?.value?.bpSystolic,
        BPDiastolic: this.vitalSignsForm?.value?.bpDiastolic,
        BPArm: this.vitalSignsForm.value.bpArm === 'right' ? 1 : 0,
        PulseRate: this.vitalSignsForm.value.heartRate,
        HeartRate: this.vitalSignsForm.value.heartRate,
        RespirationRate: this.vitalSignsForm.value.respirationRate,
        Temperature: this.vitalSignsForm.value.temperature,
        Weight: this.vitalSignsForm.value.weight,
        Height: this.vitalSignsForm.value.height,
        BMI: this.vitalSignsForm.value.bmi,
        SPO2: this.vitalSignsForm.value.spo2,
        Glucose: this.vitalSignsForm.value.glucose,
        Comment: this.vitalSignsForm.value.comment,
      };

      console.log('🚀 Submitting payload:', payload);

      this.ClinicalApiService.VitalSignInsert(payload)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Saved',
            text: 'Vital signs saved successfully!',
            confirmButtonText: 'OK'
          }).then(() => {
             this.vitalSignsForm.reset();
            this.isSubmitting = false;
            this.router.navigate(['/clinical/summary-sheet']);
          });
        })
        .catch((err: any) => {
          this.isSubmitting = false; // ✅ Stop loading if error occurs
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.message || 'Failed to save vital signs.',
          });
        });
    }
  vitalSign(mrNo:string){
    debugger
    this.vitalSignsPagedData = [];
    this.vitalTotalItems = this.vitalSignsPagedData.length;
    this.onvitalPageChanged(1);

    if (!this.SearchPatientData?.table2?.[0]?.mrNo) {
      Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      return;
    }

    this.ClinicalApiService.SummarySheet(mrNo).then((res:any)=>{
    console.log('vital Sign RESULT: ',res);
    this.vitalSignsPagedData = res?.vitalSigns || []
    this.vitalTotalItems = this.vitalSignsPagedData.length;
    this.onvitalPageChanged(1)
    })
  }

    vitalCurrentPage = 1;
    vitalPageSize = 5;
    vitalTotalItems = 0;
    pagedvital: any[] = [];

    async onvitalPageChanged(page: number) {
    this.vitalCurrentPage = page;
    this.setPagedvitalData();
    }

    setPagedvitalData() {
    const startIndex = (this.vitalCurrentPage - 1) * this.vitalPageSize;
    const endIndex = startIndex + this.vitalPageSize;
    this.pagedvital = this.vitalSignsPagedData.slice(startIndex, endIndex);

    }

  ngOnDestroy(): void {
    if (this.patientDataSubscription) {
      this.patientDataSubscription.unsubscribe();
    }
  }
}
