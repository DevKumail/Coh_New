
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '@core/services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SchedulingApiService } from '../scheduling.api.service';
import { NgIconComponent } from '@ng-icons/core';
import moment from 'moment';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { D } from 'node_modules/@angular/cdk/bidi-module.d-D-fEBKdS';
import { LoaderService } from '@core/services/loader.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';

declare var flatpickr: any;

@Component({
  selector: 'app-create-appointment',
  standalone: true,

  imports: [
            ReactiveFormsModule,
            CommonModule,
            RouterModule,
        NgbTimepickerModule,
        NgIconComponent],

  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss'
})
export class CreateAppointmentComponent implements OnInit {
  date: any;


  appointmentForm!: FormGroup;
minDate: any;
Times = [
  { Time: '01:00 AM' },
  { Time: '01:30 AM' },
  { Time: '02:00 AM' },
  { Time: '02:30 AM' },
  { Time: '03:00 AM' },
  { Time: '03:30 AM' },
  { Time: '04:00 AM' },
  { Time: '04:30 AM' },
  { Time: '05:00 AM' },
  { Time: '05:30 AM' },
  { Time: '06:00 AM' },
  { Time: '06:30 AM' },
  { Time: '07:00 AM' },
  { Time: '07:30 AM' },
  { Time: '08:00 AM' },
  { Time: '08:30 AM' },
  { Time: '09:00 AM' },
  { Time: '09:30 AM' },
  { Time: '10:00 AM' },
  { Time: '10:30 AM' },
  { Time: '11:00 AM' },
  { Time: '11:30 AM' },
  { Time: '12:00 PM' },
  { Time: '12:30 PM' },
  { Time: '01:00 PM' },
  { Time: '01:30 PM' },
  { Time: '02:00 PM' },
  { Time: '02:30 PM' },
  { Time: '03:00 PM' },
  { Time: '03:30 PM' },
  { Time: '04:00 PM' },
  { Time: '04:30 PM' },
  { Time: '05:00 PM' },
  { Time: '05:30 PM' },
  { Time: '06:00 PM' },
  { Time: '06:30 PM' },
  { Time: '07:00 PM' },
  { Time: '07:30 PM' },
  { Time: '08:00 PM' },
  { Time: '08:30 PM' },
  { Time: '09:00 PM' },
  { Time: '09:30 PM' },
  { Time: '10:00 PM' },
  { Time: '10:30 PM' },
  { Time: '11:00 PM' },
  { Time: '11:30 PM' },
  { Time: '12:00 AM' }
];


  constructor(
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private SchedulingApiService: SchedulingApiService,
    private http: HttpClient,
    private loader : LoaderService,
    private patientBannerService: PatientBannerService,
  ) {}


  facilities: any[] = [];
  specialities: any[] = [];
  appointmentType:any []=[];
  providers: any[] = [];
  sites: any[] = [];
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
    filterForm!: FormGroup;
    datePipe = new DatePipe('en-US');
    DurationData: any[] = [];
    selectedFacility: any;
    selectedSpeciality: any;
    selectedProvider: any;
    selectedSite: any;
    selectedDate: any;
    provider: any[] = [];
    case: any[] = [];
  selectedProviders: any=0;
  selectedSites: any=0;
  selectedSpecialities: any=0;
  selectedFacilities: any=0;
  selectedLocations: any=0;
  selectedCriteria: any=0;
  selectedNotified: any=0;
  selectedStatus: any=0;
  selectedVisitType: any=0;
  selectedPayer: any=0;
  selectedPayerPlan: any=0;
  selectedDuration: any=0;
  selectedPurpose: any=0;
  selectedReferred: any=0;
  selectedAppointmentId: any=0;
  showTable: boolean = false;
  TimeSlotGridTime: any;
  qid: any;
  AppoinmentBooking: any = {};
  Time: any[] = [];
  TimeSlot: any[] = [];
  TimeSlotGrid: any[] = [];
  SearchPatientData: any;
  visitAppointments: any;
  TimeSlotGridTimeArray: any[] = [];
  TimeSlotGridTimeArray1: any[] = [];
  TimeSlotGridTimeArray2: any[] = [];
  TimeSlotGridTimeArray3: any[] = [];
  TimeSlotGridTimeArray4: any[] = [];











