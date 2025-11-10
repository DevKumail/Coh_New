import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { IvfSearchService } from '@/app/shared/Services/IVF/ivf-search.service';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-ivf-home',
  templateUrl: './ivf-home.component.html',
  styleUrls: ['./ivf-home.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
      GenericPaginationComponent,
      TranslatePipe, NgIcon]
})
export class IVFHomeComponent {
  form: FormGroup;
  selectedTab: 'messages' | 'lab' | 'consents' | 'application' = 'messages';
  overview: Array<{
    woman: string;
    no: string | number;
    start: string;
    eggTreatment: string;
    partner: string;
    sperm: string;
    stimulation: string;
    stimProt: string;
    stimMed: string;
    triggering: string;
    trigMed: string;
    cycle: string;
  }> = [];
  pagination: any = {
        pageSize: 10,
        currentPage: 1,
      };
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private secureStorage: SecureStorageService
  ) {
    this.form = this.fb.group({
      femaleId: ['5'],
      maleId: ['2']
    });
  }
  ngOnInit() {
    this.secureStorage.getItem('testKey');
  }

  // subscribe to IVF search events published by topbar
  private ivfSearch = inject(IvfSearchService);
  private ivfApi = inject(IVFApiService);
  private patientBannerService = inject(PatientBannerService);
  private ivfSearchSub: any;

  ngAfterViewInit() {
    // subscribe once the component is initialized in the view
    this.ivfSearchSub = this.ivfSearch.search$.subscribe(mrNo => {
      if (!mrNo) return;
      // Call IVF API and ensure patient banner does not open
      this.ivfApi.getCoupleData(mrNo).subscribe({
        next: (res: any) => {
          console.log('IVF couple data (from ivf-home):', res);
          // Keep patient banner closed for IVF searches
          try {
            this.patientBannerService.setPatientData(null);
          } catch (e) {
            // service may not be available in some contexts
          }
          // TODO: expose this data to the ivf component view (store in a property / pass to child)
        },
        error: (err: any) => {
          console.error('Failed to fetch IVF couple data', err);
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.ivfSearchSub) {
      this.ivfSearchSub.unsubscribe();
    }
  }

  viewSummary(side: 'female' | 'male') {
    // placeholder: wire to summary view when available
    this.router.navigate([`/ivf/patient-summary`], { queryParams: { id: side === 'female' ? this.form.value.femaleId : this.form.value.maleId } });
    console.log('View summary clicked for', side, 'ID:', side === 'female' ? this.form.value.femaleId : this.form.value.maleId);
  }
}
