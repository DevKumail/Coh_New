import { Component, Input, OnInit } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-medical-history-genetics',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule],
  templateUrl: './medical-history-genetics.component.html',
  styleUrls: ['./medical-history-genetics.component.scss']
})
export class MedicalHistoryGeneticsComponent implements OnInit {
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  geneticsForm!: FormGroup;

  editorContent = '';
  quillModules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean']
    ]
  };

  opts(key: string) {
    return this.dropdowns?.[key] || [];
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.geneticsForm = this.fb.group({
      genes: [''],
      inheritance: [''],
    });
  }
}
