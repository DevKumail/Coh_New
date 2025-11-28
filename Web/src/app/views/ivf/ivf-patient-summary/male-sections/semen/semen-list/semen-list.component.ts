import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { SemenAddEditComponent } from '../semen-add-edit/semen-add-edit.component';
import { NgIconComponent } from '@ng-icons/core';
import Swal from 'sweetalert2';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { PreservationComponent } from '../cryo-preservation/preservation/preservation.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-semen-list',
  standalone: true,
  imports: [CommonModule, PreservationComponent, SemenAddEditComponent, NgIconComponent, GenericPaginationComponent
  ],
  templateUrl: './semen-list.component.html',
  styleUrls: ['./semen-list.component.scss']
})
export class SemenListComponent {
  showAdd = false;
  isLoading = false;
  showPreservation: boolean = false;
  rows: any[] = [];
  editModel: any = null;
  preservationData: any = null;

  PaginationInfo: any = {
    Page: 1,
    RowsPerPage: 10,
  };
  totalrecord: number = 0;

  constructor(private ivf: IVFApiService, private patientBannerService: PatientBannerService) {
    this.load();
  }

  openAdd() { this.showAdd = true; this.showPreservation = false; }
  onCancel() { this.showAdd = false; this.showPreservation = false; this.editModel = null; }

  onSaved(_payload: any) {
    this.showAdd = false;
    this.editModel = null;
    this.load();
  }

  load() {
    this.isLoading = true;
    var MainId: number = 0;
    this.patientBannerService.getIVFPatientData().pipe(take(1)).subscribe((data: any) => {
      if (data) {
        if (data?.couple?.ivfMainId != null) {
          MainId = data?.couple?.ivfMainId?.IVFMainId ?? 0;
        }
      }
    });
    this.ivf.GetAllMaleSemenAnalysis(MainId, this.PaginationInfo.Page, this.PaginationInfo.RowsPerPage).subscribe({
      next: (res: any) => {
        // Expecting res to have data array; adjust mapping if API differs
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        this.rows = (data || []).map((x: any) => ({
          id: x.sampleId || x.id || 0,
          collectionDate: x.collectionDateTime ? new Date(x.collectionDateTime).toLocaleDateString() : '',
          collectionDateTime: x.collectionDateTime,
          thawingDate: x.thawingDateTime ? new Date(x.thawingDateTime).toLocaleDateString() : '',
          time: x.analysisStartTime || '-',
          sampleCode: x.sampleCode || '-',
          purpose: x.purpose || '-',
          method: x.collectionMethod || '-',
          vol: x.volumeML ?? '-',
          conc: x.concentrationPerML ?? '-',
          totalCountM: x.totalSpermCount ?? '-',
          whoA: x.whO_AB_Percent ?? '-',
          whoC: x.whO_C_Percent ?? '-',
          whoD: x.whO_D_Percent ?? '-',
          norm: x.morphologyNormalPercent ?? '-',
          cryoStatus: x.cryoStatus || '-',
          status: x.status || '-',
          malePatientId: x.malePatientId,
          malePatientName: x.malePatientName
        }));

        this.totalrecord = res.totalCount;
        this.isLoading = false;
      },
      error: _ => { this.isLoading = false; this.rows = []; }
    });
  }

  edit(row: any) {
    const id = row?.id;
    if (!id) { return; }
    this.isLoading = true;
    this.ivf.GetMaleSemenSampleById(id).subscribe({
      next: (sample: any) => {
        this.isLoading = false;
        this.editModel = sample;
        this.showAdd = true;
      },
      error: _ => { this.isLoading = false; }
    });
  }

  delete(id: any) {
    const sampleId = Number(id);
    if (!sampleId) return;
    // const ok = confirm('Delete this sample?');
    // if (!ok) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.ivf.DeleteMaleSemenSample(sampleId).subscribe({
          next: _ => {
            this.isLoading = false; this.load();
            Swal.fire({
              title: 'Deleted!',
              text: 'The sample has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: _ => {
            this.isLoading = false;
            Swal.fire({
              title: 'Error!',
              text: 'The sample could not be deleted.',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });
  }

  onClickPreservation(row: any) {
    this.isLoading = true;
    const sampleId = row?.id;
    this.ivf.GetCryoPreservationsBySampleId(sampleId).subscribe({
      next: (res: any) => {
        const existing = Array.isArray(res?.data) && res.data.length > 0 ? res.data[0] : null;
        this.preservationData = {
          collectionDateTime: row.collectionDateTime,
          sampleId: row.id,
          malePatientId: row.malePatientId,
          malePatientName: row.malePatientName,
          existingPreservation: existing
        };
        this.showPreservation = true;
        this.showAdd = false;
        this.isLoading = false;
      },
      error: _ => {
        this.isLoading = false;
        this.preservationData = {
          collectionDateTime: row.collectionDateTime,
          sampleId: row.id,
          malePatientId: row.malePatientId,
          malePatientName: row.malePatientName,
          existingPreservation: null
        };
        this.showPreservation = true;
        this.showAdd = false;
      }
    });
  }

  onPageChanged(page: number) {
    this.PaginationInfo.Page = page;
    this.load();
  }

  onPreservationSaved() {
    this.showPreservation = false;
    this.load();
  }
}
