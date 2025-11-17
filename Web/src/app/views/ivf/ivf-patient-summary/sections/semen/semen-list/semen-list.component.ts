import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { SemenAddEditComponent } from '../semen-add-edit/semen-add-edit.component';

@Component({
  selector: 'app-semen-list',
  standalone: true,
  imports: [CommonModule, SemenAddEditComponent],
  templateUrl: './semen-list.component.html',
  styleUrls: ['./semen-list.component.scss']
})
export class SemenListComponent {
  showAdd = false;
  isLoading = false;
  rows: any[] = [];

  constructor(private ivf: IVFApiService) {
    this.load();
  }

  openAdd() { this.showAdd = true; }
  onCancel() { this.showAdd = false; }

  onSaved(_payload: any) {
    this.showAdd = false;
    this.load();
  }

  load(page: number = 1, pageSize: number = 10) {
    this.isLoading = true;
    this.ivf.GetAllMaleSemenAnalysis(page, pageSize).subscribe({
      next: (res: any) => {
        // Expecting res to have data array; adjust mapping if API differs
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        this.rows = (data || []).map((x: any) => ({
          collectionDate: x.collectionDateTime ? new Date(x.collectionDateTime).toLocaleDateString() : '',
          thawingDate: x.thawingDateTime ? new Date(x.thawingDateTime).toLocaleDateString() : '',
          time: x.analysisStartTime || '',
          sampleId: x.sampleCode || '',
          purpose: x.purposeName || x.purposeId || '',
          method: x.collectionMethodName || x.collectionMethodId || '',
          vol: x.observations?.[0]?.volumeML ?? '',
          conc: x.observations?.[0]?.concentrationPerML ?? '',
          totalCountM: x.observations?.[0]?.totalSpermCount ?? '',
          whoA: x.observations?.[0]?.motility?.whO_AB_Percent ?? '',
          whoC: x.observations?.[0]?.motility?.whO_C_Percent ?? '',
          whoD: x.observations?.[0]?.motility?.whO_D_Percent ?? '',
          norm: x.observations?.[0]?.morphology?.morphologyNormalPercent ?? '',
          cryoStatus: x.cryoStatusName || x.cryoStatusId || '',
          status: x.statusName || x.statusId || '',
        }));
        this.isLoading = false;
      },
      error: _ => { this.isLoading = false; this.rows = []; }
    });
  }
}