  // Misc data
  Patientpopup: boolean = false;
  mrNO: any;
  appId: any;
  patient_FName: any;
   cacheItems: string[] = [
    'SchAppointmentType',
    'VisitType',
    'RegLocations',
    'SchAppointmentCriteria',
    'PatientNotifiedOptions',
    'SchAppointmentStatus',
    'ProblemList',
    'BLPayer',
    'Provider',
    'RegFacility',
    'RegLocationTypes',
    'providerspecialty',
    'BLPayerPlan'
  ];

  ngOnInit(): void {


    this.appointmentForm = this.fb.group({
      facility: [0, Validators.required],
      speciality: [0, Validators.required],
      provider: [0, Validators.required],
      site: [0, Validators.required],
      date: ['', Validators.required],
      time: [{ hour: 10, minute: 30 },Validators.required],
      selectedPurpose: ['', Validators.required],
      selectedVisitType: ['', Validators.required],
      selectedType: ['', Validators.required],
      selectedReferredBy: ['', Validators.required],
      selectedDuration: ['', Validators.required],
      selectedLocation: ['', Validators.required],
      selectedCriteria: [''],
      selectedNotified: ['', Validators.required],
      selectedStatus: ['', Validators.required],
      selectedPayer: ['', Validators.required],
      AppointmentNote: [''],
      selectedPayerplan: [''],
      PlanCopay: [''],
      PlanBalance: [''],
      PatientBalance: [''],
      appointment: [''],


      // insurranceNo: [''],
      // referred: [''],
      // appointmentId: [''],
      // appointmentDate: [''],
      // appointmentTime: [''],
      // appointmentPurpose: [''],
      // appointmentVisitType: [''],
      // appointmentStatus: [''],
      // appointmentPriority: [''],
      // appointmentMode: [''],
      // appointmentReason: [''],
      // appointmentNotes: [''],
      // appointmentDuration: [''],
      // appointmentCriteria: [''],
      // appointmentNotified: [''],
      // appointmentPayer: [''],
      // appointmentPayerPlan: [''],
      // appointmentInsurranceNo: [''],
      // appointmentReferred: [''],
      // appointmentIdFromRoute: [''],
      // siteArray: [''],
      // selectedFacility: [''],
      // selectedSpeciality: [''],
      // selectedProvider: [''],
      // selectedSite: [''],
      // selectedDate: [''],
      // DurationData: [''],
  });


  this.appointmentForm.get('facility')?.valueChanges.subscribe((facilityId) => {
    if (facilityId) {
      this.GetSpecialitybyFacilityId(facilityId);
    } else {
      this.specialities = [];
    }
  });

  this.appointmentForm.get('speciality')?.valueChanges.subscribe((specialityId) => {
    if (specialityId) {
      this.GetSitebySpecialityId(specialityId);
    } else {
      this.siteArray = [];
    }
    });
    this.FillCache();

    flatpickr('#entryDate', {
      dateFormat: 'Y-m-d',
      // maxDate: 'today',
      onChange: (selectedDates: any, dateStr: string) => {
        this.appointmentForm.get('entryDate')?.setValue(dateStr);
      },
    });



     this.patientBannerService.patientData$
              .pipe(
                filter((data: any) => !!data?.table2?.[0]?.mrNo),
                distinctUntilChanged((prev, curr) =>
                  prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
                )
              )
              .subscribe((data: any) => {
                console.log('✅ Subscription triggered with MRNO in Alert Component:', data?.table2?.[0]?.mrNo);
                this.SearchPatientData = data;
                if (this.SearchPatientData) {
                  console.log('mr Data',this.SearchPatientData);
                  this.getEligibilityList();

                }
      });
debugger

this.patientBannerService.visitAppointments$.subscribe((data: any) => {
  console.log('✅ Subscription triggered with Visit Appointments in Alert Component:', data?.length);
  this.visitAppointments = data;
  if (this.visitAppointments) {
    console.log('Visit Appointments',this.visitAppointments);
    this.getEligibilityList();

    
  }
});
      // this.patientBannerService.visitAppointments$
      // .pipe(
      //   filter((data: any) => !!data?.table1?.length),
      //   distinctUntilChanged((prev, curr) =>
      //     prev?.table1?.length === curr?.table1?.length
      //   )
      // )
      // .subscribe((data: any) => {
      //   console.log('✅ Subscription triggered with Visit Appointments in Alert Component:', data?.length);
      //   this.visitAppointments = data;
      //   if (this.visitAppointments) {
      //     console.log('Visit Appointments',this.visitAppointments);
          
      //   }
      // });

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
    generateTimeSlots(): void {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        times.push({ Time: `${h}:${m}` });
      }
    }
    this.Times = times;
  }

 GetSitebySpecialityId(SpecialtyId: any) {
   // debugger
    if(SpecialtyId==null||SpecialtyId==undefined){
      SpecialtyId=0
    }
    this.selectedSpeciality=SpecialtyId;
      this.SchedulingApiService.GetSitebySpecialityId(SpecialtyId).then((res: any) => {
        this.siteArray=res

      }).catch((error: { message: any }) =>
            Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Error'
    }));
      // this.messageService.add({severity: 'error',summary: 'error',detail: 'Error'}))
      // let provider=this.selectedProviders||0
      // let facility=this.selectedFacility||0
      // let site=this.selectedSites||0
      // let speciality=this.selectedSpeciality||0
      // let Currentdate:any;
      // if(this.date==undefined)
      // {
      //   Currentdate= this.datePipe.transform(
      //     new Date(),
      //     'yyyy-MM-dd'
      //   );
      // }
      // else
      // {
      //   Currentdate= this.datePipe.transform(
      //     this.date,
      //     'yyyy-MM-dd'
      //   );
      // }

      const facility = this.appointmentForm?.get('facility')?.value || 0;
      const speciality = SpecialtyId || 0;
      const provider = this.appointmentForm?.get('provider')?.value || 0;
      const site = this.appointmentForm?.get('site')?.value || 0;

      const selectedDate: string = this.appointmentForm?.get('date')?.value;
      const currentDate: string = this.datePipe.transform(selectedDate ? new Date(selectedDate) : new Date(), 'yyyy-MM-dd') || '';

      this.SchedulingApiService.GetSchAppointmentList(site, provider, facility, speciality, currentDate)
      .then((appointmentRes: any) => {
        if (Array.isArray(appointmentRes)) {
          this.DurationData = appointmentRes;
          this.loader.hide();
        } else {
          this.DurationData = [];
          this.loader.hide();
          Swal.fire({
            icon: 'warning',
            title: 'No Appointments Found',
            text: 'The result is not an array or is empty.',
          });
        }
      })
      .catch((error:any) => {
        this.loader.hide();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load appointments.',
        });
      });

        // this.SchedulingApiService.GetSchAppointmentList(site,provider,facility,speciality,Currentdate).then((ress: any) => {
        //   if(ress.length>0)
        //   {
        //     this.DurationData=ress
        //   }
        //   else
        //   {
        //     this.DurationData=[]
        //   }
        // })
        this.Times=this.AppointmentData;

  }



