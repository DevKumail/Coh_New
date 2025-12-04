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
import { SocialHistoryComponent } from '../social-history/social-history.component';
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
    QuestionViewComponent,
    SocialHistoryComponent
  ],
  selector: 'app-clinical-structured-note-create',
  templateUrl: './clinical-structured-note-create.component.html',
  styleUrls: ['./clinical-structured-note-create.component.scss']
})
export class ClinicalStructuredNoteCreateComponent implements OnInit, AfterViewInit {
  @ViewChild('socialHistory', { static: false }) socialHistoryComponent!: SocialHistoryComponent;

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

    // Add additional sections like social history
    if (this.additionalSections && this.additionalSections.length > 0) {
      html += this.generateAdditionalSectionsHtml();
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
          html += `<div style="display: flex; flex-wrap: wrap; margin-left: 20px;">`;
          html += this.generateQuestionsHtml(question.children);
          html += `</div>`;
        }
        html += `</div>`;
      } else if (question.type === 'SocialHistoryItem') {
        // Handle social history items specifically
        html += `<div style="margin-left: 40px; margin-top: 8px;">`;
        html += `<strong>• ${question.answer}</strong>`;
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
    console.log('🔍 socialHistoryComponent exists?', !!this.socialHistoryComponent);

    if (!this.socialHistoryComponent) {
      console.log('❌ socialHistoryComponent is null or undefined');
      return;
    }

    const socialHistoryData = this.socialHistoryComponent.getSelectedSocialHistoriesForNote();
    console.log('🔍 Social History Data:', socialHistoryData);
    console.log('🔍 Selected items count:', this.socialHistoryComponent.selectedSocialHistories?.size || 0);

    if (socialHistoryData && socialHistoryData.data && socialHistoryData.data.length > 0) {
      this.additionalSections.push(socialHistoryData);
      console.log('✅ Added to additionalSections:', this.additionalSections);
    } else {
      console.log('❌ No social history data to add');
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

      // Add additional sections to preview
      this.refreshAdditionalSections();
      if (this.additionalSections && this.additionalSections.length > 0) {
        html += this.generateAdditionalSectionsHtml();
      }

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
          filledChildren.forEach((child: any) => {
            html += this.formatQuestion(child, marginLeft + 20);
          });
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
    }

    return html;
  }

  private hasQuestionData(question: any): boolean {
    // For social history items, always show if they exist
    if (question.type === 'SocialHistoryItem') {
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
    return this.selectedSocialHistoryItems.map(item => item.shid);
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

    // Store selected items to prevent loss during re-renders
    this.selectedSocialHistoryItems = selectedItems;

    // Find the Social history section in the template
    const questions = this.dataquestion?.node?.questions || [];
    const socialHistorySection = questions.find((q: any) =>
      q.quest_Title?.toLowerCase().includes('social history')
    );

    if (socialHistorySection) {
      console.log('✅ Found Social history section:', socialHistorySection);

      // Clear existing children
      socialHistorySection.children = [];

      // Add selected social history items as children
      selectedItems.forEach((item, index) => {
        socialHistorySection.children.push({
          quest_Id: item.shid,
          quest_Title: item.socialHistory,
          type: 'SocialHistoryItem',
          parent_Id: socialHistorySection.quest_Id,
          answer: `${item.socialHistory} (${this.formatDate(item.startDate)} - ${this.formatDate(item.endDate)})`,
          children: [],
          metadata: {
            shid: item.shid,
            startDate: item.startDate,
            endDate: item.endDate,
            active: item.active
          }
        });
      });

      console.log('✅ Updated Social history section with children:', socialHistorySection.children);

      // Update nodeData as well for the Note tab
      if (this.nodeData?.node?.questions) {
        const nodeDataSection = this.nodeData.node.questions.find((q: any) =>
          q.quest_Title?.toLowerCase().includes('social history')
        );
        if (nodeDataSection) {
          nodeDataSection.children = [...socialHistorySection.children];
        }
      }

      console.log('✅ Updated nodeData with social history children');
      this.cdr.detectChanges();
    } else {
      console.warn('⚠️ Social history section not found in template');
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
    console.log('🔍 ViewChild socialHistoryComponent:', this.socialHistoryComponent);
    setTimeout(() => {
      console.log('🔍 ViewChild after timeout:', this.socialHistoryComponent);
    }, 1000);
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
