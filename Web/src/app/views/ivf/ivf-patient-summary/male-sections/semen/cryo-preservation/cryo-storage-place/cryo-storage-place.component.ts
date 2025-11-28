import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerRotateClockwise } from '@ng-icons/tabler-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cryo-storage-place',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './cryo-storage-place.component.html',
  styleUrls: ['./cryo-storage-place.component.scss'],
  providers: [provideIcons({ tablerRotateClockwise })]
})
export class CryoStoragePlaceComponent implements OnDestroy {
  @Output() back = new EventEmitter<void>();
  @Output() selected = new EventEmitter<any>();

  form: FormGroup;

  // Simple mock lists to render the grid-like UI (replace with API later)
  storages: Array<any> = [];
  details: Array<any> = [];

  // Dropdown sources
  containers: Array<{ value: number; label: string }> = [];
  levelAs: Array<{ value: number; label: string }> = [];
  levelBs: Array<{ value: number; label: string }> = [];

  selectedRow: any = null;
  showDetails = false;

  constructor(
    private fb: FormBuilder,
    private ivfApiService: IVFApiService
  ) {
    this.form = this.fb.group({
      description: [null],
      levelA: [{ value: null, disabled: true }],
      levelB: [{ value: null, disabled: true }],
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

    // Load containers initially
    this.loadContainers();

    // On container change -> load level A, enable levelA, reset lower levels
    this.form.get('description')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((containerId: number) => {
      this.levelAs = [];
      this.levelBs = [];
      this.form.get('levelA')?.reset();
      this.form.get('levelB')?.reset();
      this.form.get('levelA')?.disable();
      this.form.get('levelB')?.disable();
      if (containerId) {
        this.ivfApiService.GetCryoLevelADropdown(containerId).subscribe({
          next: (res: any) => {
            this.levelAs = Array.isArray(res) ? res : (res?.data ?? []);
            if (this.levelAs.length > 0) this.form.get('levelA')?.enable();
          }
        });
      }
    });

    // On levelA change -> load level B, enable levelB
    this.form.get('levelA')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((levelAId: number) => {
      this.levelBs = [];
      this.form.get('levelB')?.reset();
      this.form.get('levelB')?.disable();
      if (levelAId) {
        this.ivfApiService.GetCryoLevelBDropdown(levelAId).subscribe({
          next: (res: any) => {
            this.levelBs = Array.isArray(res) ? res : (res?.data ?? []);
            if (this.levelBs.length > 0) this.form.get('levelB')?.enable();
          }
        });
      }
    });
  }

  private loadContainers() {
    this.ivfApiService.GetCryoContainersDropdown().subscribe({
      next: (res: any) => {
        this.containers = Array.isArray(res) ? res : (res?.data ?? []);
      }
    });
  }

  search() {
    const payload = {
      containerId: this.form.get('description')?.value ?? 0,
      levelAId: this.form.get('levelA')?.value ?? 0,
      levelBId: this.form.get('levelB')?.value ?? 0,
      minFreePositions: this.form.get('minFreePositionsCheck')?.value
        ? Number(this.form.get('minFreePositions')?.value || 0)
        : 0,
      maxPatients: this.form.get('maxPatientsCheck')?.value
        ? Number(this.form.get('maxPatients')?.value || 0)
        : 0,
      maxSamples: this.form.get('maxSamplesCheck')?.value
        ? Number(this.form.get('maxSamples')?.value || 0)
        : 0,
      strawId: this.form.get('strawIdCheck')?.value
        ? (this.form.get('strawId')?.value || '')
        : ''
    };

    // Clear grid then load
    this.storages = [];
    this.ivfApiService.SearchCryoStorages(payload).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        this.storages = (data || []).map((x: any) => ({
          description: x.description ?? x.description ?? '',
          levelA: x.canister ?? x.canister ?? '',
          levelB: x.goblet ?? x.goblet ?? '',
          free: x.freePlaces ?? x.freePlaces ?? 0,
          patients: x.patientCount ?? x.patientCount ?? 0,
          samples: x.sampleCount ?? x.sampleCount ?? 0,
          levelCId: x.levelCId ?? x.levelCId ?? null,
          containerId: x.containerId ?? x.id ?? null,
          NLevelC : x.nLevelCId ?? x.nLevelCId ?? null
        }));
      },
      error: (err) => {
        console.error('Cryo search failed', err);
        this.storages = [];
      }
    });
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
            levelCId: response.levelCId,
            free: response.freePlaces,
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

  onSelectStorage(s: any) { 
    this.showDetails = true;
    this.selectedRow = s;
   this.loadStorageDetails();

  }
loadStorageDetails() {
   this.details = [];

  const payload: { levelCId: number } = { levelCId: 0 };
  
 if (this.selectedRow?.patients > 0 && this.selectedRow?.free === 0) {
  payload.levelCId = this.selectedRow?.NLevelC || 0;
} else {
  payload.levelCId = this.selectedRow?.levelCId || 0;
}
   

  this.ivfApiService
    .GetStorageDetails(payload)
    .subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [res]);

        this.details = (data || []).map((x: any) => ({
          color: x.color1 || '',                  // for the colored square
          patientName: x.patientName || '',
          patientId: x.patientId || '',
          strawId: x.strawId || '',
          position: x.position || '',
          typeOfMaterial: x.typeOfMaterial || '',
          description: x.description || '',
          levelA: x.levelA || '',
          levelB: x.levelB || ''
        }));
      },
      error: (err) => {
        console.error('Failed to load storage details', err);
        this.details = [];
      }
    });
}
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
      storagePlace: `${row.description} ${row.levelA} ${row.levelB}`.trim(),
      storagePlaceId: row.levelCId,
      position: `${row.description} ${row.levelA}`.trim()
    });
  }

  // Template (change) handlers to avoid missing-method errors
  onDescriptionChange(val: any) {
    const id = Number(val) || null;
    if (this.form.get('description')?.value !== id) {
      this.form.get('description')?.setValue(id);
    }
  }

  // teardown
  private destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLevelAChange(val: any) {
    const id = Number(val) || null;
    if (this.form.get('levelA')?.value !== id) {
      this.form.get('levelA')?.setValue(id);
    }
  }
}
