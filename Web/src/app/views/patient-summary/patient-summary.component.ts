import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from "./components/side-menu/side-menu.component";
import { ContentSectionComponent } from "./components/content-section/content-section.component";
import { NotesComponent } from "./components/notes/notes.component";
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-summary',
  imports: [CommonModule, SideMenuComponent, ContentSectionComponent, NotesComponent],
  templateUrl: './patient-summary.component.html',
  styleUrl: './patient-summary.component.scss'
})
export class PatientSummaryComponent implements OnInit {

  patientBannerService = inject(PatientBannerService);
  router = inject(Router)
  leftCollapsed = false;
  rightCollapsed = false;
  selectedId: string = 'summary';
  offset = 120; // px: used in CSS var --patient-summary-offset
constructor(private Aroute: ActivatedRoute) {}

  ngOnInit(): void {
    this.patientBannerService.patientData$.subscribe(data => {
      if (!data) {
        console.log("triggered!")
        this.router.navigate(['/dashboards/dashboard-2']);
      }
    });

const id: any = this.Aroute.snapshot.queryParamMap.get('id');
    if (id == 2) {
        this.selectedId = 'patient-document';
    }
  }

  toggleLeft(): void {
    this.leftCollapsed = !this.leftCollapsed;
  }

  toggleRight(): void {
    this.rightCollapsed = !this.rightCollapsed;
  }

  onSelect(id: string): void {
    this.selectedId = id;
  }
}
