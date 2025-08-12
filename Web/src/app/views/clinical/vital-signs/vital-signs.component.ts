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
import { vitalsingsDto } from '@/app/shared/models/clinical/vitalsings.model';
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
            this.vitalSign(this.SearchPatientData?.table2[0]?.mrNo || '' );
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

  editVital(vital: any) {
debugger
    this.vitalSignsForm.patchValue({
        entryDate: vital?.entryDate?.split('T')[0],
        dailyStartTime: vital?.dailyStartTime,
        temperature: vital?.temperature,
        respirationRate: vital?.respirationRate,
        bpSystolic: vital?.bpSystolic,
        bpDiastolic: vital?.bpDiastolic,
        spo2: vital?.spO2,
        height: vital?.height,
        weight: vital?.weight,
        bmi: vital?.bmi,
        comment: vital?.comment,
        heartRate: vital?.heartrate,
        glucose: vital?.glucose,
    });
}
}
