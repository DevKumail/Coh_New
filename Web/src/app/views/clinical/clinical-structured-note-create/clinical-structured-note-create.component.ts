import { UserDataService } from '@core/services/user-data.service';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { QuestionViewComponent } from '../question-view/question-view.component';
import Swal from 'sweetalert2';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { LoaderService } from '@core/services/loader.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    FilledOnValueDirective,
    QuestionViewComponent
  ],
  selector: 'app-clinical-structured-note-create',
  templateUrl: './clinical-structured-note-create.component.html',
  styleUrls: ['./clinical-structured-note-create.component.scss']
})
export class ClinicalStructuredNoteCreateComponent implements OnInit, AfterViewInit {
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
  additionalSections: any[] = [];
  selectedSocialHistoryItems: any[] = [];
  selectedFamilyHistoryItems: any[] = [];
  selectedAllergiesItems: any[] = [];
  selectedMedicalHistoryItems: any[] = [];
  selectedVitalSignsItems: any[] = [];
  selectedImmunizationsItems: any[] = [];
  socialHistoryQuestionId: number = 0; // Track the social history section quest_Id
  familyHistoryQuestionId: number = 0; // Track the family history section quest_Id
  allergiesQuestionId: number = 0; // Track the allergies section quest_Id
  medicalHistoryQuestionId: number = 0; // Track the medical history section quest_Id
  vitalSignsQuestionId: number = 0; // Track the vital signs section quest_Id
  immunizationsQuestionId: number = 0; // Track the immunizations section quest_Id

  // Properties to store IDs only during restoration phase
  restoredSocialHistoryIds: number[] = [];
  restoredFamilyHistoryIds: number[] = [];
  restoredAllergiesIds: number[] = [];
  restoredMedicalHistoryIds: number[] = [];
  restoredVitalSignsIds: number[] = [];
  restoredImmunizationsIds: number[] = [];

  cacheItems: string[] = ['Provider'];
  private subscriptions: Subscription[] = [];

  isTemplatePreSelected: boolean = false;
  preSelectedProvider: number = 0;
  preSelectedTemplate: number = 0;
  SelectedVisit: any;

