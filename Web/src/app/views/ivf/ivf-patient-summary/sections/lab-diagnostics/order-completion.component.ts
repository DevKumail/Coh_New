import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker, NgbDatepickerModule, NgbTimepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';

export interface LabResultObservation {
  valueType: string;
  observationIdentifierFullName: string;
  observationIdentifierShortName: string;
  observationValue: string;
  units: string;
  referenceRangeMin: string;
  referenceRangeMax: string;
  abnormalFlag: string;
  resultStatus: string;
  observationDateTime: string;
  analysisDateTime: string;
  remarks: string;
  weqayaScreening: boolean;
  sequenceNo: number;
}

@Component({
  selector: 'app-order-completion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule
  ],
  templateUrl: './order-completion.component.html',
  styles: [`
    .form-label {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .form-section {
      background-color: #f8f9fa;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .observation-row {
      background-color: #f8f9fa;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid #dee2e6;
    }
    .btn-add-observation {
      margin-top: 1rem;
    }
  `]
})
export class OrderCompletionComponent implements OnInit, OnChanges {
  @Input() order: any;
  @Input() tests: Array<any> = [];
  @Output() cancel = new EventEmitter<void>();
  @Output() completed = new EventEmitter<any>();

  completionForm!: FormGroup; // Definite assignment assertion
  currentDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };
  currentTime = { hour: new Date().getHours(), minute: new Date().getMinutes() };
  
  // For date picker
  isDisabled = (date: NgbDateStruct, current?: { year: number; month: number }) => {
    if (!date) return false;
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6; // Disable weekends
  };
  
  minDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private ivfApi: IVFApiService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    // Initialize with current date and time
    this.completionForm.patchValue({
      performDate: this.currentDate,
      entryDate: this.currentDate
    });
    // Add an initial observation
    this.addObservation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Ensure Test Details grid refreshes as soon as tests input updates
    if (changes['tests']) {
      const current = changes['tests'].currentValue ?? [];
      // Clone the array so Angular always sees a new reference
      this.tests = Array.isArray(current) ? [...current] : [];
    }
  }

  private initializeForm() {
    this.completionForm = this.fb.group({
      performDate: [this.currentDate],
      entryDate: [this.currentDate],
      isDefault: [true],
      principalResultInterpreter: [null],
      action: ['Final'],
      reviewedBy: ['System User'],
      reviewedDate: [new Date().toISOString()],
      performAtLabId: [0],
      observations: this.fb.array([])
    });
  }


  get observations(): FormArray {
    return this.completionForm.get('observations') as FormArray;
  }

  get performDateControl(): FormControl {
    return this.completionForm.get('performDate') as FormControl;
  }

  createObservation(): FormGroup {
    return this.fb.group({
      valueType: ['NM'],
      observationIdentifierFullName: ['Result'],
      observationIdentifierShortName: ['RES'],
      observationValue: ['0'],
      units: [''],
      referenceRangeMin: [''],
      referenceRangeMax: [''],
      abnormalFlag: ['N'],
      resultStatus: ['F'],
      observationDateTime: [new Date().toISOString()],
      analysisDateTime: [new Date().toISOString()],
      remarks: ['Normal'],
      weqayaScreening: [true],
      sequenceNo: [0]
    });
  }

  addObservation() {
    this.observations.push(this.createObservation());
  }

  removeObservation(index: number) {
    this.observations.removeAt(index);
  }

  onTimeChange(time: { hour: number, minute: number }) {
    this.currentTime = time;
  }

  onDateSelect(date: NgbDateStruct) {
    this.completionForm.patchValue({
      performDate: date
    });
  }

  openDatePicker(datePicker: any) {
    datePicker.toggle();
  }

  private formatDateForSubmission(date: NgbDateStruct, time: { hour: number, minute: number }): string {
    const jsDate = new Date(date.year, date.month - 1, date.day, time.hour, time.minute);
    return jsDate.toISOString();
  }

  onComplete() {
    const formValue = this.completionForm.getRawValue();

    // Format the date and time for submission
    const performDate = this.formatDateForSubmission(formValue.performDate, this.currentTime);

    const payload = {
      ...formValue,
      performDate: performDate,
      entryDate: new Date().toISOString(),
      // UserId will eventually come from auth; for now 0 / backend default
      userId: 0,
      principalResultInterpreter: formValue.principalResultInterpreter || 0,
      reviewedBy: formValue.reviewedBy || '',
      reviewedDate: formValue.reviewedDate ? new Date(formValue.reviewedDate).toISOString() : null,
      performAtLabId: formValue.performAtLabId || 0,
      observations: formValue.observations.map((obs: any, index: number) => ({
        ...obs,
        sequenceNo: index + 1
      }))
    };

    const tests = this.tests || [];
    if (!Array.isArray(tests) || tests.length === 0) {
      console.warn('No tests to complete');
      return;
    }

    const apiCalls = tests.map((test: any, idx: number) => {
      // Prefer orderSetDetailId; fallback to parent orderSetId so API still gets called
      const detailId = test?.orderSetDetailId ?? this.order?.orderSetId;
      if (!detailId) {
        console.warn('Missing orderSetDetailId and orderSetId for test', test);
        return of(null);
      }

      // Per-test payload copy; adjust accession/observations if needed later
      const testPayload = { ...payload };
      return this.ivfApi.completeLabOrderDetail(detailId, testPayload);
    }).filter(Boolean) as any[];

    if (apiCalls.length === 0) {
      console.warn('No valid tests found to complete');
      return;
    }

    forkJoin(apiCalls).subscribe({
      next: (res) => {
        console.log('Order completion success', res);
      },
      error: (err) => {
        console.error('Order completion failed', err);
      }
    });
  }
}
