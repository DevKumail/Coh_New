import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BirthComponent as BirthTabComponent } from './tabs/birth/birth.component';
import { FollowUpComponent } from './tabs/follow-up/follow-up.component';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import Swal from 'sweetalert2';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { Page } from '@/app/shared/enum/dropdown.enum';

@Component({
  selector: 'app-birth',
  standalone: true,
  imports: [CommonModule, BirthTabComponent, FollowUpComponent, FilledOnValueDirective],
  templateUrl: './birth.component.html',
  styleUrl: './birth.component.scss'
})
export class BirthComponent implements OnInit, AfterViewInit {
  @ViewChild(BirthTabComponent) birthTab?: BirthTabComponent;
  @ViewChild(FollowUpComponent) followUpTab?: FollowUpComponent;

  cycleId: number = 0;
  birthId: number | null = null;
  childrenCount: number = 0;
  isLoading: boolean = false;
  isSaving: boolean = false;
  private pendingChildrenCount: number = 0;
  dropdowns: any = [];
  AllDropdownValues: any = [];
  Country: any = [];
  genders: any = [];
  constructor(
    private route: ActivatedRoute,
    private ivfApi: IVFApiService,
    private sharedservice: SharedService
  ) { }

  ngOnInit(): void {
    this.getAlldropdown();
    this.FillCache();
    this.route.queryParamMap.subscribe((qp) => {
      const idStr = qp.get('cycleId');
      const id = Number(idStr);
      this.cycleId = Number.isFinite(id) && id > 0 ? id : 0;
      if (this.cycleId > 0) {
        this.loadBirthData();
      }
    });
  }



  FillCache() {
    this.sharedservice.getCacheItem({
      entities: [
        'RegGender',
        'RegCountries',
      ],
    })
      .subscribe((response: any) => {
        if (response.cache) {
          this.FillDropDown(
            JSON.parse(JSON.stringify(response)).cache
          );
        }
      })
  }

  FillDropDown(jParse: any) {
    const json = JSON.parse(jParse);

    let regcountries = JSON.parse(jParse).RegCountries;
    let reggender = JSON.parse(jParse).RegGender;

    if (regcountries) {
      regcountries = regcountries.map(
        (item: { CountryId: any; Name: any }) => {
          return {
            name: item.Name,
            code: item.CountryId,
          };
        }
      );

      this.Country = regcountries;
    }
    if (reggender) {
      reggender = reggender.map(
        (item: { GenderId: any; Gender: any }) => {
          return {
            name: item.Gender,
            code: item.GenderId,
          };
        }
      );

      this.genders = reggender;
    }
  }


