import { Component, inject, OnInit } from '@angular/core';
import { SideMenuComponent } from "./components/side-menu/side-menu.component";
import { ContentSectionComponent } from "./components/content-section/content-section.component";
import { NotesComponent } from "./components/notes/notes.component";
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-summary',
  imports: [SideMenuComponent, ContentSectionComponent, NotesComponent],
  templateUrl: './patient-summary.component.html',
  styleUrl: './patient-summary.component.scss'
})
export class PatientSummaryComponent implements OnInit {
 
  patientBannerService = inject(PatientBannerService);
  router = inject(Router)

  ngOnInit(): void {
    this.patientBannerService.patientData$.subscribe(data => {
      if (!data) {
        console.log("triggered!")
        this.router.navigate(['/dashboards/dashboard-2']); 
      }
    });
  }
}
