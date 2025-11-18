import { Component, EventEmitter, Input, Output, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker, NgbDatepickerModule, NgbTimepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
export class OrderCompletionComponent implements OnInit {
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
    private modalService: NgbModal
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

  private initializeForm() {
    this.completionForm = this.fb.group({
      performDate: [this.currentDate, Validators.required],
      entryDate: [this.currentDate, Validators.required],
      accessionNumber: ['', Validators.required],
      isDefault: [true],
      principalResultInterpreter: [null],
      action: ['', Validators.required],
      reviewedBy: [''],
      reviewedDate: [null],
      performAtLabId: [null],
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
      valueType: ['', Validators.required],
      observationIdentifierFullName: ['', Validators.required],
      observationIdentifierShortName: ['', Validators.required],
      observationValue: ['', Validators.required],
      units: [''],
      referenceRangeMin: [''],
      referenceRangeMax: [''],
      abnormalFlag: [''],
      resultStatus: [''],
      observationDateTime: [new Date().toISOString()],
      analysisDateTime: [new Date().toISOString()],
      remarks: [''],
      weqayaScreening: [false],
      sequenceNo: [1]
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
    if (this.completionForm.invalid) {
      this.completionForm.markAllAsTouched();
      return;
    }

    const formValue = this.completionForm.getRawValue();
    
    // Format the date and time for submission
    const performDate = this.formatDateForSubmission(formValue.performDate, this.currentTime);
    
    const payload = {
      ...formValue,
      performDate: performDate,
      entryDate: new Date().toISOString(),
      userId: 0, // Will be set by the parent
      principalResultInterpreter: formValue.principalResultInterpreter || 0,
      reviewedBy: formValue.reviewedBy || '',
      reviewedDate: formValue.reviewedDate ? new Date(formValue.reviewedDate).toISOString() : null,
      performAtLabId: formValue.performAtLabId || 0,
      observations: formValue.observations.map((obs: any, index: number) => ({
        ...obs,
        sequenceNo: index + 1
      }))
    };

    this.completed.emit({
      order: this.order,
      completedTests: this.tests,
      completionData: payload
    });
  }
}
