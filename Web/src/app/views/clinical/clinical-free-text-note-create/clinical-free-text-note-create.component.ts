import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { DeepgramService } from '@/app/shared/Services/deepgram.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';

import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { QuestionItemComponent } from '../question-item/question-item.component';
import { QuestionViewComponent } from '../question-view/question-view.component';
import Swal from 'sweetalert2';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { LoaderService } from '@core/services/loader.service';
import { QuillModule } from 'ngx-quill';

@Component({
    standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    FilledOnValueDirective,
    QuestionItemComponent,
    QuestionViewComponent,
    QuillModule
],
  selector: 'app-clinical-free-text-note-create',
  templateUrl: './clinical-free-text-note-create.component.html',
  styleUrls: ['./clinical-free-text-note-create.component.scss']
})
export class ClinicalFreeTextNoteCreateComponent implements OnInit {
  clinicalForm: FormGroup;
  data: any = "";
  clinicalNotesList: any = {};
  fontSize: number = 16;
  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  selectedFont: string = 'Arial';

  noteTitle: string = '';
  createdBy: string = '';
  signedBy: boolean = false;
  description: string = '';
  updatedBy: string = '';
  mrNo: string = '';
  appointmentID: number = 0;
  visible: boolean = false;
  SearchPatientData: any
  selectedProviders: any = 0;
  selectedNotes: any = 0;
  db: any;
  private patientDataSubscription: Subscription | undefined;

  dbReady: Promise<void> = Promise.resolve();
  providers: any[] = [];
  clinicalNotes: any[] = [];

  dataquestion: any;
  viewquestion: boolean = false;
  viewNoteResponse: boolean = false;
  nodeData: any;

  cacheItems: string[] = ['Provider'];

  private subscriptions: Subscription[] = [];

  private queryParamProvider: any = null;
  private queryParamTemplate: any = null;
  hideTemplateDropdown: boolean = false;

  isRecording: boolean = false;
  transcriptionText: string = '';
  private transcriptionSubscription: Subscription | null = null;

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

  constructor(
    private fb: FormBuilder,
    private clinicalApiService: ClinicalApiService,
    private deepgramService: DeepgramService,
    private loader: LoaderService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private PatientData: PatientBannerService
  ) {
    this.clinicalForm = this.fb.group({
      provider: [null, Validators.required],
      description: [''],
      editorContent: ['']
    });
  }

