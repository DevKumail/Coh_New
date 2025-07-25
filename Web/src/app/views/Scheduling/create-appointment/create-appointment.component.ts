
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '@core/services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SchedulingApiService } from '../scheduling.api.service';

import moment from 'moment'; 


import { HttpClient } from '@angular/common/http';

import { DatePipe } from '@angular/common';
import { D } from 'node_modules/@angular/cdk/bidi-module.d-D-fEBKdS';


@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-appointment.component.html',
  // styleUrl: './create-appointment.component.scss'
})
export class CreateAppointmentComponent implements OnInit {
  date: any;
  

  appointmentForm!: FormGroup;
minDate: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private SchedulingApiService: SchedulingApiService,
    private http: HttpClient,
  ) {}

  
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
 
  Time: any[] = [];
  TimeSlot: any[] = [];
  TimeSlotGrid: any[] = [];
  
 
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
    facility: ['', Validators.required],
    speciality: ['', Validators.required],
    provider: ['', Validators.required],
    site: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    purpose: ['', Validators.required],
    visitType: ['', Validators.required],
    type: ['', Validators.required],
    duration: ['', Validators.required],
    location: ['', Validators.required],
    criteria: [''],
    notified: ['', Validators.required],
    status: ['', Validators.required],
    payer: ['', Validators.required],
    payerPlan: [''],
    insurranceNo: [''],
    referred: [''],
    appointmentId: [''],
    appointmentDate: [''],
    appointmentTime: [''],
    referredBy: [''],
    appointmentPurpose: [''],
    appointmentVisitType: [''],
    appointmentStatus: [''],
    appointmentPriority: [''],
    appointmentMode: [''],
    appointmentReason: [''],
    appointmentNotes: [''],
    appointmentDuration: [''],
    appointmentCriteria: [''],
    appointmentNotified: [''],
    appointmentPayer: [''],
    appointmentPayerPlan: [''],
    appointmentInsurranceNo: [''],
    appointmentReferred: [''],
    appointmentIdFromRoute: [''],
    siteArray: [''],
    selectedFacility: [''],
    selectedSpeciality: [''],
    selectedProvider: [''],
    selectedSite: [''],
    selectedDate: [''],
    planCopay: [''],
    planBalance: [''],
    patientBalance: [''],
    DurationData: [''],
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
    if(SpecialtyId==null||SpecialtyId==undefined){
      SpecialtyId=0
    }
      this.SchedulingApiService.GetSitebySpecialityId(SpecialtyId).then((res: any) => {
        this.siteArray=res
        
      }).catch((error: { message: any }) => 
            Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Error'
    }));
      // this.messageService.add({severity: 'error',summary: 'error',detail: 'Error'}))
      let provider=this.selectedProviders||0
      let facility=this.selectedFacility||0
      let site=this.selectedSites||0
      let speciality=this.selectedSpeciality||0
      let Currentdate:any;
      if(this.date==undefined)
      {
        Currentdate= this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd'
        );
      }
      else
      {
        Currentdate= this.datePipe.transform(
          this.date,
          'yyyy-MM-dd'
        );
      }
        this.SchedulingApiService.GetSchAppointmentList(site,provider,facility,speciality,Currentdate).then((ress: any) => {
          if(ress.length>0)
          {
            this.DurationData=ress
          }
          else
          {
            this.DurationData=[]
          }
        })
        this.Times=this.AppointmentData;

  }



