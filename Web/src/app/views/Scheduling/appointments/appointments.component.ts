import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-appointments',
  imports: [ CommonModule,RouterModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
  constructor(private router: Router) {}
  Patientpopup: boolean = false;
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


  appointments: any[] = [];
  
  buttonRoute(path: string) {
    this.router.navigate([path]);
  }

  ClearFilter(){

  }
  ClickFilter(modalRef: TemplateRef<any>) {
  this.modalService.open(modalRef, {
    backdrop: 'static',
    size: 'lg',
    centered: true
  });
}

  // confirmCancel(appointment: any) {}    
  // Reschedule(appointment: any) {}
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
  
}
