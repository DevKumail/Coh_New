import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.scss']
})
export class QuestionViewComponent implements OnInit {
  @Input() question: any;
  @Input() form!: FormGroup; // optional reactive FormGroup from parent

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

    // Sections with children start collapsed, others expanded
    if (this.question?.type === 'Question Section' && this.question?.children?.length > 0) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }

  /**
   * Toggle collapse/expand state for sections
   */
  toggleSection(): void {
    if (this.question?.type === 'Question Section') {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  /**
   * Handle mouse enter event for hover effect
   */
  onMouseEnter(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.backgroundColor = '#e9ecef';
    }
  }

  /**
   * Handle mouse leave event for hover effect
   */
  onMouseLeave(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.backgroundColor = '#f8f9fa';
    }
  }

  /**
   * Check if question has children
   */
  hasChildren(): boolean {
    return this.question?.children && this.question.children.length > 0;
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
}


