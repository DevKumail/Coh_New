import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IVF_ROUTES } from './ivf.routes';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { take, filter } from 'rxjs';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(IVF_ROUTES)
  ]
})
export class IVFModule {
  constructor(
    private patientBannerService: PatientBannerService,
    private ivfApi: IVFApiService
  ) {
        // Wait until patientData$ emits a value that has a valid mrNo (rehydration is async)
        this.patientBannerService.patientData$
          .pipe(
            filter((pd: any) => !!(pd?.table2?.[0]?.mrNo)),
            take(1)
          )
          .subscribe((pd: any) => {
            const mrNo = String(pd.table2[0].mrNo);
            this.ivfApi.getCoupleData(mrNo).subscribe({
              next: (res: any) => {
                try {
                  this.patientBannerService.setIVFPatientData(null);
                  this.patientBannerService.setIVFPatientData(res);
                } catch {}
              },
              error: (err: any) => {
                console.error('Failed to fetch IVF couple data (init)', err);
              }
            });
          });

    // this.patientBannerService.setIVFPatientData(null);
  }
}
