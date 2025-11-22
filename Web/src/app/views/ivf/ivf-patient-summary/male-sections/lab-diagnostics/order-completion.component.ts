import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker, NgbDatepickerModule, NgbTimepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Observable } from 'rxjs';
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
      console.log('Tests updated:', this.tests);
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

  isTestAlreadyUsed(testId: string, currentObservationIndex: number): boolean {
    const observations = this.observations.value;
    return observations.some((obs: any, index: number) => 
      index !== currentObservationIndex && obs.selectedTest === testId
    );
  }

  createObservation(): FormGroup {
    const today = new Date();
    const dateString = today.getFullYear() + '-' + 
                      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(today.getDate()).padStart(2, '0');
    
    return this.fb.group({
      selectedTest: [''],
      valueType: ['NM'],
      observationIdentifierFullName: ['Result'],
      observationIdentifierShortName: ['RES'],
      observationValue: ['0'],
      units: [''],
      referenceRangeMin: [''],
      referenceRangeMax: [''],
      abnormalFlag: ['N'],
      resultStatus: ['F'],
      observationDateTime: [dateString],
      analysisDateTime: [dateString],
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

  private formatDateForSubmission(date: NgbDateStruct): string {
    const jsDate = new Date(date.year, date.month - 1, date.day, 0, 0, 0);
    return jsDate.toISOString();
  }

  private convertDateToISO(dateString: string): string {
    if (!dateString) return new Date().toISOString();
    const date = new Date(dateString);
    return date.toISOString();
  }

  onComplete() {
    const formValue = this.completionForm.getRawValue();

    // Format the date for submission
    const performDate = this.formatDateForSubmission(formValue.performDate);

    // Group observations by selected test
    const observationsByTest = new Map<string, any[]>();
    
    formValue.observations.forEach((obs: any, index: number) => {
      const selectedTestId = obs.selectedTest;
      if (!selectedTestId || selectedTestId === '') {
        console.warn('Observation has no test selected, skipping', obs);
        return;
      }
      
      if (!observationsByTest.has(selectedTestId)) {
        observationsByTest.set(selectedTestId, []);
      }
      
      // Remove selectedTest field and convert dates to ISO format
      const { selectedTest, ...observationData } = obs;
      observationsByTest.get(selectedTestId)!.push({
        ...observationData,
        observationDateTime: this.convertDateToISO(observationData.observationDateTime),
        analysisDateTime: this.convertDateToISO(observationData.analysisDateTime),
        sequenceNo: observationsByTest.get(selectedTestId)!.length + 1
      });
    });

    if (observationsByTest.size === 0) {
      console.warn('No observations with selected tests found');
      return;
    }

    // Create API calls only for tests that have observations
    const apiCalls: Observable<any>[] = [];
    
    observationsByTest.forEach((observations, testId) => {
      const payload = {
        performDate: performDate,
        entryDate: new Date().toISOString(),
        userId: 0,
        isDefault: formValue.isDefault ?? true,
        principalResultInterpreter: formValue.principalResultInterpreter || 0,
        action: formValue.action || 'Final',
        reviewedBy: formValue.reviewedBy || 'System User',
        reviewedDate: formValue.reviewedDate ? new Date(formValue.reviewedDate).toISOString() : null,
        performAtLabId: formValue.performAtLabId || 0,
        observations: observations
      };
      
      apiCalls.push(this.ivfApi.addLabOrderObservations(testId, payload));
    });

    if (apiCalls.length === 0) {
      console.warn('No valid API calls to make');
      return;
    }

    forkJoin(apiCalls).subscribe({
      next: (res) => {
        console.log('Observations added successfully', res);
        this.completed.emit({ success: true });
      },
      error: (err) => {
        console.error('Failed to add observations', err);
      }
    });
  }
}
