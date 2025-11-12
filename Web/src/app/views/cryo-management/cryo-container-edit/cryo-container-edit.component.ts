import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CryoManagementService } from '../../../shared/Services/Cyro/cryo-management.service';
import { CryoContainerDto } from '../../../../app/shared/Models/Cyro/cyro-container.model';
import { NgIconComponent } from '@ng-icons/core';
import { LucideAngularModule, LucideChevronRight, LucideHome, LucideUsers, LucideEdit2, LucideTrash2 } from 'lucide-angular';
import { FilePondModule } from 'ngx-filepond';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { provideNgxMask } from 'ngx-mask';
import { FilledOnValueDirective } from '../../../shared/directives/filled-on-value.directive';
import { TranslatePipe } from '../../../../app/shared/i18n/translate.pipe';
import Swal from 'sweetalert2';

interface LevelC { id: number; position: number; }
interface LevelB { id: number; code: string; levelCs: LevelC[]; }
interface LevelA { id: number; code: string; levelBs: LevelB[]; }

@Component({
  selector: 'app-cryo-container-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgIconComponent,
    TranslatePipe,
    FilePondModule,
    NgbNavModule,
    LucideAngularModule,
    FilledOnValueDirective
  ],
  providers: [
    provideNgxMask(),
    { provide: 'ngModelOptions', useValue: { standalone: true } }
  ],
  // reuse the create template so UI stays identical
  templateUrl: '../cryo-container-add/cryo-container-add.component.html',
  styleUrls: ['../cryo-container-add/cryo-container-add.component.scss']
})
export class CryoContainerEditComponent {
  protected readonly homeIcon = LucideHome;
  protected readonly chevronRightIcon = LucideChevronRight;
  protected readonly headingIcon = LucideUsers;
  protected readonly editIcon = LucideEdit2;
  protected readonly trashIcon = LucideTrash2;

  cryoForm: FormGroup;
  levelAs: LevelA[] = [];
  selectedA: LevelA | null = null;
  selectedB: LevelB | null = null;

  newLevelA = '';
  newLevelB = '';
  newStrawsCount = 0;

  private containerId!: number;

