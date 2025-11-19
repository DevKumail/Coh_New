import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { ApiService } from '@/app/core/services/api.service';

@Component({
  selector: 'app-semen-diagnosis-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, FilledOnValueDirective, ReactiveFormsModule, NgbNavModule],
  templateUrl: './semen-diagnosis-approval.component.html',
  styleUrls: ['./semen-diagnosis-approval.component.scss']
})
export class SemenDiagnosisApprovalComponent {
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  @Input() labelFor: (key: string) => string = (k) => k;
  @Input() hrEmployees: Array<{ name: string; providerId: number; employeeType: number }> = [];
  form: FormGroup;
  active = 1;
  // Diagnosis dropdown state
  diagnosisOptions: string[] = [];
  searchDiagnosis = '';
  private diagnosisLimit = 50;
  private diagnosisLoading = false;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      diagnosis: ['Not specified'],
      finding: ['Normal'],
      note: [''],
      approvalStatus: ['Pending'],
      // timeBetweenCollectionAndUsage: ['00:00'],
      // numberOfInsemMotile: [null],
      // inseminatedAmountMl: [null],
      // rate24hMotility: [null],
    });
    // initial load of diagnosis options
    this.fetchDiagnosis();
  }

  getValue() {
    return this.form.value;
  }

  // ===== Diagnosis remote search + infinite scroll =====
  onDiagnosisSearchChange(q: string) {
    this.searchDiagnosis = q || '';
    this.diagnosisLimit = 50;
    this.fetchDiagnosis();
  }

  onDiagnosisScroll(e: Event) {
    const el = e.target as HTMLElement;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (nearBottom && !this.diagnosisLoading) {
      this.diagnosisLimit += 50;
      this.fetchDiagnosis(true);
    }
  }

  selectDiagnosis(label: string) {
    this.form.patchValue({ diagnosis: label || 'Not specified' });
  }

  private fetchDiagnosis(append: boolean = false) {
    this.diagnosisLoading = true;
    const params: any = { searchKey: this.searchDiagnosis || '', limit: this.diagnosisLimit };
    this.api.get('Common/GetICDCodesBySearch', params).subscribe({
      next: (res: any) => {
        const items: any[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        const labels = items.map((it: any) => this.icdLabel(it)).filter((s: any) => typeof s === 'string' && s.length > 0);
        this.diagnosisOptions = append ? Array.from(new Set([...(this.diagnosisOptions || []), ...labels])) : labels;
        this.diagnosisLoading = false;
      },
      error: () => { this.diagnosisLoading = false; }
    });
  }

  private icdLabel(it: any): string {
    if (typeof it === 'string') return it;
    const code = it?.icdCode || it?.ICDCode || it?.code || '';
    const descShort = it?.descriptionShort || it?.ICDName || it?.name || it?.description || it?.term || it?.icdName || '';
    const label = [code, descShort].filter(Boolean).join(' | ');
    return label || (descShort || code || '');
  }
}
