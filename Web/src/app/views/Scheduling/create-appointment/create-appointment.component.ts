// import { Component } from '@angular/core';
// import Swal from 'sweetalert2';
// import { Router } from '@angular/router';
// import { ApiService } from '@core/services/api.service';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// // import { FormBuilder, Validators } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';


// @Component({
//   selector: 'app-create-appointment',
//   imports: [ReactiveFormsModule, CommonModule, RouterModule],
//   templateUrl: './create-appointment.component.html',
//   styleUrl: './create-appointment.component.scss'
// })

// export class CreateAppointmentComponent {
//   // form: FormGroup;
//   constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder) {}
  
//   // fb: FormBuilder;
//   Patientpopup: boolean = false;
//   mrNO: any;
//   appId: any;
//   patient_FName: any;
//   appointments: any[] = [];
//   facilities: any[] = [];
//   specialities: any[] = [];
//   providers: any[] = [];
//   sites: any[] = [];
//   visitTypes: any[] = [];
//   appointmentTypes: any[] = [];
//   appointmentPurposes: any[] = [];
//   appointmentStatuses: any[] = [];
//   appointmentPriorities: any[] = [];
//   appointmentModes: any[] = [];
//   siteArray: any[] = []; 
//   facilityArray: any[] = [];
//   Times: any[] = [];
//   purpose: any[] = [];
//   visittype: any[] = [];
  
// appointmentForm!: FormGroup;



//   appointmentForm = this.fb.group({
//     facility: ['', Validators.required],
//     speciality: ['', Validators.required],
//     provider: ['', Validators.required],
//     site: ['', Validators.required],
//     date: ['', Validators.required],
//     time: ['', Validators.required],
//     purpose: ['', Validators.required],
//     visitType: ['', Validators.required],
//     // Add rest of the controls similarly
//   });
  


// onSubmit(){

// }
// onCancel(){

// }
// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '@core/services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss'
})
export class CreateAppointmentComponent implements OnInit {

  appointmentForm!: FormGroup;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {}

  // Dropdown options & data variables
  facilities: any[] = [];
  specialities: any[] = [];
  providers: any[] = [];
  sites: any[] = [];
  Times: any[] = [];
  purpose: any[] = [];
  visittype: any[] = [];
  siteArray: any[] = [];
  referred: any[] = [];
  type: any[] = [];
  appointmentTypes: any[] = [];
  appointmentPurposes: any[] = [];
  appointmentStatuses: any[] = [];
  appointmentPriorities: any[] = [];
  duration: any[] = [];
  appointmentModes: any[] = [];
  facilityArray: any[] = [];
  appointmentId: any;
  appointmentDate: any;
  appointmentTime: any;
  appointmentPurpose: any;
  appointmentVisitType: any;
  location: any;
  appointmentStatus: any;
  appointmentPriority: any;
  appointmentMode: any;
  criteria: any;
  notified: any;
  status: any;
   payer: any;
   payerPlan: any;
   insurranceNo: any;
   AppointmentData: any[] = [];
  appointmentFormData: any[] = [];
  appointmentIdFromRoute: any;
  appointment: any;
    eligibty: any[] = [];
    selectedElement: any;
    detailsDialogVisible: boolean = false;
  






  // Misc data
  Patientpopup: boolean = false;
  mrNO: any;
  appId: any;
  patient_FName: any;

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      facility: ['', Validators.required],
      speciality: ['', Validators.required],
      provider: ['', Validators.required],
      site: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      purpose: ['', Validators.required],
      visitType: ['', Validators.required],
      // ✅ Add other controls here as needed
    });

    // 🚀 Optional: Load dropdowns from API here
    // this.loadFacilities();
    // this.loadTimes();
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill all required fields.'
      });
      return;
    }

    const formData = this.appointmentForm.value;
    console.log('Submitting appointment:', formData);

    // 🟢 Submit API logic here
    // this.apiService.post('your-endpoint', formData).subscribe(...);

    Swal.fire({
      icon: 'success',
      title: 'Appointment Created',
      text: 'The appointment has been successfully created.'
    });
  }

  onCancel(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Cancelled',
      text: 'Appointment creation has been cancelled.'
    });

    this.router.navigate(['/scheduling/View-Appointments']);
  }
  onFacilityChange(){

  }
  onSpecialityChange(){

  }
  checkEligibility(){

  }
  submitAppointment(){

  }
  cancel(){

  }
 RowColor(appointment: any): boolean {
  // Example logic to highlight consultation appointments
  return appointment?.purposeOfVisit === 'Consultation';
}
eligibility(){

}

showDetailsDialog(element: any) {
  this.selectedElement = element;
  this.detailsDialogVisible = true;
}



}
