import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ImmunizationsComponent } from '../immunizations/immunizations.component';
import { MedicationComponent } from '../medication/medication.component';
import { VitalSignsComponent } from '../vital-signs/vital-signs.component';
import { AllergiesComponent } from '../allergies/allergies.component';
import { FamilyHistoryComponent } from '../family-history/family-history.component';
import { SocialHistoryComponent } from '../social-history/social-history.component';
import { ProblemComponent } from '../problem/problem.component';
import { ProblemListComponent } from '../problem-list/problem-list.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImmunizationsComponent,
    MedicationComponent,
    VitalSignsComponent,
    AllergiesComponent,
    FamilyHistoryComponent,
    SocialHistoryComponent,
    ProblemComponent,
    ProblemListComponent
  ],
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.scss']
})
export class QuestionViewComponent implements OnInit, AfterViewInit {
  @Input() question: any;
  @Input() form!: FormGroup; // optional reactive FormGroup from parent
  @Input() hasParent: boolean = false; // Track if question has a parent
  @Input() selectedSocialHistoryIds: number[] = [];
  @Input() selectedFamilyHistoryIds: number[] = [];
  @Input() selectedAllergiesIds: number[] = [];
  @Input() selectedMedicalHistoryIds: number[] = [];
  @Input() selectedVitalSignsIds: number[] = [];
  @Input() selectedImmunizationsIds: number[] = [];
  @Output() answerChange = new EventEmitter<string>();
  @Output() socialHistorySelectionChanged = new EventEmitter<any[]>();
  @Output() familyHistorySelectionChanged = new EventEmitter<any[]>();
  @Output() allergiesSelectionChanged = new EventEmitter<any[]>();
  @Output() medicalHistorySelectionChanged = new EventEmitter<any[]>();
  @Output() vitalSignsSelectionChanged = new EventEmitter<any[]>();
  @Output() immunizationsSelectionChanged = new EventEmitter<any[]>();

  @ViewChild(SocialHistoryComponent) socialHistoryComponent!: SocialHistoryComponent;
  @ViewChild(FamilyHistoryComponent) familyHistoryComponent!: FamilyHistoryComponent;
  @ViewChild(AllergiesComponent) allergiesComponent!: AllergiesComponent;
  @ViewChild(ProblemListComponent) problemListComponent!: ProblemListComponent;
  @ViewChild(VitalSignsComponent) vitalSignsComponent!: VitalSignsComponent;
  @ViewChild(ImmunizationsComponent) immunizationsComponent!: ImmunizationsComponent;  // Track collapse state for each section
  isCollapsed: boolean = true;

  // Hardcoded clinical flag to pass to all components
  readonly clinicalnote: boolean = true;

  constructor() { }

  ngOnInit(): void {
    // if a FormGroup is provided, ensure there's a control for this question
    if (this.form && this.question?.quest_Id != null) {
      const key = this.question.quest_Id.toString();
      if (!this.form.contains(key)) {
        const initial = this.question?.answer ?? (this.question.type === 'CheckBox' ? false : '');
        this.form.addControl(key, new FormControl(initial));
      }
    }

    // All questions start collapsed by default
    this.isCollapsed = true;
  }

  /**
   * Toggle collapse/expand state for all questions
   */
  toggleSection(): void {
    // Only toggle if this is a standalone question (no parent)
    if (!this.hasParent || this.isSection()) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  /**
   * Handle mouse enter event for hover effect
   */
  onMouseEnter(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.backgroundColor = 'var(--bs-gray-200, #e9ecef)';
    }
  }

