import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { QuestionViewComponent } from '../question-view/question-view.component';
import Swal from 'sweetalert2';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { LoaderService } from '@core/services/loader.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';

@Component({
    standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    FilledOnValueDirective,
    QuestionViewComponent
  ],
  selector: 'app-clinical-note-create',
  templateUrl: './clinical-note-create.component.html',
  styleUrls: ['./clinical-note-create.component.scss']
})
export class ClinicalNoteCreateComponent implements OnInit {
  clinicalForm: FormGroup;
  data: any = "";
  clinicalNotesList: any = {};
  recognition: any;
  spokenText: string = '';
  voicetext: string = '';
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
  mediaRecorder: any;
  audioChunks: any[] = [];
  voiceBlob: Blob | null = null;
  mediaStream: MediaStream | null = null; // Add this to track the stream
  selectedProviders: any = 0;
  selectedNotes: any = 0;
  db: any;
    private patientDataSubscription: Subscription | undefined;

  dbReady: Promise<void> = Promise.resolve();
  audioUrl: SafeUrl | null = null; // keep SafeUrl only
  providers: any[] = [];
  clinicalNotes: any[] = [];

  dataquestion: any;
  viewquestion: boolean = false;
  viewNoteResponse: boolean = false;
  nodeData: any;

  recording = false;
  isPaused = false;
  isListening: boolean | null = null;

  cacheItems: string[] = ['Provider'];

