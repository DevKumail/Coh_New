import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';

import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { QuestionItemComponent } from '../question-item/question-item.component';
import { QuestionViewComponent } from '../question-view/question-view.component';
import Swal from 'sweetalert2';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { NotesComponent } from '../../patient-summary/components/notes/notes.component';
import { LoaderService } from '@core/services/loader.service';

@Component({
    standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    FilledOnValueDirective,
    QuestionItemComponent,
    QuestionViewComponent,
    NotesComponent
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
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
     private PatientData: PatientBannerService
  ) {
    this.clinicalForm = this.fb.group({
      provider: [null, Validators.required],
      note: [null, Validators.required],
      description: [''],
      voicetext: ['']
    });
  }

  SelectedVisit: any;
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

    // Read query params and pre-populate form
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
        // Load notes to get template name
        if (this.preSelectedProvider) {
          this.GetNotesEmployeeId(this.preSelectedProvider);
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
        if (!this.isTemplatePreSelected) {
          this.GetNotesEmployeeId(code);
        }
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
          this.GetNotesTemplate(nid);
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

  GetNotesEmployeeId(providerCode: any) {
    if (providerCode == null || providerCode == undefined) providerCode = 0;
    this.selectedProviders = Number(providerCode) || 0;
    if (this.selectedProviders === 250) providerCode = 197;

    // Don't clear note dropdown if template is pre-selected
    if (!this.isTemplatePreSelected) {
      this.clinicalNotes = [];
      this.clinicalForm.patchValue({ note: null });
    }

    this.loader.show();
    this.clinicalApiService.EMRNotesGetByEmpId(providerCode).then((res: any) => {
      this.clinicalNotes = res.result || [];

      // Set selected template name if pre-selected
      if (this.isTemplatePreSelected && this.preSelectedTemplateId) {
        const selectedNote = this.clinicalNotes.find(n => n.pathId === this.preSelectedTemplateId);
        if (selectedNote) {
          this.selectedTemplateName = selectedNote.pathName;
          this.cdr.detectChanges();
        }
      }

      this.loader.hide();
    }).catch((e: any) =>
      Swal.fire('Error', 'Error loading notes', 'error')
    ).finally(() => this.loader.hide());
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
        this.mediaRecorder = new MediaRecorder(stream);

        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
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

  // --- submit recorded voice (upload or offline save) -------------------
  submitVoice() {
    if (this.clinicalForm.invalid) {
        Swal.fire('Error', 'Please fill all required fields.', 'error');
      this.clinicalForm.markAllAsTouched();
      return;
    }

    const formValue = this.clinicalForm.value;
    // ensure numeric conversion
    const providerCode = Number(formValue.provider) || this.selectedProviders;
    const noteId = Number(formValue.note) || this.selectedNotes;


    if (!this.voiceBlob) {
      alert('No voice recording available!');
      return;
    }
    const current_User = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
    this.createdBy = current_User.userName || '';
    this.updatedBy = current_User.userName || '';
    this.signedBy = false;
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1] || '';

      // find selected note using reactive form value (not legacy property)
      const selectedNoteId = noteId;
      const selectedNote = this.clinicalNotes.find(note => note.pathId === selectedNoteId);
      const noteName = selectedNote ? selectedNote.pathName : '';

      const note = {
        noteTitle: noteName,
        createdBy: this.createdBy,
        updatedBy: this.updatedBy,
        description: formValue.description,
        signedBy: this.signedBy,
        voiceFile: base64data,
        createdOn: new Date(),
        mrNo: this.mrNo,
        appointmentId: this.SelectedVisit.appointmentId,
        pathId: selectedNoteId
      };

      if (navigator.onLine) {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out")), 300000)
        );
this.loader.show();
        Promise.race([ this.clinicalApiService.InsertSpeech(note), timeout ])
          .then((response: any) => {
            if (response != null && response != "") {
              this.dataquestion = response;
              this.nodeData = response.node;
              this.viewNoteResponse = true;
              this.audioUrl = null;
              this.voiceBlob = null;
              this.clinicalForm.reset();
              Swal.fire('Success', 'Note uploaded successfully.', 'success');
                this.loader.hide();
            //   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Note uploaded successfully.' });
            } else {
                this.loader.hide();
              throw new Error('Upload failed');
            }
          })
          .catch((error: any) => {
            console.error('Upload failed:', error);
            this.saveNoteOffline(note);
            Swal.fire('Offline Save', 'Saved offline due to network/server error.', 'info');
            this.loader.hide();
            // this.messageService.add({ severity: 'error', summary: 'Offline Save', detail: 'Saved offline due to network/server error.' });
          });
      } else {
        this.saveNoteOffline(note);
        Swal.fire('Offline', 'Note saved offline and will be synced later.', 'info');
        this.loader.hide();
        // this.messageService.add({ severity: 'info', summary: 'Offline', detail: 'Note saved offline and will be synced later.' });
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
  answer: string;
  children: Question[];
}
