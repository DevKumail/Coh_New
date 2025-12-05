import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDateStruct, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable } from 'rxjs';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import Swal from 'sweetalert2';
import { GenericDocumentUploadComponent } from '@/app/shared/generic-document-upload/generic-document-upload.component';
import { QuillModule } from 'ngx-quill';

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
  selector: 'app-ivf-order-completion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    GenericDocumentUploadComponent,
    QuillModule
  ],
  templateUrl: './ivf-order-completion.component.html',
  styles: [`
    .form-label {
      font-weight: 500;
      margin-bottom: 0.25rem;
      color: var(--bs-body-color);
    }
    .form-section {
      background-color: var(--bs-secondary-bg);
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
      color: var(--bs-body-color);
    }
    .observation-row {
      background-color: var(--bs-secondary-bg);
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid var(--bs-border-color);
      color: var(--bs-body-color);
    }
    .btn-add-observation {
      margin-top: 1rem;
    }
  `]
})
export class IvfOrderCompletionComponent implements OnInit, OnChanges {
  @Input() order: any;
  @Input() tests: Array<any> = [];
  @Input() showObservations: boolean = false;
  @Input() orderSetId: number | string | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() completed = new EventEmitter<any>();

  completionForm!: FormGroup;
  currentDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };
  currentTime = { hour: new Date().getHours(), minute: new Date().getMinutes() };

  // Simple tab state for Attachments / Notes section
  activeTab: 'attachments' | 'notes' = 'attachments';
  noteText: string = '';

  quillModules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean']
    ]
  };

  isDisabled = (date: NgbDateStruct, current?: { year: number; month: number }) => {
    if (!date) return false;
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  minDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };

  constructor(
    private fb: FormBuilder,
    private ivfApi: IVFApiService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.completionForm.patchValue({
      performDate: this.currentDate,
      entryDate: this.currentDate
    });
    this.addObservation();
    this.loadTestsIfNeeded();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tests']) {
      const current = changes['tests'].currentValue ?? [];
      this.tests = Array.isArray(current) ? [...current] : [];
    }

    if (changes['orderSetId'] && !changes['orderSetId'].firstChange) {
      this.loadTestsIfNeeded();
    }
  }

  private loadTestsIfNeeded() {
    const rawId = this.orderSetId ?? (this.order && this.order.orderSetId);
    const idNum = Number(rawId);
    if (!Number.isFinite(idNum) || idNum <= 0) {
      return;
    }

    if (Array.isArray(this.tests) && this.tests.length > 0) {
      return;
    }

    this.ivfApi.getOrderCollectionDetails(idNum).subscribe({
      next: (res: any) => {
        const details = Array.isArray(res) ? res : (Array.isArray(res?.details) ? res.details : []);
        this.tests = details.map((d: any) => ({
          id: d.labTestId ?? d.testId,
          orderSetDetailId: d.orderSetDetailId ?? d.id ?? d.labOrderSetDetailId,
          cpt: d.cptCode ?? d.cpt,
          name: d.testName ?? d.name ?? d.cptCode,
          sampleTypeName: d.materialName ?? d.material ?? d.sampleTypeName ?? d.sampleType,
          status: d.status
        }));
      },
      error: () => {
        // keep tests as-is on error
      }
    });
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

  onTestSelectionChange(index: number, selectedTestId: string) {
    if (selectedTestId && this.isTestAlreadyUsed(selectedTestId, index)) {
      Swal.fire({
        icon: 'warning',
        title: 'Test Already Selected',
        text: 'This test has already been selected in another observation. Please select a different test.',
        showConfirmButton: true,
        buttonsStyling: false,
        customClass: { confirmButton: 'btn btn-warning' }
      });
      const observationControl = this.observations.at(index) as FormGroup;
      observationControl.patchValue({ selectedTest: '' });
    }
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
    const performDate = this.formatDateForSubmission(formValue.performDate);

    const observationsByTest = new Map<string, any[]>();

    formValue.observations.forEach((obs: any) => {
      const selectedTestId = obs.selectedTest;
      if (!selectedTestId || selectedTestId === '') {
        return;
      }

      if (!observationsByTest.has(selectedTestId)) {
        observationsByTest.set(selectedTestId, []);
      }

      const { selectedTest, ...observationData } = obs;
      observationsByTest.get(selectedTestId)!.push({
        ...observationData,
        observationDateTime: this.convertDateToISO(observationData.observationDateTime),
        analysisDateTime: this.convertDateToISO(observationData.analysisDateTime),
        sequenceNo: observationsByTest.get(selectedTestId)!.length + 1
      });
    });

    if (observationsByTest.size === 0) {
      return;
    }

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
      return;
    }

    forkJoin(apiCalls).subscribe({
      next: () => {
        this.completed.emit({ success: true });
      },
      error: (err) => {
        console.error('Failed to add observations', err);
      }
    });
  }
}