async GetSpecialitybyFacilityId(FacilityId: any) {
   // debugger
  this.loader.show();
  if (!FacilityId) {
    FacilityId = 0;
  }
  this.selectedFacility=FacilityId;
   await this.SchedulingApiService.GetSpecialitybyFacilityId(FacilityId).subscribe((res:any) => {
    this.specialities = res;
  })
   // debugger
  this.SchedulingApiService.GetProviderByFacilityId(FacilityId).subscribe({
    next: (providerRes: any) => {
    this.providers = providerRes;
    // ✅ Step 5: Update Times (if needed)
    this.Times = this.AppointmentData;
      this.loader.hide();
  },
  error: (err) => {
    this.loader.hide();
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load providers.',
    });
  }
});

  // .catch((error:any) => {
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Error',
  //     text: error.message || 'Something went wrong while fetching specialities.',
  //   });
  // });
}
  GetSpecialityByEmployeeId(EmployeeId: any) {
 // debugger
    if(!EmployeeId){
      EmployeeId=0
    }
    this.selectedProviders=EmployeeId;
      // this.SchedulingApiService.GetSpecialityByEmployeeId(EmployeeId).then((res:any) => {
      //   this.specialities=res

        this.SchedulingApiService.GetSiteByProviderId(EmployeeId).then((res:any) => {
        this.siteArray=res
      })
        this.SchedulingApiService.GetProviderScheduleData(EmployeeId).then((res:any) => {
      })
    //   }).catch((error: { message: any }) =>
    //     Swal.fire({
    //   icon: 'error',
    //   title: 'Error',
    //   text: error.message || 'Something went wrong while fetching specialities.',
    // }))
      let provider=this.selectedProviders = this.appointmentForm?.get('provider')?.value||0
      let facility=this.selectedFacility = this.appointmentForm?.get('facility')?.value||0
      let site=this.selectedSites = this.appointmentForm?.get('site')?.value||0
      let speciality=this.selectedSpeciality = this.appointmentForm?.get('speciality')?.value||0
      let date:any
      this.date = this.appointmentForm?.get('date')?.value;
      if(!this.date)
      {
        date=new Date();
      }
      else
      {
        date=this.date
      }
  const dateString = date;
  const formatted = new Date(dateString).toISOString().split('T')[0];
  const dates = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[dates.getDay()];
      this.SchedulingApiService.GetSchAppointmentList(site,provider,facility,speciality,formatted).then((ress:any) => {
        if(ress.length>0)
        {
          this.DurationData=ress
        }
        else
        {
          this.DurationData=[]
        }
        if(this.selectedSites!=undefined && this.selectedSites!=null)
        {
        this.GetProviderbySiteId(this.selectedSites)
        }
    })
    this.Times=this.AppointmentData;

  }

  GetProviderbySiteId(SiteId: any) {
     // debugger
    if(SiteId==null||SiteId==undefined){
      SiteId=0
      this.AppointmentData.length=0
      this.showTable=false
      return
    }
    this.selectedSites=SiteId;
    let Data:any
    let DataDuration:any
    let Duration:any
    let date:any
    this.date = this.appointmentForm?.get('date')?.value;
    if(!this.date)
    {
      date=new Date();
    }
    else
    {
      date=this.date 
    }

      const dateString = date;
      const formatted = new Date(dateString).toISOString().split('T')[0];
      const dates = new Date(dateString);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[dates.getDay()];
      let provider=this.selectedProviders = this.appointmentForm?.get('provider')?.value||0
      let facility=this.selectedFacility = this.appointmentForm?.get('facility')?.value||0
        this.SchedulingApiService.GetTimeSlots(SiteId,provider,facility,dayName).then((res) => {
          if(res)
          {
            Data=res

          this.SchedulingApiService.GetDurationOfTimeSlot(SiteId,provider,facility,dayName).then((ress) => {
          DataDuration=ress
          if(DataDuration.duration==null)
          {
            Duration =60/DataDuration.appPerHour
          }
          else
          {
            Duration=DataDuration.duration
          }

          // this.AppointmentData = [];
          const StartTime = moment(Data.startTime, 'HH:mm:ss a')
            const EndTime = moment(Data.endTime, 'HH:mm:ss a')
            let currentTime = new Date(StartTime.toISOString());
            let endTime = new Date(EndTime.toISOString());
            while (currentTime <= endTime) {
              let timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
              currentTime.setMinutes(currentTime.getMinutes() + Duration);
              // this.AppointmentData.push({ Time:timeString })
            }

        })

          }else
          {
            this.AppointmentData.length=0
          }
        })

        let site=this.selectedSites = this.appointmentForm?.get('site')?.value||0
        let speciality=this.selectedSpeciality = this.appointmentForm?.get('speciality')?.value||0
        let Currentdate:any = this.datePipe.transform(this.date,'yyyy-MM-dd');
        if(!Currentdate)
        {
          Currentdate = formatted
        }
         // debugger
        this.SchedulingApiService.GetSchAppointmentList(site,provider,facility,speciality,Currentdate).then((ress:any) => {
        this.DurationData=ress
      })
       // debugger
      if(this.qid!=null)
      {
        // this.Times=this.AppointmentData;
        // this.time = this.Times.filter((a) => a.code == this.time)
        this.Times = [{ Time: this.TimeSlotGridTime }];

      }
      else
      {
        this.Times=this.AppointmentData;
      }

  }
  GetProviderByFacilityId(FacilityId: any) {
    if (!FacilityId) {
      FacilityId = 0;
    }

    this.SchedulingApiService.GetProviderByFacilityId(FacilityId).subscribe((res:any) => {
      this.providers = res;
    }, (error:any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong while fetching providers.',
      });
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
  
  mrNo: any;
  submitAppointment() {

    // this.AppoinmentBooking.AppDateTime = this.combineDateTime();

    var userId = sessionStorage.getItem('userId');
    // var currentUser = JSON.parse(sessionStorage.getItem('userName') || '');
    
    this.mrNo = this.SearchPatientData?.table2[0]?.mrNo;;
    this.AppoinmentBooking.EmployeeId = userId;
    this.AppoinmentBooking.PatientId = this.SearchPatientData?.table2[0]?.patientId;;
   console.log('submitAppointment hit');
    if (!this.mrNo) {
      Swal.fire(
        'Validation Error', 
        'MrNo is a required field. Please load a patient.', 
        'warning');
        console.log('MrNo is a required field. Please load a patient line no 688.');
        return;
    }

    if (this.appointmentForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill all required fields',
      });
      this.appointmentForm.markAllAsTouched(); // saare errors dikhane k liye
      return;
    }


    if (this.qid != null || this.qid != undefined) {
      this.AppoinmentBooking.AppId = this.qid;
    } else {
      this.AppoinmentBooking.AppId = 0;
    }

    const formdata = this.appointmentForm.value;
    this.AppoinmentBooking.ProviderId = this.appointmentForm.get('provider')?.value;
    this.AppoinmentBooking.MRNo = this.mrNo;
    this.AppoinmentBooking.date = this.appointmentForm.get('date')?.value;
    this.AppoinmentBooking.time = this.appointmentForm.get('time')?.value;
    this.AppoinmentBooking.AppDateTime = this.appointmentForm.get('date')?.value;
    this.AppoinmentBooking.Duration = this.appointmentForm.get('selectedDuration')?.value;
    this.AppoinmentBooking.AppNote = 'This is Appointment Note';
    this.AppoinmentBooking.SiteId = this.appointmentForm.get('site')?.value;
    this.AppoinmentBooking.FacilityId = this.appointmentForm.get('facility')?.value;
    this.AppoinmentBooking.LocationId = this.appointmentForm.get('selectedLocation')?.value;
    this.AppoinmentBooking.AppTypeId = this.appointmentForm.get('selectedType')?.value;
    this.AppoinmentBooking.AppCriteriaId = this.appointmentForm.get('selectedCriteria')?.value;
    this.AppoinmentBooking.AppStatusId = this.appointmentForm.get('selectedStatus')?.value; //1;
    this.AppoinmentBooking.PatientStatusId = 1;
    this.AppoinmentBooking.ReferredProviderId = this.appointmentForm.get('selectedReferredBy')?.value;
    this.AppoinmentBooking.IsPatientNotified = true;
    this.AppoinmentBooking.IsActive = true;
    this.AppoinmentBooking.EnteredBy = 'JohnDoe';
    this.AppoinmentBooking.VisitTypeId = this.appointmentForm.get('selectedVisitType')?.value;
    this.AppoinmentBooking.EntryDateTime = new Date();
    this.AppoinmentBooking.PurposeOfVisitId = this.appointmentForm.get('selectedPurpose')?.value;
    this.AppoinmentBooking.PurposeOfVisit = this.appointmentForm.get('selectedPurpose')?.value;
    this.AppoinmentBooking.PatientNotifiedID = this.appointmentForm.get('selectedNotified')?.value; //17;
    this.AppoinmentBooking.RescheduledID = 4;
    this.AppoinmentBooking.ByProvider = true;
    this.AppoinmentBooking.SpecialtyID = this.appointmentForm.get('speciality')?.value;
    this.AppoinmentBooking.PayerId = this.appointmentForm.get('selectedPayer')?.value;
    this.AppoinmentBooking.PatientBalance = this.appointmentForm.get('PatientBalance')?.value;;
    this.AppoinmentBooking.PlanBalance = this.appointmentForm.get('PlanBalance')?.value;;
    this.AppoinmentBooking.PlanCopay = this.appointmentForm.get('PlanCopay')?.value;;
    this.AppoinmentBooking.planId = this.appointmentForm.get('selectedPayerplan')?.value;
    this.AppoinmentBooking.VisitStatusEnabled = false;
    this.AppoinmentBooking.CPTGroupId = 101;
    this.AppoinmentBooking.AppointmentClassification = 1;
    this.AppoinmentBooking.OrderReferralId = 1
    this.AppoinmentBooking.TelemedicineURL = 'https://example.com/telemedicine';

    const schApp = this.AppoinmentBooking;
    if (this.AppoinmentBooking.AppId <= 0) {
      this.SchedulingApiService.submitappointmentbooking(schApp)
        .then((response: any) => {
          debugger
          response
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Appointment has been Create',
          })
          
          this.router.navigate(['scheduling/view appointments']);
        }).catch((error: { message: any }) => {
          return Swal.fire({
            icon: 'error' ,
            title: 'Error',
            text: error.message,
          })
        }
        );
    } else if (this.AppoinmentBooking.AppId > 0) {
      ;
      this.SchedulingApiService.UpdateByAppId(this.AppoinmentBooking).then((response: any) => {
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Appointment has been Updated',
        })
        this.router.navigate(['scheduling/view appointments']);
      }).catch((error: { message: any }) => {
        return Swal.fire({
          icon: 'error' ,
          title: 'Error',
          text: error.message,
        })
      }
      );
    }

    // console.log('Selected Purpose:', this.AppoinmentBooking);
  }
  cancel(){

  }
   async GetAppointmentByTime(date:any)
  {
     // debugger
    //  this.AppointmentData = [];
    let Data:any
    let DataDuration:any
    let Duration:any
    let provider=this.selectedProviders = this.appointmentForm?.get('provider')?.value||0
    let facility=this.selectedFacility = this.appointmentForm?.get('facility')?.value||0
    let SiteId=this.selectedSites = this.appointmentForm?.get('site')?.value||0
    let speciality=this.selectedSpeciality = this.appointmentForm?.get('speciality')?.value||0
    this.date = this.appointmentForm?.get('date')?.value;
    if(!this.date)
    {
      date=new Date();
    }
    else
    {
      date=this.date
    }
const dateString = date;
const dates = new Date(dateString);
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayName = days[dates.getDay()];
    await this.SchedulingApiService.GetTimeSlots(SiteId,provider,facility,dayName).then((res) => {
      if(res!=null)
      {
        Data=res
      }else
      {
        this.AppointmentData.length=0
      }
    })
    await this.SchedulingApiService.GetDurationOfTimeSlot(SiteId,provider,facility,dayName).then((ress) => {
      DataDuration=ress
      if(DataDuration.duration==null)
      {

        Duration=60/DataDuration.appPerHour||1
      }
      else
      {
        Duration=DataDuration.duration
      }
          
          const StartTime = moment(Data.startTime, 'HH:mm:ss a')
          const EndTime = moment(Data.endTime, 'HH:mm:ss a')
          let currentTime = new Date(StartTime.toISOString());
          let endTime = new Date(EndTime.toISOString());
          while (currentTime <= endTime) {

            let timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            currentTime.setMinutes(currentTime.getMinutes() + Duration);
            this.AppointmentData.push({ Time:timeString })
            console.log('GetAppointmentByTime',this.AppointmentData)
          }
          this.showTable=true
    
      
    })
    var Currentdate
      if(!this.appointmentForm?.get('date')?.value)
      {
         Currentdate = new Date();
      }else{
         Currentdate = this.datePipe.transform(this.appointmentForm?.get('date')?.value,'yyyy-MM-dd');
      }
      await this.SchedulingApiService.GetSchAppointmentList(SiteId,provider,facility,speciality,Currentdate).then((ress:any) => {
      
       // debugger
        if(ress.length>0)
      {
        let mappedArray = this.AppointmentData.map((item: any) => {
          const { 
            mrno, 
            personName,
            duration,
            purposeOfVisit, 
            ...rest } = item;
          return rest;
        });
        this.AppointmentData=mappedArray
        this.DurationData=ress
      }
      else
      {
        let mappedArray = this.AppointmentData.map((item: any) => {
          const { 
            mrno, 
            personName,
            duration,
            purposeOfVisit, 
            ...rest } = item;
          return rest;
        });
        this.AppointmentData=mappedArray
        this.DurationData=[]
      }
    })
   this.Times=this.AppointmentData;
// this.Times = this.Times.filter(time => {
//   const targetTime = new Date('2000-01-01 ' + this.currentTime);
//   const timeToCompare = new Date('2000-01-01 ' + time.Time);
//   return timeToCompare >= targetTime;
// });
  }
  RowColor(rowData: any) {
    const TotalTime = moment(rowData.Time, 'HH:mm:ss a')
    if (this.DurationData.length > 0) {
      for (const timeSlot of this.DurationData) {
        let time: any = this.datePipe.transform( 
          timeSlot.appDateTime, 'hh:mm:ss a'
        )
        const StartTime = moment(time, 'HH:mm:ss a')
        let endTime: any;
        endTime = Number(timeSlot.duration)
        let endDate = new Date(StartTime.toISOString());
        let futureDate = new Date(endDate.setMinutes(endDate.getMinutes() + endTime));
        if (endTime == 0) { return false; }
        else {
          while (rowData.Time == time) {
            rowData.personName = timeSlot.personName;
            rowData.mrno = timeSlot.mrno;
            rowData.duration = timeSlot.duration;
            rowData.purposeOfVisit = timeSlot.purposeOfVisit;
            return 'true';
          }
        }
      }
      return '';

    } else {
      rowData.personName = '';
      rowData.mrno = '';
      rowData.duration = '';
      rowData.purposeOfVisit = '';
      return '';
    }
  }
