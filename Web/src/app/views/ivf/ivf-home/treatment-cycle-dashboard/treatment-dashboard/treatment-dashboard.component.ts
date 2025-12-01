import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CycleAspirationComponent } from './treatment-dashboard-tabs/aspiration/cycle-aspiration.component';
import { CultureComponent } from './treatment-dashboard-tabs/culture/culture.component';
import { LutealPhaseComponent } from './treatment-dashboard-tabs/luteal-phase/luteal-phase.component';
import { PregnancyComponent } from './treatment-dashboard-tabs/pregnancy/pregnancy.component';
import { TransferComponent } from './treatment-dashboard-tabs/transfer/transfer.component';
import { BirthComponent } from './treatment-dashboard-tabs/birth/birth.component';
import { CycleOverviewComponent } from './treatment-dashboard-tabs/cycle-overview/cycle-overview.component';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';

@Component({
  selector: 'app-treatment-dashboard',
  standalone: true,
  imports: [CommonModule, CycleOverviewComponent, CycleAspirationComponent, CultureComponent, TransferComponent, LutealPhaseComponent, PregnancyComponent, BirthComponent ],
  templateUrl: './treatment-dashboard.component.html',
  styleUrl: './treatment-dashboard.component.scss'
})
export class TreatmentDashboardComponent implements OnInit, OnDestroy {
  
   isSaving = false;

   
   activeTab: 'Overview' | 'Aspiration' | 'Culture' | 'Transfer' | 'Luteal phase' | 'Pregnancy' | 'Birth' | 'Summaries' = 'Overview';

  private subs = new Subscription();
  private lastMrNo: string | null = null;

  constructor(
    private router: Router,
    private banner: PatientBannerService,
    @Optional() public activeModal?: NgbActiveModal
  ) {}

  setTab(tab: 'Overview' | 'Aspiration' | 'Culture' | 'Transfer' | 'Luteal phase' | 'Pregnancy' | 'Birth' | 'Summaries') {
    this.activeTab = tab;
  }

  onSave(payload: any) {
    // TODO: integrate API when available
    // console.log('Cycle save payload', payload);
  }

  backToList() {
    this.router.navigate(['ivf/dashboard']);
  }

  ngOnInit(): void {
    const s = this.banner.patientData$.subscribe((pd) => {
      const mr = this.safeMr(pd);
      if (!mr) {
        this.router.navigate(['ivf/dashboard']);
        return;
      }
      if (this.lastMrNo && mr !== this.lastMrNo) {
        this.router.navigate(['ivf/dashboard']);
        return;
      }
      this.lastMrNo = mr;
    });
    this.subs.add(s);
    const currentMr = this.safeMr(this.banner.getPatientData());
    if (!currentMr) {
      this.router.navigate(['ivf/dashboard']);
    } else {
      this.lastMrNo = currentMr;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private safeMr(src: any): string | null {
    try { return src?.table2?.[0]?.mrNo || null; } catch { return null; }
  }
}
