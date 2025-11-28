import { UserDataService } from '@core/services/user-data.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-clinical-structured-note-create',
  templateUrl: './clinical-structured-note-create.component.html',
  styleUrls: ['./clinical-structured-note-create.component.scss']
})
export class ClinicalStructuredNoteCreateComponent implements OnInit {
  clinicalForm: FormGroup;
  mrNo: string = '';
  SearchPatientData: any;
  selectedProviders: any = 0;
  selectedNotes: any = 0;

  private patientDataSubscription: Subscription | undefined;
  providers: any[] = [];
  clinicalNotes: any[] = [];

  dataquestion: any;
  viewquestion: boolean = false;
  viewNoteResponse: boolean = false;
  nodeData: any;

  cacheItems: string[] = ['Provider'];
  private subscriptions: Subscription[] = [];

  isTemplatePreSelected: boolean = false;
  preSelectedProvider: number = 0;
  preSelectedTemplate: number = 0;
  SelectedVisit: any;

  // User data from RxDB
  private currentUserId: string = '';
  private currentUserName: string = '';

  constructor(
    private fb: FormBuilder,
    private clinicalApiService: ClinicalApiService,
    private loader: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private PatientData: PatientBannerService,
    private cdr: ChangeDetectorRef,
  ) {
    this.clinicalForm = this.fb.group({
      provider: [null, Validators.required],
      note: [null, Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Load user data first
    this.loadCurrentUser();

    this.patientDataSubscription = this.PatientData.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) =>
          prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
        )
      )
      .subscribe((data: any) => {
        this.SearchPatientData = data;
        this.mrNo = data?.table2?.[0]?.mrNo || '';
      });

    this.PatientData.selectedVisit$.subscribe((data: any) => {
      this.SelectedVisit = data;
    });

    this.route.queryParams.subscribe(params => {
      if (params['provider']) {
        this.preSelectedProvider = Number(params['provider']);
      }
      if (params['template']) {
        this.preSelectedTemplate = Number(params['template']);
        this.isTemplatePreSelected = true;
      }
    });

    this.FillCache();

    const providerCtrl = this.clinicalForm.get('provider');
    if (providerCtrl) {
      const sub = providerCtrl.valueChanges.subscribe((val: any) => {
        const code = Number(val) || 0;
        this.selectedProviders = code;
      });
      this.subscriptions.push(sub);
    }

    const noteCtrl: any = this.clinicalForm.get('note');
    if (noteCtrl) {
      const sub2 = noteCtrl.valueChanges.subscribe((val: any) => {
        const nid = Number(val) || 0;
        this.selectedNotes = nid;
        this.GetNotesTemplate(nid);
      });
      this.subscriptions.push(sub2);
    }
  }

  /**
   * Load current user from RxDB
   */
  private async loadCurrentUser(): Promise<void> {
    try {
      const user = await this.userDataService.getCurrentUser();

      if (user) {
        this.currentUserName = user.userName || '';
        this.currentUserId = user.userId || '';
        console.log('✅ User loaded:', this.currentUserName);
      } else {
        console.warn('⚠️ No user found in RxDB');
        // Fallback to localStorage if needed
        const localUser = localStorage.getItem('currentUser');
        if (localUser) {
          const userData = JSON.parse(localUser);
          this.currentUserName = userData.userName || '';
          this.currentUserId = userData.userId || '';
        }
      }
    } catch (error) {
      console.error('❌ Failed to load user:', error);
    }
  }

  FillCache() {
    this.clinicalApiService
      .getCacheItem({ entities: this.cacheItems })
      .then((response: any) => {
        if (response && response.cache) {
          this.FillDropDown(response);
          this.setPreSelectedValues();
        }
      })
      .catch((error: any) =>
        Swal.fire('Error', error?.message || 'Failed to load cache', 'error')
      );
  }

  FillDropDown(response: any) {
    const jParse = JSON.parse(JSON.stringify(response)).cache;
    let provider = JSON.parse(jParse).Provider;
    if (provider) {
      provider = provider.map((item: any) => ({ name: item.FullName, code: item.EmployeeId }));
      this.providers = provider;
    }
  }

  setPreSelectedValues() {
    if (this.preSelectedProvider && this.preSelectedTemplate) {
      this.clinicalForm.patchValue({
        provider: this.preSelectedProvider,
        note: this.preSelectedTemplate
      }, { emitEvent: false });

      this.selectedProviders = this.preSelectedProvider;
      this.selectedNotes = this.preSelectedTemplate;
      this.GetNotesTemplate(this.preSelectedTemplate);
    }
  }

//   GetNotesEmployeeId(providerCode: any) {
//     if (providerCode == null || providerCode == undefined) providerCode = 0;
//     this.selectedProviders = Number(providerCode) || 0;
//     if (this.selectedProviders === 250) providerCode = 197;
//     this.clinicalNotes = [];
//     this.clinicalForm.patchValue({ note: null });
//     this.loader.show();
//     this.clinicalApiService.EMRNotesGetByEmpId(providerCode).then((res: any) => {
//       this.clinicalNotes = res.result || [];
//       this.loader.hide();
//     }).catch((e: any) =>
//       Swal.fire('Error', 'Error loading notes', 'error')
//     ).finally(() => this.loader.hide());
//   }

  GetNotesTemplate(noteId: any) {
    if (noteId == null || noteId == undefined) noteId = 0;

    this.selectedNotes = Number(noteId) || 0;
    this.dataquestion = [];
    this.viewquestion = false;
    this.nodeData = [];
    if (noteId != null && noteId != undefined && noteId != 0) {
      this.loader.show();
      this.clinicalApiService.GetNotesTemplate(noteId).then((res: any) => {
        this.dataquestion = res;
        this.viewquestion = true;
        this.nodeData = res;
        // show note preview immediately for real-time updates
        this.viewNoteResponse = true;
        this.loader.hide();
      }).catch(() =>
        Swal.fire('Error', 'Error loading template', 'error')
      ).finally(() => this.loader.hide());
    }
  }

