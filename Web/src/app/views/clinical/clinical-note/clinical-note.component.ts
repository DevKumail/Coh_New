import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgIconComponent } from '@ng-icons/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '@core/services/loader.service';

@Component({
  selector: 'app-clinical-note',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericPaginationComponent,
    TranslatePipe,
    FormsModule,
    NgIconComponent,
  ],
  templateUrl: './clinical-note.component.html',
  styleUrl: './clinical-note.component.scss'
})
export class ClinicalNoteComponent {
    SearchPatientData: any;
    speechtotxt: any[] = [];
    pagegination: any = {
        pageSize: 10,
        currentPage: 1,
      };
    clinicalnoteTotalItems: any= 0;
    private patientDataSubscription: Subscription | undefined;

    // Modal form and data
    modalForm: FormGroup;
    providers: any[] = [];
    clinicalNotes: any[] = [];
    macroList: any[] = [];
    selectedNoteType: string = ''; // 'structured', 'ai', 'freetext'
    cacheItems: string[] = ['Provider'];
    isProviderSelected: boolean = false;

      constructor(
        private apiservice: ClinicalApiService,
        private PatientData: PatientBannerService,
        private router: Router,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private loader: LoaderService
    ) {
      this.modalForm = this.fb.group({
        provider: [null, Validators.required],
        note: [{ value: '', disabled: true }],
        macro: [{ value: '', disabled: true }]
      });
    }

        async ngOnInit(){
        this.patientDataSubscription = this.PatientData.patientData$
        .pipe(
          filter((data: any) => !!data?.table2?.[0]?.mrNo),
          distinctUntilChanged((prev, curr) =>
            prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
          )
        )
        .subscribe((data: any) => {
          console.log(' Subscription triggered with MRNO:', data?.table2?.[0]?.mrNo);
          this.SearchPatientData = data;
          this.speechtoText();
        });

        // Subscribe to provider changes
        this.modalForm.get('provider')?.valueChanges.subscribe((val: any) => {
          const code = Number(val) || 0;
          this.isProviderSelected = !!val; // Set to true if provider has value
          this.GetNotesEmployeeId(code);
        });

        // Subscribe to template changes - clear macro when template is selected
        this.modalForm.get('note')?.valueChanges.subscribe((val: any) => {
          if (val && this.selectedNoteType === 'structured') {
            this.modalForm.patchValue({ macro: null }, { emitEvent: false });
          }
        });

        // Subscribe to macro changes - clear template when macro is selected
        this.modalForm.get('macro')?.valueChanges.subscribe((val: any) => {
          if (val && this.selectedNoteType === 'structured') {
            this.modalForm.patchValue({ note: null }, { emitEvent: false });
          }
        });

        this.modalForm.get('provider')?.valueChanges.subscribe(value => {
            if (value) {
            this.modalForm.get('note')?.enable();
            this.modalForm.get('macro')?.enable();
            } else {
            this.modalForm.get('note')?.disable();
            this.modalForm.get('macro')?.disable();
            }
            });
    }

        speechtoText() {
        if(!this.SearchPatientData?.table2?.[0]?.mrNo) {
        Swal.fire('Error', 'MRN not found for the Load patient', 'error');
        return;
        }
    const MRN = this.SearchPatientData?.table2?.[0]?.mrNo;
      this.apiservice.SpeechtoText(MRN, this.pagegination.currentPage,this.pagegination.pageSize).then((res: any) => {
      console.log('Speech To Text RESULT: ', res);

        this.speechtotxt = res.table1;
        this.clinicalnoteTotalItems = res.table2[0]?.totalCount || 0;
      });
    }