eligibility(){

}
GetTime()
{
      this.Times=this.AppointmentData;
}
showDetailsDialog(element: any) {
  this.selectedElement = element;
  this.detailsDialogVisible = true;
}
  FillCache() {
   this.SchedulingApiService
  .getCacheItem({ entities: this.cacheItems })
  .then((response: any) => {
    if (response.cache != null) {
      this.FillDropDown(response);
    }
  })
 .catch((error: { message: any }) =>
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Something went wrong',
        })
      );
  }

  FillDropDown(response: any) {
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    console.log(jParse,'wer');
    let visitType = JSON.parse(jParse).VisitType;
    let regLocations = JSON.parse(jParse).RegLocations;
    let schAppointmentCriteria = JSON.parse(jParse).SchAppointmentCriteria;
    let patientNotifiedOptions = JSON.parse(jParse).PatientNotifiedOptions;
    let schAppointmentStatus = JSON.parse(jParse).SchAppointmentStatus;
    let blPayer = JSON.parse(jParse).BLPayer;
    let problemList = JSON.parse(jParse).ProblemList;
    let provider = JSON.parse(jParse).Provider;
    let SchAppointmentType = JSON.parse(jParse).SchAppointmentType;
    let speciality = JSON.parse(jParse).providerspecialty;
    let sites = JSON.parse(jParse).RegLocationTypes;
    let regFacility = JSON.parse(jParse).RegFacility;
    let blPayerPlan = JSON.parse(jParse).BLPayerPlan;

    if (blPayer) {
      blPayer = blPayer.map((item: { PayerId: any; PayerName: any }) => {
        return {
          name: item.PayerName,
          code: item.PayerId,
        };
      });
      this.payer = blPayer;
    }

    if (sites) {
      sites = sites.map((item: { TypeId: any; Name: any }) => {
        return {
          name: item.Name,
          code: item.TypeId,
        };
      });
      //this.sites = sites;
    }

    if (provider) {
      this.referred = provider.map((item: { EmployeeId: any; FullName: any }) => {
        return {
          name: item.FullName,
          code: item.EmployeeId,
        };
      });
      this.referred = this.referred;
    }



    if (speciality) {
      speciality = speciality.map(
        (item: { SpecialtyID: any; SpecialtyName: any }) => {
          return {
            name: item.SpecialtyName,
            code: item.SpecialtyID,
          };
        }
      );

      //this.speciality = speciality;
    }

    if (SchAppointmentType) {
      SchAppointmentType = SchAppointmentType.map(
        (item: { AppTypeId: any; AppType: any }) => {
          return {
            name: item.AppType,
            code: item.AppTypeId,
          };
        }
      );

      this.type = SchAppointmentType;
    }


    if (visitType) {
      visitType = visitType.map(
        (item: { VisitTypeId: any; VisitTypeName: any }) => {
          return {
            name: item.VisitTypeName,
            code: item.VisitTypeId,
          };
        }
      );
      this.visittype = visitType;
    }
    if (blPayerPlan) {

      blPayerPlan = blPayerPlan.map(
      (item: { PlanId: any; PlanName: any }) => {
        return {
          name: item.PlanName,
          code: item.PlanId,
        };
      }
    );
    this.payerPlan = blPayerPlan;
  }

    this.case = [
      { name: 'Case 1', criteriaid: 1 },
      { name: 'Case 2', criteriaid: 2 },
      { name: 'Case 3', criteriaid: 3 },
    ];

    this.duration = [
      { name: '15 minutes', criteriaid: 1, value:'15' },
      { name: '30 minutes', criteriaid: 2, value:'30' },
      { name: '45 minutes', criteriaid: 3, value:'45' },
    ];

    if (regLocations) {
      regLocations = regLocations.map(
        (item: { LocationId: any; Name: any }) => {
          return {
            name: item.Name,
            code: item.LocationId,
          };
        }
      );
      this.location = regLocations;
    }

    if (schAppointmentCriteria) {
      schAppointmentCriteria = schAppointmentCriteria.map(
        (item: { CriteriaId: any; CriteriaName: any }) => {
          return {
            name: item.CriteriaName,
            code: item.CriteriaId,
          };
        }
      );

      this.criteria = schAppointmentCriteria;
    }

    if (regFacility) {
      regFacility = regFacility.map((item: { Id: number; Name: any }) => {
        return {
          name: item.Name,
          code: item.Id,
        };
      });
      this.facilities = regFacility;
      console.log(this.facilities, 'this.facilities');
    }

    if (patientNotifiedOptions) {
      patientNotifiedOptions = patientNotifiedOptions.map(
        (item: { NotifiedId: any; NotifiedOptions: any }) => {
          return {
            name: item.NotifiedOptions,
            code: item.NotifiedId,
          };
        }
      );
      this.notified = patientNotifiedOptions;
    }

    if (schAppointmentStatus) {
      schAppointmentStatus = schAppointmentStatus.map(
        (item: { AppStatusId: any; AppStatus: any }) => {
          return {
            name: item.AppStatus,
            code: item.AppStatusId,
          };
        }
      );

      this.status = schAppointmentStatus;
    }

    if (problemList) {
      problemList = problemList.map(
        (item: { ProblemId: any; ProblemName: any }) => {
          return {
            name: item.ProblemName,
            code: item.ProblemId,
          };
        }
      );
      this.purpose = problemList;
    }

    this.SchedulingApiService
      .getEmployeeFacilityFromCache()
      .then((response:any) => {
        if (response.cache != null) {
          let jParse = JSON.parse(JSON.stringify(response)).cache;
          let hremployeefacility = JSON.parse(jParse);
          if (hremployeefacility) {
            let facilityIds = hremployeefacility.map(
              (item: { FacilityID: any }) => {
                return item.FacilityID;
              }
            );
          }
        }
      })
      .catch((error) =>
       Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Something went wrong',
        })
      );
  }