  constructor(
    private fb: FormBuilder,
    private cryoService: CryoManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cryoForm = this.fb.group({
      description: ['', Validators.required],
      location: [''],
      isSperm: [false],
      isOocyteOrEmb: [false],
      lastAudit: [''],
      maxStraws: ['']
    }, { validators: this.typeRequiredValidator });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      // invalid id -> go back
      this.router.navigate(['/cryo/cryo-management']);
      return;
    }
    this.containerId = id;
    this.loadContainer(id);
  }

  // form-level validator: require at least one of the two type checkboxes
  private typeRequiredValidator(control: AbstractControl): ValidationErrors | null {
    const isSperm = !!control.get('isSperm')?.value;
    const isOocyte = !!control.get('isOocyteOrEmb')?.value;
    return (isSperm || isOocyte) ? null : { typeRequired: true };
  }

  // ----------------- load & mapping -----------------
  private loadContainer(id: number) {
    this.cryoService.getContainerById(id).subscribe({
      next: (res: any) => {
        const dto: any = res?.data || res || {};

        // helper to read either PascalCase or camelCase property
        const get = (obj: any, pascal: string, camel: string) => {
          if (!obj) return undefined;
          return obj[pascal] !== undefined ? obj[pascal] : obj[camel];
        };

        // populate form (support Description/description, IsSperm/isSperm, LastAudit/lastAudit, MaxStrawsInLastLevel/maxStrawsInLastLevel)
        this.cryoForm.patchValue({
          description: get(dto, 'Description', 'description') || '',
          location: get(dto, 'Location', 'location') || '',
          isSperm: !!get(dto, 'IsSperm', 'isSperm'),
          isOocyteOrEmb: !!get(dto, 'IsOocyteOrEmb', 'isOocyteOrEmb'),
          lastAudit: get(dto, 'LastAudit', 'lastAudit') || '',
          maxStraws: get(dto, 'MaxStrawsInLastLevel', 'maxStrawsInLastLevel') || ''
        });

        // normalize LevelA array (support LevelA/levelA and nested naming variations)
        const rawLevelA: any[] = get(dto, 'LevelA', 'levelA') || [];
        this.levelAs = rawLevelA.map(a => {
          const rawLevelB: any[] = get(a, 'LevelB', 'levelB') || [];
          const levelBs: LevelB[] = rawLevelB.map(b => {
            const rawLevelC: any[] = get(b, 'LevelC', 'levelC') || [];
            const levelCs: LevelC[] = rawLevelC.map(c => ({
              id: c.ID ?? c.id ?? 0,
              position: c.StrawPosition ?? c.strawPosition ?? 0
            }));
            return {
              id: b.ID ?? b.id ?? 0,
              code: b.CaneCode ?? b.caneCode ?? b.CaneCode ?? b.caneCode ?? '',
              levelCs
            } as LevelB;
          });
          return {
            id: a.ID ?? a.id ?? 0,
            code: a.CanisterCode ?? a.canisterCode ?? a.CanisterCode ?? a.canisterCode ?? '',
            levelBs
          } as LevelA;
        });
      },
      error: () => {
        this.router.navigate(['/cryo/cryo-management']);
      }
    });
  }

  // reuse create behaviour for levels (add/select/generate/delete/edit)
  addLevelA() {
    if (!this.newLevelA.trim()) return;
    this.levelAs.push({ id: 0, code: this.newLevelA.trim(), levelBs: [] });
    this.newLevelA = '';
  }
  selectA(a: LevelA) { this.selectedA = a; this.selectedB = null; }
  addLevelB() {
    if (!this.selectedA || !this.newLevelB.trim()) return;
    this.selectedA.levelBs.push({ id: 0, code: this.newLevelB.trim(), levelCs: [] });
    this.newLevelB = '';
  }

  editLevelA(a: LevelA, event?: Event) {
    if (event) event.stopPropagation();
    const next = window.prompt('Edit Level A code', a.code);
    if (next === null) return;
    a.code = String(next).trim() || a.code;
  }

  selectB(b: LevelB) { this.selectedB = b; }

  generateStraws() {
    if (!this.selectedB) return;
    // Create new Level C items as new records (id = 0) with sequential positions
    this.selectedB.levelCs = Array.from({ length: this.newStrawsCount }, (_, i) => ({ id: 0, position: i + 1 }));
  }


  async deleteLevelA(a: LevelA, event?: Event) {
    if (event) event.stopPropagation();

    const childCountB = a.levelBs?.length || 0;
    const childCountC = a.levelBs?.reduce((acc, b) => acc + (b.levelCs?.length || 0), 0) || 0;
    const message = childCountB || childCountC
      ? `Deleting "${a.code}" will also remove ${childCountB} Level B item(s) and ${childCountC} Level C item(s). Are you sure?`
      : `Delete Level A "${a.code}"?`;
    const result = await Swal.fire({
      title: 'Confirm delete',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;

    // existing record on backend -> call API
    if (a.id && a.id > 0) {
      this.cryoService.deleteLevelA(a.id).subscribe({
        next: (res: any) => {
          this.removeLocalLevelA(a);
          Swal.fire({ position: 'center', icon: 'success', title: res?.message || 'Level A deleted', showConfirmButton: false, timer: 1400 });
        },
        error: (err: any) => {
          Swal.fire({ icon: 'error', title: 'Delete failed', text: err?.error?.message || err?.message || 'Unable to delete Level A.' });
        }
      });
      return;
    }

    // local-only record -> remove locally
    this.removeLocalLevelA(a);
    await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Level A and its children removed.', timer: 1200, showConfirmButton: false, position: 'center' });
  }

  private removeLocalLevelA(a: LevelA) {
    const idx = this.levelAs.indexOf(a);
    if (idx > -1) {
      this.levelAs.splice(idx, 1);
      if (this.selectedA === a) {
        this.selectedA = null;
        this.selectedB = null;
      }
    }
  }

  editLevelB(b: LevelB, event?: Event) { if (event) event.stopPropagation(); const next = window.prompt('Edit Level B code', b.code); if (next === null) return; b.code = String(next).trim() || b.code; }

  async deleteLevelB(b: LevelB, event?: Event) {
    if (event) event.stopPropagation();
    if (!this.selectedA) return;

    const childCountC = b.levelCs?.length || 0;
    const message = childCountC
      ? `Deleting "${b.code}" will also remove ${childCountC} Level C item(s). Are you sure?`
      : `Delete Level B "${b.code}"?`;

    const result = await Swal.fire({
      title: 'Confirm delete',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;

    // existing backend record -> call API
    if (b.id && b.id > 0) {
      this.cryoService.deleteLevelB(b.id).subscribe({
        next: (res: any) => {
          this.removeLocalLevelB(b);
          Swal.fire({ position: 'center', icon: 'success', title: res?.message || 'Level B deleted', showConfirmButton: false, timer: 1400 });
        },
        error: (err: any) => {
          Swal.fire({ icon: 'error', title: 'Delete failed', text: err?.error?.message || err?.message || 'Unable to delete Level B.' });
        }
      });
      return;
    }

    // local-only: remove locally
    this.removeLocalLevelB(b);
    await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Level B and its children removed.', timer: 1000, showConfirmButton: false, position: 'center' });
  }

  private removeLocalLevelB(b: LevelB) {
    if (!this.selectedA) return;
    const idx = this.selectedA.levelBs.indexOf(b);
    if (idx > -1) {
      this.selectedA.levelBs.splice(idx, 1);
      if (this.selectedB === b) {
        this.selectedB = null;
      }
    }
  }

  editLevelC(c: LevelC, event?: Event) { if (event) event.stopPropagation(); const next = window.prompt('Edit Level C position (number)', String(c.position)); if (next === null) return; const num = Number(next); if (!Number.isFinite(num) || num <= 0) { Swal.fire({ icon: 'error', title: 'Invalid position' }); return; } c.position = Math.floor(num); }

  async deleteLevelC(c: LevelC, event?: Event) {
    if (event) event.stopPropagation();
    if (!this.selectedB) return;

    const result = await Swal.fire({
      title: 'Confirm delete',
      text: `Delete Level C position "${c.position}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;

    // existing backend record -> call API
    if (c.id && c.id > 0) {
      this.cryoService.deleteLevelC(c.id).subscribe({
        next: (res: any) => {
          this.removeLocalLevelC(c);
          Swal.fire({ position: 'center', icon: 'success', title: res?.message || 'Level C deleted', showConfirmButton: false, timer: 1200 });
        },
        error: (err: any) => {
          Swal.fire({ icon: 'error', title: 'Delete failed', text: err?.error?.message || err?.message || 'Unable to delete Level C.' });
        }
      });
      return;
    }

    // local-only -> remove locally
    this.removeLocalLevelC(c);
    await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Level C removed.', timer: 800, showConfirmButton: false, position: 'center' });
  }

  private removeLocalLevelC(c: LevelC) {
    if (!this.selectedB) return;
    const idx = this.selectedB.levelCs.indexOf(c);
    if (idx > -1) {
      this.selectedB.levelCs.splice(idx, 1);
    }
  }

  // ----------------- update -----------------
  saveContainer() {
    if (this.cryoForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Please fill all required fields.' });
      return;
    }

    const containerDto: CryoContainerDto = {
      ID: this.containerId,
      FacilityID: 1,
      Description: this.cryoForm.value.description,
      IsSperm: !!this.cryoForm.value.isSperm,
      IsOocyteOrEmb: !!this.cryoForm.value.isOocyteOrEmb,
      LastAudit: this.cryoForm.value.lastAudit,
      MaxStrawsInLastLevel: this.cryoForm.value.maxStraws,
      CreatedBy: 1,
      LevelA: this.levelAs.map(a => ({
        ID: a.id,
        CanisterCode: a.code,
        CreatedBy: 1,
        LevelB: a.levelBs.map(b => ({
          ID: b.id,
          CaneCode: b.code,
          CreatedBy: 1,
          LevelC: b.levelCs.map(c => ({
            ID: c.id,
            StrawPosition: c.position,
            Status: 'Available',
            CreatedBy: 1
          }))
        }))
      }))
    };

    this.cryoService.updateContainer(this.containerId, containerDto).subscribe({
      next: (res: any) => {
        Swal.fire({ position: 'center', icon: 'success', title: res?.message || 'Cryo container updated!', showConfirmButton: false, timer: 1500 });
        this.router.navigate(['/cryo/cryo-management']);
      },
      error: (error: any) => {
        let msg = 'Update failed';
        if (error?.error?.message) msg = error.error.message;
        else if (error?.message) msg = error.message;
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
      }
    });
  }
}