  openNoteTypeModal(content: any) {
    this.modalForm.reset();
    this.clinicalNotes = [];
    this.selectedNoteType = '';
    this.FillCache();
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  selectNoteType(type: string) {
    this.selectedNoteType = type;

    // Update form validators based on note type
    const providerCtrl = this.modalForm.get('provider');
    const noteCtrl = this.modalForm.get('note');
    const macroCtrl = this.modalForm.get('macro');

    if (type === 'freetext') {
      // Make fields optional for free text
      providerCtrl?.clearValidators();
      noteCtrl?.clearValidators();
      macroCtrl?.clearValidators();
    } else if (type === 'structured') {
      // For structured: provider is required, either note or macro is required
      providerCtrl?.setValidators([Validators.required]);
      noteCtrl?.clearValidators();
      macroCtrl?.clearValidators();
    } else {
      // For AI: provider and note are required
      providerCtrl?.setValidators([Validators.required]);
      noteCtrl?.setValidators([Validators.required]);
      macroCtrl?.clearValidators();
    }

    providerCtrl?.updateValueAndValidity();
    noteCtrl?.updateValueAndValidity();
    macroCtrl?.updateValueAndValidity();
  }

  FillCache() {
    this.apiservice
      .getCacheItem({ entities: this.cacheItems })
      .then((response: any) => {
        if (response && response.cache) {
          this.FillDropDown(response);
        }
      })
      .catch((error: any) =>
        Swal.fire('Error', error?.message || 'Failed to load cache', 'error')
      );
  }

  FillDropDown(response: any) {
    const jParse = JSON.parse(JSON.stringify(response)).cache;
    let provider = JSON.parse(jParse).Provider;
    if (provider) {
      provider = provider.map((item: any) => ({ name: item.FullName, code: item.EmployeeId }));
      this.providers = provider;
    }
  }

  GetNotesEmployeeId(providerCode: any) {
    if (providerCode == null || providerCode == undefined) providerCode = 0;
    const selectedProvider = Number(providerCode) || 0;
    if (selectedProvider === 250) providerCode = 197;

    this.clinicalNotes = [];
    this.macroList = [];
    this.modalForm.patchValue({ note: null, macro: null });
    this.loader.show();

    this.apiservice.EMRNotesGetByEmpId(providerCode).then((res: any) => {
      this.clinicalNotes = res.result || [];
      // For now, using same API for macro - will be updated in future
      this.macroList = res.result || [];
      this.loader.hide();
    }).catch((e: any) => {
      Swal.fire('Error', 'Error loading notes', 'error');
      this.loader.hide();
    });
  }

  createNote(modal: any) {
    // Validation for structured notes - must select either template or macro
    if (this.selectedNoteType === 'structured') {
      const noteValue = this.modalForm.get('note')?.value;
      const macroValue = this.modalForm.get('macro')?.value;

      if (!noteValue && !macroValue) {
        Swal.fire('Warning', 'Please select either Template or Macro', 'warning');
        this.modalForm.markAllAsTouched();
        return;
      }
    }

    // Validation for AI notes
    if (this.selectedNoteType === 'ai' && this.modalForm.invalid) {
      Swal.fire('Warning', 'Please select both Provider and Template', 'warning');
      this.modalForm.markAllAsTouched();
      return;
    }

    const providerValue = this.modalForm.get('provider')?.value;
    const noteValue = this.modalForm.get('note')?.value;
    const macroValue = this.modalForm.get('macro')?.value;

    modal.close();

    // Build query params object
    const queryParams: any = {};
    if (providerValue) queryParams.provider = providerValue;
    if (noteValue) queryParams.template = noteValue;
    if (macroValue) queryParams.macro = macroValue;

    switch(this.selectedNoteType) {
      case 'structured':
        this.router.navigate(['/clinical/create-structured-notes'], { queryParams });
        break;
      case 'ai':
        this.router.navigate(['/clinical/create-notes'], { queryParams });
        break;
      case 'freetext':
        const freetextParams = Object.keys(queryParams).length > 0 ? { queryParams } : {};
        this.router.navigate(['/clinical/create-free-text-notes'], freetextParams);
        break;
    }
  }

  isCreateEnabled(): boolean {
    // For freetext, always enabled
    if (this.selectedNoteType === 'freetext') return true;

    // For structured, check if provider and (template OR macro) are selected
    if (this.selectedNoteType === 'structured') {
      const providerValue = this.modalForm.get('provider')?.value;
      const noteValue = this.modalForm.get('note')?.value;
      const macroValue = this.modalForm.get('macro')?.value;
      return !!(providerValue && (noteValue || macroValue));
    }

    // For AI, check if form is valid
    return this.modalForm.valid && this.selectedNoteType !== '';
  }

  goBackToStep1() {
    this.selectedNoteType = '';
    this.modalForm.reset();
    this.clinicalNotes = [];
    this.macroList = [];
    this.isProviderSelected = false; // Reset when going back
  }

  async onallergiePageChanged(page: number) {
    this.pagegination.currentPage = page;
    await this.speechtoText();
  }

  ngOnDestroy(): void {
    if (this.patientDataSubscription) {
      this.patientDataSubscription.unsubscribe();
    }
  }
}

