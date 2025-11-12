import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgIconComponent } from '@ng-icons/core';
import { Router } from '@angular/router';

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
      constructor(
        private apiservice: ClinicalApiService,
        private PatientData: PatientBannerService,
        private router: Router
    ) { }


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

            buttonRoute(path: string) {
                console.log('Button Route', path);
                this.router.navigate(['/clinical/create-notes']);
        }

async onallergiePageChanged(page: number) {
  this.pagegination.currentPage = page;
  await this.speechtoText();
}
}

