import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demographic-basic-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="ibox">
    <div class="ibox-title">
      <h5><i class="fa fa-id-card m-r-xs"></i> Basic Details</h5>
    </div>
    <div class="ibox-content">
      <div class="form-horizontal" [formGroup]="demographicForm">
        <div class="form-grid">
          <!-- Gender -->
          <div class="form-group form-item">
            <label class="control-label required">Gender</label>
            <select class="form-control"
                    [class.is-invalid]="demographicForm.get('PersonSexId')?.invalid && (demographicForm.get('PersonSexId')?.touched || isFormSubmitted)"
                    formControlName="PersonSexId">
              <option [ngValue]="null" disabled>-- Select Gender --</option>
              <option *ngFor="let g of gender" [ngValue]="g.code">{{ g.name }}</option>
            </select>
            <div class="invalid-feedback d-block"
                 *ngIf="demographicForm.get('PersonSexId')?.invalid && (demographicForm.get('PersonSexId')?.touched || isFormSubmitted)">
              Gender is required.
            </div>
          </div>

          <!-- Preferred Name -->
          <div class="form-group form-item">
            <label class="control-label">Preferred Name</label>
            <input type="text" class="form-control" formControlName="preferredName" placeholder="Enter preferred name"/>
          </div>

          <!-- Gender Identity -->
          <div class="form-group form-item span-2">
            <label class="control-label required">Gender Identity</label>
            <select class="form-control"
                    [class.is-invalid]="demographicForm.get('genderIdentity')?.invalid && (demographicForm.get('genderIdentity')?.touched || isFormSubmitted)"
                    formControlName="genderIdentity">
              <option [ngValue]="null" disabled>-- Select Gender Identity --</option>
              <option *ngFor="let g of genderIdentity" [ngValue]="g.genderId">{{ g.genderText }}</option>
            </select>
            <div class="invalid-feedback d-block"
                 *ngIf="demographicForm.get('genderIdentity')?.invalid && (demographicForm.get('genderIdentity')?.touched || isFormSubmitted)">
              Gender Identity is required.
            </div>
          </div>

          <!-- Marital Status -->
          <div class="form-group form-item">
            <label class="control-label required">Marital Status</label>
            <select class="form-control"
                    [class.is-invalid]="demographicForm.get('PersonMaritalStatus')?.invalid && (demographicForm.get('PersonMaritalStatus')?.touched || isFormSubmitted)"
                    formControlName="PersonMaritalStatus">
              <option [ngValue]="null" disabled>-- Select Marital Status --</option>
              <option *ngFor="let m of maritalstatus" [ngValue]="m.code">{{ m.name }}</option>
            </select>
            <div class="invalid-feedback d-block"
                 *ngIf="demographicForm.get('PersonMaritalStatus')?.invalid && (demographicForm.get('PersonMaritalStatus')?.touched || isFormSubmitted)">
              Marital Status is required.
            </div>
          </div>

          <!-- Blood Group -->
          <div class="form-group form-item">
            <label class="control-label required">Blood Group</label>
            <select class="form-control"
                    [class.is-invalid]="demographicForm.get('PatientBloodGroupId')?.invalid && (demographicForm.get('PatientBloodGroupId')?.touched || isFormSubmitted)"
                    formControlName="PatientBloodGroupId">
              <option [ngValue]="null" disabled>-- Select Blood Group --</option>
              <option *ngFor="let b of bloodgroup" [ngValue]="b.code">{{ b.name }}</option>
            </select>
            <div class="invalid-feedback d-block"
                 *ngIf="demographicForm.get('PatientBloodGroupId')?.invalid && (demographicForm.get('PatientBloodGroupId')?.touched || isFormSubmitted)">
              Blood Group is required.
            </div>
          </div>

          <!-- Date of Birth -->
          <div class="form-group form-item">
            <label class="control-label required">Date of Birth</label>
            <input type="text" class="form-control"
                   [class.is-invalid]="demographicForm.get('PatientBirthDate')?.invalid && (demographicForm.get('PatientBirthDate')?.touched || isFormSubmitted)"
                   formControlName="PatientBirthDate" data-provider="flatpickr" id="birthDate" placeholder="Select date" (change)="onDobChange()"/>
            <div class="invalid-feedback d-block"
                 *ngIf="demographicForm.get('PatientBirthDate')?.invalid && (demographicForm.get('PatientBirthDate')?.touched || isFormSubmitted)">
              Date of Birth is required.
            </div>
          </div>

          <!-- Age (small) -->
          <div class="form-group form-item small">
            <label class="control-label">Age</label>
            <input type="text" class="form-control" formControlName="Age" placeholder="Age" readonly />
          </div>

          <!-- VIP Checkbox -->
          <div class="form-group form-item">
            <label class="control-label">&nbsp;</label>
            <div class="i-checks">
              <label>
                <input type="checkbox" formControlName="VIPPatient" id="vipCheck" /> <i></i> VIP
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
    .ibox { margin-bottom: 15px; }
    .ibox-title { padding: 12px 15px; border-bottom: 1px solid #e7eaec; }
    .ibox-content { padding: 15px; }

    /* Responsive grid without Bootstrap */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px 16px;
      align-items: start;
    }
    .form-item { min-width: 0; }
    .form-item.small { max-width: 200px; }
    /* Make specific wide fields span two columns */
    .form-item.span-2 { grid-column: span 2; }

    .control-label { display: block; font-weight: 600; margin-bottom: 6px; }
    .required::after { content: ' *'; color: #e74c3c; font-weight: 700; }

    .i-checks > label { cursor: pointer; user-select: none; }
    .i-checks input { margin-right: 6px; }

    /* Improve input height spacing to match Inspinia look */
    .form-control { height: 36px; }

    @media (max-width: 480px) {
      .form-item.small { max-width: unset; }
      .form-item.span-2 { grid-column: auto; }
    }
    `
  ]
})
export class DemographicBasicDetailsComponent {
  @Input() demographicForm!: FormGroup;
  @Input() gender: any[] = [];
  @Input() genderIdentity: any[] = [];
  @Input() maritalstatus: any[] = [];
  @Input() bloodgroup: any[] = [];
  @Input() isFormSubmitted: boolean = false;

  onDobChange() {
    // NO-OP: parent initializes flatpickr and listens, but keep handler to mirror original
  }
}