  /**
   * Handle mouse leave event for hover effect
   */
  onMouseLeave(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.backgroundColor = 'var(--bs-light, #f8f9fa)';
    }
  }

  /**
   * Check if question has children
   */
  hasChildren(): boolean {
    return this.question?.children && this.question.children.length > 0;
  }

  /**
   * Check if this is a section or single question
   */
  isSection(): boolean {
    return this.question?.type === 'Question Section';
  }

  /**
   * Check if this is a single question (has no children and is not a section)
   */
  isSingleQuestion(): boolean {
    return !this.isSection() && !this.hasChildren();
  }

  /**
   * Check if the question content should be visible
   */
  shouldShowContent(): boolean {
    // For single questions without children, show content when expanded
    if (this.isSingleQuestion()) {
      return !this.isCollapsed;
    }
    // For sections with children, show children when expanded
    if (this.hasChildren()) {
      return !this.isCollapsed;
    }
    // For sections with custom components, show component when expanded
    return !this.isCollapsed;
  }

  /**
   * Check if checkbox is checked
   */
  isChecked(answer: any): boolean {
    return answer === true || answer === 'true' || answer === 1 || answer === '1';
  }

  /**
   * Handle checkbox change
   */
  onCheckboxChange(event: any, question: any): void {
    question.answer = event.target.checked;
  }

  /**
   * Handle text input change
   */
  onAnswerChange(event: any, question: any): void {
    question.answer = event.target.value;
  }

  /**
   * Handle input change and emit answerChange event
   */
  onInputChange(event: any) {
    const value = event?.target?.value || '';
    if (this.question) {
      this.question.answer = value;
      this.answerChange.emit(value);
    }
  }

  /**
   * Get the component selector for this section
   */
  getComponentSelector(): string {
    const sectionTitle = this.question?.quest_Title?.toLowerCase().trim();

    // Remove trailing colons and extra spaces
    const cleanTitle = sectionTitle?.replace(/:/g, '').trim();

    const componentMap: { [key: string]: string } = {
      'medical history': 'app-medical-history',
      'medications history': 'app-medication',
      'family history': 'app-family-history',
      'social history': 'app-social-history',
      'review of systems': 'app-review-of-systems',
      'allergies': 'app-allergies',
      'vital signs': 'app-vital-signs',
      'immunizations': 'app-immunizations',
      'problem': 'app-problem',
      'problems': 'app-problem'
    };

    const selector = componentMap[cleanTitle || ''] || '';
    console.log('🔍 Component Selector Debug:', {
      sectionTitle,
      cleanTitle,
      selector,
      isExpanded: !this.isCollapsed,
      hasChildren: this.hasChildren()
    });
    return selector;
  }

  /**
   * Check if this is specifically the social history section
   */
  isSocialHistorySection(): boolean {
    const sectionTitle = this.question?.quest_Title?.toLowerCase().trim().replace(/:/g, '');
    return sectionTitle === 'social history' && this.question?.type === 'Question Section';
  }

  /**
   * Check if this section has a custom component
   */
  hasCustomComponent(): boolean {
    if (this.question?.type !== 'Question Section') return false;

    const sectionTitle = this.question?.quest_Title?.toLowerCase().trim();
    const cleanTitle = sectionTitle?.replace(/:/g, '').trim();

    const componentMap = [
      'medical history',
      'medications history',
      'family history',
      'social history',
      'review of systems',
      'allergies',
      'vital signs',
      'immunizations',
      'problem',
      'problems'
    ];

    const hasComponent = componentMap.includes(cleanTitle || '');
    return hasComponent;
  }

  /**
   * Check if this section should render a custom component
   * Social history component is always shown (even with children)
   * Other components only render if section has NO children
   */
  shouldRenderCustomComponent(): boolean {
    const isCustomSection = this.hasCustomComponent();
    const isExpanded = !this.isCollapsed;

    // Social history, family history, allergies, medical history, vital signs, and immunizations should always show their components, even with children
    if (this.isSocialHistorySection() || this.isFamilyHistorySection() || this.isAllergiesSection() || this.isMedicalHistorySection() || this.isVitalSignsSection() || this.isImmunizationsSection()) {
      return isCustomSection && isExpanded;
    }

    // Other sections only show component when they have no children
    const hasNoChildren = !this.hasChildren();
    return hasNoChildren && isCustomSection && isExpanded;
  }

  /**
   * Check if this section should render default children
   * Social history: Show children below the component (for selected items preview)
   * Other sections: Render children if section HAS children
   */
  shouldRenderDefaultChildren(): boolean {
    if (!this.hasChildren() || this.isCollapsed) {
      return false;
    }

    // For social history, family history, allergies, medical history, and vital signs, don't show children (no preview in structured tab)
    if (this.isSocialHistorySection() || this.isFamilyHistorySection() || this.isAllergiesSection() || this.isMedicalHistorySection() || this.isVitalSignsSection() || this.isImmunizationsSection()) {
      return false;
    }

    // For other sections, only show children if no custom component is rendered
    return !this.shouldRenderCustomComponent();
  }

  /**
   * Check if this question should be collapsable
   * Sections are always collapsable
   * TextBox/CheckBox are only collapsable if they have no parent
   */
  isCollapsable(): boolean {
    if (this.isSection()) {
      return true;
    }
    // Single questions (TextBox/CheckBox) are only collapsable if they have no parent
    return !this.hasParent;
  }

  /**
   * After view initialization, set up event listeners for child components
   */
  ngAfterViewInit(): void {
    // If this is a social history section, subscribe to selection changes
    if (this.socialHistoryComponent && this.isSocialHistorySection()) {
      console.log('🔌 [QuestionView] Setting up social history listener for section:', this.question?.quest_Title);
      this.socialHistoryComponent.selectionChanged.subscribe((selectedItems: any[]) => {
        console.log('🔔 [QuestionView] Social history selection changed:', selectedItems);
        this.handleSocialHistorySelection(selectedItems);
      });
    }

    // If this is a family history section, subscribe to selection changes
    if (this.familyHistoryComponent && this.isFamilyHistorySection()) {
      console.log('🔌 [QuestionView] Setting up family history listener for section:', this.question?.quest_Title);
      this.familyHistoryComponent.selectionChanged.subscribe((selectedItems: any[]) => {
        console.log('🔔 [QuestionView] Family history selection changed:', selectedItems);
        this.handleFamilyHistorySelection(selectedItems);
      });
    }

    // If this is an allergies section, subscribe to selection changes
    if (this.allergiesComponent && this.isAllergiesSection()) {
      console.log('🔌 [QuestionView] Setting up allergies listener for section:', this.question?.quest_Title);
      this.allergiesComponent.selectionChanged.subscribe((selectedItems: any[]) => {
        console.log('🔔 [QuestionView] Allergies selection changed:', selectedItems);
        this.handleAllergiesSelection(selectedItems);
      });
    }

    // If this is a medical history section, subscribe to selection changes
    if (this.problemListComponent && this.isMedicalHistorySection()) {
      console.log('🔌 [QuestionView] Setting up medical history listener for section:', this.question?.quest_Title);
      this.problemListComponent.selectionChanged.subscribe((selectedItems: any[]) => {
        console.log('🔔 [QuestionView] Medical history selection changed:', selectedItems);
        this.handleMedicalHistorySelection(selectedItems);
      });
    }

    // If this is a vital signs section, subscribe to selection changes
    if (this.vitalSignsComponent && this.isVitalSignsSection()) {
      console.log('🔌 [QuestionView] Setting up vital signs listener for section:', this.question?.quest_Title);
      this.vitalSignsComponent.selectionChanged.subscribe((selectedItems: any[]) => {
        console.log('🔔 [QuestionView] Vital signs selection changed:', selectedItems);
        this.handleVitalSignsSelection(selectedItems);
      });
    }

    // If this is an immunizations section, subscribe to selection changes
    if (this.immunizationsComponent && this.isImmunizationsSection()) {
      console.log('🔌 [QuestionView] Setting up immunizations listener for section:', this.question?.quest_Title);
      this.immunizationsComponent.selectionChanged.subscribe((selectedItems: any[]) => {
        console.log('🔔 [QuestionView] Immunizations selection changed:', selectedItems);
        this.handleImmunizationsSelection(selectedItems);
      });
    }
  }

  /**
   * Check if this is the family history section
   */
  isFamilyHistorySection(): boolean {
    const sectionTitle = this.question?.quest_Title?.toLowerCase().trim().replace(/:/g, '');
    return sectionTitle === 'family history' && this.question?.type === 'Question Section';
  }

  /**
   * Handle social history selection changes
   */
  handleSocialHistorySelection(selectedItems: any[]): void {
    console.log('📤 [QuestionView] Emitting social history selection to parent:', selectedItems);
    this.socialHistorySelectionChanged.emit(selectedItems);
  }

  /**
   * Check if this is the allergies section
   */
  isAllergiesSection(): boolean {
    const sectionTitle = this.question?.quest_Title?.toLowerCase().trim().replace(/:/g, '');
    return sectionTitle === 'allergies' && this.question?.type === 'Question Section';
  }

  /**
   * Handle family history selection changes
   */
  handleFamilyHistorySelection(selectedItems: any[]): void {
    console.log('📤 [QuestionView] Emitting family history selection to parent:', selectedItems);
    this.familyHistorySelectionChanged.emit(selectedItems);
  }

  /**
   * Handle allergies selection changes
   */
  handleAllergiesSelection(selectedItems: any[]): void {
    console.log('📤 [QuestionView] Emitting allergies selection to parent:', selectedItems);
    this.allergiesSelectionChanged.emit(selectedItems);
  }

  /**
   * Check if this is the medical history section
   */
  isMedicalHistorySection(): boolean {
    const sectionTitle = this.question?.quest_Title?.toLowerCase().trim().replace(/:/g, '');
    return sectionTitle === 'medical history' && this.question?.type === 'Question Section';
  }

  /**
   * Handle medical history selection changes
   */
  handleMedicalHistorySelection(selectedItems: any[]): void {
    console.log('📤 [QuestionView] Emitting medical history selection to parent:', selectedItems);
    this.medicalHistorySelectionChanged.emit(selectedItems);
  }

  /**
   * Get the clinical flag (always true for clinical context)
   */
  getClinicalFlag(): boolean {
    return this.clinicalnote;
  }

  /**
   * Check if input field should be shown for single questions
   */
  shouldShowInputField(): boolean {
    // If question has parent, always show (not collapsable)
    if (this.hasParent && !this.isSection()) {
      return true;
    }
    // If standalone, show based on collapsed state
    return this.isSingleQuestion() && !this.isCollapsed;
  }

  /**
   * Check if this is the vital signs section
   */
  isVitalSignsSection(): boolean {
    const sectionTitle = this.question?.quest_Title?.toLowerCase().trim().replace(/:/g, '');
    return sectionTitle === 'vital signs' && this.question?.type === 'Question Section';
  }

  /**
   * Handle vital signs selection changes
   */
  handleVitalSignsSelection(selectedItems: any[]): void {
    console.log('📤 [QuestionView] Emitting vital signs selection to parent:', selectedItems);
    this.vitalSignsSelectionChanged.emit(selectedItems);
  }

  /**
   * Check if this is the immunizations section
   */
  isImmunizationsSection(): boolean {
    const sectionTitle = this.question?.quest_Title?.toLowerCase().trim().replace(/:/g, '');
    return sectionTitle === 'immunizations' && this.question?.type === 'Question Section';
  }

  /**
   * Handle immunizations selection changes
   */
  handleImmunizationsSelection(selectedItems: any[]): void {
    console.log('📤 [QuestionView] Emitting immunizations selection to parent:', selectedItems);
    this.immunizationsSelectionChanged.emit(selectedItems);
  }
}


