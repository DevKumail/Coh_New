import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';

@Component({
  selector: 'app-immunizations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './immunizations.component.html',
  styleUrls: ['./immunizations.component.scss']
})
export class ImmunizationsComponent implements OnInit {
  buttonText = 'Save';
  Immunization: any = {};
  providers: any[] = [];
  siteOptions: any[] = [];
  RouteOptions: any[] = [];
  filteredDiagnosisData: any[] = [];

  Active = [{ id: 1, name: 'Active' }, { id: 0, name: 'InActive' }];
  ActiveStatus = [
    { id: 1, name: 'Active' },
    { id: 0, name: 'InActive' },
    { id: 2, name: 'All' }
  ];

  hrEmployees: any[] = [];
  selectedProvider: any;
  appId: any;
  Mrno: any;
  PatientId: any;
  providerCheck: any;
  isProviderCheck: boolean = false;
  userid: any;
  siteId: any;
  immunization: any = {};

  constructor(
    private clinical: ClinicalApiService
  ) {}

  ngOnInit(): void {
    this.GetEMRSite();
    this.GetEMRRoute();
    this.FillCache();
    this.GetImmunizationType();

    const app = JSON.parse(localStorage.getItem('LoadvisitDetail') || '{}');
    this.appId = app.appointmentId;

    const Demographicsinfo = localStorage.getItem('Demographics');
    if (Demographicsinfo) {
      const Demographics = JSON.parse(Demographicsinfo);
      this.Mrno = Demographics.table2?.[0]?.mrNo;
      this.PatientId = Demographics.table2?.[0]?.patientId;
    }

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const current_User = JSON.parse(currentUser);
      this.userid = current_User.userId;
    }
    this.GetPatientImmunizationData();
    this.immunization.ActiveStatus = 1;
  }

  GetEMRSite() {
    this.clinical
      .GetSite()
      .then((res: any) => {
        this.siteOptions = res.result;
      })
      .catch((error: any) => {
        console.error('Error fetching site options', error);
      });
  }

  GetEMRRoute() {
    this.clinical
      .GetRoute()
      .then((res: any) => {
        this.RouteOptions = res.result;
      })
      .catch((error: any) => {
        console.error('Error fetching route options', error);
      });
  }

  getImmunization: any = [];
  selectedImmunization: any = {};
  GetImmunizationType() {
    this.clinical.GetImmunizationType().then((res: any) => {
      this.getImmunization = res.result;
    });
  }

  FillCache() {
    this.clinical
      .getCacheItem({ entities: ['Provider'] })
      .then((response: any) => {
        if (response.cache != null) {
          this.FillDropDown(response);
        }
      })
      .catch((error: any) => {
        console.error('Error loading cache', error);
        alert(error?.message || 'Error loading cache');
      });
  }

  FillDropDown(response: any) {
    const jParse = JSON.parse(JSON.stringify(response)).cache;
    let provider = JSON.parse(jParse).Provider;

    if (provider) {
      provider = provider.map((item: { EmployeeId: any; FullName: any }) => {
        return {
          name: item.FullName,
          providerId: item.EmployeeId,
        };
      });
      this.hrEmployees = [{ name: '[Outside Clinic]', providerId: 'P1' }, ...provider];
    }
  }

  onProviderChange(event: any) {
    const val = event?.target?.value ?? event;
    this.selectedProvider = val;
  }

  onRowSelect(data: any) {
    this.buttonText = 'Update';
    this.immunization.immTypeId = data.immTypeId;
    this.immunization.providerId = data.providerId;
    this.immunization.description = data.description;
    this.immunization.SiteInjection = Number(data.siteInjection);
    this.immunization.dose = data.dose;
    this.immunization.manufacturerName = data.manufacturerName;
    this.immunization.comments = data.comments;
    this.immunization.routeId = data.routeId;
    this.immunization.lotNumber = data.lotNumber;
    this.immunization.status = data.status === 'Active' ? 1 : 0;
    this.immunization.startDate = data.startDate ? new Date(data.startDate) : null;
    this.immunization.endDate = data.endDate ? new Date(data.endDate) : null;
    this.immunization.nextInjectionDate = data.nextInjectionDate ? new Date(data.nextInjectionDate) : null;
    this.immunization.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
  }

  onCheckboxChange2() {
    const isChecked = this.providerCheck;
    this.providerCheck = isChecked;
    console.log('providerCheck Checkbox Value:', isChecked);
  }

  DropFilled() {
    this.immunization.providerId = '';
    this.immunization.immTypeId = '';
    this.immunization.comments = '';
    this.immunization.status = '';
    this.immunization.dose = '';
    this.immunization.manufacturerName = '';
    this.immunization.lotNumber = '';
    this.immunization.startDate = '';
    this.immunization.expiryDate = '';
    this.immunization.nextInjectionDate = '';
    this.immunization.SiteInjection = '';
    this.immunization.routeId = '';
    this.immunization.providerDescription = '';
    this.isProviderCheck = false;
  }

  submit() {
    if (this.validation(this.immunization.immTypeId) === true) {
      alert('Select Type');
      return;
    }
    if (this.validation(this.immunization.comments) === true) {
      alert('Enter Comments');
      return;
    }
    if (this.validation(this.immunization.dose) === true) {
      alert('Enter Dose');
      return;
    }
    if (this.validation(this.immunization.manufacturerName) === true) {
      alert('Enter Manufacturer Name');
      return;
    }
    if (this.validation(this.immunization.lotNumber) === true) {
      alert('Enter Lot No. of Medication');
      return;
    }
    if (this.validation(this.immunization.startDate) === true) {
      alert('Select Immunization Start Date');
      return;
    }
    if (this.validation(this.immunization.expiryDate) === true) {
      alert('Select Expiry Date');
      return;
    }
    if (this.validation(this.immunization.nextInjectionDate) === true) {
      alert('Select Next Immunizaton Date');
      return;
    }
    if (this.validation(this.immunization.SiteInjection) === true) {
      alert('Select Site Immunization');
      return;
    }
    if (this.validation(this.immunization.routeId) === true) {
      alert('Select Route');
      return;
    }

    const mrno = this.Mrno;
    const user = this.userid;
    const Patientid = this.PatientId;
    this.immunization.createdBy = user;
    this.immunization.updatedBy = user;
    this.immunization.mrno = mrno;
    this.immunization.patientId = Patientid;
    this.immunization.AppointmentId = this.appId;
    this.immunization.providerDescription = this.immunization.providerDescription;

    this.clinical
      .InsertOrUpdatePatientImmunization(this.immunization)
      .then(() => {
        this.DropFilled();
        alert('Immunization Successfully Created');
      })
      .catch((error: any) => alert(error?.message || 'Error creating immunization'));
  }

  ImmunizationData: any[] = [];
  GetPatientImmunizationData() {
    const mrno = this.Mrno;
    if (!mrno) return;
    this.clinical.GetPatientImmunizationData(mrno).then((res: any) => {
      this.ImmunizationData = res.patient?.table1 || [];
      this.filteredDiagnosisData = this.ImmunizationData;
      this.onStatusChange();
      console.log('this.ImmunizationData', this.ImmunizationData);
    });
  }

  delete(id: number) {
    this.clinical
      .DeleteImmunization(id)
      .then(() => {
        this.DropFilled();
        alert('Immunization Successfully Deleted');
        this.GetPatientImmunizationData();
      })
      .catch((error: any) => alert(error?.message || 'Error deleting immunization'));
  }

  onStatusChange() {
    const selectedStatus = this.ActiveStatus.find(
      (status) => status.id === this.immunization.ActiveStatus
    )?.name;
    if (selectedStatus === 'All') {
      this.filteredDiagnosisData = this.ImmunizationData;
    } else {
      this.filteredDiagnosisData = this.ImmunizationData.filter(
        (item: { status: string }) => item.status === selectedStatus
      );
    }
  }

  validation(obj: any) {
    if (obj == null || obj == undefined || obj == 0 || obj == '') {
      return true;
    }
    return false;
  }
}
