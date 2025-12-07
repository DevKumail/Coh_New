import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class ProgressComponent implements OnInit {
  embryosData: Array<{ key: number; label: string }> = [];
  embryoCountOptions = [1, 2, 3, 4];
  selectedEmbryoCount = 0;
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

      // embryo count dropdown
      embryoCount: [0],

      // embryos array (initially empty)
      embryos: this.fb.array([]),

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

  ngOnInit() {
    // Listen to embryo count changes
    this.form.get('embryoCount')?.valueChanges.subscribe((count: number) => {
      this.selectedEmbryoCount = count;
      this.updateEmbryosArray(count);
    });
  }

  updateEmbryosArray(count: number) {
    const embryosArray = this.embryosFA;
    
    // Clear existing array
    while (embryosArray.length > 0) {
      embryosArray.removeAt(0);
    }
    
    // Generate new embryos data
    this.embryosData = [];
    for (let i = 1; i <= count; i++) {
      this.embryosData.push({ key: i, label: `HB Embryo ${i}` });
      
      // Add form group for each embryo
      embryosArray.push(
        this.fb.group({
          checked: [true],
          progress1: ['Ongoing'],
          progress2: ['Ongoing'],
          note: [''],
        })
      );
    }
  }

  get embryosFA(): FormArray<FormGroup> {
    return this.form.get('embryos') as FormArray<FormGroup>;
  }
}
