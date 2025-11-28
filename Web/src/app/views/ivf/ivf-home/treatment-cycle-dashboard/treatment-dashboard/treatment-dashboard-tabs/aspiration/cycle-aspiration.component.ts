import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-cycle-aspiration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,QuillModule],
  templateUrl: './cycle-aspiration.component.html',
  styleUrl: './cycle-aspiration.component.scss'
})
export class CycleAspirationComponent {
  form: FormGroup;
  activeTab: 'oocyte' | 'further' = 'oocyte';
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
  complicationOptions = [
    { id: 0, name: 'No complication' },
    { id: 1, name: 'Bleeding' },
    { id: 2, name: 'Infection' }
  ];

  measuresOptions = [
    { id: 1, name: 'Observation' },
    { id: 2, name: 'Medication' },
    { id: 3, name: 'Surgical intervention' }
  ];

  retrievalTechniques = [
    { id: 'transvaginal', name: 'Transvaginal' },
    { id: 'transabdominal', name: 'Transabdominal' }
  ];

  anesthesiaOptions = [
    { id: 'general', name: 'General anesthesia' },
    { id: 'sedation', name: 'Sedation' },
    { id: 'local', name: 'Local' }
  ];

  operatingClinicians = [
    { id: 1, name: 'Clinician A' },
    { id: 2, name: 'Clinician B' }
  ];
  embryologists = [
    { id: 1, name: 'Embryologist X' },
    { id: 2, name: 'Embryologist Y' }
  ];
  anesthetists = [
    { id: 1, name: 'Anesthetist M' },
    { id: 2, name: 'Anesthetist N' }
  ];
  nurses = [
    { id: 1, name: 'Nurse P' },
    { id: 2, name: 'Nurse Q' }
  ];

  aspirationSystems = [
    { id: 'cook', name: 'Cook' },
    { id: 'kitazato', name: 'Kitazato' },
    { id: 'other', name: 'Other' }
  ];
  generalConditions = [
    { id: 'tolerated', name: 'Procedure tolerated' },
    { id: 'stable', name: 'Stable' },
    { id: 'critical', name: 'Critical' }
  ];
  mucousMembranes = [
    { id: 'intact', name: 'Intact' },
    { id: 'inflamed', name: 'Inflamed' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: [null],
      startTime: [null],
      endTime: [null],

      collectedOocytesCount: [null],
      emptyCumulusCount: [null],
      poorDrugResponse: [null],

      retrievalTechnique: ['transvaginal'],
      anesthesia: ['general'],

      primaryComplication: [null],
      furtherComplications: [null],
      primaryMeasure: [null],
      furtherMeasures: [null],

      operatingClinician: [''],
      embryologist: [''],
      anesthetist: [''],
      nurse: [''],

      editorContent: [''],

      // Further details
      aspirationSystem: ['cook'],
      folliclesTotal: [],
      folliclesLeft: [],
      folliclesRight: [],
      leadingFollicleSizeMm: [null],
      follicleWashed: [false],
      washedFolliclesCount: [null],
      doseLH: [null],
      doseFSH: [null],
      doseHMG: [null],
      generalCondition: ['tolerated'],
      mucousMembrane: ['intact'],
      preOpPulse: [null],
      preOpBpSys: [null],
      preOpBpDia: [null],
      preOpTemp: [null],
      anesPulse: [null],
      anesBpSys: [null],
      anesBpDia: [null],
      anesNote: ['']
    });
  }

  submit() {
    console.log('Cycle Aspiration form:', this.form.value);
  }
}