  SelectedVisit: any;
  ngOnInit(): void {
    this.patientDataSubscription = this.PatientData.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) =>
          prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
        )
      )
      .subscribe((data: any) => {
        console.log(' Subscription triggered with MRNO:', data?.table2?.[0]?.mrNo);
        this.SearchPatientData = data;
        this.mrNo = data?.table2?.[0]?.mrNo || '';
      });

    this.PatientData.selectedVisit$.subscribe((data: any) => {
      this.SelectedVisit = data;
      this.appointmentID = data?.appointmentId || 0;
      console.log('Selected Visit medical-list', this.SelectedVisit);
    });

    // Read query parameters first
    this.route.queryParams.subscribe(params => {
      this.queryParamProvider = params['provider'] ? Number(params['provider']) : null;
      this.queryParamTemplate = params['template'] ? Number(params['template']) : null;

      console.log('Query params - Provider:', this.queryParamProvider, 'Template:', this.queryParamTemplate);

      // If template is provided, hide the template dropdown
      this.hideTemplateDropdown = !!this.queryParamTemplate;

      // Set provider if provided
      if (this.queryParamProvider) {
        this.clinicalForm.patchValue({ provider: this.queryParamProvider });
      }
    });

    this.FillCache();

    // subscribe to provider selection changes (value is the selected code)
    const providerCtrl = this.clinicalForm.get('provider');
    if (providerCtrl) {
      const sub = providerCtrl.valueChanges.subscribe((val: any) => {
        const code = Number(val) || 0;
        this.selectedProviders = code;

        // Only load notes if no template was pre-selected
        if (!this.queryParamTemplate) {
          this.GetNotesEmployeeId(code);
        }
      });
      this.subscriptions.push(sub);
    }

    // subscribe to note selection changes
    const noteCtrl: any = this.clinicalForm.get('note');
    if (noteCtrl != null && noteCtrl != undefined) {
      const sub2 = noteCtrl.valueChanges.subscribe((val: any) => {
        const nid = Number(val) || 0;
        this.selectedNotes = nid;
        this.GetNotesTemplate(nid);
      });
      this.subscriptions.push(sub2);
    }

    // Subscribe to transcription updates
    this.transcriptionSubscription = this.deepgramService.getTranscript$().subscribe(
      (transcript: string) => {
        this.appendTranscriptionToEditor(transcript);
      }
    );
  }

  showDialog() { this.visible = true; }

  loadData() {
    this.clinicalApiService.getDataquestion().subscribe(data => {
      this.dataquestion = data;
      console.log(" json Data Question", this.dataquestion);
    });
  }


  FillCache() {
    // ...existing code...
    this.clinicalApiService
      .getCacheItem({ entities: this.cacheItems })
      .then((response: any) => {
        if (response && response.cache) {
          this.FillDropDown(response);
        }
      })
      .catch((error: any) =>
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.message || 'Failed to load cache' })
      Swal.fire('Error', error?.message || 'Failed to load cache', 'error'
      ));
  }

  FillDropDown(response: any) {
    const jParse = JSON.parse(JSON.stringify(response)).cache;
    let provider = JSON.parse(jParse).Provider;
    if (provider) {
      provider = provider.map((item: any) => ({ name: item.FullName, code: item.EmployeeId }));
      this.providers = provider;

      // After providers are loaded, trigger template load if pre-selected
      if (this.queryParamProvider && this.queryParamTemplate) {
        this.selectedProviders = this.queryParamProvider;
        this.selectedNotes = this.queryParamTemplate;
        this.clinicalForm.patchValue({ note: this.queryParamTemplate });
        this.GetNotesTemplate(this.queryParamTemplate);
      }
    }
  }

  GetNotesEmployeeId(providerCode: any) {
    if (providerCode == null || providerCode == undefined) providerCode = 0;
    this.selectedProviders = Number(providerCode) || 0;
    if (this.selectedProviders === 250) providerCode = 197;

  }

  // GetNotesTemplate unchanged except it now receives numeric noteId
  GetNotesTemplate(noteId: any) {
    if (noteId == null || noteId == undefined) noteId = 0;

    this.selectedNotes = Number(noteId) || 0;
    this.dataquestion = [];
    this.viewquestion = false;
    this.nodeData = []
    if(noteId != null && noteId != undefined && noteId != 0){
    this.loader.show();
    this.clinicalApiService.GetNotesTemplate(noteId).then((res: any) => {
      this.dataquestion = res;
      this.viewquestion = true;
      this.nodeData = res;
          this.loader.hide();
    }).catch(() =>
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading template' })
    Swal.fire('Error', 'Error loading template', 'error')
    ).finally(() => this.loader.hide());
    }

  }

  // --- offline storage (IndexedDB) --------------------------------------
  initIndexedDB() {
    // ...existing code...
    this.dbReady = new Promise((resolve, reject) => {
      const request = indexedDB.open('ClinicalNotesDB', 2);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };
      request.onerror = () => {
        console.error('IndexedDB initialization failed');
        reject(request.error);
      };
    });
  }

  async saveNoteOffline(note: any) {
    // ...existing code...
    this.initIndexedDB();
    await this.dbReady;
    if (!this.db) { console.error('DB not initialized'); return; }
    const tx = this.db.transaction(["notes"], 'readwrite');
    const store = tx.objectStore('notes');
    const req = store.add(note);
    req.onsuccess = () => console.log('Note saved offline');
    req.onerror = (event: any) => console.error('Error saving note offline:', event);
  }

  // --- submit note (no voice) -------------------------------------------
  submitVoice() {
    if (this.clinicalForm.invalid) {
      return;
    }

    const htmlContent = this.clinicalForm.get('editorContent')?.value || '';
    const textContent = this.stripHtml(htmlContent);
    const providerId = this.clinicalForm.get('provider')?.value;
    const description = this.clinicalForm.get('description')?.value;

    if (this.appointmentID == null || this.appointmentID == undefined || this.appointmentID == 0
        && this.mrNo == null || this.mrNo == undefined || this.mrNo == ''
    ) {
      Swal.fire('Error', 'Appointment ID and MRNo are required to submit the note.', 'error');
      return;
    }

    const current_User = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
    const createdByUserId = current_User.userId || 0;

    const nowIso = new Date().toISOString();

    const emrPayload = {
      // use appointment ID as visit account number for EMR note
      visitAcNo: this.appointmentID || 0,
      notesTitle: this.dataquestion?.node?.noteTitle || 'Clinical Free Text Note',
      noteText: textContent,
      noteHtmltext: htmlContent,
      description: description,
      createdBy: createdByUserId,
      createdOn: nowIso,
      updatedBy: createdByUserId,
      updatedDate: nowIso,
      signed: false,
      isEdit: false,
      review: false,
      noteType: 'FreeText',
      active: true,
      // provider who will sign the note
      signedBy: providerId || 0,
      signedDate: '',
      cosignedBy: 0,
      cosignedDate: '',
      mrcosignedBy: 0,
      mrcosignedDate: '',
      noteCosignProvId: 0,
      reviewedBy: 0,
      reviewedDate: '',
      noteStatus: 'Draft',
      mrno: this.mrNo,
      documents: '',
      caseId: '00000000-0000-0000-0000-000000000000',
      isNursingNote: false,
      receiverRoleId: 0,
      receiverEmpId: 0,
      referredSiteId: '00000000-0000-0000-0000-000000000000',
      labOrderSetDetailId: 0,
      oldMrno: '',
      isMbrcompleted: false,
      oldNoteId: 0,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    console.log('SaveEMRNote payload:', emrPayload);

    this.loader.show();
    this.clinicalApiService.SaveEMRNote(emrPayload)
      .then(() => {
        Swal.fire('Success', 'Note saved successfully.', 'success');
        this.router.navigate(['/clinical/clinical-notes']);
      })
      .catch((error: any) => {
        console.error('Error saving EMR note:', error);
        Swal.fire('Error', 'Failed to save note.', 'error');
      })
      .finally(() => {
        this.loader.hide();
      });
  }

  stripHtml(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // --- additional submit used elsewhere in old code ---------------------
  submit() {
    if (!this.mrNo) {
      Swal.fire('Error', 'MRNo is not Found please load patient', 'error');
      return;
    }

    this.clinicalNotesList.NoteTitle = this.noteTitle;
    this.clinicalNotesList.CreatedBy = this.createdBy;
    this.clinicalNotesList.SignedBy = this.signedBy;
    this.clinicalNotesList.Description = this.description;
    this.clinicalNotesList.UpdatedBy = this.updatedBy;
    this.clinicalNotesList.mrNo = this.mrNo;
    this.clinicalApiService.InsertSpeech(this.clinicalNotesList).then(() => {
      Swal.fire('Success', 'Appointment has been Created', 'success');
      this.router.navigate(['/clinical/clinical-notes']);
    });
  }

  onProviderchange() {

  }

  cancel() {
    this.router.navigate(['/patient-summary'], { queryParams: { id: 2 } });

  }

  resetForm(){
    this.clinicalForm.reset();
  }
  toggleVoiceRecording(): void {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  async startRecording(): Promise<void> {
    try {
      this.loader.show();
      await this.deepgramService.startTranscription();
      this.isRecording = true;
      Swal.fire({
        icon: 'info',
        title: 'Recording Started',
        text: 'Speak into your microphone. Your speech will be transcribed in real-time.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      Swal.fire('Error', 'Failed to start voice recording. Please check microphone permissions.', 'error');
      this.isRecording = false;
    } finally {
      this.loader.hide();
    }
  }

  stopRecording(): void {
    this.deepgramService.stopTranscription();
    this.isRecording = false;
    Swal.fire({
      icon: 'success',
      title: 'Recording Stopped',
      text: 'Transcription has been added to your note.',
      timer: 2000,
      showConfirmButton: false
    });
  }

  private appendTranscriptionToEditor(transcript: string): void {
    const currentContent = this.clinicalForm.get('editorContent')?.value || '';
    const newContent = currentContent + (currentContent ? ' ' : '') + transcript;
    this.clinicalForm.patchValue({ editorContent: newContent });
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.patientDataSubscription) {
      this.patientDataSubscription.unsubscribe();
    }
    if (this.transcriptionSubscription) {
      this.transcriptionSubscription.unsubscribe();
    }
    if (this.isRecording) {
      this.deepgramService.stopTranscription();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

/* keep Question interface if needed by template/components */
export interface Question {
  quest_Id: number;
  quest_Title: string;
  type: string;
  parent_Id: number;
  answer: string;
  children: Question[];
}
