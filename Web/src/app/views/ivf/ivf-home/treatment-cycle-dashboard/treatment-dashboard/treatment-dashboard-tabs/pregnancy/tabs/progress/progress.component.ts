import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    QuillModule, 
    QuillEditorComponent,
    FilledOnValueDirective],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit {
  @Input() set dropdowns(value: any) {
    console.log('Dropdowns received in Progress component:', value);
    this._dropdowns = value;
  }
  get dropdowns(): any {
    return this._dropdowns;
  }
  private _dropdowns: any = {};
  
  embryosData: Array<{ key: number; label: string }> = [];
  embryoCountOptions = [1, 2, 3, 4];
  selectedEmbryoCount = 0;
  
  searchComplication = '';
  searchComplicationAfter20 = '';
  
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
  embryoImageSrc = 'assets/images/placeholder-image.png';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // top row
      clinicalPregnancyDate: [null],
      cbd: [null],
      amnioticIntrauterine: ['No. intrauterine'],
      amnioticExtrauterine: [null],

      // editor
      editorContent: [''],

      // embryo count dropdown
      embryoCount: [null],

      // embryos array (initially empty)
      embryos: this.fb.array([]),

      // complications until 20th week (multi-select)
      compUntil20: this.fb.control<number[]>([]),

      // complications after 20th week (multi-select)
      compAfter20: this.fb.control<number[]>([]),

      fetalPathology: [null],
    });
  }

  ngOnInit() {
    // Listen to embryo count changes
    this.form.get('embryoCount')?.valueChanges.subscribe((valueId: any) => {
      console.log('Embryo count valueId changed:', valueId, 'Type:', typeof valueId);
      console.log('Available options:', this.options('IntrauterineCount'));
      
      // Convert to number if it's a string
      const numericValueId = typeof valueId === 'string' ? parseInt(valueId, 10) : valueId;
      console.log('Numeric valueId:', numericValueId);
      
      // Find the selected option to get the count value
      const selectedOption = this.options('IntrauterineCount').find((opt: any) => opt.valueId === numericValueId);
      console.log('Selected option:', selectedOption);
      
      const count = selectedOption ? parseInt(selectedOption.name, 10) : 0;
      console.log('Parsed count:', count);
      console.log('embryosData will be:', count);
      
      this.selectedEmbryoCount = count;
      this.updateEmbryosArray(count);
    });

    // Listen to clinical pregnancy date changes to calculate CBD
    this.form.get('clinicalPregnancyDate')?.valueChanges.subscribe((date: string) => {
      if (date) {
        this.calculateCBD(date);
      } else {
        this.form.patchValue({ cbd: null }, { emitEvent: false });
      }
    });
  }

  calculateCBD(pregnancyDate: string) {
    if (!pregnancyDate) return;
    
    // Parse the pregnancy date
    const date = new Date(pregnancyDate);
    
    // Add 280 days (40 weeks) to get calculated birth date
    date.setDate(date.getDate() + 280);
    
    // Format to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const cbdDate = `${year}-${month}-${day}`;
    
    // Update CBD field
    this.form.patchValue({ cbd: cbdDate }, { emitEvent: false });
  }

  updateEmbryosArray(count: number) {
    console.log('updateEmbryosArray called with count:', count);
    const embryosArray = this.embryosFA;
    const currentCount = embryosArray.length;
    
    console.log('Current embryo count:', currentCount, 'New count:', count);
    
    // If increasing count, add new embryos
    if (count > currentCount) {
      for (let i = currentCount + 1; i <= count; i++) {
        this.embryosData.push({ key: i, label: `HB Embryo ${i}` });
        
        embryosArray.push(
          this.fb.group({
            checked: [true],
            progress1: [null],
            progress2: [null],
            note: [''],
          })
        );
      }
      console.log('Added', count - currentCount, 'new embryos');
    }
    // If decreasing count, remove extra embryos
    else if (count < currentCount) {
      const removeCount = currentCount - count;
      for (let i = 0; i < removeCount; i++) {
        embryosArray.removeAt(embryosArray.length - 1);
        this.embryosData.pop();
      }
      console.log('Removed', removeCount, 'embryos');
    }
    
    this.selectedEmbryoCount = count;
    console.log('Final embryosData:', this.embryosData);
    console.log('Final embryosData.length:', this.embryosData.length);
    console.log('Final FormArray length:', embryosArray.length);
  }

  get embryosFA(): FormArray<FormGroup> {
    return this.form.get('embryos') as FormArray<FormGroup>;
  }

  // Helper to get dropdown options
  options(key: string) {
    return (this.dropdowns && this.dropdowns[`IVFPregnancyEpisode:${key}`]) || [];
  }

  // Get complications options from dropdown
  get complicationsOptions(): any[] {
    return this.options('ComplicationUntil20th');
  }

  // Get complications after 20th week options from dropdown
  get complicationsAfter20Options(): any[] {
    return this.options('ComplicationAfter20th');
  }

  // Get progress options from dropdown
  get progressOptions(): any[] {
    return this.options('PGProgressUntil24thWeek');
  }

  // Complications multi-select helpers
  get compUntil20Control(): FormControl<number[] | null> {
    return this.form.get('compUntil20') as FormControl<number[] | null>;
  }

  get selectedComplications(): number[] {
    return (this.compUntil20Control.value || []) as number[];
  }

  get selectedComplicationsDisplay(): string {
    const ids = this.selectedComplications;
    if (ids.length === 0) return '';
    
    const names = ids.map(id => {
      const option = this.complicationsOptions.find((opt: any) => opt.valueId === id);
      return option ? option.name : '';
    }).filter(name => name !== '');
    
    return names.join(', ');
  }

  isComplicationSelected(value: number): boolean {
    return this.selectedComplications.includes(value);
  }

  toggleComplication(value: number) {
    const current = new Set(this.selectedComplications);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    this.compUntil20Control.setValue(Array.from(current) as any);
    this.compUntil20Control.markAsDirty();
    this.compUntil20Control.markAsTouched();
  }

  get filteredComplicationsOptions(): any[] {
    const q = this.searchComplication.trim().toLowerCase();
    if (q.length === 0) return this.complicationsOptions;
    return this.complicationsOptions.filter((o: any) => o.name.toLowerCase().includes(q));
  }

  // Complications after 20th week multi-select helpers
  get compAfter20Control(): FormControl<number[] | null> {
    return this.form.get('compAfter20') as FormControl<number[] | null>;
  }

  get selectedComplicationsAfter20(): number[] {
    return (this.compAfter20Control.value || []) as number[];
  }

  get selectedComplicationsAfter20Display(): string {
    const ids = this.selectedComplicationsAfter20;
    if (ids.length === 0) return '';
    
    const names = ids.map(id => {
      const option = this.complicationsAfter20Options.find((opt: any) => opt.valueId === id);
      return option ? option.name : '';
    }).filter(name => name !== '');
    
    return names.join(', ');
  }

  isComplicationAfter20Selected(value: number): boolean {
    return this.selectedComplicationsAfter20.includes(value);
  }

  toggleComplicationAfter20(value: number) {
    const current = new Set(this.selectedComplicationsAfter20);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    this.compAfter20Control.setValue(Array.from(current) as any);
    this.compAfter20Control.markAsDirty();
    this.compAfter20Control.markAsTouched();
  }

  get filteredComplicationsAfter20Options(): any[] {
    const q = this.searchComplicationAfter20.trim().toLowerCase();
    if (q.length === 0) return this.complicationsAfter20Options;
    return this.complicationsAfter20Options.filter((o: any) => o.name.toLowerCase().includes(q));
  }
}
