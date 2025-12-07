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
    this.completionForm.patchValue({
      performDate: this.currentDate,
      entryDate: this.currentDate
    });
    this.addObservation();
    this.loadTestsIfNeeded();
    this.loadExistingIfNeeded();
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
    const date = new Date(dateString);
    return date.toISOString();
  }

  onComplete() {
    console.log('noteText before submit:', this.noteText);

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
          this.completed.emit({ success: true });
        },
        error: (err) => {
          console.error('Failed to complete lab order with attachments', err);
        }
      });
  }
}
