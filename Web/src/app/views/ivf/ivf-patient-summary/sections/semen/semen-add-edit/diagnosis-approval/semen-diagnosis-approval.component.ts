import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-semen-diagnosis-approval',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbNavModule],
  templateUrl: './semen-diagnosis-approval.component.html',
  styleUrls: ['./semen-diagnosis-approval.component.scss']
})
export class SemenDiagnosisApprovalComponent {
  form: FormGroup;
  active = 1;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      diagnosis: ['Not specified'],
      finding: ['Normal'],
      note: [''],
      approvalStatus: ['Pending'],
      timeBetweenCollectionAndUsage: ['00:00'],
      numberOfInsemMotile: [null],
      inseminatedAmountMl: [null],
      rate24hMotility: [null],
    });
  }
}