  async submitVoice() {
    if (this.clinicalForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields.', 'error');
      this.clinicalForm.markAllAsTouched();
      return;
    }

    const formValue = this.clinicalForm.value;
    const noteId = Number(formValue.note) || this.selectedNotes;

    // Get user info from RxDB
    const auditInfo = await this.userDataService.getAuditInfo();
    const createdBy = auditInfo.createdBy || this.currentUserName;
    const userId = auditInfo.userId || this.currentUserId;

    let noteName = this.dataquestion?.node?.noteTitle || '';
    if (!noteName) {
      const selectedNote = this.clinicalNotes.find(note => note.pathId === noteId);
      noteName = selectedNote ? selectedNote.pathName : '';
    }

    // Collect filled values from the structured note
    const filledStructuredNote = this.collectFilledValues();

    // Generate HTML from structured note with filled values
    const htmlContent = this.generateHtmlFromStructuredNote(filledStructuredNote);

    const payload = {
      appointmentId: this.SelectedVisit.appointmentId,
      providerId: Number(formValue.provider) || this.selectedProviders,
      userId: userId,
      currentUser: createdBy,
      mrNo: this.mrNo,
      noteTitle: noteName,
      description: formValue.description,
      pathId: noteId,
      structuredNote: filledStructuredNote,
      htmlContent: htmlContent,
      createdBy: createdBy,
      updatedBy: createdBy,
      signedBy: false,
      createdOn: new Date()
    };

    console.log('Payload:', payload);

    if (navigator.onLine) {
      this.loader.show();
      this.clinicalApiService.InsertSpeech(payload)
        .then((response: any) => {
          if (response != null && response != "") {
            this.dataquestion = response;
            this.nodeData = response.node || response;
            this.viewquestion = true;
            this.viewNoteResponse = true;
            this.clinicalForm.patchValue({ description: '' });
            Swal.fire('Success', 'Note created successfully.', 'success');
          } else {
            throw new Error('Creation failed');
          }
        })
        .catch((error: any) => {
          console.error('Creation failed:', error);
          Swal.fire('Error', 'Failed to create note.', 'error');
        })
        .finally(() => this.loader.hide());
    } else {
      Swal.fire('Offline', 'You are offline. Please connect to the internet.', 'warning');
    }
  }
// }

  collectFilledValues(): any {
    if (!this.dataquestion?.node) {
      return null;
    }

    // Deep clone the structure and collect filled values
    const filledNote = JSON.parse(JSON.stringify(this.dataquestion));

    if (filledNote.node && filledNote.node.questions) {
      filledNote.node.questions = this.collectQuestionValues(filledNote.node.questions);
    }

    return filledNote;
  }

  collectQuestionValues(questions: Question[]): Question[] {
    return questions.map(question => {
      const filledQuestion = { ...question };

      // Collect answer value from the form/component
      // The answer should be populated by the question-view component
      filledQuestion.answer = question.answer || '';

      if (question.children && question.children.length > 0) {
        filledQuestion.children = this.collectQuestionValues(question.children);
      }

      return filledQuestion;
    });
  }

  generateHtmlFromStructuredNote(filledNote: any): string {
    if (!filledNote?.node) {
      return '';
    }

    let html = `<div class="clinical-note">`;
    html += `<h2 style="font-weight: bold; text-decoration: underline;">${filledNote.node.noteTitle}</h2>`;

    if (filledNote.node.questions) {
      html += this.generateQuestionsHtml(filledNote.node.questions);
    }

    html += `</div>`;
    return html;
  }

  generateQuestionsHtml(questions: Question[]): string {
    let html = '';

    questions.forEach(question => {
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
        html += `<div>${question.answer || 'N/A'}</div>`;
        html += `</div>`;
      } else if (question.type === 'CheckBox') {
        // Only show checkbox if it's checked (true)
        if (question.answer === true || question.answer === 'true') {
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

  cancel() {
    this.router.navigate(['/patient-summary'], { queryParams: { id: 2 } });
  }

  resetForm() {
    this.clinicalForm.reset();
  }

  getProviderName(providerCode: string): string {
    const provider = this.providers?.find(p => p.code === providerCode);
    return provider ? provider.name : '';
  }

  // Update the model when a child emits an answer change (string or boolean for checkboxes)
  onAnswerChange(value: string | boolean, question: any) {
    if (question) {
      question.answer = value ?? '';
    }
    // this.cdr.markForCheck();
  }

  // Helper for template to check if a section or any of its children has content (recursive)
  isSectionFilled(section: any): boolean {
    if (!section) return false;

    // Check if the section itself has an answer (string or boolean for checkboxes)
    const hasSelf = (typeof section.answer === 'string' && section.answer.trim().length > 0) ||
                    (typeof section.answer === 'boolean' && section.answer === true);

    // Recursively check all children
    const hasChild = Array.isArray(section.children) && section.children.some((c: any) => this.isSectionFilled(c));

    return hasSelf || hasChild;
  }

  // Check if ANY question in the template has filled data
  hasAnyFilledData(): boolean {
    const questions = this.nodeData?.node?.questions || this.nodeData?.questions || [];
    return questions.some((q: any) => this.isSectionFilled(q));
  }

  ngOnDestroy(): void {
    if (this.patientDataSubscription) {
      this.patientDataSubscription.unsubscribe();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

export interface Question {
  quest_Id: number;
  quest_Title: string;
  type: string;
  parent_Id: number;
  answer: string | boolean; // Support boolean for checkboxes
  children: Question[];
}
