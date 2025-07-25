import { EmailItemType } from '@/app/views/apps/email/types';
import { Component,AfterViewInit  } from '@angular/core';
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
import { Observable, ReplaySubject } from 'rxjs';
import   Swal from 'sweetalert2';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { ViewChild } from '@angular/core';
import { NgxDaterangepickerBootstrapDirective} from "ngx-daterangepicker-bootstrap";
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask'
import {CounterDirective} from '@core/directive/counter.directive';
import { vitalsingsDto } from '@/app/shared/Models/Clinical/vitalsings.model';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';

declare var flatpickr: any;


@Component({
  selector: 'app-vital-signs',
  imports: [
    CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
        FilePondModule,CounterDirective,
        NgbNavModule,
  ],
  templateUrl: './vital-signs.component.html',
  styleUrl: './vital-signs.component.scss'
})

// export class VitalSignsComponent  {

//     @ViewChild('picker') picker!: NgxDaterangepickerBootstrapDirective;

//    vitalSignsForm!: FormGroup;

//     count: number = 0;
//     min: number = 0;
//     max: number = 999999;
//     count7: number = 0

// bpSystolic = 0;
// bpDiastolic = 0;
// heartRate = 0;
// respirationRate = 0;
// temperature = 0;
// weight = 0;
// height = 0;
// bmi = 0;
// spo2 = 0;
// glucose = 0;

