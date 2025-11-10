import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicalActivityService, ClinicalActivity } from '@/app/shared/Services/clinical-activity.service';
import { Subscription } from 'rxjs';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';

@Component({
  selector: 'app-notes',
  imports: [CommonModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit, OnDestroy {
  activities: ClinicalActivity[] = [];
  private subscription!: Subscription;
  SelectedVisit: any;
  
  constructor(
    private clinicalActivityService: ClinicalActivityService,
    private PatientData: PatientBannerService) {}

  ngOnInit(): void {
    
    this.subscription = this.clinicalActivityService.activities$.subscribe(
      (activities) => {
        this.subscription = this.PatientData.selectedVisit$.subscribe((data: any) => {
          if (data) {
          this.SelectedVisit = data;
        }
      });
        this.activities = activities;

      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



  clearAll(): void {
    this.clinicalActivityService.clearActivities();
  }
}