  // Edit mode support
  private noteId: number = 0;
  private existingNoteHtml: string = '';

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
    private sanitizer: DomSanitizer
  ) {
    this.clinicalForm = this.fb.group({
      provider: [null, Validators.required],
      note: [null],
      description: [''],
      noteTitle: ['', Validators.required]
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

      // Edit existing structured note
      if (params['noteId']) {
        const id = Number(params['noteId']);
        if (id) {
          this.loadExistingNote(id);
        }
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
  GetNotesTemplate(noteId: any) {
    if (noteId == null || noteId == undefined) noteId = 0;

    this.selectedNotes = Number(noteId) || 0;
    this.dataquestion = [];
    this.viewquestion = false;
    this.nodeData = [];
    if (noteId != null && noteId != undefined && noteId != 0) {
      this.loader.show();

      this.clinicalApiService.GetNotesTemplate(noteId).then((res: any) => {
        debugger;
        this.dataquestion = res;
        this.viewquestion = true;
        this.nodeData = res;

        // Detect and store social history section quest_Id
        this.detectSocialHistorySection();

        // Set the note title in the form
        this.clinicalForm.patchValue({
          noteTitle: res?.node?.noteTitle || ''
        });
        // show note preview immediately for real-time updates
        this.viewNoteResponse = true;
        this.loader.hide();
      }).catch(() =>
        Swal.fire('Error', 'Error loading template', 'error')
      ).finally(() => this.loader.hide());
    }
  }

  /**
   * Detect and store the quest_Id of the Social History and Family History sections
   */
  private detectSocialHistorySection(): void {
    const questions = this.dataquestion?.node?.questions || [];

    // Detect Social History section
    const socialHistorySection = questions.find((q: any) => {
      const title = q.quest_Title?.toLowerCase().trim().replace(/:/g, '');
      return title === 'social history';
    });

    if (socialHistorySection) {
      this.socialHistoryQuestionId = socialHistorySection.quest_Id;
      console.log('✅ Detected Social History Section ID:', this.socialHistoryQuestionId);
    } else {
      this.socialHistoryQuestionId = 0;
      console.log('⚠️ Social history section not found in template');
    }

    // Detect Family History section
    const familyHistorySection = questions.find((q: any) => {
      const title = q.quest_Title?.toLowerCase().trim().replace(/:/g, '');
      return title === 'family history';
    });

    if (familyHistorySection) {
      this.familyHistoryQuestionId = familyHistorySection.quest_Id;
      console.log('✅ Detected Family History Section ID:', this.familyHistoryQuestionId);
    } else {
      this.familyHistoryQuestionId = 0;
      console.log('⚠️ Family history section not found in template');
    }

    // Detect Allergies section
    const allergiesSection = questions.find((q: any) => {
      const title = q.quest_Title?.toLowerCase().trim().replace(/:/g, '');
      return title === 'allergies';
    });

    if (allergiesSection) {
      this.allergiesQuestionId = allergiesSection.quest_Id;
      console.log('✅ Detected Allergies Section ID:', this.allergiesQuestionId);
    } else {
      this.allergiesQuestionId = 0;
      console.log('⚠️ Allergies section not found in template');
    }

    // Detect Medical History section
    const medicalHistorySection = questions.find((q: any) => {
      const title = q.quest_Title?.toLowerCase().trim().replace(/:/g, '');
      return title === 'medical history';
    });

    if (medicalHistorySection) {
      this.medicalHistoryQuestionId = medicalHistorySection.quest_Id;
      console.log('✅ Detected Medical History Section ID:', this.medicalHistoryQuestionId);
    } else {
      this.medicalHistoryQuestionId = 0;
      console.log('⚠️ Medical history section not found in template');
    }

    // Detect Vital Signs section
    const vitalSignsSection = questions.find((q: any) => {
      const title = q.quest_Title?.toLowerCase().trim().replace(/:/g, '');
      return title === 'vital signs';
    });

    if (vitalSignsSection) {
      this.vitalSignsQuestionId = vitalSignsSection.quest_Id;
      console.log('✅ Detected Vital Signs Section ID:', this.vitalSignsQuestionId);
    } else {
      this.vitalSignsQuestionId = 0;
      console.log('⚠️ Vital signs section not found in template');
    }

    // Detect Immunizations section
    const immunizationsSection = questions.find((q: any) => {
      const title = q.quest_Title?.toLowerCase().trim().replace(/:/g, '');
      return title === 'immunizations';
    });

    if (immunizationsSection) {
      this.immunizationsQuestionId = immunizationsSection.quest_Id;
      console.log('✅ Detected Immunizations Section ID:', this.immunizationsQuestionId);
    } else {
      this.immunizationsQuestionId = 0;
      console.log('⚠️ Immunizations section not found in template');
    }
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
          Swal.fire('Error', 'Unable to load structured note for editing.', 'error');
          return;
        }
        debugger;

        // Normalize answeredNotesTemplate so it matches the same shape as GetNotesTemplate
        let answeredTemplate: any = note.answeredNotesTemplate;

        // If backend sends JSON string, parse it
        if (typeof answeredTemplate === 'string') {
          try {
            answeredTemplate = JSON.parse(answeredTemplate);
          } catch (e) {
            console.error('Failed to parse answeredNotesTemplate JSON', e);
          }
        }

        // If we only have questions without the { node: { ... } } wrapper, wrap it
        if (answeredTemplate && !answeredTemplate.node && (answeredTemplate.questions || Array.isArray(answeredTemplate))) {
          const questions = answeredTemplate[0].questions || answeredTemplate;
          const titleFromTemplate = answeredTemplate[0].noteTitle || '';

          answeredTemplate = {
            node: {
              noteTitle: titleFromTemplate || note.notesTitle || '',
              questions: questions
            }
          };
        }

        this.dataquestion = answeredTemplate;
        this.viewquestion = true;
        this.nodeData = answeredTemplate;

        // Detect social history section for editing
        this.detectSocialHistorySection();

        // Store id for update payload
        this.noteId = note.noteId || note.id || 0;

        // Update MRN and visit if available
        this.mrNo = note.mrno || this.mrNo;
        if (note.visitAcNo && (!this.SelectedVisit || !this.SelectedVisit.appointmentId)) {
          this.SelectedVisit = { ...(this.SelectedVisit || {}), appointmentId: note.visitAcNo };
        }

        // Provider and description
        const providerCode = note.signedBy || note.providerId || null;
        this.preSelectedProvider = providerCode || this.preSelectedProvider;
        this.selectedProviders = this.preSelectedProvider || 0;

        // Set editable note title from loaded note
        this.clinicalForm.patchValue({
          noteTitle: note.notesTitle || note.noteTitle || '',
          provider: providerCode,

        });

        // Optionally repopulate description/provider if desired
        // this.clinicalForm.patchValue({
        //   provider: this.preSelectedProvider || null,
        //   note: null,
        //   description: note.description || ''
        // }, { emitEvent: false });

        // Capture existing HTML for Note tab
        this.existingNoteHtml = note.noteHtmltext || '';
        this.viewNoteResponse = !!this.existingNoteHtml;

        // Extract pre-selected social history, family history, and allergies IDs from the answered template
        this.extractSocialHistorySelections();
        this.extractFamilyHistorySelections();
        this.extractAllergiesSelections();
        this.extractMedicalHistorySelections();
        this.extractVitalSignsSelections();
        this.extractImmunizationsSelections();

        this.cdr.markForCheck();
      })
      .catch((error: any) => {
        console.error('Error loading structured EMR note by id:', error);
        Swal.fire('Error', 'Failed to load structured note for editing.', 'error');
      })
      .finally(() => {
        this.loader.hide();
      });
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

    // Use the editable note title from form
    let noteName = formValue.noteTitle || this.dataquestion?.node?.noteTitle || '';
    if (!noteName) {
      const selectedNote = this.clinicalNotes.find(note => note.pathId === noteId);
      noteName = selectedNote ? selectedNote.pathName : '';
    }

    // Collect filled values from the structured note
    const filledStructuredNote = this.collectFilledValues();

    // Build additional sections from selected social history items
    this.additionalSections = [];
    if (this.selectedSocialHistoryItems && this.selectedSocialHistoryItems.length > 0) {
      this.additionalSections.push({
        sectionTitle: 'Social History',
        type: 'SocialHistory',
        data: this.selectedSocialHistoryItems
      });
      console.log('✅ Added social history to additionalSections:', this.additionalSections);
    }

    // Generate HTML from structured note with filled values and additional sections
    const htmlContent = this.generateHtmlFromStructuredNote(filledStructuredNote);

    // Generate plain text note content from HTML for noteText
    const noteText = this.stripHtml(htmlContent);

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
      noteText: noteText,
      createdBy: createdBy,
      updatedBy: createdBy,
      signedBy: this.selectedProviders || 0,
      Id: this.noteId || 0,
      isEdit: this.noteId > 0,
      noteType: 'Structured',
      createdOn: new Date(),
      templateId: this.preSelectedTemplate,
      additionalSections: this.additionalSections
    };

    console.log('Payload:', payload);

    if (navigator.onLine) {
      this.loader.show();
      this.clinicalApiService.InsertNote(payload)
        .then((response: any) => {
          if (response != null && response != "") {
            // Store the note ID if it's a new note (preserve data, don't reset template)
            if (response.id || response.noteId) {
              this.noteId = response.id || response.noteId;
            }

            // Keep the current data intact - don't replace dataquestion with response
            // this.dataquestion = response;  // Commented out to retain data
            this.nodeData = response.node || response;
            this.viewquestion = true;
            this.viewNoteResponse = true;

            // Only clear description field
            this.clinicalForm.patchValue({ description: '' });

            Swal.fire('Success', 'Note saved successfully.', 'success');
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

      // Preserve metadata for special question types like SocialHistoryItem and FamilyHistoryItem
      if ((question as any).metadata) {
        (filledQuestion as any).metadata = { ...(question as any).metadata };
      }

      // Recursively process children
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

  private stripHtml(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  }

  generateAdditionalSectionsHtml(): string {
    let html = '';
    debugger;

    this.additionalSections.forEach(section => {
      if (section.type === 'SocialHistory') {
        html += `<div style="margin-top: 20px;">`;
        html += `<h3 style="font-weight: bold; text-decoration: underline;">${section.sectionTitle}</h3>`;
        html += `<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">`;
        html += `<thead>`;
        html += `<tr style="background-color: #f8f9fa;">`;
        html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Social History</th>`;
        html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Start Date</th>`;
        html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">End Date</th>`;
        html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Status</th>`;
        html += `</tr>`;
        html += `</thead>`;
        html += `<tbody>`;

        section.data.forEach((item: any) => {
          const startDate = item.startDate ? new Date(item.startDate).toLocaleDateString('en-GB') : '-';
          const endDate = item.endDate ? new Date(item.endDate).toLocaleDateString('en-GB') : '-';
          const status = item.active ? 'Active' : 'Inactive';

          html += `<tr>`;
          html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${item.socialHistory || '-'}</td>`;
          html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${startDate}</td>`;
          html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${endDate}</td>`;
          html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${status}</td>`;
          html += `</tr>`;
        });

        html += `</tbody>`;
        html += `</table>`;
        html += `</div>`;
      }
    });

    return html;
  }

  generateQuestionsHtml(questions: Question[]): string {
    let html = '';

    questions.forEach(question => {
      // Skip any question/section that has no filled data (matches Note tab behavior)
      if (!this.isSectionFilled(question)) {
        return;
      }

      if (question.type === 'Question Section') {
        html += `<div style="margin-top: 20px;">`;
        html += `<h4 style="font-weight: bold; margin-left: 20px;">${question.quest_Title}</h4>`;

        if (question.children && question.children.length > 0) {
          // Check if this section contains VitalSignsItem children - render as table
          const hasVitalSigns = question.children.some((child: any) => child.type === 'VitalSignsItem');

          if (hasVitalSigns) {
            // Render vital signs as a table
            html += `<div style="margin-left: 20px; margin-top: 10px;">`;
            html += `<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">`;
            html += `<thead style="background-color: #17a2b8; color: white;">`;
            html += `<tr>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Date</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Temp (°C)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Pulse (bpm)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Resp (/min)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">BP (mmHg)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">SpO2 (%)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Height (cm)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Weight (kg)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">BMI</th>`;
            html += `</tr>`;
            html += `</thead>`;
            html += `<tbody>`;

            question.children.forEach((child: any) => {
              if (child.type === 'VitalSignsItem') {
                const metadata = child.metadata || {};
                const entryDate = this.formatDate(metadata.entryDate);
                const temperature = metadata.temperature || 'N/A';
                const pulseRate = metadata.pulseRate || 'N/A';
                const respirationRate = metadata.respirationRate || 'N/A';
                const bpSystolic = metadata.bpSystolic || 'N/A';
                const bpDiastolic = metadata.bpDiastolic || 'N/A';
                const bp = `${bpSystolic}/${bpDiastolic}`;
                const spO2 = metadata.spO2 || 'N/A';
                const height = metadata.height || 'N/A';
                const weight = metadata.weight || 'N/A';
                const bmi = metadata.bmi || 'N/A';

                html += `<tr>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${entryDate}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${temperature}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${pulseRate}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${respirationRate}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${bp}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${spO2}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${height}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${weight}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${bmi}</td>`;
                html += `</tr>`;
              }
            });

            html += `</tbody>`;
            html += `</table>`;
            html += `</div>`;
          } else {
            // Render other sections normally
            html += `<div style="display: flex; flex-wrap: wrap; margin-left: 20px;">`;
            html += this.generateQuestionsHtml(question.children);
            html += `</div>`;
          }
        }
        html += `</div>`;
      } else if (question.type === 'SocialHistoryItem') {
        // Handle social history items specifically with metadata
        const metadata = (question as any).metadata || {};
        const socialHistory = metadata.socialHistory || question.quest_Title || 'N/A';
        const startDate = this.formatDate(metadata.startDate);
        const endDate = this.formatDate(metadata.endDate);
        const status = metadata.active ? 'Active' : 'Inactive';

        html += `<div style="margin-left: 40px; margin-top: 8px; border-left: 3px solid #007bff; padding-left: 15px;">`;
        html += `<strong>• ${socialHistory}</strong>`;
        html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
        html += `Start Date: ${startDate} | End Date: ${endDate} | Status: ${status}`;
        html += `</div>`;
        html += `</div>`;
      } else if (question.type === 'FamilyHistoryItem') {
        // Handle family history items specifically with metadata
        console.log('🏥 [HTML Generation] Processing FamilyHistoryItem:', question);
        const metadata = (question as any).metadata || {};
        console.log('🏥 [HTML Generation] Metadata:', metadata);
        const relationship = metadata.relationship || 'N/A';
        const problem = metadata.problem || 'N/A';
        const status = metadata.active ? 'Active' : 'Inactive';

        html += `<div style="margin-left: 40px; margin-top: 8px; border-left: 3px solid #28a745; padding-left: 15px;">`;
        html += `<strong>• ${relationship} - ${problem}</strong>`;
        html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
        html += `Status: ${status}`;
        html += `</div>`;
        html += `</div>`;
      } else if (question.type === 'AllergiesItem') {
        // Handle allergies items specifically with metadata
        const metadata = (question as any).metadata || {};
        const allergen = metadata.allergen || 'N/A';
        const allergyType = metadata.allergyType || 'N/A';
        const severity = metadata.severity || 'N/A';
        const reaction = metadata.reaction || 'N/A';
        const startDate = this.formatDate(metadata.startDate);
        const endDate = this.formatDate(metadata.endDate);
        const status = metadata.status || 'N/A';

        html += `<div style="margin-left: 40px; margin-top: 8px; border-left: 3px solid #dc3545; padding-left: 15px;">`;
        html += `<strong>• ${allergen} (${allergyType})</strong>`;
        html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
        html += `Severity: ${severity} | Reaction: ${reaction}<br>`;
        html += `Start: ${startDate} | End: ${endDate} | Status: ${status}`;
        html += `</div>`;
        html += `</div>`;
      } else if (question.type === 'MedicalHistoryItem') {
        // Handle medical history items specifically with metadata
        const metadata = (question as any).metadata || {};
        const problem = metadata.problem || 'N/A';
        const icdCode = metadata.icdCode || 'N/A';
        const providerName = metadata.providerName || 'N/A';
        const comments = metadata.comments || '';
        const status = metadata.status || 'N/A';
        const startDate = this.formatDate(metadata.startDate);
        const endDate = this.formatDate(metadata.endDate);
        const confidential = metadata.confidential ? 'Yes' : 'No';

        html += `<div style="margin-left: 40px; margin-top: 8px; border-left: 3px solid #6f42c1; padding-left: 15px;">`;
        html += `<strong>• ${problem} (${icdCode})</strong>`;
        html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
        html += `Provider: ${providerName} | Status: ${status} | Confidential: ${confidential}<br>`;
        if (comments) html += `Comments: ${comments}<br>`;
        html += `Start: ${startDate} | End: ${endDate}`;
        html += `</div>`;
        html += `</div>`;
      } else if (question.type === 'VitalSignsItem') {
        // Handle vital signs items specifically with metadata
        const metadata = (question as any).metadata || {};
        const entryDate = this.formatDate(metadata.entryDate);
        const temperature = metadata.temperature || 'N/A';
        const pulseRate = metadata.pulseRate || 'N/A';
        const respirationRate = metadata.respirationRate || 'N/A';
        const bpSystolic = metadata.bpSystolic || 'N/A';
        const bpDiastolic = metadata.bpDiastolic || 'N/A';
        const spO2 = metadata.spO2 || 'N/A';
        const height = metadata.height || 'N/A';
        const weight = metadata.weight || 'N/A';
        const bmi = metadata.bmi || 'N/A';

        html += `<div style="margin-left: 40px; margin-top: 8px; border-left: 3px solid #17a2b8; padding-left: 15px;">`;
        html += `<strong>• Vital Signs - ${entryDate}</strong>`;
        html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
        html += `Temp: ${temperature}°C | Pulse: ${pulseRate} bpm | Resp: ${respirationRate} /min<br>`;
        html += `BP: ${bpSystolic}/${bpDiastolic} mmHg | SpO2: ${spO2}% | Height: ${height} cm | Weight: ${weight} kg | BMI: ${bmi}`;
        html += `</div>`;
        html += `</div>`;
      } else if (question.type === 'ImmunizationsItem') {
        // Handle immunizations items specifically with metadata
        const metadata = (question as any).metadata || {};
        const immTypeName = metadata.immTypeName || 'Unknown Type';
        const providerName = metadata.providerName || 'N/A';
        const isOutsideClinic = metadata.isOutsideClinic || false;
        const providerText = isOutsideClinic ? `${providerName} (Outside Clinic)` : providerName;
        const dose = metadata.dose || 'N/A';
        const routeName = metadata.routeName || 'N/A';
        const startDate = this.formatDate(metadata.startDate);
        const nextInjectionDate = this.formatDate(metadata.nextInjectionDate);
        const siteName = metadata.siteName || 'N/A';
        const statusText = metadata.status === 1 ? 'Active' : metadata.status === 0 ? 'Inactive' : 'N/A';

        html += `<div style="margin-left: 40px; margin-top: 8px; border-left: 3px solid #fd7e14; padding-left: 15px;">`;
        html += `<strong>• ${immTypeName} - ${startDate}</strong>`;
        html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
        html += `Provider: ${providerText} | Dose: ${dose} | Route: ${routeName}<br>`;
        html += `Site: ${siteName} | Next Date: ${nextInjectionDate} | Status: ${statusText}`;
        html += `</div>`;
        html += `</div>`;
      } else if (question.type === 'TextBox') {
        html += `<div style="display: inline-block; margin-right: 20px; margin-bottom: 15px; width: calc(25% - 20px); vertical-align: top;">`;
        html += `<div style="margin-bottom: 5px;"><strong>${question.quest_Title}:</strong></div>`;
        html += `<div>${question.answer || ''}</div>`;
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

  refreshAdditionalSections(): void {
    this.additionalSections = [];
    console.log('🔄 [ClinicalNote] Refreshing additional sections');
    console.log('🔍 Selected social history items:', this.selectedSocialHistoryItems);
    console.log('🔍 Selected family history items:', this.selectedFamilyHistoryItems);

    // Use the stored selectedSocialHistoryItems instead of ViewChild reference
    if (this.selectedSocialHistoryItems && this.selectedSocialHistoryItems.length > 0) {
      const socialHistoryData = {
        sectionTitle: 'Social History',
        type: 'SocialHistory',
        data: this.selectedSocialHistoryItems
      };

      this.additionalSections.push(socialHistoryData);
      console.log('✅ Added social history to additionalSections:', this.additionalSections);
    } else {
      console.log('❌ No social history items selected');
    }

    // Add family history to additional sections
    if (this.selectedFamilyHistoryItems && this.selectedFamilyHistoryItems.length > 0) {
      const familyHistoryData = {
        sectionTitle: 'Family History',
        type: 'FamilyHistory',
        data: this.selectedFamilyHistoryItems
      };

      this.additionalSections.push(familyHistoryData);
      console.log('✅ Added family history to additionalSections:', this.additionalSections);
    } else {
      console.log('❌ No family history items selected');
    }
  }

  getFormattedNoteHtml(): SafeHtml {
    debugger
    // Prefer live structured template data when available (so edits reflect immediately)
    const questions = this.nodeData?.node?.questions || this.nodeData?.questions;
    const title = this.nodeData?.node?.noteTitle || this.nodeData?.noteTitle || '';

    if (Array.isArray(questions) && questions.length > 0) {
      let html = `<h2 style="margin-top: 10px; font-weight: bold; margin-left: 10px; text-decoration-line: underline;">${title}</h2>`;

      questions.forEach((section: any) => {
        if (this.hasQuestionData(section)) {
          html += this.formatQuestion(section, 10);
        }
      });

      return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    // Fallback: use existing HTML from backend (e.g. when no structured template is available)
    if (this.noteId && this.existingNoteHtml) {
      return this.sanitizer.bypassSecurityTrustHtml(this.existingNoteHtml);
    }

    return this.sanitizer.bypassSecurityTrustHtml('');
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
          // Check if this section contains VitalSignsItem children - render as table
          const hasVitalSigns = filledChildren.some((child: any) => child.type === 'VitalSignsItem');

          if (hasVitalSigns) {
            // Render vital signs as a table in Note tab
            html += `<div style="margin-left: ${marginLeft + 20}px; margin-top: 10px;">`;
            html += `<table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">`;
            html += `<thead style="background-color: #17a2b8; color: white;">`;
            html += `<tr>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 6px; text-align: left;">Date</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">Temp (°C)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">Pulse (bpm)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">Resp (/min)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">BP (mmHg)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">SpO2 (%)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">Height (cm)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">Weight (kg)</th>`;
            html += `<th style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">BMI</th>`;
            html += `</tr>`;
            html += `</thead>`;
            html += `<tbody>`;

            filledChildren.forEach((child: any) => {
              if (child.type === 'VitalSignsItem') {
                const metadata = child.metadata || {};
                const entryDate = this.formatDate(metadata.entryDate);
                const temperature = metadata.temperature || 'N/A';
                const pulseRate = metadata.pulseRate || 'N/A';
                const respirationRate = metadata.respirationRate || 'N/A';
                const bpSystolic = metadata.bpSystolic || 'N/A';
                const bpDiastolic = metadata.bpDiastolic || 'N/A';
                const bp = `${bpSystolic}/${bpDiastolic}`;
                const spO2 = metadata.spO2 || 'N/A';
                const height = metadata.height || 'N/A';
                const weight = metadata.weight || 'N/A';
                const bmi = metadata.bmi || 'N/A';

                html += `<tr>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 6px;">${entryDate}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">${temperature}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">${pulseRate}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">${respirationRate}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">${bp}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">${spO2}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">${height}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">${weight}</td>`;
                html += `<td style="border: 1px solid #dee2e6; padding: 6px; text-align: center;">${bmi}</td>`;
                html += `</tr>`;
              }
            });

            html += `</tbody>`;
            html += `</table>`;
            html += `</div>`;
          } else {
            // Render other sections normally
            filledChildren.forEach((child: any) => {
              html += this.formatQuestion(child, marginLeft + 20);
            });
          }
        }
      }
    } else if (question.type === 'TextBox') {
      if (question.answer && typeof question.answer === 'string' && question.answer.trim()) {
        html += `<div style="margin-left: ${marginLeft}px; margin-bottom: 10px;">`;
        html += `<strong>${question.quest_Title}</strong> ${question.answer}`;
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
      if (question.answer === true || question.answer === 'true') {
        html += `<div style="margin-left: ${marginLeft}px; margin-bottom: 10px;">`;
        html += `<strong>${question.quest_Title}</strong>`;
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
    } else if (question.type === 'SocialHistoryItem') {
      // Handle social history items specifically with metadata
      const metadata = (question as any).metadata || {};
      const socialHistory = metadata.socialHistory || question.quest_Title || 'N/A';
      const startDate = this.formatDate(metadata.startDate);
      const endDate = this.formatDate(metadata.endDate);
      const status = metadata.active ? 'Active' : 'Inactive';

      html += `<div style="margin-left: ${marginLeft}px; margin-top: 8px; border-left: 3px solid #007bff; padding-left: 15px;">`;
      html += `<strong>• ${socialHistory}</strong>`;
      html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
      html += `Start Date: ${startDate} | End Date: ${endDate} | Status: ${status}`;
      html += `</div>`;
      html += `</div>`;
    } else if (question.type === 'FamilyHistoryItem') {
      // Handle family history items specifically with metadata
      console.log('🏥 [formatQuestion] Processing FamilyHistoryItem:', question);
      const metadata = (question as any).metadata || {};
      const relationship = metadata.relationship || 'N/A';
      const problem = metadata.problem || 'N/A';
      const status = metadata.active ? 'Active' : 'Inactive';

      html += `<div style="margin-left: ${marginLeft}px; margin-top: 8px; border-left: 3px solid #28a745; padding-left: 15px;">`;
      html += `<strong>• ${relationship} - ${problem}</strong>`;
      html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
      html += `Status: ${status}`;
      html += `</div>`;
      html += `</div>`;
    } else if (question.type === 'AllergiesItem') {
      // Handle allergies items specifically with metadata
      console.log('🏥 [formatQuestion] Processing AllergiesItem:', question);
      const metadata = (question as any).metadata || {};
      const allergen = metadata.allergen || 'N/A';
      const allergyType = metadata.allergyType || 'N/A';
      const severity = metadata.severity || 'N/A';
      const reaction = metadata.reaction || 'N/A';
      const startDate = this.formatDate(metadata.startDate);
      const endDate = this.formatDate(metadata.endDate);
      const status = metadata.status || 'N/A';

      html += `<div style="margin-left: ${marginLeft}px; margin-top: 8px; border-left: 3px solid #dc3545; padding-left: 15px;">`;
      html += `<strong>• ${allergen} (${allergyType})</strong>`;
      html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
      html += `Severity: ${severity} | Reaction: ${reaction}<br>`;
      html += `Start: ${startDate} | End: ${endDate} | Status: ${status}`;
      html += `</div>`;
      html += `</div>`;
    } else if (question.type === 'MedicalHistoryItem') {
      // Handle medical history items specifically with metadata
      console.log('🏥 [formatQuestion] Processing MedicalHistoryItem:', question);
      const metadata = (question as any).metadata || {};
      const problem = metadata.problem || 'N/A';
      const icdCode = metadata.icdCode || 'N/A';
      const providerName = metadata.providerName || 'N/A';
      const comments = metadata.comments || '';
      const status = metadata.status || 'N/A';
      const startDate = this.formatDate(metadata.startDate);
      const endDate = this.formatDate(metadata.endDate);
      const confidential = metadata.confidential ? 'Yes' : 'No';

      html += `<div style="margin-left: ${marginLeft}px; margin-top: 8px; border-left: 3px solid #6f42c1; padding-left: 15px;">`;
      html += `<strong>• ${problem} (${icdCode})</strong>`;
      html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
      html += `Provider: ${providerName} | Status: ${status} | Confidential: ${confidential}<br>`;
      if (comments) html += `Comments: ${comments}<br>`;
      html += `Start: ${startDate} | End: ${endDate}`;
      html += `</div>`;
      html += `</div>`;
    } else if (question.type === 'VitalSignsItem') {
      // Handle vital signs items specifically with metadata
      console.log('🏥 [formatQuestion] Processing VitalSignsItem:', question);
      const metadata = (question as any).metadata || {};
      const entryDate = this.formatDate(metadata.entryDate);
      const temperature = metadata.temperature || 'N/A';
      const pulseRate = metadata.pulseRate || 'N/A';
      const respirationRate = metadata.respirationRate || 'N/A';
      const bpSystolic = metadata.bpSystolic || 'N/A';
      const bpDiastolic = metadata.bpDiastolic || 'N/A';
      const spO2 = metadata.spO2 || 'N/A';
      const height = metadata.height || 'N/A';
      const weight = metadata.weight || 'N/A';
      const bmi = metadata.bmi || 'N/A';

      html += `<div style="margin-left: ${marginLeft}px; margin-top: 8px; border-left: 3px solid #17a2b8; padding-left: 15px;">`;
      html += `<strong>• Vital Signs - ${entryDate}</strong>`;
      html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
      html += `Temp: ${temperature}°C | Pulse: ${pulseRate} bpm | Resp: ${respirationRate} /min<br>`;
      html += `BP: ${bpSystolic}/${bpDiastolic} mmHg | SpO2: ${spO2}% | Height: ${height} cm | Weight: ${weight} kg | BMI: ${bmi}`;
      html += `</div>`;
      html += `</div>`;
    } else if (question.type === 'ImmunizationsItem') {
      // Handle immunizations items specifically with metadata
      console.log('💉 [formatQuestion] Processing ImmunizationsItem:', question);
      const metadata = (question as any).metadata || {};
      const immTypeName = metadata.immTypeName || 'Unknown Type';
      const providerName = metadata.providerName || 'N/A';
      const isOutsideClinic = metadata.isOutsideClinic || false;
      const providerText = isOutsideClinic ? `${providerName} (Outside Clinic)` : providerName;
      const dose = metadata.dose || 'N/A';
      const routeName = metadata.routeName || 'N/A';
      const startDate = this.formatDate(metadata.startDate);
      const nextInjectionDate = this.formatDate(metadata.nextInjectionDate);
      const siteName = metadata.siteName || 'N/A';
      const statusText = metadata.status === 1 ? 'Active' : metadata.status === 0 ? 'Inactive' : 'N/A';

      html += `<div style="margin-left: ${marginLeft}px; margin-top: 8px; border-left: 3px solid #fd7e14; padding-left: 15px;">`;
      html += `<strong>• ${immTypeName} - ${startDate}</strong>`;
      html += `<div style="margin-left: 15px; margin-top: 4px; color: #6c757d; font-size: 0.9rem;">`;
      html += `Provider: ${providerText} | Dose: ${dose} | Route: ${routeName}<br>`;
      html += `Site: ${siteName} | Next Date: ${nextInjectionDate} | Status: ${statusText}`;
      html += `</div>`;
      html += `</div>`;
    }

    return html;
  }

  private hasQuestionData(question: any): boolean {
    // For social history, family history, allergies, medical history, vital signs, and immunizations items, always show if they exist
    if (question.type === 'SocialHistoryItem' || question.type === 'FamilyHistoryItem' || question.type === 'AllergiesItem' || question.type === 'MedicalHistoryItem' || question.type === 'VitalSignsItem' || question.type === 'ImmunizationsItem') {
      return true;
    }

    // For checkboxes, only return true if checked
    if (question.type === 'CheckBox') {
      const isChecked = question.answer === true || question.answer === 'true';
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

  getSelectedSocialHistoryIds(): number[] {
    return this.restoredSocialHistoryIds;
  }

  getSelectedFamilyHistoryIds(): number[] {
    return this.restoredFamilyHistoryIds;
  }

  getSelectedAllergiesIds(): number[] {
    return this.restoredAllergiesIds;
  }

  getSelectedMedicalHistoryIds(): number[] {
    return this.restoredMedicalHistoryIds;
  }

  getSelectedVitalSignsIds(): number[] {
    return this.restoredVitalSignsIds;
  }

  getSelectedImmunizationsIds(): number[] {
    return this.restoredImmunizationsIds;
  }

  // Update the model when a child emits an answer change (string or boolean for checkboxes)
  onAnswerChange(value: string | boolean, question: any) {
    if (question) {
      question.answer = value ?? '';
    }
    // this.cdr.markForCheck();
  }

  // Handle social history selection changes
  onSocialHistorySelectionChanged(selectedItems: any[]): void {
    console.log('📥 [ClinicalNote] Received social history selections:', selectedItems);

    // Clear restored IDs on user interaction to prevent feedback loop
    this.restoredSocialHistoryIds = [];

    // Store selected items to prevent loss during re-renders
    this.selectedSocialHistoryItems = selectedItems;

    // Find the Social history section in the template using the stored quest_Id
    const questions = this.dataquestion?.node?.questions || [];
    const socialHistorySection = questions.find((q: any) =>
      q.quest_Id === this.socialHistoryQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'social history'
    );

    if (socialHistorySection) {
      console.log('✅ Found Social history section:', socialHistorySection);

      // Clear existing children
      socialHistorySection.children = [];

      // Add selected social history items as children
      selectedItems.forEach((item, index) => {
        const childQuestion = {
          quest_Id: Number(item.shid) || (10000000 + index), // Use shid as unique ID
          quest_Title: item.socialHistory || 'Social History Item',
          type: 'SocialHistoryItem',
          parent_Id: socialHistorySection.quest_Id,
          answer: `${item.socialHistory} (${this.formatDate(item.startDate)} - ${this.formatDate(item.endDate)})`,
          children: [],
          metadata: {
            shid: item.shid,
            socialHistory: item.socialHistory,
            startDate: item.startDate,
            endDate: item.endDate,
            active: item.active
          }
        };

        socialHistorySection.children.push(childQuestion);
      });

      console.log('✅ Updated Social history section with', socialHistorySection.children.length, 'children');

      // Synchronize nodeData with dataquestion for the Note tab
      if (this.nodeData?.node?.questions) {
        const nodeDataSection = this.nodeData.node.questions.find((q: any) =>
          q.quest_Id === this.socialHistoryQuestionId ||
          q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'social history'
        );
        if (nodeDataSection) {
          nodeDataSection.children = JSON.parse(JSON.stringify(socialHistorySection.children));
          console.log('✅ Synchronized nodeData with social history children');
        }
      }

      // Force change detection to update the view
      this.cdr.detectChanges();
    } else {
      console.warn('⚠️ Social history section not found in template');
      console.log('Available sections:', questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
    }
  }

  onFamilyHistorySelectionChanged(selectedItems: any[]): void {
    console.log('📥 [ClinicalNote] Received family history selections:', selectedItems);

    // Clear restored IDs on user interaction to prevent feedback loop
    this.restoredFamilyHistoryIds = [];

    // Store selected items to prevent loss during re-renders
    this.selectedFamilyHistoryItems = selectedItems;

    // Find the Family history section in the template using the stored quest_Id
    const questions = this.dataquestion?.node?.questions || [];
    const familyHistorySection = questions.find((q: any) =>
      q.quest_Id === this.familyHistoryQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'family history'
    );

    if (familyHistorySection) {
      console.log('✅ Found Family history section:', familyHistorySection);

      // Clear existing children
      familyHistorySection.children = [];

      // Add selected family history items as children
      selectedItems.forEach((item, index) => {
        const childQuestion = {
          quest_Id: Number(item.fhid) || (20000000 + index), // Use fhid as unique ID
          quest_Title: `${item.relationship || 'Family Member'} - ${item.problem || 'Unknown Condition'}`,
          type: 'FamilyHistoryItem',
          parent_Id: familyHistorySection.quest_Id,
          answer: `${item.relationship || 'N/A'}: ${item.problem || 'N/A'} (${item.active ? 'Active' : 'Inactive'})`,
          children: [],
          metadata: {
            fhid: item.fhid,
            relationship: item.relationship,
            problem: item.problem,
            active: item.active
          }
        };

        familyHistorySection.children.push(childQuestion);
      });

      console.log('✅ Updated Family history section with', familyHistorySection.children.length, 'children');
      console.log('📋 Family history children:', JSON.stringify(familyHistorySection.children, null, 2));

      // Synchronize nodeData with dataquestion for the Note tab
      if (this.nodeData?.node?.questions) {
        const nodeDataSection = this.nodeData.node.questions.find((q: any) =>
          q.quest_Id === this.familyHistoryQuestionId ||
          q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'family history'
        );
        if (nodeDataSection) {
          nodeDataSection.children = JSON.parse(JSON.stringify(familyHistorySection.children));
          console.log('✅ Synchronized nodeData with family history children');
          console.log('📋 nodeData family history children:', JSON.stringify(nodeDataSection.children, null, 2));
        } else {
          console.warn('⚠️ Family history section not found in nodeData');
          console.log('Available nodeData sections:', this.nodeData.node.questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
        }
      } else {
        console.warn('⚠️ nodeData.node.questions is not available');
        console.log('nodeData structure:', this.nodeData);
      }

      // Force change detection to update the view
      this.cdr.detectChanges();
    } else {
      console.warn('⚠️ Family history section not found in template');
      console.log('Available sections:', questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
    }
  }

  onAllergiesSelectionChanged(selectedItems: any[]): void {
    console.log('📥 [ClinicalNote] Received allergies selections:', selectedItems);

    // Clear restored IDs on user interaction to prevent feedback loop
    this.restoredAllergiesIds = [];

    // Store selected items to prevent loss during re-renders
    this.selectedAllergiesItems = selectedItems;

    // Find the Allergies section in the template using the stored quest_Id
    const questions = this.dataquestion?.node?.questions || [];
    const allergiesSection = questions.find((q: any) =>
      q.quest_Id === this.allergiesQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'allergies'
    );

    if (allergiesSection) {
      console.log('✅ Found Allergies section:', allergiesSection);

      // Clear existing children
      allergiesSection.children = [];

      // Add selected allergies items as children
      selectedItems.forEach((item, index) => {
        const childQuestion = {
          quest_Id: Number(item.allergyId) || (30000000 + index), // Use allergyId as unique ID
          quest_Title: `${item.allergen || 'Unknown Allergen'} (${item.allergyType || 'Unknown Type'})`,
          type: 'AllergiesItem',
          parent_Id: allergiesSection.quest_Id,
          answer: `${item.allergen || 'N/A'}: ${item.reaction || 'N/A'} - Severity: ${item.severity || 'N/A'} (${item.status})`,
          children: [],
          metadata: {
            allergyId: item.allergyId,
            allergen: item.allergen,
            allergyType: item.allergyType,
            severity: item.severity,
            reaction: item.reaction,
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.status
          }
        };

        allergiesSection.children.push(childQuestion);
      });

      console.log('✅ Updated Allergies section with', allergiesSection.children.length, 'children');
      console.log('📋 Allergies children:', JSON.stringify(allergiesSection.children, null, 2));

      // Synchronize nodeData with dataquestion for the Note tab
      if (this.nodeData?.node?.questions) {
        const nodeDataSection = this.nodeData.node.questions.find((q: any) =>
          q.quest_Id === this.allergiesQuestionId ||
          q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'allergies'
        );
        if (nodeDataSection) {
          nodeDataSection.children = JSON.parse(JSON.stringify(allergiesSection.children));
          console.log('✅ Synchronized nodeData with allergies children');
          console.log('📋 nodeData allergies children:', JSON.stringify(nodeDataSection.children, null, 2));
        } else {
          console.warn('⚠️ Allergies section not found in nodeData');
          console.log('Available nodeData sections:', this.nodeData.node.questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
        }
      } else {
        console.warn('⚠️ nodeData.node.questions is not available');
        console.log('nodeData structure:', this.nodeData);
      }

      // Force change detection to update the view
      this.cdr.detectChanges();
    } else {
      console.warn('⚠️ Allergies section not found in template');
      console.log('Available sections:', questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
    }
  }

  onMedicalHistorySelectionChanged(selectedItems: any[]): void {
    console.log('📥 [ClinicalNote] Received medical history selections:', selectedItems);

    // Clear restored IDs on user interaction to prevent feedback loop
    this.restoredMedicalHistoryIds = [];

    // Store selected items to prevent loss during re-renders
    this.selectedMedicalHistoryItems = selectedItems;

    // Find the Medical History section in the template using the stored quest_Id
    const questions = this.dataquestion?.node?.questions || [];
    const medicalHistorySection = questions.find((q: any) =>
      q.quest_Id === this.medicalHistoryQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'medical history'
    );

    if (medicalHistorySection) {
      console.log('✅ Found Medical History section:', medicalHistorySection);

      // Clear existing children
      medicalHistorySection.children = [];

      // Add selected medical history items as children
      selectedItems.forEach((item, index) => {
        const childQuestion = {
          quest_Id: Number(item.problemId) || (40000000 + index), // Use problemId as unique ID
          quest_Title: `${item.problem || 'Unknown Problem'} (${item.icdCode || 'No Code'})`,
          type: 'MedicalHistoryItem',
          parent_Id: medicalHistorySection.quest_Id,
          answer: `${item.problem || 'N/A'} - Status: ${item.status || 'N/A'}`,
          children: [],
          metadata: {
            problemId: item.problemId,
            providerName: item.providerName,
            problem: item.problem,
            comments: item.comments,
            confidential: item.confidential,
            status: item.status,
            startDate: item.startDate,
            endDate: item.endDate,
            icdCode: item.icdCode
          }
        };

        medicalHistorySection.children.push(childQuestion);
      });

      console.log('✅ Updated Medical History section with', medicalHistorySection.children.length, 'children');
      console.log('📋 Medical History children:', JSON.stringify(medicalHistorySection.children, null, 2));

      // Synchronize nodeData with dataquestion for the Note tab
      if (this.nodeData?.node?.questions) {
        const nodeDataSection = this.nodeData.node.questions.find((q: any) =>
          q.quest_Id === this.medicalHistoryQuestionId ||
          q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'medical history'
        );
        if (nodeDataSection) {
          nodeDataSection.children = JSON.parse(JSON.stringify(medicalHistorySection.children));
          console.log('✅ Synchronized nodeData with medical history children');
          console.log('📋 nodeData medical history children:', JSON.stringify(nodeDataSection.children, null, 2));
        } else {
          console.warn('⚠️ Medical History section not found in nodeData');
          console.log('Available nodeData sections:', this.nodeData.node.questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
        }
      } else {
        console.warn('⚠️ nodeData.node.questions is not available');
        console.log('nodeData structure:', this.nodeData);
      }

      // Force change detection to update the view
      this.cdr.detectChanges();
    } else {
      console.warn('⚠️ Medical History section not found in template');
      console.log('Available sections:', questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
    }
  }

  onVitalSignsSelectionChanged(selectedItems: any[]): void {
    console.log('📥 [ClinicalNote] Received vital signs selections:', selectedItems);

    // Clear restored IDs on user interaction to prevent feedback loop
    this.restoredVitalSignsIds = [];

    // Store selected items to prevent loss during re-renders
    this.selectedVitalSignsItems = selectedItems;

    // Find the Vital Signs section in the template using the stored quest_Id
    const questions = this.dataquestion?.node?.questions || [];
    const vitalSignsSection = questions.find((q: any) =>
      q.quest_Id === this.vitalSignsQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'vital signs'
    );

    if (vitalSignsSection) {
      console.log('✅ Found Vital Signs section:', vitalSignsSection);

      // Clear existing children
      vitalSignsSection.children = [];

      // Add selected vital signs items as children
      selectedItems.forEach((item, index) => {
        const childQuestion = {
          quest_Id: Number(item.vitalId) || (50000000 + index), // Use vitalId as unique ID
          quest_Title: `Vital Signs - ${new Date(item.entryDate).toLocaleDateString()}`,
          type: 'VitalSignsItem',
          parent_Id: vitalSignsSection.quest_Id,
          answer: `Temp: ${item.temperature || 'N/A'}°C, HR: ${item.pulseRate || 'N/A'}, BP: ${item.bpSystolic || 'N/A'}/${item.bpDiastolic || 'N/A'}`,
          children: [],
          metadata: {
            vitalId: item.vitalId,
            entryDate: item.entryDate,
            temperature: item.temperature,
            pulseRate: item.pulseRate,
            respirationRate: item.respirationRate,
            bpSystolic: item.bpSystolic,
            bpDiastolic: item.bpDiastolic,
            spO2: item.spO2,
            height: item.height,
            weight: item.weight,
            bmi: item.bmi
          }
        };

        vitalSignsSection.children.push(childQuestion);
      });

      console.log('✅ Updated Vital Signs section with', vitalSignsSection.children.length, 'children');
      console.log('📋 Vital Signs children:', JSON.stringify(vitalSignsSection.children, null, 2));

      // Synchronize nodeData with dataquestion for the Note tab
      if (this.nodeData?.node?.questions) {
        const nodeDataSection = this.nodeData.node.questions.find((q: any) =>
          q.quest_Id === this.vitalSignsQuestionId ||
          q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'vital signs'
        );
        if (nodeDataSection) {
          nodeDataSection.children = JSON.parse(JSON.stringify(vitalSignsSection.children));
          console.log('✅ Synchronized nodeData with vital signs children');
          console.log('📋 nodeData vital signs children:', JSON.stringify(nodeDataSection.children, null, 2));
        } else {
          console.warn('⚠️ Vital Signs section not found in nodeData');
          console.log('Available nodeData sections:', this.nodeData.node.questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
        }
      } else {
        console.warn('⚠️ nodeData.node.questions is not available');
        console.log('nodeData structure:', this.nodeData);
      }

      // Force change detection to update the view
      this.cdr.detectChanges();
    } else {
      console.warn('⚠️ Vital Signs section not found in template');
      console.log('Available sections:', questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
    }
  }

  onImmunizationsSelectionChanged(selectedItems: any[]): void {
    console.log('📥 [ClinicalNote] Received immunizations selections:', selectedItems);

    // Clear restored IDs on user interaction to prevent feedback loop
    this.restoredImmunizationsIds = [];

    // Store selected items to prevent loss during re-renders
    this.selectedImmunizationsItems = selectedItems;

    // Find the Immunizations section in the template using the stored quest_Id
    const questions = this.dataquestion?.node?.questions || [];
    const immunizationsSection = questions.find((q: any) =>
      q.quest_Id === this.immunizationsQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'immunizations'
    );

    if (immunizationsSection) {
      console.log('✅ Found Immunizations section:', immunizationsSection);

      // Clear existing children
      immunizationsSection.children = [];

      // Add selected immunizations items as children
      selectedItems.forEach((item, index) => {
        const providerText = item.isOutsideClinic ? `${item.providerName} (Outside Clinic)` : item.providerName;
        const dateText = item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A';

        const childQuestion = {
          quest_Id: Number(item.immunizationId) || (60000000 + index), // Use immunizationId as unique ID
          quest_Title: `${item.immTypeName} - ${dateText}`,
          type: 'ImmunizationsItem',
          parent_Id: immunizationsSection.quest_Id,
          answer: `${item.immTypeName} by ${providerText}`,
          children: [],
          metadata: {
            immunizationId: item.immunizationId,
            providerName: item.providerName,
            isOutsideClinic: item.isOutsideClinic,
            immTypeName: item.immTypeName,
            dose: item.dose,
            routeName: item.routeName,
            startDate: item.startDate,
            nextInjectionDate: item.nextInjectionDate,
            siteName: item.siteName,
            status: item.status
          }
        };

        immunizationsSection.children.push(childQuestion);
      });

      console.log('✅ Updated Immunizations section with', immunizationsSection.children.length, 'children');
      console.log('📋 Immunizations children:', JSON.stringify(immunizationsSection.children, null, 2));

      // Synchronize nodeData with dataquestion for the Note tab
      if (this.nodeData?.node?.questions) {
        const nodeDataSection = this.nodeData.node.questions.find((q: any) =>
          q.quest_Id === this.immunizationsQuestionId ||
          q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'immunizations'
        );
        if (nodeDataSection) {
          nodeDataSection.children = JSON.parse(JSON.stringify(immunizationsSection.children));
          console.log('✅ Synchronized nodeData with immunizations children');
          console.log('📋 nodeData immunizations children:', JSON.stringify(nodeDataSection.children, null, 2));
        } else {
          console.warn('⚠️ Immunizations section not found in nodeData');
          console.log('Available nodeData sections:', this.nodeData.node.questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
        }
      } else {
        console.warn('⚠️ nodeData.node.questions is not available');
        console.log('nodeData structure:', this.nodeData);
      }

      // Force change detection to update the view
      this.cdr.detectChanges();
    } else {
      console.warn('⚠️ Immunizations section not found in template');
      console.log('Available sections:', questions.map((q: any) => ({ id: q.quest_Id, title: q.quest_Title })));
    }
  }

  /**
   * Extract social history IDs from the loaded note to restore selections
   */
  private extractSocialHistorySelections(): void {
    const questions = this.dataquestion?.node?.questions || [];
    const socialHistorySection = questions.find((q: any) =>
      q.quest_Id === this.socialHistoryQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'social history'
    );

    if (socialHistorySection && socialHistorySection.children && socialHistorySection.children.length > 0) {
      // Extract social history items from children
      const socialHistoryItems = socialHistorySection.children
        .filter((child: any) => child.type === 'SocialHistoryItem' && child.metadata)
        .map((child: any) => ({
          shid: child.metadata.shid,
          socialHistory: child.metadata.socialHistory,
          startDate: child.metadata.startDate,
          endDate: child.metadata.endDate,
          active: child.metadata.active
        }));

      if (socialHistoryItems.length > 0) {
        console.log('✅ Extracted social history items for restoration:', socialHistoryItems);
        this.selectedSocialHistoryItems = socialHistoryItems;

        // Populate the restored IDs array for preSelectedIds binding
        this.restoredSocialHistoryIds = socialHistoryItems.map((item: any) => item.shid);
      }
    }
  }

  /**
   * Extract family history IDs from the loaded note to restore selections
   */
  private extractFamilyHistorySelections(): void {
    const questions = this.dataquestion?.node?.questions || [];
    const familyHistorySection = questions.find((q: any) =>
      q.quest_Id === this.familyHistoryQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'family history'
    );

    if (familyHistorySection && familyHistorySection.children && familyHistorySection.children.length > 0) {
      // Extract family history items from children
      const familyHistoryItems = familyHistorySection.children
        .filter((child: any) => child.type === 'FamilyHistoryItem' && child.metadata)
        .map((child: any) => ({
          fhid: child.metadata.fhid,
          relationship: child.metadata.relationship,
          problem: child.metadata.problem,
          active: child.metadata.active
        }));

      if (familyHistoryItems.length > 0) {
        console.log('✅ Extracted family history items for restoration:', familyHistoryItems);
        this.selectedFamilyHistoryItems = familyHistoryItems;

        // Populate the restored IDs array for preSelectedIds binding
        this.restoredFamilyHistoryIds = familyHistoryItems.map((item: any) => item.fhid);
      }
    }
  }

  /**
   * Extract allergies IDs from the loaded note to restore selections
   */
  private extractAllergiesSelections(): void {
    const questions = this.dataquestion?.node?.questions || [];
    const allergiesSection = questions.find((q: any) =>
      q.quest_Id === this.allergiesQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'allergies'
    );

    if (allergiesSection && allergiesSection.children && allergiesSection.children.length > 0) {
      // Extract allergies items from children
      const allergiesItems = allergiesSection.children
        .filter((child: any) => child.type === 'AllergiesItem' && child.metadata)
        .map((child: any) => ({
          allergyId: child.metadata.allergyId,
          allergen: child.metadata.allergen,
          allergyType: child.metadata.allergyType,
          severity: child.metadata.severity,
          reaction: child.metadata.reaction,
          startDate: child.metadata.startDate,
          endDate: child.metadata.endDate,
          status: child.metadata.status
        }));

      if (allergiesItems.length > 0) {
        console.log('✅ Extracted allergies items for restoration:', allergiesItems);
        this.selectedAllergiesItems = allergiesItems;

        // Populate the restored IDs array for preSelectedIds binding
        this.restoredAllergiesIds = allergiesItems.map((item: any) => item.allergyId);
      }
    }
  }

  private extractMedicalHistorySelections(): void {
    const questions = this.dataquestion?.node?.questions || [];
    const medicalHistorySection = questions.find((q: any) =>
      q.quest_Id === this.medicalHistoryQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'medical history'
    );

    if (medicalHistorySection && medicalHistorySection.children && medicalHistorySection.children.length > 0) {
      // Extract medical history items from children
      const medicalHistoryItems = medicalHistorySection.children
        .filter((child: any) => child.type === 'MedicalHistoryItem' && child.metadata)
        .map((child: any) => ({
          problemId: child.metadata.problemId,
          providerName: child.metadata.providerName,
          problem: child.metadata.problem,
          comments: child.metadata.comments,
          confidential: child.metadata.confidential,
          status: child.metadata.status,
          startDate: child.metadata.startDate,
          endDate: child.metadata.endDate,
          icdCode: child.metadata.icdCode
        }));

      if (medicalHistoryItems.length > 0) {
        console.log('✅ Extracted medical history items for restoration:', medicalHistoryItems);
        this.selectedMedicalHistoryItems = medicalHistoryItems;

        // Populate the restored IDs array for preSelectedIds binding
        this.restoredMedicalHistoryIds = medicalHistoryItems.map((item: any) => item.problemId);
      }
    }
  }

  private extractVitalSignsSelections(): void {
    const questions = this.dataquestion?.node?.questions || [];
    const vitalSignsSection = questions.find((q: any) =>
      q.quest_Id === this.vitalSignsQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'vital signs'
    );

    if (vitalSignsSection && vitalSignsSection.children && vitalSignsSection.children.length > 0) {
      // Extract vital signs items from children
      const vitalSignsItems = vitalSignsSection.children
        .filter((child: any) => child.type === 'VitalSignsItem' && child.metadata)
        .map((child: any) => ({
          vitalId: child.metadata.vitalId,
          entryDate: child.metadata.entryDate,
          temperature: child.metadata.temperature,
          pulseRate: child.metadata.pulseRate,
          respirationRate: child.metadata.respirationRate,
          bpSystolic: child.metadata.bpSystolic,
          bpDiastolic: child.metadata.bpDiastolic,
          spO2: child.metadata.spO2,
          height: child.metadata.height,
          weight: child.metadata.weight,
          bmi: child.metadata.bmi
        }));

      if (vitalSignsItems.length > 0) {
        console.log('✅ Extracted vital signs items for restoration:', vitalSignsItems);
        this.selectedVitalSignsItems = vitalSignsItems;

        // Populate the restored IDs array for preSelectedIds binding
        this.restoredVitalSignsIds = vitalSignsItems.map((item: any) => item.vitalId);
      }
    }
  }

  private extractImmunizationsSelections(): void {
    const questions = this.dataquestion?.node?.questions || [];
    const immunizationsSection = questions.find((q: any) =>
      q.quest_Id === this.immunizationsQuestionId ||
      q.quest_Title?.toLowerCase().trim().replace(/:/g, '') === 'immunizations'
    );

    if (immunizationsSection && immunizationsSection.children && immunizationsSection.children.length > 0) {
      // Extract immunizations items from children
      const immunizationsItems = immunizationsSection.children
        .filter((child: any) => child.type === 'ImmunizationsItem' && child.metadata)
        .map((child: any) => ({
          immunizationId: child.metadata.immunizationId,
          providerName: child.metadata.providerName,
          isOutsideClinic: child.metadata.isOutsideClinic,
          immTypeName: child.metadata.immTypeName,
          dose: child.metadata.dose,
          routeName: child.metadata.routeName,
          startDate: child.metadata.startDate,
          nextInjectionDate: child.metadata.nextInjectionDate,
          siteName: child.metadata.siteName,
          status: child.metadata.status
        }));

      if (immunizationsItems.length > 0) {
        console.log('✅ Extracted immunizations items for restoration:', immunizationsItems);
        this.selectedImmunizationsItems = immunizationsItems;

        // Populate the restored IDs array for preSelectedIds binding
        this.restoredImmunizationsIds = immunizationsItems.map((item: any) => item.immunizationId);
      }
    }
  }

  private formatDate(dateValue: any): string {
    if (!dateValue) return 'N/A';
    try {
      const d = new Date(dateValue);
      if (!isFinite(d.getTime())) return 'N/A';
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return 'N/A';
    }
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
    const questions = this.nodeData?.node?.questions || this.nodeData?.questions;
    if (Array.isArray(questions) && questions.length > 0) {
      const hasQuestionData = questions.some((q: any) => this.isSectionFilled(q));
      if (hasQuestionData) return true;
    }

    // Check if social history items are selected
    if (this.selectedSocialHistoryItems && this.selectedSocialHistoryItems.length > 0) {
      return true;
    }

    // Fallback: if we are in edit mode and only have existing HTML, treat as having data
    if (this.noteId && this.existingNoteHtml) {
      return true;
    }

    return false;
  }

  ngAfterViewInit(): void {
    // Component initialization complete
    console.log('✅ Component view initialized');
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