//   @ViewChild('pulseCounter') pulseCounter!: CounterDirective;

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.vitalSignsForm = this.fb.group({
//       entryDate: [null, Validators.required],
//       dailyStartTime: [null, Validators.required],
//       bloodPressure: [''],
//       pulse: [this.count],
//       temperature: [''],
//       respiratoryRate: [''],
//       oxygenSaturation: [''],
//     });
//   }

//   onSubmit() {
//     if (this.vitalSignsForm.valid) {
//       console.log(this.vitalSignsForm.value);
//       // submit logic here
//     } else {
//       this.vitalSignsForm.markAllAsTouched();
//     }
//   }








//   incrementPulse() {
//     this.pulseCounter.increment();
//     this.vitalSignsForm.get('pulse')?.setValue(this.count);
//   }

//   decrementPulse() {
//     this.pulseCounter.decrement();
//     this.vitalSignsForm.get('pulse')?.setValue(this.count);
//   }

//   onPulseChange(val: number) {
//     this.count = val;
//     this.vitalSignsForm.get('pulse')?.setValue(this.count);
//   }

//     ngAfterViewInit(): void {
//     flatpickr('#entryDate', {
//     dateFormat: 'Y-m-d',
//     maxDate: 'today', // typically DOB should not be in the future
//     onChange: (selectedDates: any, dateStr: string) => {
//       this.vitalSignsForm.get('entryDate')?.setValue(dateStr);
//     },
//   });
//   }
// }

export class VitalSignsComponent implements OnInit {
  @ViewChild('picker') picker!: NgxDaterangepickerBootstrapDirective;
  @ViewChild('pulseCounter') pulseCounter!: CounterDirective;

  vitalSignsForm!: FormGroup;

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

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private ClinicalApiService: ClinicalApiService,) {}

  ngOnInit(): void {
    this.vitalSignsForm = this.fb.group({
      entryDate: [null, Validators.required],
      dailyStartTime: [null, Validators.required],
      bpArm: ['left', Validators.required],
      comment: [''],
    });

    flatpickr('#entryDate', {
      dateFormat: 'Y-m-d',
      maxDate: 'today',
      onChange: (selectedDates: any, dateStr: string) => {
        this.vitalSignsForm.get('entryDate')?.setValue(dateStr);
      },
    });
  }

  calculateBMI() {
    if (this.height > 0) {
      const heightInMeters = this.height / 100;
      this.bmi = +(this.weight / (heightInMeters * heightInMeters)).toFixed(2);
    }
  }

//   onSubmit() {
//     if (this.vitalSignsForm.invalid) {
//       this.vitalSignsForm.markAllAsTouched();
//       return;
//     }

//     const Demographicsinfo = localStorage.getItem('Demographics');
//     const visitInfo = localStorage.getItem('LoadvisitDetail');
//     if (!Demographicsinfo || !visitInfo) {
//       this.ClinicalApiService.add({ severity: 'error', summary: 'Missing Info', detail: 'Demographics or Visit Info missing' });
//       return;
//     }

//     const Demographics = JSON.parse(Demographicsinfo);
//     const Visit = JSON.parse(visitInfo);

//     const mrNo = Demographics?.table2?.[0]?.mrNo;
//     const appointmentId = Visit?.appointmentId;

//     if (!mrNo || !appointmentId) {
//       this.ClinicalApiService.add({ severity: 'error', summary: 'Missing Data', detail: 'MR No or Appointment ID missing' });
//       return;
//     }

//     // Set BMI
//     this.calculateBMI();

//     const payload: vitalsingsDto = {
//       mrNo,
//       appointmentId,
//       entryDate: this.vitalSignsForm.value.entryDate,
//       dailyStartTime: this.vitalSignsForm.value.dailyStartTime,
//       bpSystolic: this.bpSystolic,
//       bpDiastolic: this.bpDiastolic,
//       bpArm: this.vitalSignsForm.value.bpArm === 'right' ? 1 : 0,
//       heartRate: this.heartRate,
//       respirationRate: this.respirationRate,
//       temperature: this.temperature,
//       weight: this.weight,
//       height: this.height,
//       bmi: this.bmi,
//       spo2: this.spo2,
//       glucose: this.glucose,
//       comment: this.vitalSignsForm.value.comment,
//       updateDate: new Date()
//     };

//     console.log('🚀 Submitting payload:', payload);

//     this.ClinicalApiService.VitalSignInsert(payload).then(() => {
//       this.ClinicalApiService.add({ severity: 'success', summary: 'Saved', detail: 'Vital signs saved successfully' });
//       this.router.navigate(['/clinical/summary-sheet']);
//     });
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

//   // Hardcoded values
//   const mrNo = "1004"; // Replace with actual test MR No
//   const appointmentId = 104080; // Replace with actual test Appointment ID

//   // Set BMI
//   this.calculateBMI();

//   const payload: vitalsingsDto = {
//     mrNo,
//     appointmentId,
//     entryDate: this.vitalSignsForm.value.entryDate,
//     dailyStartTime: this.vitalSignsForm.value.dailyStartTime,
//     bpSystolic: this.bpSystolic,
//     bpDiastolic: this.bpDiastolic,
//     bpArm: this.vitalSignsForm.value.bpArm === 'right' ? 1 : 0,
//     heartRate: this.heartRate,
//     respirationRate: this.respirationRate,
//     temperature: this.temperature,
//     weight: this.weight,
//     height: this.height,
//     bmi: this.bmi,
//     spo2: this.spo2,
//     glucose: this.glucose,
//     comment: this.vitalSignsForm.value.comment,
//     updateDate: new Date()
//   };

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
    debugger
  if (this.vitalSignsForm.invalid) {
    this.vitalSignsForm.markAllAsTouched();
    Swal.fire({
      icon: 'warning',
      title: 'Form Incomplete',
      text: 'Please fill all required fields.',
    });
    return;
  }

  // Hardcoded values
  const mrNo = "1004";
  const appointmentId = 104080;

  // Set BMI
  this.calculateBMI();

  const payload: vitalsingsDto = {
    mrNo,
    appointmentId,
    entryDate: this.vitalSignsForm.value.entryDate,
    dailyStartTime: this.vitalSignsForm.value.dailyStartTime,
    bpSystolic: this.bpSystolic,
    bpDiastolic: this.bpDiastolic,
    bpArm: this.vitalSignsForm.value.bpArm === 'right' ? 1 : 0,
    heartRate: this.heartRate,
    respirationRate: this.respirationRate,
    temperature: this.temperature,
    weight: this.weight,
    height: this.height,
    bmi: this.bmi,
    spo2: this.spo2,
    glucose: this.glucose,
    comment: this.vitalSignsForm.value.comment,
    updateDate: new Date()
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
        this.router.navigate(['/clinical/summary-sheet']);
      });
    })
    .catch((err: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Failed to save vital signs.',
      });
    });
}


}