GetSpecialitybyFacilityId(FacilityId: any) {
  debugger
  if (!FacilityId) {
    FacilityId = 0;
  }
  this.SchedulingApiService.GetSpecialitybyFacilityId(FacilityId).subscribe((res:any) => {
    this.specialities = res;
  this.SchedulingApiService.GetProviderByFacilityId(FacilityId).subscribe({
    next: (providerRes: any) => {
    this.providers = providerRes;
    
    
    const provider: number = this.filterForm.get('provider')?.value || 0;
    const facility: number = this.filterForm.get('facility')?.value || 0;
    const site: number = this.filterForm.get('site')?.value || 0;
    const speciality: number = this.filterForm.get('speciality')?.value || 0;

    const selectedDate: string = this.filterForm.get('date')?.value;
    const currentDate: string = this.datePipe.transform(
      selectedDate ? new Date(selectedDate) : new Date(),
      'yyyy-MM-dd'
    ) || '';

   
    this.SchedulingApiService.GetSchAppointmentList(site, provider, facility, speciality, currentDate)
      .then((appointmentRes: any) => {
        if (Array.isArray(appointmentRes)) {
          this.DurationData = appointmentRes;
        } else {
          this.DurationData = [];
          Swal.fire({
            icon: 'warning',
            title: 'No Appointments Found',
            text: 'The result is not an array or is empty.',
          });
        }
      })
      .catch((error:any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load appointments.',
        });
      });

    // ✅ Step 5: Update Times (if needed)
    this.Times = this.AppointmentData;

  },
  error: (err) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load providers.',
    });
  }
});


  })
  // .catch((error:any) => {
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Error',
  //     text: error.message || 'Something went wrong while fetching specialities.',
  //   });
  // });
}
  GetSpecialityByEmployeeId(EmployeeId: any) {
    if(EmployeeId==null||EmployeeId==undefined){
      EmployeeId=0
    }
      this.SchedulingApiService.GetSpecialityByEmployeeId(EmployeeId).then((res:any) => {
        this.specialities=res

        this.SchedulingApiService.GetSiteByProviderId(EmployeeId).then((res:any) => {
        this.siteArray=res
      })
        this.SchedulingApiService.GetProviderScheduleData(EmployeeId).then((res:any) => {
      })
      }).catch((error: { message: any }) => 
        Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Something went wrong while fetching specialities.',
    }))
      let provider=this.selectedProviders||0
      let facility=this.selectedFacility||0
      let site=this.selectedSites||0
      let speciality=this.selectedSpeciality||0
      let date:any
    
      if(this.date==undefined)
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
      this.SchedulingApiService.GetSchAppointmentList(site,provider,facility,speciality,days).then((ress:any) => {
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
    
    if(SiteId==null||SiteId==undefined){
      SiteId=0
      this.AppointmentData.length=0
      this.showTable=false
      return
    }
    let Data:any
    let DataDuration:any
    let Duration:any
    let date:any
    if(this.date==undefined)
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
let provider=this.selectedProviders||0
let facility=this.selectedFacility||0
    this.SchedulingApiService.GetTimeSlots(SiteId,provider,facility,dayName).then((res) => {
      if(res!=null)
      {
    this.SchedulingApiService.GetDurationOfTimeSlot(SiteId,provider,facility,dayName).then((ress) => {
      DataDuration=ress
      if(DataDuration.duration==null)
      {
        Duration=60/DataDuration.appPerHour
      } 
      else
      {
        Duration=DataDuration.duration
      }
      
          Data=res
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
  
      }else
      {
        this.AppointmentData.length=0
      }
    })
 
    let site=this.selectedSites||0
    let speciality=this.selectedSpeciality||0
    let Currentdate:any= this.datePipe.transform(
      this.date,
      'yyyy-MM-dd'
    );
    this.SchedulingApiService.GetSchAppointmentList(site,provider,facility,speciality,Currentdate).then((ress:any) => {
    this.DurationData=ress
  })
  debugger
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
  submitAppointment(){

  }
  cancel(){

  }
   GetAppointmentByTime(date:any)
  {
    
    let Data:any
    let DataDuration:any
    let Duration:any
    let provider=this.selectedProviders||0
    let facility=this.selectedFacility||0
    let SiteId=this.selectedSites||0
    let speciality=this.selectedSpeciality||0
    if(this.date==undefined)
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
    this.SchedulingApiService.GetTimeSlots(SiteId,provider,facility,dayName).then((res) => {
      if(res!=null)
      {
    this.SchedulingApiService.GetDurationOfTimeSlot(SiteId,provider,facility,dayName).then((ress) => {
      DataDuration=ress
      if(DataDuration.duration==null)
      {
        
        Duration=60/DataDuration.appPerHour||1
      }
      else
      {
        Duration=DataDuration.duration
      }
          Data=res
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
      }else
      {
        this.AppointmentData.length=0
      }
    })
      if(date==undefined)
      {
        date=new Date();
      }
      let Currentdate:any= this.datePipe.transform(
        date,
        'yyyy-MM-dd'
      );
      this.SchedulingApiService.GetSchAppointmentList(SiteId,provider,facility,speciality,Currentdate).then((ress:any) => {      
      if(ress.length>0)
      {
        let mappedArray = this.AppointmentData.map((item: any) => {
          const { mrno, personName,duration,purposeOfVisit, ...rest } = item;
          return rest;
        });
        this.AppointmentData=mappedArray
        this.DurationData=ress
      }
      else
      {
        let mappedArray = this.AppointmentData.map((item: any) => {
          const { mrno, personName,duration,purposeOfVisit, ...rest } = item;
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
 RowColor(appointment: any): boolean {
  // Example logic to highlight consultation appointments
  return appointment?.purposeOfVisit === 'Consultation';
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
      provider = provider.map((item: { EmployeeId: any; FullName: any }) => {
        return {
          name: item.FullName,
          code: item.EmployeeId,
        };
      });
      this.provider = provider;
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

    if (provider) {
      this.referred = provider;
    }

    if (visitType) {
      visitType = visitType.map(
        (item: { VisitTypeId: any; VisitTypeName: any }) => {
          return {
            name: item.VisitTypeName,
            visittypeid: item.VisitTypeId,
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
            locationid: item.LocationId,
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
            criteriaid: item.CriteriaId,
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
            notifiedid: item.NotifiedId,
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
            appstatusid: item.AppStatusId,
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
            problemid: item.ProblemId,
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



}
