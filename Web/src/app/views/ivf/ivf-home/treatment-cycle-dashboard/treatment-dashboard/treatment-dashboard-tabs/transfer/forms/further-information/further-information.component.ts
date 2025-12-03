import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-further-information',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, QuillEditorComponent],
  templateUrl: './further-information.component.html',
  styleUrl: './further-information.component.scss'
})
export class FurtherInformationComponent {
  severalAttempts = false;
  attempts: number | null = null;

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

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      editorContent: [''],
      cultureDuration: [{ value: null, disabled: true }],
      catheterUsed: [''],
      catheterAddition: [''],
      mainComplication: [''],
      furtherComplications: [''],
      severalAttempts: [false],
      attempts: [{ value: null, disabled: true }],
      embryoGlue: [false],
      difficultCatheter: [false],
      catheterChange: [false],
      mucusInCatheter: [false],
      bloodInCatheter: [false],
      dilation: [false],
      ultrasoundCheck: [false],
      vulsellum: [false],
      probe: [false],
    });
  }

}
