import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent implements OnInit {
  @Input() question: any;
  @Input() form?: FormGroup; // optional reactive FormGroup passed from parent
  @Output() answerChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    // If a form/control is provided, emit its value as plain string on changes
    const ctrlName = this.question?.controlName || this.question?.quest_Id;
    if (this.form && ctrlName && this.form.get(String(ctrlName))) {
      this.form.get(String(ctrlName))!.valueChanges.subscribe((v: any) => {
        this.answerChange.emit(String(v ?? ''));
      });
    }
  }

  // Call this from template inputs to emit a plain string
  onValueChange(value: string) {
    this.answerChange.emit(value ?? '');
  }
}