  private subscriptions: Subscription[] = [];
  isTemplatePreSelected: boolean = false;
  selectedTemplateName: string = 'Clinical Note';
  preSelectedProvider: number | null = null;
  preSelectedTemplateId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clinicalApiService: ClinicalApiService,
    // private messageService: MessageService,
         private loader: LoaderService,
    private sharedService: SharedService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
     private PatientData: PatientBannerService
  ) {
    this.clinicalForm = this.fb.group({
      noteTitle: ['', Validators.required],
      provider: [null, Validators.required],
      note: [null, Validators.required],
      description: [''],
      voicetext: ['']
    });
  }

  SelectedVisit: any;
  // Edit mode support
  private noteId: number = 0;
  ngOnInit(): void {
    debugger
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
        console.log('Selected Visit medical-list', this.SelectedVisit);
        if (this.SelectedVisit) {
        }
      });

    this.FillCache();

    // Read query params and pre-populate form / edit existing note
    this.route.queryParams.subscribe(params => {
      if (params['provider']) {
        this.preSelectedProvider = Number(params['provider']);
        this.clinicalForm.patchValue({ provider: params['provider'] });
      }
      if (params['template']) {
        this.isTemplatePreSelected = true;
        const templateId = Number(params['template']);
        this.preSelectedTemplateId = templateId;
        this.clinicalForm.patchValue({ note: templateId });
        this.selectedNotes = templateId;
        // Load template immediately
        this.GetNotesTemplate(templateId);
      }

      // Edit existing note (structured with voice)
      if (params['noteId']) {
        const id = Number(params['noteId']);
        if (id) {
          this.loadExistingNote(id);
        }
      }
    });

    // subscribe to provider selection changes (value is the selected code)
    const providerCtrl = this.clinicalForm.get('provider');
    if (providerCtrl) {
      debugger
      const sub = providerCtrl.valueChanges.subscribe((val: any) => {
        const code = Number(val) || 0;
        this.selectedProviders = code;
        // Only reload notes if template is not pre-selected
      });
      this.subscriptions.push(sub);
    }

    // subscribe to note selection changes
    const noteCtrl: any = this.clinicalForm.get('note');
    if (noteCtrl != null && noteCtrl != undefined && noteCtrl != 0) {
      console.log('Note control initialized:', noteCtrl);

      const sub2 = noteCtrl.valueChanges.subscribe((val: any) => {
        // Only handle changes if template is not pre-selected
        if (!this.isTemplatePreSelected) {
          const nid = Number(val) || 0;
          this.selectedNotes = nid;
        }
      });
      this.subscriptions.push(sub2);
    }

  }

  // --- UI / dialog -------------------------------------------------------
  showDialog() { this.visible = true; }

  loadData() {
    this.clinicalApiService.getDataquestion().subscribe(data => {
      this.dataquestion = data;
      console.log(" json Data Question", this.dataquestion);
    });
  }

  // --- recording small helpers -------------------------------------------
  startRecording() {
    this.recording = true;
    console.log("Recording started");
  }

  stopRecording() {
    this.recording = false;
    console.log("Recording stopped");
  }

  // --- populate dropdowns / cache ---------------------------------------
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
    // ...existing code...
    const jParse = JSON.parse(JSON.stringify(response)).cache;
    let provider = JSON.parse(jParse).Provider;
    if (provider) {
      provider = provider.map((item: any) => ({ name: item.FullName, code: item.EmployeeId }));
      this.providers = provider;
    }
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

      // Set template name from response
      if (res?.node?.noteTitle) {
        this.selectedTemplateName = res.node.noteTitle;
        // Patch the noteTitle form control with the template title
        this.clinicalForm.patchValue({ noteTitle: res.node.noteTitle });
      }

      this.loader.hide();
    }).catch(() =>
      Swal.fire('Error', 'Error loading template', 'error')
    ).finally(() => this.loader.hide());
    }

  }

  // --- speech recognition (live transcription) ---------------------------
  startListening() {
    // ...existing code...
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
    //   this.messageService.add({ severity: 'warn', summary: 'Not Supported', detail: 'SpeechRecognition is not supported in this browser.' });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      this.voicetext = transcript;
      // keep reactive form in sync
      this.clinicalForm.patchValue({ voicetext: this.voicetext });
    };
    recognition.onerror = (err: any) => {
      console.error('Speech recognition error', err);
    };
    recognition.start();
    this.isListening = true;
    recognition.onend = () => { this.isListening = false; };
    this.recognition = recognition;
  }

  stopListening(): void {
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch {}
    }
  }

  // --- voice recording to Blob ------------------------------------------
    startVoiceRecording() {
    if (this.selectedNotes > 0) {
      this.recording = true;
      this.isPaused = false;
      this.isListening = false;
      this.ganricfunction();
    }
    else {
      Swal.fire('Warning', 'Please select Note Template first.', 'warning');
    }
  }


  ganricfunction(){
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaStream = stream; // Store the stream reference
      this.mediaRecorder = new MediaRecorder(stream);

      this.audioChunks = []; // Clear chunks before starting

      this.mediaRecorder.ondataavailable = (event: any) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        // Stop all media stream tracks ONLY here
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach(track => {
            track.stop();
            console.log('Track stopped:', track.kind);
          });
          this.mediaStream = null;
        }

        // Revoke old URL to prevent memory leaks
        if (this.audioUrl) {
          const oldUrl = this.audioUrl.toString();
          if (oldUrl.startsWith('blob:')) {
            URL.revokeObjectURL(oldUrl);
          }
        }

        // Clear audio URL first
        this.audioUrl = null;
        this.cdr.detectChanges();

        // Create new blob and URL
        this.voiceBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(this.voiceBlob);
        this.audioUrl = this.sanitizer.bypassSecurityTrustUrl(url);

        // Manually trigger change detection
        this.cdr.detectChanges();
      };

      this.mediaRecorder.start();
    }).catch((err) => {
      console.error('Microphone access denied:', err);
      Swal.fire('Error', 'Microphone access denied. Please allow microphone access.', 'error');
    });
  }

  pauseVoiceRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.isPaused = true;
    }
  }

  resumeVoiceRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isPaused = false;
    }
  }

  stopVoiceRecording() {
    this.recording = false;
    this.isPaused = false;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.error('Error stopping recorder:', e);
      }
    } else {
      Swal.fire('Warning', 'No active recording to stop.', 'warning');
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

  private loadExistingNote(noteId: number) {
    if (!noteId) {
      return;
    }

    this.dataquestion = [];
    this.viewquestion = false;
    this.nodeData = [];

    this.loader.show();
    this.clinicalApiService.GetEMRNoteByNoteId(noteId)
      .then((res: any) => {
        const note = res?.data;
        if (!note) {
          Swal.fire('Error', 'Unable to load note for editing.', 'error');
          return;
        }

        // Normalize answeredNotesTemplate so it matches the same shape as GetNotesTemplate
        let answeredTemplate: any = note.answeredNotesTemplate;

        if (typeof answeredTemplate === 'string') {
          try {
            answeredTemplate = JSON.parse(answeredTemplate);
          } catch (e) {
            console.error('Failed to parse answeredNotesTemplate JSON', e);
          }
        }

        if (answeredTemplate && !answeredTemplate.node && (answeredTemplate.questions || Array.isArray(answeredTemplate))) {
          const questions = answeredTemplate[0].questions || answeredTemplate;
          const titleFromTemplate = answeredTemplate[0].noteTitle || '';

          answeredTemplate = {
            node: {
              noteTitle: titleFromTemplate || note.notesTitle || note.noteTitle || '',
              questions: questions
            }
          };
        }

        this.dataquestion = answeredTemplate;
        this.viewquestion = true;
        this.nodeData = answeredTemplate;
        // Store id for update payload
        this.noteId = note.noteId || note.id || 0;

        // Update MRN and visit if available
        this.mrNo = note.mrno || this.mrNo;
        if (note.visitAcNo && (!this.SelectedVisit || !this.SelectedVisit.appointmentId)) {
          this.SelectedVisit = { ...(this.SelectedVisit || {}), appointmentId: note.visitAcNo };
        }

        // Provider and title
        const providerCode = note.signedBy || note.providerId || null;
        this.preSelectedProvider = providerCode || this.preSelectedProvider;
        this.selectedProviders = this.preSelectedProvider || 0;

        this.clinicalForm.patchValue({
          noteTitle: note.notesTitle || note.noteTitle || '',
          provider: providerCode
        });

        this.cdr.markForCheck();
      })
      .catch((error: any) => {
        console.error('Error loading EMR note by id:', error);
        Swal.fire('Error', 'Failed to load note for editing.', 'error');
      })
      .finally(() => {
        this.loader.hide();
      });
  }
  // collect filled answers from structured note tree
  public collectFilledValues(): any {
    if (!this.dataquestion?.node) return null;
    const clone = JSON.parse(JSON.stringify(this.dataquestion));
    if (clone.node?.questions) {
      clone.node.questions = this.collectQuestionValues(clone.node.questions);
    }
    return clone;
  }

  public collectQuestionValues(questions: Question[]): Question[] {
    return questions.map(q => ({
      ...q,
      answer: q.answer || '',
      children: q.children && q.children.length ? this.collectQuestionValues(q.children) : []
    }));
  }

  public generateHtmlFromStructuredNote(filledNote: any): string {
    if (!filledNote?.node) return '';
    let html = `<div class="clinical-note">`;
    html += `<h2 style="font-weight:bold;text-decoration:underline;">${filledNote.node.noteTitle}</h2>`;
    if (filledNote.node.questions) html += this.generateQuestionsHtml(filledNote.node.questions);
    html += `</div>`;
    return html;
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  }

  public generateQuestionsHtml(questions: Question[]): string {
    let html = '';

    questions.forEach(question => {
      // Skip any question/section that has no filled data
      if (!this.isSectionFilled(question)) {
        return;
      }

      if (question.type === 'Question Section') {
        html += `<div style="margin-top: 20px;">`;
        html += `<h4 style="font-weight: bold; margin-left: 20px;">${question.quest_Title}</h4>`;

        if (question.children && question.children.length > 0) {
          html += `<div style="display: flex; flex-wrap: wrap; margin-left: 20px;">`;
          html += this.generateQuestionsHtml(question.children);
          html += `</div>`;
        }
        html += `</div>`;
      } else if (question.type === 'TextBox') {
        html += `<div style="display: inline-block; margin-right: 20px; margin-bottom: 15px; width: calc(25% - 20px); vertical-align: top;">`;
        html += `<div style="margin-bottom: 5px;"><strong>${question.quest_Title}:</strong></div>`;
        html += `<div>${question.answer || ''}</div>`;
        html += `</div>`;
      } else if (question.type === 'CheckBox') {
        // Only show checkbox if it's checked (true)
        if (question.answer === 'true' || question.answer === true) {
          html += `<div style="display: inline-block; margin-right: 20px; margin-bottom: 15px; width: calc(25% - 20px); vertical-align: top;">`;
          html += `<div><strong>${question.quest_Title}:</strong> Yes</div>`;
          html += `</div>`;
        }
      }

      if (question.children && question.children.length > 0 && question.type !== 'Question Section') {
        html += this.generateQuestionsHtml(question.children);
      }
    });

    return html;
  }

  getFormattedNoteHtml(): SafeHtml {
    const questions = this.dataquestion?.node?.questions || this.dataquestion?.questions || [];
    const title = this.dataquestion?.node?.noteTitle || this.dataquestion?.noteTitle || '';

    let html = `<h2 style="margin-top: 10px; font-weight: bold; margin-left: 10px; text-decoration-line: underline;">${title}</h2>`;

    questions.forEach((section: any) => {
      if (this.hasQuestionData(section)) {
        html += this.formatQuestion(section, 10);
      }
    });

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private formatQuestion(question: any, marginLeft: number): string {
    let html = '';

    if (!this.hasQuestionData(question)) {
      return html;
    }

    if (question.type === 'Question Section') {
      html += `<h3 style="font-weight: bold; margin-top: 15px; margin-left: ${marginLeft}px; font-size: 1rem;">${question.quest_Title}</h3>`;

      if (question.answer && typeof question.answer === 'string' && question.answer.trim()) {
        html += `<div style="margin-left: ${marginLeft + 20}px; margin-bottom: 10px;">${question.answer}</div>`;
      }

      if (question.children && question.children.length > 0) {
        const filledChildren = question.children.filter((child: any) => this.hasQuestionData(child));

        if (filledChildren.length > 0) {
          filledChildren.forEach((child: any) => {
            html += this.formatQuestion(child, marginLeft + 20);
          });
        }
      }
    } else if (question.type === 'TextBox') {
      if (question.answer && typeof question.answer === 'string' && question.answer.trim()) {
        html += `<div style="margin-left: ${marginLeft}px; margin-bottom: 10px;">`;
        html += `<strong>${question.quest_Title}:</strong> ${question.answer}`;
        html += '</div>';

        if (question.children && question.children.length > 0) {
          question.children.forEach((child: any) => {
            if (this.hasQuestionData(child)) {
              html += this.formatQuestion(child, marginLeft + 20);
            }
          });
        }
      }
    } else if (question.type === 'CheckBox') {
      // Only show if checkbox is checked (true)
      if (question.answer === 'true' || question.answer === true) {
        html += `<div style="margin-left: ${marginLeft}px; margin-bottom: 10px;">`;
        html += `<strong>${question.quest_Title}:</strong> Yes`;
        html += '</div>';

        // Show children if they have data
        if (question.children && question.children.length > 0) {
          question.children.forEach((child: any) => {
            if (this.hasQuestionData(child)) {
              html += this.formatQuestion(child, marginLeft + 20);
            }
          });
        }
      }
    }

    return html;
  }

  private hasQuestionData(question: any): boolean {
    // For checkboxes, only return true if checked
    if (question.type === 'CheckBox') {
      const isChecked = question.answer === 'true' || question.answer === true;
      if (isChecked) {
        return true;
      }
      // Check if any children have data
      if (question.children && question.children.length > 0) {
        return question.children.some((child: any) => this.hasQuestionData(child));
      }
      return false;
    }

    // For text fields, check if there's actual content
    if (typeof question.answer === 'string' && question.answer.trim().length > 0) {
      return true;
    }

    if (question.children && question.children.length > 0) {
      return question.children.some((child: any) => this.hasQuestionData(child));
    }

    return false;
  }

  private isSectionFilled(question: Question): boolean {
    // Check if the question itself has an answer
    if (question.answer && question.answer.toString().trim() !== '') {
      return true;
    }

    // For checkboxes, only consider filled if checked
    if (question.type === 'CheckBox' && (question.answer === 'true' || question.answer === true)) {
      return true;
    }

    // Check if any children have data
    if (question.children && question.children.length > 0) {
      return question.children.some(child => this.isSectionFilled(child));
    }

    return false;
  }

  hasAnyFilledData(): boolean {
    const questions = this.nodeData?.node?.questions || this.nodeData?.questions || [];
    return questions.some((q: any) => this.hasQuestionData(q));
  }

  // --- submit recorded voice (upload or offline save) -------------------
  submitVoice() {
    if (this.clinicalForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields.', 'error');
      this.clinicalForm.markAllAsTouched();
      return;
    }
    if (!this.voiceBlob) {
      Swal.fire('Warning', 'No voice recording available.', 'warning');
      return;
    }

    const formValue = this.clinicalForm.value;
    const providerId = Number(formValue.provider) || this.selectedProviders;
    const noteId = Number(formValue.note) || this.selectedNotes;
    const current_User = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
    const createdBy = current_User.userName || '';
    const userId = current_User.userId || '';

    // derive note title
    const selectedNote = this.clinicalNotes.find(n => n.pathId === noteId);
    const noteName = selectedNote ? selectedNote.pathName : (this.dataquestion?.node?.noteTitle || '');

    // collect structured filled values + html
    const filledStructuredNote = this.collectFilledValues();
    const htmlContent = this.generateHtmlFromStructuredNote(filledStructuredNote);
    const noteText = this.stripHtml(htmlContent);

    const reader = new FileReader();
    reader.onloadend = () => {
      const voiceBase64 = reader.result?.toString().split(',')[1] || '';
      const basePayload = {
        appointmentId: this.SelectedVisit?.appointmentId,
        providerId,
        userId,
        currentUser: createdBy,
        mrNo: this.mrNo,
        noteTitle: noteName,
        description: formValue.description,
        pathId: noteId,
        structuredNote: filledStructuredNote,
        htmlContent,
        noteText,
        createdBy,
        updatedBy: createdBy,
        signedBy: providerId || 0,
        Id: this.noteId || 0,
        isEdit: this.noteId > 0,
        noteType: 'Structured',
        createdOn: new Date(),
        templateId: noteId,
        voicetext: formValue.voicetext
      } as any;

      if (navigator.onLine) {
        this.loader.show();

        const audioFile = new File([
          this.voiceBlob as Blob
        ], 'clinical-note.webm', { type: (this.voiceBlob as Blob).type || 'audio/webm' });

        this.sharedService.uploadDocumentsWithModule('ClinicalSpeech', [audioFile]).subscribe({
          next: (uploadRes: any) => {
            const first = Array.isArray(uploadRes) && uploadRes.length ? uploadRes[0] : null;
            const fileId = first?.fileId || first?.id;

            const payload = {
              ...basePayload,
              fileId
            };

            // Payload now contains both voice and filled template
            console.log('Payload:', payload);

            const timeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request timed out")), 300000)
            );

            Promise.race([ this.clinicalApiService.InsertNote(payload), timeout ])
              .then((response: any) => {
                this.dataquestion = response;
                this.nodeData = response?.node || response;
                this.viewNoteResponse = true;

                this.audioUrl = null;
                this.voiceBlob = null;
                this.clinicalForm.patchValue({ description: '', voicetext: '' });
                Swal.fire('Success', 'Note uploaded successfully.', 'success');
                this.router.navigate(['/patient-summary'], { queryParams: { id: 2 } });
                this.loader.hide();
              })
              .catch((error: any) => {
                console.error('Upload failed:', error);
                Swal.fire('Offline Save', 'Saved offline due to network/server error.', 'info');
                this.loader.hide();
              });
          },
          error: (err: any) => {
            console.error('Voice file upload failed:', err);
            this.loader.hide();
            Swal.fire('Error', 'Failed to upload voice file.', 'error');
          }
        });
      } else {
        const offlinePayload = {
          ...basePayload
        };
        this.saveNoteOffline(offlinePayload);
        Swal.fire('Offline', 'Note saved offline and will be synced later.', 'info');
        this.loader.hide();
      }
    };

    reader.readAsDataURL(this.voiceBlob);
  }
  cancel() {
    this.router.navigate(['/patient-summary'], { queryParams: { id: 2 } });
  }

  // --- additional submit used elsewhere in old code ---------------------
  submit() {
    // ...existing code...
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
    this.clinicalNotesList.NoteText = this.spokenText;
    this.clinicalNotesList.VoiceText = this.voicetext;
    this.clinicalApiService.InsertSpeech(this.clinicalNotesList).then(() => {
      Swal.fire('Success', 'Appointment has been Created', 'success');
      this.router.navigate(['/clinical/clinical-notes']);
    });
  }

  onProviderchange() {

  }

  resetForm(){
    this.clinicalForm.reset();
    this.isTemplatePreSelected = false;
    this.selectedTemplateName = 'Clinical Note';
  }

  ngOnDestroy(): void {
    // cleanup subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());

    // Stop media stream tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped on destroy:', track.kind);
      });
      this.mediaStream = null;
    }

    // Cleanup audio URL
    if (this.audioUrl) {
      const url = this.audioUrl.toString();
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }

    // Cleanup media recorder
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.error('Error stopping recorder on destroy:', e);
      }
    }
  }

  getProviderName(providerCode: any): string {
    if (!providerCode || !this.providers?.length) return '';
    const provider = this.providers.find(p => p.code == providerCode);
    return provider ? provider.name : '';
  }
}

/* keep Question interface if needed by template/components */
export interface Question {
  quest_Id: number;
  quest_Title: string;
  type: string;
  parent_Id: number;
  answer: string | boolean;  // Updated to allow both string and boolean
  children: Question[];
}
