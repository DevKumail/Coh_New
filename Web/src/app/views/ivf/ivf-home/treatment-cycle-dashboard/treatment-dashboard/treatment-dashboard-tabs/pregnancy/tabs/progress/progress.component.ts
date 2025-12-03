import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    QuillModule, 
    QuillEditorComponent],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent {
  embryosData = [
    { key: 1, label: 'HB Embryo 1' },
    { key: 2, label: 'HB Embryo 2' },
    { key: 3, label: 'HB Embryo 3' },
    { key: 4, label: 'HB Embryo 4' },
  ];
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

  progressOptions = ['Ongoing', 'Completed'];

  form: FormGroup;
  embryoImageSrc = 'assets/images/placeholder-image.png';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // top row
      clinicalPregnancyDate: [''],
      cbd: [{ value: '', disabled: true }],
      amnioticIntrauterine: ['No. intrauterine'],
      amnioticExtrauterine: [0],

      // editor
      editorContent: [''],

      // embryos array
      embryos: this.fb.array(
        this.embryosData.map((_, i) =>
          this.fb.group({
            checked: [i === 0],
            progress1: ['Ongoing'],
            progress2: ['Ongoing'],
            note: [''],
          })
        )
      ),

      // complications until 20th week
      compUntil20: this.fb.group({
        none: [false],
        bleeding: [false],
        passingFluid: [false],
        vaginalInfection: [false],
        amnionInfection: [false],
        fever: [false],
        other: [false],
        unknown: [false],
      }),

      // complications after 20th week
      compAfter20: this.fb.group({
        comp1: [''],
        comp2: [''],
        comp3: [''],
        comp4: [''],
      }),

      fetalPathology: ['—'],
    });
  }

  get embryosFA(): FormArray<FormGroup> {
    return this.form.get('embryos') as FormArray<FormGroup>;
  }
}
