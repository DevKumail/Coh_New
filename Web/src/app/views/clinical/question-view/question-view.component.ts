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
  @Input() form?: FormGroup; // optional reactive FormGroup from parent

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
  }

  isChecked(answer: any): boolean {
    return answer === 'Yes' || answer === true || answer === 'true';
  }

  onCheckboxChange(event: any, question: any) {
    const checked = event.target.checked;
    question.answer = checked ? 'Yes' : 'No';
    if (this.form && question?.quest_Id != null) {
      const ctrl = this.form.get(question.quest_Id.toString());
      if (ctrl) ctrl.setValue(checked);
    }
  }

  onAnswerChange(event: any, question: any) {
    const value = event.target.value;
    question.answer = value;
    if (this.form && question?.quest_Id != null) {
      const ctrl = this.form.get(question.quest_Id.toString());
      if (ctrl) ctrl.setValue(value);
    }
  }
}


