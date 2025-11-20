import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cryo-storage-place',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cryo-storage-place.component.html',
  styleUrls: ['./cryo-storage-place.component.scss']
})
export class CryoStoragePlaceComponent {
  @Output() back = new EventEmitter<void>();
  @Output() selected = new EventEmitter<any>();

  form: FormGroup;

  // Simple mock lists to render the grid-like UI (replace with API later)
  storages: Array<any> = [
    { description: 'A1H-D10', levelA: 'C1', levelB: 'N10', levelC: 'N1', free: 4, patients: 8, samples: 12 },
    { description: 'A1H-D10', levelA: 'C1', levelB: 'N12', levelC: 'N3', free: 2, patients: 3, samples: 6 },
  ];
  details: Array<any> = [
    { color: '#5bc0de', c1: 'D19 C1 N1', patient: 'John Doe', patientId: '3017', strawId: 'D19C1N1', pos: 'D19 C1 N1', type: 'EMB' },
    { color: '#f0ad4e', c1: 'D19 C1 N1', patient: 'Jane Roe', patientId: '3018', strawId: 'D19C1N1', pos: 'D19 C1 N1', type: 'EMB' },
  ];

  selectedRow: any = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      description: [''],
      levelA: [''],
      levelB: [''],
      levelC: [''],
      minFreePositionsCheck: [false],
      minFreePositions: [''],
      maxPatientsCheck: [false],
      maxPatients: [''],
      maxSamplesCheck: [false],
      maxSamples: [''],
      strawIdCheck: [false],
      strawId: [''],
    });
  }

  search() {
    // Placeholder for future API call; keep UI responsive
  }

  onSelectStorage(s: any) { this.selectedRow = s; }

  onCancel() { this.back.emit(); }

  onOk() {
    if (!this.selectedRow) { this.back.emit(); return; }
    this.selected.emit({
      storagePlace: this.selectedRow?.description || '',
      position: `${this.selectedRow?.levelA} ${this.selectedRow?.levelB} ${this.selectedRow?.levelC}`.trim(),
      colour: '#5bc0de'
    });
  }
}
