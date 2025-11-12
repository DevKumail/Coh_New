import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { HasPermissionDirective } from '@/app/shared/directives/has-permission.directive';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { CryoContainerDto, CryoContainerResultDto } from '@/app/shared/Models/Cyro/cyro-container.model';
import { CryoManagementService } from '@/app/shared/Services/Cyro/cryo-management.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIcon, NgIconComponent } from '@ng-icons/core';
import { LucideAngularModule, LucideDelete, LucideEdit, LucideHome, LucideUsers } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cryo-container-list',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
        NgIcon,
        TranslatePipe,
        LucideAngularModule,
        HasPermissionDirective,
        GenericPaginationComponent,
        FilledOnValueDirective
    ],  templateUrl: './cryo-container-list.component.html',
  styleUrl: './cryo-container-list.component.scss',
   animations: [
        trigger('slideFade', [
          transition(':enter', [
            style({ height: 0, opacity: 0, overflow: 'hidden' }),
            animate('250ms ease-out', style({ height: '*', opacity: 1 }))
          ]),
          transition(':leave', [
            style({ height: '*', opacity: 1, overflow: 'hidden' }),
            animate('200ms ease-in', style({ height: 0, opacity: 0 }))
          ])
        ])
      ]
})
export class CryoContainerListComponent {
 /**
  *
  */
 CryoPagedData: CryoContainerResultDto[] = [];
FilterForm!: FormGroup;
@ViewChild('CryoToggler') CryoToggler?: ElementRef<HTMLButtonElement>;
CryoTotalItems = 0;
  isCryoFiltered = false;
  Type: any = []
PaginationInfo = {
  Page: 1,
  RowsPerPage: 10
};

 constructor(    
  public router: Router,
  private cryoService: CryoManagementService,
  private fb: FormBuilder
) { 

  
}
    protected readonly homeIcon = LucideHome;
    protected readonly headingIcon = LucideUsers;
      protected readonly editIcon = LucideEdit;
      protected readonly deleteIcon = LucideDelete;


     get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }

  }
  ngOnInit() {
    this.FilterForm = this.fb.group({
      description: [''],
      type: ['']
  })
  this.loadCryoContainers();
}
loadCryoContainers() {
  this.cryoService.getAllContainers(this.PaginationInfo.Page, this.PaginationInfo.RowsPerPage)
    .subscribe((res: any) => {
      this.CryoPagedData = res.data;
      this.CryoTotalItems = res.totalCount;
    });
}
onCryoPageChanged(page: number) {
  this.PaginationInfo.Page = page;
  this.loadCryoContainers();
}

editContainer(item: any) {
  this.router.navigate(['/cryo/cryo-management/edit', item.id]);
}

deleteContainer(id: number) {
  this.cryoService.deleteContainer(id).subscribe({
    next: (res: any) => {
      // show success alert then reload list
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: res?.message || 'Record deleted',
        showConfirmButton: false,
        timer: 1800,
      });
      this.loadCryoContainers();
    },
    error: (err: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: err?.error?.message || err?.message || 'Unable to delete record.',
      });
    }
  });
}

// Return display text for type based on boolean flags
getTypeText(item: CryoContainerResultDto): string {
  if (item.isSperm && item.isOocyteOrEmb) return 'BothGenders';
  if (item.isSperm) return 'Sperm';
  if (item.isOocyteOrEmb) return 'Ooc/Emb';
  return 'N/A';
}

ClearFilter() { 
  this.isCryoFiltered = false;
  this.collapseIfOpen(this.CryoToggler);
}

FilterCryo(){ 
  this.isCryoFiltered = !!( this.FilterForm?.value?.fromDate || this.FilterForm?.value?.toDate );
  this.collapseIfOpen(this.CryoToggler);
}

  private collapseIfOpen(toggler?: ElementRef<HTMLButtonElement>) {
    if (!toggler) return;
    const btn = toggler.nativeElement;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      btn.click();
    }
  }
}
