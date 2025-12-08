import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDateStruct, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import Swal from 'sweetalert2';
import { GenericDocumentUploadComponent } from '@/app/shared/generic-document-upload/generic-document-upload.component';
import { QuillModule } from 'ngx-quill';
import { SharedService } from '@/app/shared/Services/Common/shared-service';

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
    /* Modal scroll container */
    .modal-scroll-container {
      max-height: 85vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .modal-scroll-container::-webkit-scrollbar {
      width: 8px;
    }
    .modal-scroll-container::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    .modal-scroll-container::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    .modal-scroll-container::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    .form-label {
      font-weight: 500;
      color: var(--bs-body-color);
    }
    .form-label.small {
      font-size: 0.875rem;
      font-weight: 500;
    }
    h6.fw-semibold {
      font-size: 1rem;
      font-weight: 600;
      color: var(--bs-body-color);
    }
    .card-body {
      padding: 1.25rem;
    }
    .table th {
      background-color: var(--bs-light);
      font-weight: 600;
      font-size: 0.875rem;
    }
    .btn-add-observation {
      margin-top: 0.5rem;
    }
    /* Custom tab styling */
    .custom-tabs .nav-link {
      color: #6c757d;
      border: 1px solid transparent;
      border-bottom: 2px solid transparent;
      background: transparent;
      padding: 0.5rem 1rem;
      font-weight: 500;
    }
    .custom-tabs .nav-link:hover {
      border-color: transparent;
      color: #20c997;
    }
    .custom-tabs .nav-link.active {
      color: #20c997;
      background-color: transparent;
      border-color: transparent transparent #20c997 transparent;
      border-bottom-width: 3px;
    }
    .tab-content {
      min-height: 200px;
    }
    /* Custom button styling */
    .btn-complete {
      background-color: #20c997;
      border-color: #20c997;
      color: white;
    }
    .btn-complete:hover {
      background-color: #1ab386;
      border-color: #1ab386;
      color: white;
    }
    .btn-complete:disabled {
      background-color: #20c997;
      border-color: #20c997;
      opacity: 0.65;
    }
    .card-footer {
      border-top: 1px solid #dee2e6;
    }
    /* Close button styling */
    .btn-close {
      padding: 0.5rem;
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    .btn-close:hover {
      opacity: 1;
    }
    .card-header {
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: white;
    }
    /* Skeleton loader styling */
    .placeholder {
      background-color: #e9ecef;
      border-radius: 0.25rem;
      display: inline-block;
    }
    .placeholder-glow .placeholder {
      animation: placeholder-glow 2s ease-in-out infinite;
    }
    @keyframes placeholder-glow {
      50% {
        opacity: 0.5;
      }
    }
  `]
})
export class IvfOrderCompletionComponent implements OnInit, OnChanges {
  @Input() order: any;
  @Input() tests: Array<any> = [];
  @Input() showObservations: boolean = false;
  @Input() orderSetId: number | string | null = null;
  @Input() labResultId: number | string | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() completed = new EventEmitter<any>();

  @ViewChild(GenericDocumentUploadComponent) uploader?: GenericDocumentUploadComponent;

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
  
  // Loading states
  isLoading: boolean = true;
  isSaving: boolean = false;

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
    private ivfApi: IVFApiService,
    private shared: SharedService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    // Simulate loading
    setTimeout(() => {
      this.completionForm.patchValue({
        performDate: this.currentDate,
        entryDate: this.currentDate
      });
      this.addObservation();
      this.loadTestsIfNeeded();
      this.loadExistingIfNeeded();
      this.isLoading = false;
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tests']) {
      const current = changes['tests'].currentValue ?? [];
      this.tests = Array.isArray(current) ? [...current] : [];
    }

    if (changes['orderSetId'] && !changes['orderSetId'].firstChange) {
      this.loadTestsIfNeeded();
    }

    if (changes['labResultId'] && !changes['labResultId'].firstChange) {
      this.loadExistingIfNeeded();
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

  private loadExistingIfNeeded() {
    const rawId = this.labResultId;
    const idNum = Number(rawId);
    if (!Number.isFinite(idNum) || idNum <= 0) {
      return;
    }

    this.ivfApi.getCollectionDetailsWithResults(idNum).subscribe({
      next: (res: any) => {
        const rows = Array.isArray(res) ? res : (Array.isArray(res?.details) ? res.details : (res ? [res] : []));
        if (!rows.length) {
          return;
        }

        const first = rows[0];

        // Map tests from response (if provided)
        try {
          this.tests = rows.map((d: any) => ({
            id: d.labTestId ?? d.labTestID ?? d.testId,
            orderSetDetailId: d.orderSetDetailId ?? d.orderSetDetailID ?? d.labOrderSetDetailId,
            cpt: d.cptCode ?? d.cpt,
            name: d.testName ?? d.name ?? d.testName ?? '',
            sampleTypeName: d.material ?? d.materialName ?? d.sampleTypeName ?? d.sampleType,
            status: d.status
          }));
        } catch {
          // keep existing tests if mapping fails
        }

        // Patch header fields where available
        const patch: any = {};
        if (first.action) patch.action = first.action;
        if (first.reviewedBy) patch.reviewedBy = first.reviewedBy;
        if (first.reviewedDate) patch.reviewedDate = new Date(first.reviewedDate).toISOString().slice(0, 10);
        if (first.performAtLabId != null) patch.performAtLabId = first.performAtLabId;
        if (first.isDefault != null) patch.isDefault = first.isDefault;
        if (first.principalResultInterpreter != null) patch.principalResultInterpreter = first.principalResultInterpreter;

        if (Object.keys(patch).length) {
          this.completionForm.patchValue(patch);
        }

        // Existing rich-text note
        this.noteText = first.note || first.Note || this.noteText;

        // Existing attachments -> bind into GenericDocumentUploadComponent
        const rawAttachments = first.attachments || first.Attachments;
        if (this.uploader && Array.isArray(rawAttachments) && rawAttachments.length) {
          const ids = rawAttachments
            .map((a: any) => Number(a.fileId ?? a.FileId))
            .filter((id: number) => Number.isFinite(id) && id > 0);

          if (ids.length) {
            // Prefer backend GetAttachmentFiles API to get accurate file metadata + base64 content
            this.shared.getAttachmentFiles(ids).subscribe({
              next: (resp: any) => {
                let rows: any[] = [];
                if (Array.isArray(resp)) {
                  rows = resp;
                } else if (Array.isArray(resp?.data)) {
                  rows = resp.data;
                } else if (resp && typeof resp === 'object') {
                  const firstArray = Object.values(resp).find((v: any) => Array.isArray(v));
                  if (Array.isArray(firstArray)) {
                    rows = firstArray as any[];
                  }
                }
                const docsFromApi = rows
                  .map((r: any, idx: number) => {
                    const fileId = Number(r.fileId ?? r.FileId);
                    if (!Number.isFinite(fileId) || fileId <= 0) return null;

                    const file = r.file || r.File || {};
                    const nameFromApi =
                      r.fileName ?? r.FileName ??
                      file.fileName ?? file.FileName;
                    const lenFromApi = Number(
                      r.length ?? r.Length ??
                      file.length ?? file.Length
                    );
                    const contentType =
                      r.contentType ?? r.ContentType ??
                      file.contentType ?? file.ContentType;
                    const base64 = r.content ?? r.Content;

                    const fallbackPath = (rawAttachments.find((a: any) => Number(a.fileId ?? a.FileId) === fileId)?.filePath
                      ?? rawAttachments.find((a: any) => Number(a.fileId ?? a.FileId) === fileId)?.FilePath
                      ?? '');
                    const fileName = String(nameFromApi || this.deriveAttachmentFileName(fallbackPath, idx + 1));
                    const fileSize = Number.isFinite(lenFromApi) && lenFromApi > 0 ? lenFromApi : 0;

                    const isImage = typeof contentType === 'string' && contentType.startsWith('image/');
                    const previewUrl = isImage && typeof base64 === 'string' && base64.length
                      ? `data:${contentType};base64,${base64}`
                      : null;

                    return { fileId, fileName, fileSize, previewUrl };
                  })
                  .filter((x: any) => !!x);

                if (docsFromApi.length) {
                  this.uploader!.setExisting(docsFromApi as Array<{ fileId: number; fileName: string; fileSize: number; previewUrl?: string | null }>);
                  return;
                }

                // Fallback to local mapping if API returned no usable rows
                const fallbackDocs = rawAttachments
                  .map((a: any, idx: number) => {
                    const fileId = Number(a.fileId ?? a.FileId);
                    if (!Number.isFinite(fileId) || fileId <= 0) return null;
                    const filePath = a.filePath ?? a.FilePath ?? '';
                    const fileName = this.deriveAttachmentFileName(filePath, idx + 1);
                    const fileSize = Number(a.fileSize ?? a.FileSize);
                    return {
                      fileId,
                      fileName,
                      fileSize: Number.isFinite(fileSize) && fileSize > 0 ? fileSize : 0,
                      previewUrl: null
                    };
                  })
                  .filter((x: any) => !!x);

                if (fallbackDocs.length) {
                  this.uploader!.setExisting(fallbackDocs as Array<{ fileId: number; fileName: string; fileSize: number; previewUrl?: string | null }>);
                }
              },
              error: () => {
                // On error, fall back to basic mapping from Attachments DTO
                const fallbackDocs = rawAttachments
                  .map((a: any, idx: number) => {
                    const fileId = Number(a.fileId ?? a.FileId);
                    if (!Number.isFinite(fileId) || fileId <= 0) return null;
                    const filePath = a.filePath ?? a.FilePath ?? '';
                    const fileName = this.deriveAttachmentFileName(filePath, idx + 1);
                    const fileSize = Number(a.fileSize ?? a.FileSize);
                    return {
                      fileId,
                      fileName,
                      fileSize: Number.isFinite(fileSize) && fileSize > 0 ? fileSize : 0,
                      previewUrl: null
                    };
                  })
                  .filter((x: any) => !!x);

                if (fallbackDocs.length) {
                  this.uploader!.setExisting(fallbackDocs as Array<{ fileId: number; fileName: string; fileSize: number; previewUrl?: string | null }>);
                }
              }
            });
          }
        }
      },
      error: () => {
        // ignore and keep create-mode defaults
      }
    });
  }

  private deriveAttachmentFileName(filePath: string, index: number): string {
    const trimmed = String(filePath || '').trim();
    if (trimmed) {
      const parts = trimmed.split(/[\\/]/);
      const last = parts[parts.length - 1];
      if (last) {
        return last;
      }
    }
    return `Attachment-${index}.pdf`;
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
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  onComplete() {
    if (!this.completionForm.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    // Directly save without confirmation
    this.saveLabOrder();
  }

  private saveLabOrder() {
    this.isSaving = true;

    const formValue = this.completionForm.value;
    const performDate = this.convertDateToISO(formValue.performDate);

    const observationsByTest = new Map<string, any[]>();

    const obsArray = this.completionForm.get('observations') as FormArray;
    obsArray.controls.forEach((ctrl: any) => {
      const obs = ctrl.value;
      const selectedTestId = String(obs.selectedTest ?? '').trim();
      if (!selectedTestId) {
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

    const testObservationPairs: Array<{ testId: string; observations: any[] }> = [];
    if (Array.isArray(this.tests) && this.tests.length > 0) {
      this.tests.forEach((t: any) => {
        const rawId = t.orderSetDetailId ?? t.id;
        const key = String(rawId ?? '').trim();
        if (!key) {
          return;
        }
        const obs = observationsByTest.get(key) || [];
        testObservationPairs.push({ testId: key, observations: obs });
      });
    } else {
      observationsByTest.forEach((observations, testId) => {
        testObservationPairs.push({ testId: String(testId), observations });
      });
    }

    if (!testObservationPairs.length) {
      this.isSaving = false;
      return;
    }
    const newFiles = this.uploader?.getFiles() || [];
    const existingFileIds = this.uploader?.getExistingIds() || [];

    const upload$ = newFiles.length > 0
      ? this.shared.uploadDocumentsWithModule('LABORDER', newFiles)
      : of([]);

    upload$
      .pipe(
        switchMap((uploadRes: any) => {
          const uploadedIds: number[] = Array.isArray(uploadRes)
            ? uploadRes
              .map((x: any) => Number(x?.fileId ?? x?.id))
              .filter((x: any) => Number.isFinite(x) && x > 0)
            : [];

          const allFileIds = [...existingFileIds, ...uploadedIds];
          const attachments = allFileIds.map(id => ({ fileId: id }));

          const apiCalls: Observable<any>[] = [];

          testObservationPairs.forEach(pair => {
            const observations = pair.observations || [];
            const testId = pair.testId;
            const payload = {
              performDate: performDate,
              entryDate: new Date().toISOString(),
              userId: 0,
              accessionNumber: null,
              isDefault: formValue.isDefault ?? true,
              principalResultInterpreter: formValue.principalResultInterpreter || 0,
              action: formValue.action || 'Final',
              reviewedBy: formValue.reviewedBy || 'System User',
              reviewedDate: formValue.reviewedDate ? new Date(formValue.reviewedDate).toISOString() : null,
              performAtLabId: formValue.performAtLabId || 0,
              Note: this.noteText || null,
              observations: observations,
              attachments: attachments
            };

            apiCalls.push(this.ivfApi.completeLabOrder(testId, payload));
          });

          return apiCalls.length ? forkJoin(apiCalls) : of([]);
        })
      )
      .subscribe({
        next: () => {
          this.isSaving = false;
          Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'Lab order completed successfully',
            timer: 2000,
            showConfirmButton: false
          });
          this.completed.emit({ success: true });
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Failed to complete lab order with attachments', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to save lab order. Please try again.',
            timer: 3000,
            showConfirmButton: false
          });
        }
      });
  }
}
