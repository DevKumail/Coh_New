import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, QuillEditorComponent],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent {

  generalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.generalForm = this.fb.group({ 
      treatment: ['', Validators.required],
      onlyInternalCycle: [false],
      // Checkbox flags under Treatment
      fertilityPreservation: [false],
      socialEggFreezing: [false],
      freezeAll: [false],
      oocyteThawing: [false],
      embryoThawing: [false],
      ivm: [false],
      imsi: [false],
      picsi: [false],

      dateOfLMP: [null],
      cycleFromAmenorrhea: [''],
      mainIndication: [''],
      protocol: [''],
      stimulationPlanned: [''],
      stimulatedExternally: [''],
      longTermMedication: [''],
      plannedNoOfEmbryos: [0],
      plannedSpermCollection: [''],
      attendingClinician: [''],
      surveyId: [''],
      randomizationGroup: [''],
      takenOverFrom: [''],
      takenOverOn: [''],
      editorContent: [''],

      femaleMedicalHistoryOf: [''],
      femaleHistory: [''],
      maleMedicalHistoryOf: [''],
      maleHistory: [''],
      cycleNote: ['']
    });
  }

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

}
