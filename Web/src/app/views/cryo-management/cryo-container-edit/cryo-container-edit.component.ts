import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CryoManagementService } from '@/app/shared/Services/Cyro/cryo-management.service';
import { CryoContainerDto } from '@/app/shared/Models/Cyro/cyro-container.model';
import { NgIconComponent } from '@ng-icons/core';
import { LucideAngularModule, LucideChevronRight, LucideHome, LucideUsers, LucideEdit2, LucideTrash2 } from 'lucide-angular';
import { FilePondModule } from 'ngx-filepond';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { provideNgxMask } from 'ngx-mask';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
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
        Swal.fire({ icon: 'error', title: 'Load failed', text: 'Unable to load container.' });
        this.router.navigate(['/cryo/cryo-management']);
      }
    });
  }

  // reuse create behaviour for levels (add/select/generate/delete/edit)
  addLevelA() {
    if (!this.newLevelA.trim()) return;
    this.levelAs.push({ id: this.levelAs.length + 1, code: this.newLevelA.trim(), levelBs: [] });
    this.newLevelA = '';
  }
  selectA(a: LevelA) { this.selectedA = a; this.selectedB = null; }
  addLevelB() {
    if (!this.selectedA || !this.newLevelB.trim()) return;
    this.selectedA.levelBs.push({ id: this.selectedA.levelBs.length + 1, code: this.newLevelB.trim(), levelCs: [] });
    this.newLevelB = '';
  }
  selectB(b: LevelB) { this.selectedB = b; }
  generateStraws() {
    if (!this.selectedB) return;
    this.selectedB.levelCs = Array.from({ length: this.newStrawsCount }, (_, i) => ({ id: i + 1, position: i + 1 }));
  }

  // edit/delete functions same as create component (you can reuse implementations)
  editLevelA(a: LevelA, event?: Event) { if (event) event.stopPropagation(); const next = window.prompt('Edit Level A code', a.code); if (next === null) return; a.code = String(next).trim() || a.code; }
  async deleteLevelA(a: LevelA, event?: Event) { if (event) event.stopPropagation();
    const childCountB = a.levelBs?.length || 0;
    const childCountC = a.levelBs?.reduce((acc, b) => acc + (b.levelCs?.length || 0), 0) || 0;
    const message = childCountB || childCountC ? `Deleting "${a.code}" will also remove ${childCountB} Level B and ${childCountC} Level C item(s). Continue?` : `Delete Level A "${a.code}"?`;
    const result = await Swal.fire({ title: 'Confirm delete', text: message, icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete' });
    if (!result.isConfirmed) return;
    const idx = this.levelAs.indexOf(a); if (idx > -1) { this.levelAs.splice(idx, 1); if (this.selectedA === a) { this.selectedA = null; this.selectedB = null; } await Swal.fire({ icon: 'success', title: 'Deleted', timer: 1000, showConfirmButton: false }); } }

  editLevelB(b: LevelB, event?: Event) { if (event) event.stopPropagation(); const next = window.prompt('Edit Level B code', b.code); if (next === null) return; b.code = String(next).trim() || b.code; }
  async deleteLevelB(b: LevelB, event?: Event) { if (event) event.stopPropagation(); if (!this.selectedA) return;
    const childCountC = b.levelCs?.length || 0;
    const message = childCountC ? `Deleting "${b.code}" will also remove ${childCountC} Level C item(s). Continue?` : `Delete Level B "${b.code}"?`;
    const result = await Swal.fire({ title: 'Confirm delete', text: message, icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete' });
    if (!result.isConfirmed) return;
    const idx = this.selectedA.levelBs.indexOf(b);
    if (idx > -1) { this.selectedA.levelBs.splice(idx, 1); if (this.selectedB === b) this.selectedB = null; await Swal.fire({ icon: 'success', title: 'Deleted', timer: 1000, showConfirmButton: false }); } }

  editLevelC(c: LevelC, event?: Event) { if (event) event.stopPropagation(); const next = window.prompt('Edit Level C position (number)', String(c.position)); if (next === null) return; const num = Number(next); if (!Number.isFinite(num) || num <= 0) { Swal.fire({ icon: 'error', title: 'Invalid position' }); return; } c.position = Math.floor(num); }
  async deleteLevelC(c: LevelC, event?: Event) { if (event) event.stopPropagation(); if (!this.selectedB) return; const result = await Swal.fire({ title: 'Confirm delete', text: `Delete Level C position "${c.position}"?`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete' }); if (!result.isConfirmed) return; const idx = this.selectedB.levelCs.indexOf(c); if (idx > -1) { this.selectedB.levelCs.splice(idx, 1); await Swal.fire({ icon: 'success', title: 'Deleted', timer: 800, showConfirmButton: false }); } }

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