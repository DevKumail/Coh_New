import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';

import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { QuestionItemComponent } from '../question-item/question-item.component';
import { QuestionViewComponent } from '../question-view/question-view.component';
import Swal from 'sweetalert2';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { LoaderService } from '@core/services/loader.service';

@Component({
    standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    FilledOnValueDirective,
    QuestionItemComponent,
    QuestionViewComponent
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
      description: ['']
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
    this.clinicalNotes = [];
    this.clinicalForm.patchValue({ note: null });
    this.loader.show();
    this.clinicalApiService.EMRNotesGetByEmpId(providerCode).then((res: any) => {
      this.clinicalNotes = res.result || [];
        this.loader.hide();
    }).catch((e: any) =>
        Swal.fire('Error', 'Error loading notes', 'error')
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading notes' })
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
      Swal.fire('Error', 'Please fill all required fields.', 'error');
      this.clinicalForm.markAllAsTouched();
      return;
    }

    const formValue = this.clinicalForm.value;
    const providerCode = Number(formValue.provider) || this.selectedProviders;
    const noteId = Number(formValue.note) || this.selectedNotes;

    const current_User = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
    this.createdBy = current_User.userName || '';
    this.updatedBy = current_User.userName || '';
    this.signedBy = false;

    // find selected note using reactive form value
    const selectedNoteId = noteId;
    const selectedNote = this.clinicalNotes.find(note => note.pathId === selectedNoteId);
    const noteName = selectedNote ? selectedNote.pathName : '';

    const note = {
      noteTitle: noteName,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      description: formValue.description,
      signedBy: this.signedBy,
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
            this.clinicalForm.reset();
            Swal.fire('Success', 'Note uploaded successfully.', 'success');
            this.loader.hide();
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
        });
    } else {
      this.saveNoteOffline(note);
      Swal.fire('Offline', 'Note saved offline and will be synced later.', 'info');
      this.loader.hide();
    }
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
  ngOnDestroy(): void {
    if (this.patientDataSubscription) {
      this.patientDataSubscription.unsubscribe();
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
