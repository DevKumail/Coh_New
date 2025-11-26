import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ivf-ps-lab-diagnostics',
  standalone: true,  
  imports: [CommonModule],
  template: `
    <div class="px-2 py-2">
      <ul class="nav nav-tabs small">
        <li class="nav-item">
          <button class="nav-link" [class.active]="tab==='results'" (click)="tab='results'">Pathology results</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="tab==='orders'" (click)="tab='orders'">Lab orders</button>
        </li>
      </ul>

      <div class="tab-content border border-top-0 p-2">
        <div class="tab-pane fade show" [class.active]="tab==='results'">
          <div class="table-responsive">
            <table class="table table-sm table-hover table-bordered align-middle mb-0">
              <thead class="table-light text-nowrap">
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Group</th>
                  <th>Sample</th>
                  <th>Material</th>
                  <th>Param. abbreviation</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>Note</th>
                  <th>Clinician</th>
                  <th>Finding status</th>
                  <th>Approval status</th>
                  <th>Attention for</th>
                  <th>Attachment</th>
                </tr>
              </thead>
              <tbody class="small">
                <tr *ngFor="let r of resultsRows">
                  <td>{{ r.date }}</td>
                  <td>{{ r.type }}</td>
                  <td>{{ r.group }}</td>
                  <td>{{ r.sample }}</td>
                  <td>{{ r.parameter }}</td>
                  <td>{{ r.abbrev }}</td>
                  <td>{{ r.value }}</td>
                  <td>{{ r.unit }}</td>
                  <td>{{ r.note }}</td>
                  <td>{{ r.clinician }}</td>
                  <td>{{ r.findingStatus }}</td>
                  <td>{{ r.approvalStatus }}</td>
                  <td>{{ r.attentionFor }}</td>
                  <td>{{ r.attachment }}</td>
                </tr>
                <tr *ngIf="resultsRows.length===0">
                  <td colspan="14" class="text-center text-muted">No data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="tab-pane fade show" [class.active]="tab==='orders'">
          <div class="table-responsive">
            <table class="table table-sm table-hover table-bordered align-middle mb-0">
              <thead class="table-light text-nowrap">
                <tr>
                  <th>Order number</th>
                  <th>Sample dep date</th>
                  <th>Time</th>
                  <th>Clinician</th>
                  <th>Name</th>
                  <th>Note</th>
                  <th>Parameter</th>
                  <th>Material</th>
                  <th>Laboratory</th>
                  <th>States</th>
                  <th>Pat. status</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody class="small">
                <tr *ngFor="let o of ordersRows">
                  <td>{{ o.orderNumber }}</td>
                  <td>{{ o.sampleDate }}</td>
                  <td>{{ o.time }}</td>
                  <td>{{ o.clinician }}</td>
                  <td>{{ o.name }}</td>
                  <td>{{ o.note }}</td>
                  <td>{{ o.parameter }}</td>
                  <td>{{ o.material }}</td>
                  <td>{{ o.laboratory }}</td>
                  <td>{{ o.states }}</td>
                  <td>{{ o.patientStatus }}</td>
                  <td>{{ o.comment }}</td>
                </tr>
                <tr *ngIf="ordersRows.length===0">
                  <td colspan="12" class="text-center text-muted">No data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IvfPsLabDiagnosticsComponent {
  tab: 'results' | 'orders' = 'results';
  resultsRows: any[] = [
    {
      date: '30.01.2025', type: 'Hormones', group: 'General', sample: 'Serum',
      parameter: 'E2', abbrev: 'E2', value: 100, unit: 'pg/ml', note: '',
      clinician: 'Doe, John Dr.', findingStatus: '✔', approvalStatus: '✔', attentionFor: '', attachment: ''
    },
    {
      date: '29.01.2025', type: 'Serology', group: 'General', sample: 'Serum',
      parameter: 'HbsAg', abbrev: 'HBSAG', value: 'negative', unit: '', note: '',
      clinician: '', findingStatus: '☐', approvalStatus: '', attentionFor: '', attachment: ''
    },
    {
      date: '28.01.2025', type: 'Serology', group: 'HIV', sample: 'Serum',
      parameter: 'HIV1 Ab (Westernblot)', abbrev: 'HIV1W', value: 'positive', unit: '', note: '',
      clinician: 'Doe, Jane Dr.', findingStatus: '☐', approvalStatus: '✔', attentionFor: '', attachment: ''
    }
  ];
  ordersRows: any[] = [
    {
      orderNumber: '0000002040', sampleDate: '30.01.2025', time: '10:00', clinician: 'Mr JF',
      name: 'E2', note: '', parameter: 'E2', material: 'Serum', laboratory: 'Internal',
      states: '—', patientStatus: '—', comment: ''
    },
    {
      orderNumber: '0000002289', sampleDate: '14.01.2025', time: '12:29', clinician: 'Doe, John Dr.',
      name: 'Cycling Hormons', note: '', parameter: 'FSH', material: 'Serum', laboratory: 'Internal',
      states: '✔', patientStatus: '—', comment: ''
    },
    {
      orderNumber: '0000002290', sampleDate: '14.01.2025', time: '12:31', clinician: 'Doe, Jane Dr.',
      name: 'Blood count', note: '', parameter: 'CBC', material: 'EDTA blood', laboratory: 'Internal',
      states: '⛔', patientStatus: '—', comment: ''
    }
  ];
}
