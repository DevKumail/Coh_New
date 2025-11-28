import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ImmunizationsComponent } from '../immunizations/immunizations.component';
import { MedicationComponent } from '../medication/medication.component';
import { VitalSignsComponent } from '../vital-signs/vital-signs.component';
import { AllergiesComponent } from '../allergies/allergies.component';
import { FamilyHistoryComponent } from '../family-history/family-history.component';
import { SocialHistoryComponent } from '../social-history/social-history.component';
import { ProblemComponent } from '../problem/problem.component';
import { MedicalHistoryComponent } from '../medical-history/medical-history.component';

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
    MedicalHistoryComponent
  ],
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.scss']
})
export class QuestionViewComponent implements OnInit {
  @Input() question: any;
  @Input() form!: FormGroup; // optional reactive FormGroup from parent
  @Input() hasParent: boolean = false; // Track if question has a parent

  // Track collapse state for each section
  isCollapsed: boolean = true;

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

    // Debug logging
    console.log('🔍 Section Title:', this.question?.quest_Title);
    console.log('🔍 Clean Title:', cleanTitle);
    console.log('🔍 Selector:', selector);
    console.log('🔍 Has Custom Component:', this.hasCustomComponent());
    console.log('🔍 Should Render:', this.shouldRenderCustomComponent());

    return selector;
  }

  /**
   * Check if section has a custom component
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

    console.log(`✅ Section "${this.question?.quest_Title}" has custom component:`, hasComponent);

    return hasComponent;
  }

  /**
   * Check if this section should render a custom component
   * Only render custom component if section has NO children
   */
  shouldRenderCustomComponent(): boolean {
    const hasNoChildren = !this.hasChildren();
    const isCustomSection = this.hasCustomComponent();
    const isExpanded = !this.isCollapsed;

    return hasNoChildren && isCustomSection && isExpanded;
  }

  /**
   * Check if this section should render default children
   * Render children if section HAS children (regardless of custom component)
   */
  shouldRenderDefaultChildren(): boolean {
    return this.hasChildren() && !this.isCollapsed;
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
}