//     ngAfterViewInit(): void {

//     flatpickr('#appointmentDate', {
//     dateFormat: 'Y-m-d',
//     maxDate: 'today',
//     onChange: (selectedDates: any, dateStr: string) => {
//       this.appointmentForm.get('appointmentDate')?.setValue(dateStr);
//     },
//   });
//   }

getEligibilityList() {
  this.mrNo = this.SearchPatientData?.table2?.[0]?.mrNo;
  if(!this.mrNo){
    Swal.fire(
      'Validation Error', 
      'MrNo is a required field. Please load a patient.',
      'warning');
    console.log('MrNo is a required field. Please load a patient line no 1183.');
    return;
  }
  if (this.mrNo) {
    this.SchedulingApiService.getEligibilitydata(this.mrNo)
      .then((res: any) => {
        if (res.table1) {
          let eligibilities = [];
          for (let i = 0; i < res.table1.length; i++) {
            eligibilities.push({
              mrno: res.table1[i].mrno,
              status: res.table1[i].status,
              payerName: res.table1[i].payerName,
              planName: res.table1[i].planName,
              eligiblityDate: res.table1[i].eligiblityDate,
              facility: res.table1[i].facility,
              responseDetails: res.table1[i].responseDetails
            });
          }
          this.eligibty = eligibilities;
        }
      })
      .catch((error: any) => {
        console.error('Error fetching eligibility data:', error);
      });
  }
}

}
