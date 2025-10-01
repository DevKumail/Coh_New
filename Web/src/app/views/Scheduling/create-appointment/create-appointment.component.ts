
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '@core/services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SchedulingApiService } from '../scheduling.api.service';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import moment from 'moment';
import { NgbModal, NgbModalRef, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { LoaderService } from '@core/services/loader.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { ChangeDetectorRef } from '@angular/core';

declare var flatpickr: any;

@Component({
  selector: 'app-create-appointment',
  standalone: true,

  imports: [
            ReactiveFormsModule,
            CommonModule,
            RouterModule,
        NgbTimepickerModule,
        NgIconComponent,
        TranslatePipe],

  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CreateAppointmentComponent implements OnInit {
  date: any;

  // private focusFirstInvalidControl(): void {
  //   try {
  //     setTimeout(() => {
  //       const firstInvalid = document.querySelector('.is-invalid, .ng-invalid.ng-touched') as HTMLElement | null;
  //       firstInvalid?.focus({ preventScroll: true } as any);
  //       firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //     });
  //   } catch {}
  // }

    //  focusFirstInvalidControl() {
    //     // Defer to allow template to update validation classes
    //   const selector = 'form .ng-invalid.ng-touched, form .ng-invalid[formcontrolname]';
    //   const firstInvalid = document.querySelector(selector) as HTMLElement | null;
    //   if (firstInvalid) {
    //     firstInvalid.focus({ preventScroll: true } as any);
    //     firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //   }
    // }


    
  
  // Reset the appointment form and related UI state
  resetForm(): void {
    if (!this.appointmentForm) return;
    this.appointmentForm.reset({
      facility: '',
      speciality: '',
      provider: '',
      site: '',
      date: '',
      time: '',
      selectedPurpose: '',
      selectedVisitType: '',
      selectedType: '',
      selectedReferredBy: '',
      selectedDuration: '',
      selectedLocation: '',
      selectedCriteria: '',
      selectedNotified: '',
      selectedStatus: '1',
      selectedPayer: '',
      AppointmentNote: '',
      selectedPayerplan: '',
      PlanCopay: '',
      PlanBalance: '',
      PatientBalance: '',
      IsConsultationVisit: ''
    });

    // Clear dependent UI state
    this.siteArray = [];
    this.AppointmentData = [];
    this.DurationData = [];

    // Reset selection trackers
    this.selectedFacility = 0;
    this.selectedSpeciality = 0;
    this.selectedProvider = 0;
    this.selectedSite = 0;
    this.selectedDate = null;
    this.selectedProviders = 0;
    this.selectedSites = 0;
    this.selectedSpecialities = 0;
    this.selectedFacilities = 0;
    this.selectedLocations = 0;
    this.selectedCriteria = 0;
    this.selectedNotified = 0;
    this.selectedStatus = 0;
    this.selectedVisitType = 0;
    this.selectedPayer = 0;
    this.selectedPayerPlan = 0;
    this.selectedDuration = 0;
    this.selectedPurpose = 0;
    this.selectedReferred = 0;

    // UI housekeeping
    this.showTable = false;

    // Mark form pristine and untouched
    this.appointmentForm.markAsPristine();
    this.appointmentForm.markAsUntouched();
  }


  appointmentForm!: FormGroup;
minDate: any;
    private modalRef!: NgbModalRef; 

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
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private SchedulingApiService: SchedulingApiService,
    private http: HttpClient,
    private loader : LoaderService,
    private patientBannerService: PatientBannerService,
    private secureStorage: SecureStorageService,
    private cdr: ChangeDetectorRef
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

  async ngOnInit() {


    this.appointmentForm = this.fb.group({
      facility: ['', Validators.required],
      speciality: ['', Validators.required],
      provider: ['', Validators.required],
      site: ['', Validators.required],
      date: ['', Validators.required],
      // Use string time like '01:30 PM' to match dropdown options
      time: ['', Validators.required],
      selectedPurpose: ['', Validators.required],
      selectedVisitType: ['', Validators.required],
      selectedType: ['', Validators.required],
      selectedReferredBy: ['', Validators.required],
      selectedDuration: ['', Validators.required],
      selectedLocation: ['', Validators.required],
      selectedCriteria: ['',Validators.required],
      selectedNotified: ['', Validators.required],
      selectedStatus: ['1'],
      selectedPayer: ['', Validators.required],
      AppointmentNote: [''],
      selectedPayerplan: [''],
      PlanCopay: [''],
      PlanBalance: [''],
      PatientBalance: [''],
    IsConsultationVisit: [''],
  });
  await this.FillCache();
  this.cdr.markForCheck();


  // Prefer Router navigation state; fallback to window.history.state for refresh/reuse
  const nav = this.router.getCurrentNavigation();
  const navState: any = nav?.extras?.state ?? (window.history && (window.history.state as any)) ?? {};
  const stateAppId = navState?.appId;
  const stateAppointment = navState?.appointment;

  // Fallback to secure storage on page refresh
  const storedId = this.secureStorage.getItem('appointmentEditId');

  if (stateAppId != null) {
    this.qid = Number(stateAppId);
    await this.FillAppoinment(this.qid);
    this.cdr.markForCheck();
  } else if (storedId) {  
    this.qid = Number(storedId);
    await this.FillAppoinment(this.qid);
    this.cdr.markForCheck();

  }

  // Clear once consumed to avoid stale usage
  if (this.qid) {
    this.secureStorage.removeItem('appointmentEditId');
  }
      
  
  this.appointmentForm.get('facility')?.valueChanges.subscribe((facilityId) => {
    if (facilityId) {
      this.cdr.markForCheck();
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
    

    

    // Keep time grid highlight in sync with dropdown selection
    this.appointmentForm.get('time')?.valueChanges.subscribe((val) => {
      // No-op here; template binds directly to form value for highlighting
      // But you could scroll to the selected row if desired
      });

    flatpickr('#entryDate', {
      dateFormat: 'Y-m-d',
      // maxDate: 'today',
      onChange: (selectedDates: any, dateStr: string) => {
        this.appointmentForm.get('entryDate')?.setValue(dateStr);
      },
    });



     this.patientBannerService.patientData$.pipe(
                filter((data: any) => !!data?.table2?.[0]?.mrNo),
                distinctUntilChanged((prev, curr) =>
                  prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
                )
              )
              .subscribe((data: any) => {
                this.SearchPatientData = data;
                if (this.SearchPatientData) {
                  this.getEligibilityList();

                }
      });

this.patientBannerService.visitAppointments$.subscribe((data: any) => {
  this.visitAppointments = data;
  this.cdr.markForCheck();
  if (this.visitAppointments) {
      this.getEligibilityList();    
    }
  });

  
}




  // onSubmit(): void {
  //   if (this.appointmentForm.invalid) {
  //     this.appointmentForm.markAllAsTouched();
  //     try { this.focusFirstInvalidControl(); } catch {}
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Invalid Form',
  //       text: 'Please fill all required fields.'
  //     });
  //     return;
  //   }

  //   const formData = this.appointmentForm.value;

  //   Swal.fire({
  //     icon: 'success',
  //     title: 'Appointment Created',
  //     text: 'The appointment has been successfully created.'
  //   });
  // }

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
   //  
    if(SpecialtyId==null||SpecialtyId==undefined){
      SpecialtyId=0
    }
    this.selectedSpeciality=SpecialtyId;
      this.SchedulingApiService.GetSitebySpecialityId(SpecialtyId).then((res: any) => {
        this.siteArray=res
this.cdr.markForCheck();
      }).catch((error: { message: any }) =>
            Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Error'
    }));

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
          this.cdr.markForCheck();
          this.loader.hide();
        } else {
          this.DurationData = [];
          this.cdr.markForCheck();
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
   //  
  this.loader.show();
  if (!FacilityId) {
    FacilityId = 0;
  }
  this.selectedFacility=FacilityId;
   await this.SchedulingApiService.GetSpecialitybyFacilityId(FacilityId).subscribe((res:any) => {
    this.specialities = res;
    this.cdr.markForCheck();
  })
   //  
  this.SchedulingApiService.GetProviderByFacilityId(FacilityId).subscribe({
    next: (providerRes: any) => {
    this.providers = providerRes;
    this.cdr.markForCheck();
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
}
  GetSpecialityByEmployeeId(EmployeeId: any) {
 //  
    if(!EmployeeId){
      EmployeeId=0
    }
    this.selectedProviders=EmployeeId;
        this.SchedulingApiService.GetSiteByProviderId(EmployeeId).then((res:any) => {
        this.siteArray=res
        this.cdr.markForCheck();
      })
        this.SchedulingApiService.GetProviderScheduleData(EmployeeId).then((res:any) => {
      })
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
          this.cdr.markForCheck();
        }
        else
        {
          this.DurationData=[]
          this.cdr.markForCheck();
        }
        if(this.selectedSites!=undefined && this.selectedSites!=null)
        {
        this.GetProviderbySiteId(this.selectedSites)
        }
    })
    this.Times=this.AppointmentData;

  }

  GetProviderbySiteId(SiteId: any) {
     //  
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
      this.cdr.markForCheck();
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
            this.cdr.markForCheck();


          this.SchedulingApiService.GetDurationOfTimeSlot(SiteId,provider,facility,dayName).then((ress) => {
          DataDuration=ress
          this.cdr.markForCheck();
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
              this.cdr.markForCheck();

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
         //  
        this.SchedulingApiService.GetSchAppointmentList(site,provider,facility,speciality,Currentdate).then((ress:any) => {
        this.DurationData=ress
        this.cdr.markForCheck();
      })
       //  
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
      this.cdr.markForCheck();
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
   if (this.appointmentForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill all required fields',
      });
    this.appointmentForm.markAllAsTouched(); // saare errors dikhane k liye
    // setTimeout(() => this.focusFirstInvalidControl(), 0);
      return;
    }
    var userId = sessionStorage.getItem('userId');
    // var currentUser = JSON.parse(sessionStorage.getItem('userName') || '');
    
    this.mrNo = this.SearchPatientData?.table2[0]?.mrNo;;
    this.AppoinmentBooking.EmployeeId = userId;
    this.AppoinmentBooking.PatientId = this.SearchPatientData?.table2[0]?.patientId;;
    if (!this.mrNo || this.mrNo == null || this.mrNo == undefined) {
      Swal.fire(
        'Validation Error', 
        'MrNo is a required field. Please load a patient.', 
        'warning');
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
    if(this.appointmentForm.get('IsConsultationVisit')?.value == "0"){
      this.AppoinmentBooking.IsConsultationVisit = false
    }
    if (this.appointmentForm.get('IsConsultationVisit')?.value == "1") {
      this.AppoinmentBooking.IsConsultationVisit = true
    }
    this.AppoinmentBooking.VisitStatusEnabled = false;
    this.AppoinmentBooking.CPTGroupId = 101;
    this.AppoinmentBooking.AppointmentClassification = 1;
    this.AppoinmentBooking.OrderReferralId = 1
    this.AppoinmentBooking.TelemedicineURL = 'https://example.com/telemedicine';

    const schApp = this.AppoinmentBooking;
    if (this.AppoinmentBooking.AppId <= 0) {
        
      this.SchedulingApiService.submitappointmentbooking(schApp)
        .then((response: any) => {
           
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

  }
  cancel(){

  }
   async GetAppointmentByTime(date:any)
  {
     //  
     this.AppointmentData = [];
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
      
       //  
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
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
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
    try {
      if (!rowData?.Time || !Array.isArray(this.DurationData) || this.DurationData.length === 0) {
        rowData.personName = '';
        rowData.mrno = '';
        rowData.duration = '';
        rowData.purposeOfVisit = '';
        return '';
      }
  
      const displayTime = this.formatDisplayTime(rowData.Time);
      const slot = this.DurationData.find((s: any) => {
        const startStr = this.datePipe.transform(s.appDateTime, 'hh:mm a');
        return startStr && this.formatDisplayTime(startStr) === displayTime;
      });
  
      if (slot) {
        rowData.personName = slot.personName;
        rowData.mrno = slot.mrno;
        rowData.duration = slot.duration;
        rowData.purposeOfVisit = slot.purposeOfVisit;
        return 'true';
      }
  
      rowData.personName = '';
      rowData.mrno = '';
      rowData.duration = '';
      rowData.purposeOfVisit = '';
      return '';
    } catch {
      return '';
    }
  }

    GetTime()
    {
          this.Times=this.AppointmentData;
    }

// Normalize raw time strings (e.g., '01:30:00 PM' or '01:30 PM') to 'hh:mm AM/PM'
formatDisplayTime(raw: any): string {
  if (!raw) return '';
  try {
    const str = String(raw).trim();
    const d = new Date('2000-01-01 ' + str);
    if (isNaN(d.getTime())) return str; // fallback to raw if parsing fails
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return String(raw);
  }
}

// Determine if a raw time value corresponds to the current selected time
isSelectedTime(raw: any): boolean {
  const sel = this.appointmentForm.get('time')?.value;
  return !!sel && sel === this.formatDisplayTime(raw);
}

// Set the selected time from the time slots grid into the dropdown
onTimeRowClick(raw: any) {
      
  if(raw?.mrno){
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'This time slot is already booked',
    })
  } else {
    this.appointmentForm.get('time')?.setValue(this.formatDisplayTime(raw.Time));
  }
}

// Check if a given display time (e.g., '01:30 PM') is already booked using DurationData list
isTimeBooked(displayTime: string): boolean {
  try {
    if (!displayTime || !Array.isArray(this.DurationData)) return false;
    // Extract start times from existing appointments and compare by display string
    for (const slot of this.DurationData) {
      const startStr = this.datePipe.transform(slot.appDateTime, 'hh:mm a');
      if (startStr && this.formatDisplayTime(startStr) === this.formatDisplayTime(displayTime)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

  // Layout helper: true when current document direction is RTL
  get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }
  }

    modalService = new NgbModal();


showDetailsDialog(element: any,modalContent: any) {
  this.selectedElement = element;
  // if(this.selectedElement?.responseDetails){
    this.modalRef = this.modalService.open(modalContent, { size: 'lg', backdrop: 'static' });
  // }
}

FillCache() {
  this.SchedulingApiService
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



 async FillAppoinment(AppointmentById: number) {
  try {
    this.loader.show();
    const res: any = await this.SchedulingApiService.EditAppoimentByAppId(AppointmentById);
    if (!res)
    this.cdr.markForCheck();

    const dateStr = this.datePipe.transform(res.appDateTime, 'yyyy-MM-dd') || '';
    const timeStr = this.datePipe.transform(res.appDateTime, 'hh:mm a') || '';

    this.GetSpecialitybyFacilityId(res.facilityId);
    this.GetSitebySpecialityId(res.specialtyID);
    this.GetProviderbySiteId(res.siteId);
    this.GetSpecialityByEmployeeId(res.providerId);

    // Patch ONLY the required fields, using IDs directly (not option objects)
    this.appointmentForm.patchValue({
      facility: res.facilityId ?? 0,
      speciality: res.specialtyID ?? 0,
      provider: res.providerId ?? 0,
      site: res.siteId ?? 0,
      date: dateStr,
      time: timeStr,
      selectedPurpose: res.purposeOfVisitId ?? 0,
      selectedVisitType: res.visitTypeId ?? 0,
      selectedReferredBy: res.referredProviderId ?? 0,
      selectedType: res.appTypeId ?? 0,
      selectedDuration: res.duration ?? 0,
      selectedLocation: res.locationId ?? 0,
      selectedCriteria: res.appCriteriaId ?? 0,
      selectedNotified: res.patientNotifiedId ?? 0,
      selectedStatus: res.appStatusId ?? 0,
      selectedPayer: res.payerId ?? 0,
      selectedPayerplan: res.planId ?? 0,
      AppointmentNote: res.appNote ?? '',
      PatientBalance: res.patientBalance ?? '',
      PlanBalance: res.planBalance ?? '',
      PlanCopay: res.planCopay ?? '',
      IsConsultationVisit: res.isConsultationVisit ?? 0,
    });

    this.GetAppointmentByTime(dateStr);
    

    // Optionally refresh time slots and provider availability for the selected site/date
    if (res.siteId && res.providerId && res.facilityId && res.specialtyID && dateStr) {
      await this.SchedulingApiService.GetSchAppointmentList(
        res.siteId,
        res.providerId,
        res.facilityId,
        res.specialtyID,
        dateStr
      );
    }
this.cdr.markForCheck();

        this.loader.hide();
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e?.message || 'Failed to load appointment.' });
  } finally {
    this.loader.hide();
  }
      this.loader.hide();

}


eligibility() {
  var Demographicsinfo = sessionStorage.getItem('pb_patientData');
  if (Demographicsinfo) {
    var Demographics = JSON.parse(sessionStorage.getItem('pb_patientData') || '');
    this.mrNo = Demographics.table2[0].mrNo;
    this.SchedulingApiService.InsertEligibility(this.mrNo).then((res:any)=>{
      if(res){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Eligibility Inserted',
        });
      }
    });

  }
}

trackByTime = (_: number, a: any) => a?.Time || _;

}
