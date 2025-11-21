import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';

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
  storages: Array<any> = [];
  details: Array<any> = [];

  selectedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private ivfApiService: IVFApiService
  ) {
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

  nextAvailableSlot() {
    this.ivfApiService.GetNextAvailableStorageSlot().subscribe({
      next: (response: any) => {
        if (response) {
          // Add to storages grid
          const newSlot = {
            description: response.containerDescription,
            levelA: response.canisterCode,
            levelB: response.caneCode,
            position: response.strawPosition,
            storageLocation: response.storageLocation,
            containerId: response.containerId,
            free: 0,
            patients: 0,
            samples: 0,
            isNextAvailable: true
          };
          // Add to beginning of array
          this.storages = [newSlot];
        }
      },
      error: (error) => {
        console.error('Error getting next available slot:', error);
      }
    });
  }

  onSelectStorage(s: any) { this.selectedRow = s; }

  onCancel() { this.back.emit(); }

  onOk() {
    if (!this.selectedRow) { this.back.emit(); return; }
    const position = this.selectedRow.isNextAvailable 
      ? `${this.selectedRow?.levelA} ${this.selectedRow?.levelB} ${this.selectedRow?.position}`.trim()
      : `${this.selectedRow?.levelA} ${this.selectedRow?.levelB} ${this.selectedRow?.levelC}`.trim();
    
    this.selected.emit({
      storagePlace: this.selectedRow?.description || '',
      position: position,
      colour: '#5bc0de'
    });
  }

  loadSlot(row: any) {
    this.selected.emit({
      storagePlace: row.description || '',
      position: `${row.levelA} ${row.levelB} ${row.position}`.trim()
    });
  }
}
