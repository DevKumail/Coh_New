import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '@core/services/loader.service';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIconComponent } from '@ng-icons/core';
import { ClinicalApiService } from '../../clinical/clinical.api.service';
import { LucideAngularModule, LucideChevronRight, LucideHome, LucideUsers, LucideEdit2, LucideTrash2, LucidePlus, LucideMinus, LucideX } from 'lucide-angular';

@Component({
  selector: 'app-dropdown-configration',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbNavModule,
    NgIconComponent,
    TranslatePipe,
    GenericPaginationComponent,
    FilledOnValueDirective,
    LucideAngularModule,
  ],
  templateUrl: './dropdown-configration.component.html',
  styleUrl: './dropdown-configration.component.scss'
})
export class DropdownConfigrationComponent {
  protected readonly homeIcon = LucideHome;
  protected readonly chevronRightIcon = LucideChevronRight;
  protected readonly plusIcon = LucidePlus;
  protected readonly minusIcon = LucideMinus;
  protected readonly crossIcon = LucideX;

  dropdownListData: any = [];
  AddForm!: FormGroup;
  dropdownlistPaginationInfo: any = {
    Page: 1,
    RowsPerPage: 10,
  };
  modalService = new NgbModal();
  CatogaryListData: any = [];
  // Available categories for the dropdown (populate as needed)
  availableCategories: string[] = [
    'Category 1',
    'Category 2',
    'Category 3',
  ];
  // Items added within the modal session
  modalItems: { categoryName: string; description: string }[] = [];
  // Tracks locked category once first item is added
  lockedCategoryName: string | null = null;
  // Validation flag for attempting to add mismatched category
  categoryMismatch: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clinicalApiService: ClinicalApiService, 
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {
    this.AddForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.GetDropdownListData();
  }



  onEdit(record: any) {
    console.log(record);
  }


  GetDropdownListData(){
    this.clinicalApiService.GetAllCategories().then((res:any)=>{
      this.dropdownListData = res;
    })
  }

    modalRefInstance: any;

  onAddUpdateDropdownConfiguration(modalRef: TemplateRef<any>){
     this.AddForm.patchValue({
      categoryName: '',
      description: '',
    });
    this.lockedCategoryName = null;
    this.categoryMismatch = false;
    this.AddForm.get('categoryName')?.enable({ emitEvent: false });
    this.modalItems = [];

    this.modalRefInstance = this.modalService.open(modalRef, {
      backdrop: 'static',
      size: 'xl',
      centered: true
    });
    this.modalRefInstance.result.then((result: any) => {
      if (result) {
        console.log('Modal returned:', result);
      }
    }).catch(() => {
      // Modal dismissed without selecting
      console.log('Modal dismissed');
    });
  }

  Save(){
    
  }

  onDelete(id:any){
    
  }

  addItem(){
    if (this.AddForm.invalid) {
      this.AddForm.markAllAsTouched();
      return;
    }
    const categoryName = this.AddForm.get('categoryName')?.value?.toString().trim();
    const description = this.AddForm.get('description')?.value?.toString().trim();
    if (!categoryName || !description) return;

    // If already locked, ensure same category
    if (this.lockedCategoryName && categoryName !== this.lockedCategoryName) {
      this.categoryMismatch = true;
      return;
    }

    // First add: lock category and disable control
    if (!this.lockedCategoryName) {
      this.lockedCategoryName = categoryName;
      this.AddForm.get('categoryName')?.disable({ emitEvent: false });
    }

    this.categoryMismatch = false;
    this.modalItems.push({ categoryName, description });
    this.AddForm.get('description')?.reset('');
  }

  removeLastItem(){
    if (this.modalItems.length > 0) {
      this.modalItems.pop();
    }
    // If list becomes empty, unlock category and enable control
    if (this.modalItems.length === 0) {
      this.lockedCategoryName = null;
      this.categoryMismatch = false;
      this.AddForm.get('categoryName')?.enable({ emitEvent: false });
    }
  }

  removeItemAt(index: number){
    if (index > -1 && index < this.modalItems.length) {
      this.modalItems.splice(index, 1);
    }
    if (this.modalItems.length === 0) {
      this.lockedCategoryName = null;
      this.categoryMismatch = false;
      this.AddForm.get('categoryName')?.enable({ emitEvent: false });
    }
  }

}
