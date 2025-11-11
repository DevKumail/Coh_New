import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { CryoContainerDto } from '@/app/shared/Models/Cyro/cyro-container.model';
import { CryoManagementService } from '@/app/shared/Services/Cyro/cryo-management.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIconComponent } from '@ng-icons/core';
import { LucideAngularModule, LucideChevronRight, LucideHome, LucideUsers, LucideEdit2, LucideTrash2 } from 'lucide-angular';
import { FilePondModule } from 'ngx-filepond';
import { provideNgxMask } from 'ngx-mask';
import Swal from 'sweetalert2';

interface LevelC {
  id: number;
  position: number;
}

interface LevelB {
  id: number;
  code: string;
  levelCs: LevelC[];
}

interface LevelA {
  id: number;
  code: string;
  levelBs: LevelB[];
}


@Component({
  selector: 'app-cryo-container-add',
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
  templateUrl: './cryo-container-add.component.html',
  styleUrl: './cryo-container-add.component.scss'
})

export class CryoContainerAddComponent {
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

  constructor(private fb: FormBuilder,private cryoService: CryoManagementService,
  private router: Router) {
    this.cryoForm = this.fb.group({
      description: ['', Validators.required],
      location: [''],
      isSperm: [false],
      isOocyteOrEmb: [false],
      lastAudit: [''],
      maxStraws: ['']
    });
  }
 
  // Checkbox helpers for "type" (store as string[] in form control)
  isTypeSelected(type: string): boolean {
    const val = this.cryoForm.get('type')?.value;
    return Array.isArray(val) && val.includes(type);
  }

  onTypeToggle(event: Event, type: string) {
    const target = event.target as HTMLInputElement | null;
    const checked = !!target && target.checked;
    const control = this.cryoForm.get('type');
    const val = Array.isArray(control?.value) ? [...control!.value] : [];
    if (checked) {
      if (!val.includes(type)) val.push(type);
    } else {
      const idx = val.indexOf(type);
      if (idx > -1) val.splice(idx, 1);
    }
    control?.setValue(val);
  }

    addLevelA() {
      debugger;
    if (!this.newLevelA.trim()) return;

    this.levelAs.push({
      id: this.levelAs.length + 1,
      code: this.newLevelA.trim(),
      levelBs: []
    });

    this.newLevelA = '';
  }

  // ✅ Select Level A (to load Level B)
  selectA(a: LevelA) {
    this.selectedA = a;
    this.selectedB = null;
  }

  // ✅ Add Level B under selected Level A
  addLevelB() {
    if (!this.selectedA || !this.newLevelB.trim()) return;

    this.selectedA.levelBs.push({
      id: this.selectedA.levelBs.length + 1,
      code: this.newLevelB.trim(),
      levelCs: []
    });

    this.newLevelB = '';
  }

  // ✅ Select Level B (to load Level C)
  selectB(b: LevelB) {
    this.selectedB = b;
  }

  // ✅ Add Level C straw positions for selected Level B
  generateStraws() {
    if (!this.selectedB) return;

    this.selectedB.levelCs = Array.from(
      { length: this.newStrawsCount },
      (_, i) => ({ id: i + 1, position: i + 1 })
    );
  }

 saveContainer() {
  if (this.cryoForm.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all required fields.',
    });
    return;
  }
 
  const containerDto: CryoContainerDto = {
    ID: 0, // new container
    FacilityID: 1, // TODO: replace with actual facility id
    Description: this.cryoForm.value.description,
    IsSperm: !!this.cryoForm.value.isSperm,
    IsOocyteOrEmb: !!this.cryoForm.value.isOocyteOrEmb,
    LastAudit: this.cryoForm.value.lastAudit,
    MaxStrawsInLastLevel: this.cryoForm.value.maxStraws,
    CreatedBy: 1, // TODO: replace with actual user
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

  this.cryoService.saveContainer(containerDto).subscribe({
    next: (res: any) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: res?.message || 'Cryo container saved successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      this.router.navigate(['/cryo/containers']); // replace with actual route
    },
    error: (error: any) => {
      let errorMessage = 'Something went wrong';
      if (error?.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = JSON.stringify(error.error);
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: errorMessage,
      });
    }
  });
}

  // --------- New edit/delete helpers ----------

  // Edit Level A code (no restriction)
  editLevelA(a: LevelA, event?: Event) {
    if (event) event.stopPropagation();
    const next = window.prompt('Edit Level A code', a.code);
    if (next === null) return;
    a.code = String(next).trim() || a.code;
  }

  // Delete Level A only if it has no child LevelBs
  deleteLevelA(a: LevelA, event?: Event) {
    if (event) event.stopPropagation();
    if (a.levelBs && a.levelBs.length > 0) {
      // check deeper: if any LevelB still has LevelC, instruct to remove them first
      const hasCs = a.levelBs.some(b => b.levelCs && b.levelCs.length > 0);
      if (hasCs) {
        alert('Please remove Level C entries first, then Level B, then Level A.');
        return;
      }
      alert('Please remove Level B entries first, then delete this Level A.');
      return;
    }
    if (!confirm(`Delete Level A "${a.code}"?`)) return;
    const idx = this.levelAs.indexOf(a);
    if (idx > -1) {
      this.levelAs.splice(idx, 1);
      if (this.selectedA === a) {
        this.selectedA = null;
        this.selectedB = null;
      }
    }
  }

  // Edit Level B code (no restriction)
  editLevelB(b: LevelB, event?: Event) {
    if (event) event.stopPropagation();
    const next = window.prompt('Edit Level B code', b.code);
    if (next === null) return;
    b.code = String(next).trim() || b.code;
  }

  // Delete Level B only if it has no LevelC entries
  deleteLevelB(b: LevelB, event?: Event) {
    if (event) event.stopPropagation();
    if (b.levelCs && b.levelCs.length > 0) {
      alert('Please remove Level C entries first before deleting this Level B.');
      return;
    }
    if (!this.selectedA) return;
    if (!confirm(`Delete Level B "${b.code}"?`)) return;
    const idx = this.selectedA.levelBs.indexOf(b);
    if (idx > -1) {
      this.selectedA.levelBs.splice(idx, 1);
      if (this.selectedB === b) {
        this.selectedB = null;
      }
    }
  }

  // Edit Level C position (no restriction)
  editLevelC(c: LevelC, event?: Event) {
    if (event) event.stopPropagation();
    const next = window.prompt('Edit Level C position (number)', String(c.position));
    if (next === null) return;
    const num = Number(next);
    if (!Number.isFinite(num) || num <= 0) {
      alert('Invalid position');
      return;
    }
    c.position = Math.floor(num);
  }

  // Delete Level C
  deleteLevelC(c: LevelC, event?: Event) {
    if (event) event.stopPropagation();
    if (!this.selectedB) return;
    if (!confirm(`Delete Level C position "${c.position}"?`)) return;
    const idx = this.selectedB.levelCs.indexOf(c);
    if (idx > -1) {
      this.selectedB.levelCs.splice(idx, 1);
    }
  }
}


