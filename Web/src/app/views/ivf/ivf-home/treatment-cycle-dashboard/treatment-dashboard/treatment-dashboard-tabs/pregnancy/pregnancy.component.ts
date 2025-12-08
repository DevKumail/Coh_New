import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UltrasoundComponent } from './tabs/ultrasound/ultrasound.component';
import { ProgressComponent } from './tabs/progress/progress.component';
import { Page } from '@/app/shared/enum/dropdown.enum';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';


@Component({  
  selector: 'app-pregnancy',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ProgressComponent, 
    UltrasoundComponent,
    FilledOnValueDirective
  ],
  templateUrl: './pregnancy.component.html',
  styleUrl: './pregnancy.component.scss'
})
export class PregnancyComponent implements OnInit {
  cycleId: number = 0;
  pregnancyId: number = 0;
  form: FormGroup;
  dropdowns: any = [];
  AllDropdownValues: any = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  @ViewChild(ProgressComponent) progress?: ProgressComponent;
  @ViewChild(UltrasoundComponent) ultrasound?: UltrasoundComponent;

  
  constructor(
    private fb: FormBuilder,
    private sharedservice: SharedService,
    private ivfApi: IVFApiService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      cycleOutcome: [null],
      positivePgTest: [null],
      lastHcg: [null],
    });
  }

  ngOnInit(): void {
    this.getAlldropdown();

    this.route.queryParamMap.subscribe((qp) => {
      const idStr = qp.get('cycleId');
      const id = Number(idStr);
      this.cycleId = Number.isFinite(id) && id > 0 ? id : 0;
      if (this.cycleId > 0) {
        this.loadPregnancyData();
      }
    });
  }


    // Store payload from service for dynamic labels/options
    getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
      this.dropdowns = payload || {};
    }
  
    getAlldropdown() {
      this.sharedservice.getDropDownValuesByName(Page.IVFPregnancyEpisode).subscribe((res: any) => {
        this.AllDropdownValues = res;
        this.getAllDropdown(res);
      })
    }
  
    // Helper to read dropdown options by key
    options(key: string) {
      return (this.dropdowns && this.dropdowns[`IVFPregnancyEpisode:${key}`]) || [];
    }

  loadPregnancyData() {
    this.isLoading = true;
    this.ivfApi.getEpisodePregnancyByCycleId(this.cycleId).subscribe({
      next: (response) => {
        console.log('Pregnancy data loaded:', response);
        if (response && response.pregnancy) {
          this.bindPregnancyData(response.pregnancy);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Load pregnancy error:', error);
        this.isLoading = false;
      }
    });
  }

  bindPregnancyData(data: any) {
    console.log('bindPregnancyData called with:', data);
    
    // Store pregnancy ID for update
    this.pregnancyId = data.pregnancyId || 0;

    // Bind top form (main pregnancy component)
    this.form.patchValue({
      cycleOutcome: data.statusId || null,
      positivePgTest: data.progress?.positivePgtestCategoryId || null,
      lastHcg: data.progress?.lastbhCGDate ? this.formatDateForInput(data.progress.lastbhCGDate) : null
    });

    console.log('Top form patched');

    // Wait for ViewChild to be available
    setTimeout(() => {
      // Bind progress tab data
      if (this.progress && data.progress?.pregnancy) {
        console.log('Progress component found, binding data');
        const pregnancyData = data.progress.pregnancy;
        
        // Patch basic fields
        this.progress.form.patchValue({
          clinicalPregnancyDate: pregnancyData.pregnancyDeterminedOnDate ? this.formatDateForInput(pregnancyData.pregnancyDeterminedOnDate) : null,
          embryoCount: pregnancyData.intrauterineCategoryId || null,
          amnioticExtrauterine: pregnancyData.extrauterineCategoryId || null,
          editorContent: pregnancyData.notes || '',
          fetalPathology: pregnancyData.fetalPathologyComplicationCategoryId || null,
          compUntil20: this.extractComplicationIds(pregnancyData.complicationsUntil20th),
          compAfter20: this.extractComplicationIds(pregnancyData.complicationsAfter20th)
        });

        console.log('Progress form patched');

        // Bind embryos
        if (pregnancyData.embryos && pregnancyData.embryos.length > 0) {
          console.log('Binding embryos:', pregnancyData.embryos);
          this.bindEmbryos(pregnancyData.embryos);
        }
      } else {
        console.warn('Progress component not found or no pregnancy data');
      }
    }, 100);
  }

  // Format date from API (ISO string) to input format (YYYY-MM-DD)
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  extractComplicationIds(complications: any[]): number[] {
    if (!complications || !Array.isArray(complications)) return [];
    return complications
      .map((c: any) => c.complicationUntil20thWeekCategoryId || c.complicationAfter20thWeekCategoryId)
      .filter((id: any) => id != null);
  }

  bindEmbryos(embryos: any[]) {
    if (!this.progress) return;

    const embryosArray = this.progress.embryosFA;
    
    // Clear existing
    while (embryosArray.length > 0) {
      embryosArray.removeAt(0);
    }

    // Update embryosData
    this.progress.embryosData = [];
    
    embryos.forEach((embryo: any, index: number) => {
      this.progress!.embryosData.push({ 
        key: index + 1, 
        label: `HB Embryo ${index + 1}` 
      });
      
      embryosArray.push(
        this.fb.group({
          checked: [true],
          progress1: [embryo.pgProgressUntil24thWeekCategoryId || null],
          progress2: [null],
          note: [embryo.note || '']
        })
      );
    });

    this.progress.selectedEmbryoCount = embryos.length;
  }
  


  onSave() {
    const topData = this.form.getRawValue();
    const progressData = this.progress ? this.progress.form.getRawValue() : null;
    
    if (!progressData) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Progress data is required',
      });

      return;
    }

    // Build payload according to API structure
    const payload = this.buildPayload(topData, progressData);
    
    console.log('Pregnancy save payload:', payload);
    
    this.isSaving = true;
    this.ivfApi.saveEpisodePregnancy(payload).subscribe({
      next: (response) => {
        console.log('Save response:', response);
        
        // Update pregnancyId after successful save
        if (response && response.pregnancyId) {
          this.pregnancyId = response.pregnancyId;
        }
        
        this.isSaving = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Pregnancy data saved successfully',
        });
        
        // Reload data to ensure form is in sync
        this.loadPregnancyData();
      },
      error: (error) => {
        console.error('Save error:', error);
        console.error('Error details:', error.error);
        console.error('Validation errors:', error.error?.errors);
        this.isSaving = false;
        
        // Extract validation errors if available
        let errorMessage = 'Failed to save pregnancy data';
        if (error.error?.errors) {
          const errors = Object.values(error.error.errors).flat();
          errorMessage = errors.join(', ');
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: errorMessage,
        });
      }
    });
  }

  private buildPayload(topData: any, progressData: any) {
    // Map embryos
    const embryos = (progressData.embryos || []).map((embryo: any, index: number) => ({
      embryoId: 0,
      pregnancyId: this.pregnancyId,
      pgProgressUntil24thWeekCategoryId: embryo.progress1 || null,
      note: embryo.note || null,
      imageId: 0
    }));

    // Map complications until 20th week
    const complicationsUntil20th = (progressData.compUntil20 || []).length > 0
      ? (progressData.compUntil20 || []).map((compId: any) => ({
          complicationUntil20thId: 0,
          pregnancyId: this.pregnancyId,
          complicationUntil20thWeekCategoryId: compId || null
        }))
      : null;

    // Map complications after 20th week
    const complicationsAfter20th = (progressData.compAfter20 || []).length > 0
      ? (progressData.compAfter20 || []).map((compId: any) => ({
          complicationAfter20thId: 0,
          pregnancyId: this.pregnancyId,
          complicationAfter20thWeekCategoryId: compId || null
        }))
      : null;

    return {
      pregnancyId: this.pregnancyId,
      ivfDashboardTreatmentCycleId: this.cycleId,
      statusId: topData.cycleOutcome || null,
      progress: {
        id: 0,
        pregnancyId: this.pregnancyId,
        cycleOutcomeCategoryId: topData.cycleOutcome || null,
        positivePgtestCategoryId: topData.positivePgTest || null,
        lastbhCGDate: topData.lastHcg || null,
        ultrasound: {
          ultrasoundId: 0
        },
        pregnancy: {
          pregnancyDeterminedOnDate: progressData.clinicalPregnancyDate || null,
          intrauterineCategoryId: progressData.embryoCount || null,
          extrauterineCategoryId: progressData.amnioticExtrauterine || null,
          notes: progressData.editorContent || null,
          fetalPathologyComplicationCategoryId: progressData.fetalPathology || null,
          embryos: embryos,
          complicationsUntil20th: complicationsUntil20th,
          complicationsAfter20th: complicationsAfter20th
        }
      }
    };
  }
}
