import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedulingApiService } from '../scheduling.api.service'; // or your actual path





@Component({
  selector: 'app-appointments',
  imports: [ CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './appointments.component.html',
  // styleUrl: './appointments.component.scss',
  styleUrls: []
})
export class AppointmentsComponent {
  constructor(private router: Router,
    private fb: FormBuilder,
    // private schedulingService: ApiService,
    private Service: SchedulingApiService
  ) {}
  Patientpopup: boolean = false;
  FilterForm!: FormGroup;
  mrNO: any;
  appId: any;
  patient_FName: any;
  filter: boolean = false;
  modalService = new NgbModal();
//   PatientStatus(event: any, appointment: any, position: string) {
//   this.Patientpopup = true;
//   this.mrNO = appointment.mrNo;
//   this.appId = appointment.appointment_Id;
//   this.patient_FName = appointment.patient_FName;
// }
messageService = {}
  totalRecord: number = 0;
  FilterData: any = {}
  PaginationInfo: any = {}
  appointments: any[] = [];
  appointmentStatuses: any[] = [];
  providers: any[] = [];
  facilities: any[] = [];
  sites: any[] = [];
  speciality: any[] = [];
  appointmentcriteria: any = {  }
  visitType: any= [
    { code: 1, name: 'New' },
    { code: 2, name: 'Follow-up' },
    { code: 3, name: 'Emergency' }
  ];
  locations: any = [];
  appointmentType: any;
  add: any;


  ngOnInit(): void {

    this.SearchAppointmentWithpagination();




    this.FilterForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      providerId: [null],
      facilityId: [null],
      sitesId: [null],
      specialityId: [null],
      criteriaId: [null],
      visitTypeId: [null],
      locationId: [null],
      appointmentId: [null],
    });



  }
  SearchAppointmentWithpagination() {
    this.Service.SearchAppointmentDBWithPagination(this.FilterData, this.PaginationInfo)
      .subscribe((appointment:any) => {
        if (appointment!=null) {
          let appointments = [];
          for (let i = 0; i < appointment.table1.length; i++) {
            let appointmentStatusColor = 'black'; // Default color
            if (appointment.table1[i].appStatus === 'Cancelled') {
              appointmentStatusColor = 'red';
            } else if (appointment.table1[i].appStatus === 'Rescheduled') {
              appointmentStatusColor = 'blue';
            }
            appointments.push({
              appointment_Id: appointment.table1[i].appointment_Id,
              visitAccDisplay: appointment.table1[i].visitAccDisplay,
              mrNo: appointment.table1[i].mrNo,
              patient_FName: appointment.table1[i].patient_FName,
              appDateTime: appointment.table1[i].appDateTime,
              appointment_SiteName: appointment.table1[i].appointment_SiteName,
              appType: appointment.table1[i].appType,
              appStatus: appointment.table1[i].appStatus,
              appointment_PatientStatus:
                appointment.table1[i].appointment_PatientStatus,
              purposeOfVisit: appointment.table1[i].purposeOfVisit,
              statusColor: appointmentStatusColor,
            });
          }
          this.appointments = appointments;
          this.totalRecord = appointment.table2[0].totalCount;
        }
        else
        {
          this.appointments = [];
          this.totalRecord = 0;
        }
      },(error: any) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: error.message || 'Something went wrong',
  });
}

      );
  }
 



  // appointments: any[] = [];
  
  buttonRoute(path: string) {
    this.router.navigate([path]);
  }

  ClearFilter(){

  }
  ClickFilter(modalRef: TemplateRef<any>) {
  this.modalService.open(modalRef, {
    backdrop: 'static',
    size: 'xl',
    centered: true
  });
}


  PatientStatus(event: any, appointment: any, position: string) {
  // your logic
}

confirmCancel(event: any, appointment: any, position: string) {
  // your logic
}

Reschedule(event: any, appointment: any, position: string) {
  // your logic
}
openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
        this.modalService.open(content, options)
    }
 buttonRouter(path: string): void {
    this.router.navigate([path]);
 }
onSubmit(){

  }
  
}