  // Store payload from service for dynamic labels/options
  getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
    this.dropdowns = payload || {};
  }

  getAlldropdown() {
    this.sharedservice.getDropDownValuesByName(Page.IVFBirthEpisode).subscribe((res: any) => {
      this.AllDropdownValues = res;
      this.getAllDropdown(res);
    })
  }

  // Helper to read dropdown options by key
  options(key: string) {
    return (this.dropdowns && this.dropdowns[`IVFBirthEpisode:${key}`]) || [];
  }
  ngAfterViewInit(): void {
    // If data was loaded before ViewChild was ready, apply it now
    if (this.pendingChildrenCount > 0 && this.birthTab) {
      console.log('Applying pending children count:', this.pendingChildrenCount);
      this.birthTab.setChildrenCount(this.pendingChildrenCount);
      this.pendingChildrenCount = 0;
    }
  }

  loadBirthData() {
    this.isLoading = true;
    this.ivfApi.getEpisodeBirthByCycleId(this.cycleId).subscribe({
      next: (response: any) => {
        console.log('Birth data loaded:', response);
        if (response?.birth) {
          this.birthId = response.birth.birthId;
          this.childrenCount = response.birth.childrenCount || 0;

          console.log('Children count:', this.childrenCount);
          console.log('Birth tab component:', this.birthTab);

          // Pass data to child component
          if (this.birthTab) {
            console.log('Birth tab available, setting children count immediately');
            this.birthTab.isLoading = true;

            // Small delay to show skeleton
            setTimeout(() => {
              if (this.birthTab) {
                this.birthTab.setChildrenCount(this.childrenCount);
                if (response.birth.children) {
                  this.birthTab.bindChildrenData(response.birth.children);
                }
                this.birthTab.isLoading = false;
              }
            }, 300);
          } else {
            console.log('Birth tab not ready, storing pending count');
            this.pendingChildrenCount = this.childrenCount;
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Load birth error:', error);
        this.isLoading = false;
      }
    });
  }

  onSave() {
    if (!this.birthTab) {
      console.error('Birth tab not available');
      return;
    }

    const formData = this.birthTab.form.getRawValue();

    // Build payload
    const payload = {
      birthId: this.birthId || 0,
      ivfDashboardTreatmentCycleId: this.cycleId,
      statusId: 0,
      childrenCount: this.childrenCount,
      children: formData.children.map((child: any) => ({
        id: 0,
        birthId: this.birthId || 0,
        dateOfBirth: child.dateOfBirth || null,
        week: (child.week !== null && child.week !== undefined && child.week !== '') ? Number(child.week) : null,
        genderId: (child.gender && child.gender !== '' && child.gender !== '—') ? child.gender : null,
        deliveryMethodCategoryId: (child.deliveryMethod && child.deliveryMethod !== '' && child.deliveryMethod !== '—') ? child.deliveryMethod : null,
        weight: child.weight ? Number(child.weight) : 0,
        length: child.length ? Number(child.length) : 0,
        headCircumference: child.headCircumference ? Number(child.headCircumference) : 0,
        apgar1: (child.apgar1 !== null && child.apgar1 !== undefined && child.apgar1 !== '') ? Number(child.apgar1) : null,
        apgar5: (child.apgar5 !== null && child.apgar5 !== undefined && child.apgar5 !== '') ? Number(child.apgar5) : null,
        conditionCategoryId: (child.condition && child.condition !== '' && child.condition !== '—') ? child.condition : null,
        infantFeedingCategoryId: (child.infantFeeding && child.infantFeeding !== '' && child.infantFeeding !== '—') ? child.infantFeeding : null,
        deathPostPartumOn: child.deathPostPartumOn || null,
        diedPerinatallyOn: child.diedPerinatallyOn || null,
        identityNumber: child.identityNumber || null,
        firstName: child.firstName || null,
        surname: child.surname || null,
        placeOfBirth: child.placeOfBirth || null,
        countryId: (child.countryOfBirth && child.countryOfBirth !== '' && child.countryOfBirth !== '—') ? child.countryOfBirth : null,
        note: child.note || null,
        chromosomeAnomalyCategoryIds: (child.icd10Codes || []).filter((c: string) => c && c.trim() !== ''),
        congenitalMalformationCategoryIds: (child.malfCodes || []).filter((c: string) => c && c.trim() !== '')
      }))
    };

    console.log('Birth save payload:', payload);

    const isUpdate = this.birthId && this.birthId > 0;

    this.isSaving = true;
    this.ivfApi.saveEpisodeBirth(payload).subscribe({
      next: (response: any) => {
        console.log('Birth saved successfully:', response);
        this.isSaving = false;

        Swal.fire({
          icon: 'success',
          title: isUpdate ? 'Updated!' : 'Saved!',
          text: isUpdate ? 'Birth data updated successfully' : 'Birth data saved successfully',
          timer: 2000,
          showConfirmButton: false
        });

        // Reload data
        if (response?.birthId) {
          this.birthId = response.birthId;
        }
      },
      error: (error: any) => {
        console.error('Birth save error:', error);
        this.isSaving = false;

        let errorMessage = 'Failed to save birth data';
        if (error?.error?.errors) {
          const errors = Object.values(error.error.errors).flat();
          errorMessage = errors.join(', ');
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
