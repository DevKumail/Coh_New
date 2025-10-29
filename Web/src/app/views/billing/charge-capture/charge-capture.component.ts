import { Component, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '@/app/shared/icons.module';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import Swal from 'sweetalert2'; 
import { ChargeCaptureService } from '@/app/shared/Services/Charge-Capture/charge-capture.service';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { LoaderService } from '@core/services/loader.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { Subscription } from 'rxjs';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';

// import { NgxPermissionsDirective } from 'ngx-permissions';

@Component({
  selector: 'app-charge-capture',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    NgbNavModule,
    IconsModule,
  TranslatePipe,
    FormsModule,
    FilledOnValueDirective,
    GenericPaginationComponent
    // NgxPermissionsDirective
  ],
  standalone: true, 
  templateUrl: './charge-capture.component.html',
  styles: ``,
})
export class ChargeCaptureComponent {
  @Output() yearFilterChange = new EventEmitter<any>();
  private patientDataSubscription: Subscription | undefined;
  private AppoinmentDataSubscription: Subscription | undefined;
  selectedYear: any;
  SearchPatientData: any
  activeServiceTabId = 1;
  activeTabId = 1;
  Demographic: any = {};
  ServicesGrid: any = {M1:undefined,M2:undefined,M3:undefined,M4:undefined,universaltoothcode:undefined,Unit:undefined}
  DignosisGrid: any = {YearofOnset:undefined,TypeofDiagnosis:undefined}
  status: any = [];
  maritalstatus: any = [];
  Provider: any[] = [];
  ICDVersions:any[]=[];
  universaltoothcodearray:any[]=[];
  @ViewChild('MyDiagnosis') MyDiagnosis: any;
  @ViewChild('MyCPT')  MyCPT: any;
  @ViewChild('MYHCPCS')  MYHCPCS: any;
  @ViewChild('MyDental')  MyDental: any;
  AllMyDiagnosisCode: any [] = [];
  AllMyHCPCSCode: any [] = [];
  selectedgrid:any=[]
  comment: any;
  ICT9Group:any[]=[];
  ICT9GroupId:number=0;
  DescriptionFilter: any ;
  DiagnosisEndCode: any = '';
  DiagnosisStartCode: any = '';
  ICDVersionId: number=0;
  ProviderId: any=0;
  ProviderBind: any
  GroupId: any = 0;
  universaltoothid:any;


  //CPTCode parameter
  AllCPTCode: any = 0;
  CPTStartCode: any = '';
  CPTEndCode: any = '';
  Description: any = '';
  ProcedureEndCode: any = '';
  ProcedureStartCode: any = '';

  //MyDentalCode parameter
  DentalCode: any = '';
  ProviderDescription: any = '' ;

  //DentalCode parameter
  AllDentalCode: any = 0;
  DentalStartCode: any ;
  DentalEndCode: any ;

  //HCPCSCode parameter
  HCPCSCode: any  = '';
  AllHCPCSCode: any = 0;
  HCPCStartCode: any ;
  HCPCSEndCode: any ;

  //UnclassifiedService parameter
  AllCode: any = 0;
  UCStartCode: any ;
  ServiceStartCode: any ;


  //All Grid Fill by this array
  MyDiagnosisCode: any [] = [];
  DiagnosisCode: any [] = [];
  MyCPTCode: any = [];
  CPTCode: any [] = [];
  MyDentalCode: any = [];
  AllMyDentalCode: any = [];
  DentalCodeGridData: any= [];
  MyHCPCSCode: any = [];
  HCPCSCodeGrid: any = [];
  UnclassifiedService: any = [];
  ServiceItems: any = [];
  Procedure: any = [];

  Dshow: boolean = true;
  DHide: any;
  Diagnosis: any;
  SShow: boolean = true;
  SHide: any;
  Services: any;

  visitDetail:any=[];
  VisitAccountNO:any;
  MrNo:any;

  ChargeCapture: any = {
    Provider: ' ',
  }

  yearsArray: string[] = [
    "Primary", "Secondary"
  ];

  cacheItems: string[] = [
    'Provider',
    'BLUniversalToothCodes',
    'BLICDVersion',
  ];
  VisitAccountNo: any;
  currentUser: any;
  SearchById:number=0
  serviceCode:boolean=true;
  serviceUnit:boolean=true;
  ServiceM:boolean=true;
serviceToothCode:boolean=true;


CPTGroupId:number=0;
CPTGroups:any[]=[];
PairId:number=0;
MyHCPSGroupId:number=0;
MYHCPCSGroups:any[]=[];
MyDentalGroupId:number=0;
MyDentalGroups:any[]=[];

  Searchby:any=[{code:1 ,name: 'Diagnosis Code'},{code:2 ,name: 'Diagnosis Code Range'},{code:3 ,name: 'Description'}]
  constructor(
    private service: ChargeCaptureService,
    private router: Router,
    private loader: LoaderService,
    private PatientData: PatientBannerService
  ) {  }
  SearchCPTby: any = [
    { code: 1, name: 'All' },
    { code: 2, name: 'CPT Code' },
    { code: 3, name: 'CPT Code Range' },
    { code: 4, name: 'Description' },
  ];

  SearchHCPSby: any = [
    { code: 1, name: 'All' },
    { code: 2, name: 'HCPS Code' },
    { code: 3, name: 'HCPS Code Range' },
    { code: 4, name: 'Description' },
  ];

  SearchDentalby: any = [
    { code: 1, name: 'All' },
    { code: 2, name: 'Dental Code' },
    { code: 3, name: 'Dental Code Range' },
    { code: 4, name: 'Description' },
  ];

  SearchUnclassifiedby: any = [
    { code: 1, name: 'All' },
    { code: 2, name: 'By Code' },
    { code: 4, name: 'Description' },
  ];

  id: any;
  selectedId: any;
  ProceduresData:any = [];

  async ngOnInit() {
 
        this.patientDataSubscription = this.PatientData.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) =>
          prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
        )
      )
      .subscribe((data: any) => {
        if(data){
          this.SearchPatientData = data;
          console.log('✅ Subscription triggered with MRNO:', data);
        }
      });

      this.AppoinmentDataSubscription = this.PatientData.selectedVisit$
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe((visitdata: any) => {
          if (visitdata) {
            this.visitDetail = visitdata;
            this.VisitAccountNO = visitdata.appointmentId
            console.log('✅ Subscription triggered with visit:', this.visitDetail);
          }
      }); 
      
    // var visitAccountDetail=localStorage.getItem("LoadvisitDetail");  
    // if(!(visitAccountDetail==undefined)  && !(visitAccountDetail=="") && !(visitAccountDetail==null))
    // {
    //   this.visitDetail=JSON.parse(localStorage.getItem("LoadvisitDetail") || "");
    //   console.log(this.visitDetail);
    //   this.VisitAccountNO=  this.visitDetail.visitAccountNo;
    //   this.MrNo=  this.visitDetail.mrNo;
    // }

    await this.FillCache();
    await this.populateYearDropdown();
  }

  async loadICD9Gropu(){
    await this.service.GetICD9CMGroupByProvider(this.ProviderId).then((response: any) => {
      console.log(response , 'Group');
      this.ICT9Group=response || [];

      this.ICT9Group = this.ICT9Group.map(
        (item: { groupId: any; groupName: any }) => {
          return {
            name: item.groupName,
            code: item.groupId,
          };
        });
        const item = {
          name: 'ALL',
          code: 0,
        };
       this.ICT9Group.push(item);


  }).catch((error: any) =>
      Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.message
          }));
          }
  async loadCPTGroup(){
    await this.service.GetCPTByProvider(this.ProviderId).then((response: any) => {
      console.log(response , 'Group');
      this.CPTGroups=response || [];
    if(this.CPTGroups.length != 0){
      this.CPTGroups = this.CPTGroups.map(
        (item: { groupId: any; groupName: any }) => {
          return {
            name: item.groupName,
            code: item.groupId,
          };
        });
        const item = {
          name: 'ALL',
          code: 0,
        };
       this.CPTGroups.push(item);
    }


  }).catch(error =>
      Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.message
          }));
  }

async loadHCPCSGroup() {
  await this.service.GetHCPCSByProvider(this.ProviderId).then((response: any) => {
      // Map the response directly and include the 'ALL' group.
      if(Object.keys(response).length != 0){
        
        this.MYHCPCSGroups = [
          ...response?.groups.map((item: { groupId: any; groupName: any }) => ({
            name: item.groupName,
            code: item.groupId,
          })),
          { name: 'ALL', code: 0 }  // Adding 'ALL' group at the end
        ];
      }
      
      console.log(this.MYHCPCSGroups, 'Group');
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'An unexpected error occurred.',
      });
    });
}


  loadDentalGroupGroup(){
  //   this.service.GetDentalGroupbyProvider(this.ProviderId).then((response: any) => {
  //     console.log(response , 'Group');
  //     this.MyDentalGroups=response || [];

  //     this.MyDentalGroups = this.MyDentalGroups.map(
  //       (item: { groupId: any; groupName: any }) => {
  //         return {
  //           name: item.groupName,
  //           code: item.groupId,
  //         };
  //       });
  //       const item = {
  //         name: 'ALL',
  //         code: 0,
  //       };
  //      this.MyDentalGroups.push(item);


  // }).catch((error: any) =>
  //   Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: error?.message
  //         }));
  }

    async filter(e: any) {
    const input = e.target.value?.toLowerCase().trim();

    if (!input) {
      this.MyDiagnosisCode = [...this.AllMyDiagnosisCode];
      return;
    }
    var data = this.AllMyDiagnosisCode.filter((item: any) => {
      return (
        item.icD9Code?.toLowerCase().includes(input) ||
        item.providerDescription?.toLowerCase().includes(input)
      );
    });
    this.MyDiagnosisCode = [...data];
}

  async filteVersion(e: any) {
      this.MyDiagnosisCodeTotalItems = 0;
      this.MyDiagnosisCode = [];
      this.MyDiagnosisCodePaginationInfo.Page = 1;
      const response: any = await this.service.MyDiagnosisCodebyProvider(this.ProviderId, this.ICT9GroupId, this.ICDVersionId , this.MyDiagnosisCodePaginationInfo.Page, this.MyDiagnosisCodePaginationInfo.RowsPerPage);
      this.AllMyDiagnosisCode = response?.table1 || [];
      this.MyDiagnosisCodeTotalItems = response?.table2[0]?.totalRecords || 0;

      this.AllMyDiagnosisCode.map((e: any) => {
        const isSelected = this.MyDiagnosisData.some((item: any) => item.ICDCode  === e.icD9Code); 
        if (isSelected) {
          e.selected = true;
        } else {
          e.selected = false;
        }
      });


  this.MyDiagnosisCode = [...this.AllMyDiagnosisCode];
  }


AllMyCPTCode: any [] = [];

  async filterCPT(e: any) {
     
  const input = e.target.value?.toLowerCase().trim();

  if (!input) {
        this.MyCPTCode = [...this.AllMyCPTCode];
        this.MyCptCodeTotalItems = this.MyCPTCode.length;
        this.MyCptCodeCurrentPage = 1;
        this.MyCptCodeSetPagedData();
        return;
      }

  var data = this.AllMyCPTCode.filter((item: any) => {
    return (
      item.cptCode?.toLowerCase().includes(input) ||
      item.providerDescription?.toLowerCase().includes(input)
    );
  });

  this.MyCPTCode = [...data];
  this.MyCptCodeTotalItems = this.MyCPTCode.length;
  this.MyCptCodeCurrentPage = 1;
  this.MyCptCodeSetPagedData();
}

  filteCPTGroup(e: any) {
    this.service.MyCptCodebyProvider(this.ProviderId, this.CPTGroupId).then((response: any) => {
      this.MyCPTCode = response.table1 || [];

       this.MyCPTCode.map((e: any) => {
        const isSelected = this.MyServicesData.some((item: any) => item.cptCode  === e.cptCode); 
        if (isSelected) {
          e.selected = true;
        } else {
          e.selected = false;
        }
      });
    })
  }

  async filterMyHCPS(e: any) {
     
    // await this.MyHCPCSCodebyProvider()
  const input = e.target.value?.toLowerCase().trim();

  if (!input) {
    this.MyHCPCSCode = [...this.AllMyHCPCSCode];
    this.MyHCPCSCodeTotalItems = this.MyHCPCSCode.length;
      this.MyHCPCSCodeCurrentPage = 1;
      this.MyHCPCSCodeSetPagedData();
    return;
  }

  var data = this.AllMyHCPCSCode.filter((item: any) => {
    return (
      item.hcpcsCode?.toLowerCase().includes(input) ||
      item.providerDescription?.toLowerCase().includes(input)
    );
  });

  this.MyHCPCSCode = [...data];
  this.MyHCPCSCodeTotalItems = this.MyHCPCSCode.length;
  this.MyHCPCSCodeCurrentPage = 1;
  this.MyHCPCSCodeSetPagedData();
}

async filterMyDental(e: any){
       
  const input = e.target.value?.toLowerCase().trim();

  if (!input) {
      this.MyDentalCode = [...this.AllMyDentalCode];
      this.MyDentalCodeTotalItems = this.MyDentalCode.length;
      this.MyDentalCodeCurrentPage = 1;
      this.MyDentalCodeSetPagedData();
    return;
  }

  var data = this.AllMyDentalCode.filter((item: any) => {
    return (
      item.dentalCode?.toLowerCase().includes(input) ||
      item.providerDescription?.toLowerCase().includes(input)
    );
  });
      this.MyDentalCode = [...data];
      this.MyDentalCodeTotalItems = this.MyDentalCode.length;
      this.MyDentalCodeCurrentPage = 1;
      this.MyDentalCodeSetPagedData();
}

  async FillCache() {
     await this.service.getCacheItem({ entities: this.cacheItems }).then((response: any) => {
      if (response.cache != null) {
        this.FillDropDown(response);
      }
    })
      .catch((error) =>
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.message
          }));
  }

  FillDropDown(response: any) {
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let hremploeevar = JSON.parse(jParse).Provider;
    let universaltoothcode= JSON.parse(jParse).BLUniversalToothCodes;
    let iCDVersion=JSON.parse(jParse).BLICDVersion;

    if (hremploeevar) {
      hremploeevar = hremploeevar.map(
        (item: { EmployeeId: any; FullName: any }) => {
          return {
            name: item.FullName,
            code: item.EmployeeId,
          };
        });

        const item = {
          name: "-- Select Provider --",
          code: 0,
        };
        hremploeevar.push(item);
         
      this.ProviderId =0;

      hremploeevar= hremploeevar.sort((a:any, b:any) => {
        return a.code - b.code;
      });
      this.Provider = hremploeevar;
      console.log(this.Provider, 'Provider');
    }

    if (universaltoothcode) {
      universaltoothcode = universaltoothcode.map(
        (item: { ToothCode: any; Tooth: any }) => {
          return {
            name: item.Tooth,
            code: item.ToothCode,
          };
        });
      this.universaltoothid = universaltoothcode[0].code
      this.universaltoothcodearray = universaltoothcode;
      console.log(this.universaltoothcodearray, 'universal tooth code');
    }

    if (iCDVersion) {
       ;
      iCDVersion = iCDVersion.map(
        (item: { ICDVersionId: any; ICDVersion: any }) => {
          return {
            name: item.ICDVersion,
            code: item.ICDVersionId,
          };
        });
         
        const item = {
          name: 'ALL',
          code: 0,
        };
        iCDVersion.push(item);
      this.ICDVersions = iCDVersion;
    }

    this.loader.show();
    this.loadICD9Gropu();
    this.loadCPTGroup();
    this.loadHCPCSGroup();
    this.loadDentalGroupGroup();
    this.loader.hide();
  }

  async provider(event:any) {
    this.loader.show();
    await this.AllServicesApis();
    await this.AllDignosisApis();
    await this.loadICD9Gropu();
    await this.loadCPTGroup();
    await this.loadHCPCSGroup();
    await this.loadDentalGroupGroup();
    this.loader.hide();
  }
  async MyCptCodebyProvider(){
      await this.service.MyCptCodebyProvider(this.ProviderId, this.CPTGroupId).then((response: any) => {
      console.log('response =>',response);
      if(response){
        this.MyCPTCode = response?.table1 || [];
        this.AllMyCPTCode = response?.table1 || [];
        console.log(this.MyCPTCode, 'this.MyCPTCode');
        this.MyCptCodeTotalItems = this.MyCPTCode.length;
        this.MyCptCodeCurrentPage = 1;
        this.MyCptCodeSetPagedData();
      }
    })
  }

  async AllServicesApis() {
    this.loader.show();
    await this.MyCptCodebyProvider();
    await this.MyHCPCSCodebyProvider();
    await this.MyDentalCodebyProvider();
    await this.GetAllCPT();
    await this.GetAllHCPCS();
    await this.GetAllDental();
    await this.GetAllUnclassifiedService();
    await this.GetAllServiceItem();
    this.loader.hide();
  }

  
  validation : boolean = false;
  submit() {
    this.loader.show();
    this.validation = false; 
    if(!(this.VisitAccountNO>0))
    {
      this.loader.hide();
      Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please load Visit'
          });
      return;
    }

    if (this.MyDiagnosisData.length <= 0 || this.pagedAllService.length <= 0) {
      this.loader.hide();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please Select Diagnosis and Service'
      });
      return;
    }

    this.currentUser = JSON.parse(sessionStorage.getItem("userId") || "");
    const currentDate = new Date();
    let ChargCaptureModel = {
      VisitAccountNo:parseInt(this.VisitAccountNO) || null,
      MrNo: this.SearchPatientData?.table2?.[0]?.mrNo || null,
      Comment: this.comment || null,
      PayerId: this.visitDetail.payerId || null,
      EmployeeId: this.currentUser || null,
      AppointmentId: parseInt(this.VisitAccountNO) || null,
      BLSupperBillDiagnosisModel: [],
      BlSuperBillProcedureModel:[]
  }
    let data:any=[];
    for(let i=0;i<this.MyDiagnosisData.length;i++)
    {
        if (!this.MyDiagnosisData[i].typeofDiagnosis) {
          this.validation = true;
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Type is required and at least one type must be Primary'
                });
                this.loader.hide();
        return;
        }
      let Array={
        DiagnosisId : 0,
        VisitAccountNo : parseInt(this.VisitAccountNO),
        Icd9code: this.MyDiagnosisData[i].ICDCode,
        LastUpdatedBy:this.currentUser,
        CreatedBy: this.currentUser,
        CreatedDate : currentDate,
        DiagnosisPriority: this.MyDiagnosisData[i].typeofDiagnosis,
        DiagnosisType :'Final',
        Confidential : false,
        IsHl7msgCreated :false,
        Icdorder :Number( i+1 ),
        Type :this.MyDiagnosisData[i].typeofDiagnosis,
        Descriptionshort :this.MyDiagnosisData[i].description,
        IcdversionId :this.MyDiagnosisData[i].versionId,
        YearofOnset :this.MyDiagnosisData[i].yearofOnset
    };
      data.push(Array);
    }

    ChargCaptureModel.BLSupperBillDiagnosisModel=data;
   
    let procedureData: any = [];
    for (let i = 0; i < this.pagedAllService.length; i++) {
      let procedure = {
        ProcedureId: 0,
        VisitAccountNo: parseInt(this.VisitAccountNO),
        DateOfServiceFrom: currentDate,
        DateOfServiceTo: currentDate,
        CreatedBy: this.currentUser,
        ProcedureCode: this.pagedAllService[i].cptCode,
        Description: this.pagedAllService[i].description,
        UnclassifiedId: this.pagedAllService[i].UnclassifiedId || null,
        ProcedureType: this.pagedAllService[i].type,
        Units: this.pagedAllService[i].Unit || '1',
        Modifier1: this.pagedAllService[i].M1,
        Modifier2: this.pagedAllService[i].M2,
        Modifier3: this.pagedAllService[i].M3,
        Modifier4: this.pagedAllService[i].M4,
        CreatedDate: currentDate
      };
      procedureData.push(procedure);
    }

    ChargCaptureModel.BlSuperBillProcedureModel = procedureData;

    let hasPrimary = ChargCaptureModel.BLSupperBillDiagnosisModel.some(
      (item: any) => item.DiagnosisPriority?.toLowerCase() === 'primary'
    );

    if (!hasPrimary) {
      this.loader.hide();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'At least one diagnosis must be Primary'
      });
      return; // Function stop ho jayega
    }

    debugger
 
        this.service.SaveChargeCapture(ChargCaptureModel).then((response: any) => {
          if (response.success) {
            this.loader.hide();
             Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Successfully Inserted',
                    timer: 1500,
                    showConfirmButton: false
                  });
           this.pagedAllService = []; 
           this.MyDiagnosisData = [];
           this.router.navigate(['/billing/bill generator']);
          }
        })
      }

      delete(){
      }

  DGridShow() {
    this.Dshow = false;
    this.DHide = true;
    this.Diagnosis = true;
  }

  DGridHide() {
    this.DHide = false;
    this.Dshow = true;
    this.Diagnosis = false;
  }

  SGridShow() {
    this.SShow = false;
    this.SHide = true;
    this.Services = true;
    this.AllServicesApis()
  }

  SGridHide() {
    this.SHide = false;
    this.SShow = true;
    this.Services = false;
  }

  servicestype: any [] = [];
  colDxYearofOnset: any [] = [];
  selectedDiagnosis: any[] = [];
  selectedallDiagnosis: any[] = [];
  selectedServices: any [] = [];
  MyDiagnosisData:any=[];
  MyServicesData:any=[];
  cpt= false;
  Dental= false;
  HCPCS= false;

  Rows()
    {
      let data:any=[];
      for(let i=0;i<this.selectedDiagnosis.length;i++)
      {
        let oldData={
          ICDCode:undefined,
          version:undefined,
          description:undefined,
          typeofDiagnosis:'',
          yearofOnset:'',
          versionId:0,
        };
        oldData.ICDCode=this.selectedDiagnosis[i].icD9Code;
        oldData.version=this.selectedDiagnosis[i].icdVersion;
        oldData.versionId=this.selectedDiagnosis[i].icdVersionId;
        oldData.description=this.selectedDiagnosis[i].providerDescription;
        oldData.typeofDiagnosis='';
        oldData.yearofOnset='';
        data.push(oldData);
      }
      this.MyDiagnosisData = data;
      if(this.selectedallDiagnosis.length>0)
      {
        for(let i=0;i<this.selectedallDiagnosis.length;i++)
      {
        let oldData={
          ICDCode:undefined,
          version:undefined,
          description:undefined,
          typeofDiagnosis:'',
          yearofOnset:'',
          versionId:0,
        };
        oldData.ICDCode=this.selectedallDiagnosis[i].icD9Code;
        oldData.version=this.selectedallDiagnosis[i].icdVersion;
        oldData.versionId=this.selectedallDiagnosis[i].icdVersionId;
        oldData.description=this.selectedallDiagnosis[i].descriptionFull;
        oldData.typeofDiagnosis='';
        oldData.yearofOnset='';
        this.MyDiagnosisData.push(oldData);
      }
    }
    console.log(this.MyDiagnosisData,"kun");
  }
  giagnosis:number=0;

  onDiagnosisCodeCheckboxChange(item: any) {
  item.selected = !item.selected;

  if (item.selected) {
    // Add to array if not already there
    const existing = this.MyDiagnosisData.find((d: any) => d.ICDCode === item.icD9Code);
    if (!existing) {
      const newData = {
        ICDCode: item.icD9Code,
        version: item.icdVersion,
        versionId: item.icdVersionId,
        description: item.providerDescription || item.descriptionFull,
        typeofDiagnosis: '',
        yearofOnset: ''
      };
      this.MyDiagnosisData.push(newData);
    }
  } else {
    // Remove from array if unchecked
    this.MyDiagnosisData = this.MyDiagnosisData.filter((d: any) => d.ICDCode !== item.icD9Code);
  }
  this.allDiagnosisUpdatePagination();
}

onMyDiagnosisCheckboxChange(event: any, diagnosis: any): void {
  diagnosis.selected = event.target.checked;

  if (diagnosis.selected) {
    // Add to selected data if not already added
    const newData = {
      ICDCode: diagnosis.icD9Code,
      version: diagnosis.icdVersion,
      versionId: diagnosis.icdVersionId,
      description: diagnosis.providerDescription,
      typeofDiagnosis: '',
      yearofOnset: ''
    };

    const exists = this.MyDiagnosisData.some((item: any) =>
      item.ICDCode === newData.ICDCode && item.versionId === newData.versionId
    );

    if (!exists) {
      this.MyDiagnosisData.push(newData);
    }
  } else {
    // Remove from selected data
    this.MyDiagnosisData = this.MyDiagnosisData.filter((item: any) =>
      !(item.ICDCode === diagnosis.icD9Code && item.versionId === diagnosis.icdVersionId)
    );
  }
this.allDiagnosisUpdatePagination();
  console.log('Selected Diagnoses:', this.MyDiagnosisData);
}


onCPTCheckboxChange(event: any, item: any): void {
    if (item.selected) {
      // Add item if not already in selectedServices
      if (!this.selectedServices.includes(item)) {
        this.selectedServices.push(item);
      }
    } else {
      // Remove item if unchecked
      this.selectedServices = this.selectedServices.filter(s => s !== item);
    }

    this.CPTRows(); // Update processed data
  }

onDentalCheckboxChange(event: any, item: any): void {
  item.procedureType = item.procedureType; // Fallback agar type missing ho
  if (item.selected) {
    if (!this.selectedServices.includes(item)) {
      this.selectedServices.push(item);
    }
  } else {
    this.selectedServices = this.selectedServices.filter(s => s !== item);
  }
  this.CPTRows(); // Reuse same logic
}

onServiceItemCheckboxChange(event: any, item: any): void {
   
  item.procedureType = "Service"; // Fallback agar type missing ho
  if (item.selected) {
    if (!this.selectedServices.includes(item)) {
      this.selectedServices.push(item);
    }
  } else {
    this.selectedServices = this.selectedServices.filter(s => s !== item);
  }
  this.CPTRows(); // Reuse same logic
}


onUnclassifiedServiceCheckboxChange(event: any, item: any): void {
   
  item.procedureType =  "UnclassifiedService";
  if (item.selected) {
    if (!this.selectedServices.includes(item)) {
      this.selectedServices.push(item);
    }
  } else {
    this.selectedServices = this.selectedServices.filter(s => s !== item);
  }
  this.CPTRows(); // Reuse same logic
}


onCPTCODECheckboxChange(event: any, item: any): void {
  item.procedureType = item.procedureType; // Fallback agar type missing ho
  if (item.selected) {
    if (!this.selectedServices.includes(item)) {
      this.selectedServices.push(item);
    }
  } else {
    this.selectedServices = this.selectedServices.filter(s => s !== item);
  }
  this.CPTRows(); // Reuse same logic
}

onHCPCSCheckboxChange(event: any, item: any): void {
  item.procedureType = item.procedureType; // Fallback agar type missing ho
  if (item.selected) {
    if (!this.selectedServices.includes(item)) {
      this.selectedServices.push(item);
    }
  } else {
    this.selectedServices = this.selectedServices.filter(s => s !== item);
  }
  this.CPTRows(); // Reuse same logic
}

onMyhcpcsCheckboxChange(event: any, item: any): void {
  item.procedureType = item.procedureType; // Fallback agar type missing ho
  if (item.selected) {
    if (!this.selectedServices.includes(item)) {
      this.selectedServices.push(item);
    }
  } else {
    this.selectedServices = this.selectedServices.filter(s => s !== item);
  }

  this.CPTRows(); // Reuse same logic
}


  CPTRows() {
     
    let data: any[] = [];

    for (let i = 0; i < this.selectedServices.length; i++) {
      let oldData = {
        type: "",
        cptCode: undefined,
        description: undefined,
        UnclassifiedId: undefined
      };

      let svc = this.selectedServices[i];

      if (svc.procedureType === "Dental") {
        oldData.type = svc.procedureType;
        oldData.cptCode = svc.dentalCode;
        oldData.description = svc.providerDescription;
        this.Dental = true;
        this.cpt = false;
        this.HCPCS = false;
        data.push(oldData);
      } 
      else if (svc.procedureType === "ALLDental") {
        oldData.type = "Dental";
        oldData.cptCode = svc.code;
        oldData.description = svc.descriptionFull;
        this.Dental = true;
        this.cpt = false;
        this.HCPCS = false;
        data.push(oldData);
      } 
      else if (svc.procedureType === "CPT") {
        oldData.type = svc.procedureType;
        oldData.cptCode = svc.cptCode;
        oldData.description = svc.providerDescription;
        this.cpt = true;
        this.Dental = false;
        this.HCPCS = false;
        data.push(oldData);
      } 
      else if (svc.procedureType === "ALLCPT") {
        oldData.type = "CPT";
        oldData.cptCode = svc.code;
        oldData.description = svc.descriptionFull;
        this.cpt = true;
        this.Dental = false;
        this.HCPCS = false;
        data.push(oldData);
      } 
      else if (svc.procedureType === "HCPCS") {
        oldData.type = svc.procedureType;
        oldData.cptCode = svc.hcpcsCode;
        oldData.description = svc.providerDescription;
        this.HCPCS = true;
        this.cpt = false;
        this.Dental = false;
        data.push(oldData);
      } 
      else if (svc.procedureType === "ALLHCPCS") {
        oldData.type = "HCPCS";
        oldData.cptCode = svc.code;
        oldData.description = svc.descriptionFull;
        this.HCPCS = true;
        this.cpt = false;
        this.Dental = false;
        data.push(oldData);
      }
      else if (svc.procedureType === "Service") {
        oldData.type = "Service";
        oldData.cptCode = svc.code;
        oldData.description = svc.description;
        oldData.UnclassifiedId = svc.unclassifiedID
        this.HCPCS = true;
        this.cpt = false;
        this.Dental = false;
        data.push(oldData);
      }
      else if(svc.procedureType === "UnclassifiedService"){
        oldData.type = "Service";
        oldData.cptCode = svc.code;
        oldData.description = svc.description;
        oldData.UnclassifiedId = svc.unclassifiedID
        this.HCPCS = true;
        this.cpt = false;
        this.Dental = false;
        data.push(oldData);
      }
    }

    this.MyServicesData = data;
    this.GetAllService(this.MyServicesData);
    console.log(this.MyServicesData, "Processed Selected Services");
  }

  editingValues: any = {};

  toggleEditMode(rowIndex: number, column: string): void {
    if (this.editingValues[rowIndex] === column) {
      delete this.editingValues[rowIndex]; 
    } else {
      this.editingValues[rowIndex] = column; 
    }
  }

  getEditingValue(rowIndex: number, column: string): any {
    return this.editingValues[rowIndex] === column
      ? this.MyServicesData[rowIndex][column]
      : null;
  }

  populateYearDropdown() {
     
     const currentYear = new Date().getFullYear();
   const years = Array.from({ length: currentYear - 1900 + 1 },
      (_, index) => (currentYear - index).toString());

    this.colDxYearofOnset = years;
     console.log(this.colDxYearofOnset,'this.colDxYearofOnset');
     this.servicestype=this.yearsArray;
  }

  onYearFilterChange(value:any, row:any): void {
   row.yearofOnset = value.value;
  }

  onTypeofDiagnosisChange(value:any, row:any): void {
  row.typeofDiagnosis = value.value;
  }

  onDropdownChange(data:any): void {
    data.displayValue = data.dropdownValue;
  }
searchingName:string='Starting Code';
 searchBy(e: any) {

  if(e.value==3)
  {
    this.searchingName='Code Description';
  }
  else
  {
    this.DescriptionFilter='';
    this.searchingName='Starting Code';
  }
  }

  filteHCPCSGroup(e: any) {
    this.service.MyHCPCSCodebyProvider(this.ProviderId, this.MyHCPSGroupId, this.HCPCSCode, this.DescriptionFilter,this.PairId).then((response: any) => {
      this.MyHCPCSCode = response.table1 || [];

        this.MyHCPCSCode.map((e: any) => {
        const isSelected = this.MyServicesData.some((item: any) => item.cptCode  === e.hcpcsCode); 
        if (isSelected) {
          e.selected = true;
        } else {
          e.selected = false;
        }
      });
      this.MyHCPCSCodeTotalItems = this.MyHCPCSCode.length;
      this.MyHCPCSCodeCurrentPage = 1;
      this.MyHCPCSCodeSetPagedData();
    })
  }

  filteDentalGroup(e: any) {
    this.service.MyDentalCodebyProvider(this.ProviderId, this.MyDentalGroupId, this.ProviderDescription, this.DentalCode).then((response: any) => {
      this.MyDentalCode = response.table1 || []
        this.MyDentalCode.map((e: any) => {
        const isSelected = this.MyServicesData.some((item: any) => item.cptCode  === e.dentalCode); 
        if (isSelected) {
          e.selected = true;
        } else {
          e.selected = false;
        }
      });

      console.log(this.MyDentalCode, 'this.MyDentalCode');

    })
  }

  showSpinner: boolean = false
  SearchProcedure(ProcedureTypeId: number){
    this.showSpinner = true;
     ;
    this.id = this.SearchById;
    this.ProcedureStartCode = this.ProcedureStartCode !== undefined ? this.ProcedureStartCode : null;
    this.ProcedureEndCode = this.ProcedureEndCode !== undefined ? this.ProcedureEndCode : null;
    this.DescriptionFilter = this.DescriptionFilter !== undefined ? this.DescriptionFilter : null;
    if(this.id==1){
      this.ResetFields();
    }
    this.service.ChargeCaptureProceduresList(this.id,this.ProcedureStartCode,this.ProcedureEndCode,this.DescriptionFilter,ProcedureTypeId).then((list: any) => {;
      this.Procedure = list.procedures.table1 || [];
      this.showSpinner = false;
    });
    this.showSpinner = false;
  }
  ResetFields(){
    this.ProcedureStartCode = "";
    this.ProcedureEndCode = "";
    this.DescriptionFilter = "";
  }

  myData: any = [];
  visibleData: any = [];


//#region DiagnosisCode Pagination Start

DiagnosisCodePaginationInfo: any = {
  Page: 1,
  RowsPerPage: 5
};
diagnosisCodeTotalItems = 0;
 
onDiagnosisCodePageChanged(page: number) {
  this.DiagnosisCodePaginationInfo.Page = page;
  this.SearchDiagnosis();
}


SearchDiagnosis() {
  this.showSpinner = true;
  this.service.DiagnosisCodebyProvider(
    this.ICDVersionId,
    this.DiagnosisCodePaginationInfo.Page,
    this.DiagnosisCodePaginationInfo.RowsPerPage,
    this.DiagnosisStartCode,
    this.DiagnosisEndCode,
    this.DescriptionFilter
  ).then((response: any) => {
      this.DiagnosisCode = response.table1 || [];

        this.DiagnosisCode.map((e: any) => {
        const isSelected = this.MyDiagnosisData.some((item: any) => item.ICDCode  === e.icD9Code); 
        if (isSelected) {
          e.selected = true;
        } else {
          e.selected = false;
        }
      });
      
      this.diagnosisCodeTotalItems = response.table2[0]?.totalRecords || 0;
      this.showSpinner = false;
    });
}
//#endregion

//#region MyDiagnosisCode Pagination Start

MyDiagnosisCodePaginationInfo: any = {
  Page: 1,
  RowsPerPage: 5
};
MyDiagnosisCodeTotalItems = 0;

    async onMyDiagnosisCodePageChanged(page: number) {
    this.MyDiagnosisCodePaginationInfo.Page = page;
    await this.AllDignosisApis();
    }


async AllDignosisApis() {
  const response: any = await this.service.MyDiagnosisCodebyProvider(this.ProviderId, this.ICT9GroupId, this.ICDVersionId, this.MyDiagnosisCodePaginationInfo.Page, this.MyDiagnosisCodePaginationInfo.RowsPerPage);
  this.AllMyDiagnosisCode = response?.table1 || [];
  this.MyDiagnosisCode = [...this.AllMyDiagnosisCode];
  this.MyDiagnosisCodeTotalItems = response?.table2[0]?.totalRecords || 0;
}
//#endregion

//#region AllDiagnosis Pagination Start 

// AllDiagnosis Pagination Start
  allDiagnosisPaginatedItems: any[] = [];
  allDiagnosisItemsPerPage: number = 5;
  allDiagnosisCurrentPage: number = 1;
  allDiagnosisTotalPages: number = 0;
  allDiagnosisPageNumbers: number[] = [];

  // Get total count from main list
  get allDiagnosisTotalItems(): number {
    return this.MyDiagnosisData.length;
  }

  get allDiagnosisStart(): number {
    return (this.allDiagnosisCurrentPage - 1) * this.allDiagnosisItemsPerPage;
  }

  get allDiagnosisEnd(): number {
    return Math.min(
      this.allDiagnosisStart + this.allDiagnosisItemsPerPage,
      this.allDiagnosisTotalItems
    );
  }

  // Call this after data load or on checkbox change
  allDiagnosisUpdatePagination(): void {
    this.allDiagnosisTotalPages = Math.ceil(this.allDiagnosisTotalItems / this.allDiagnosisItemsPerPage);
    this.allDiagnosisPageNumbers = Array.from({ length: this.allDiagnosisTotalPages }, (_, i) => i + 1);
    this.allDiagnosisPaginatedItems = this.MyDiagnosisData.slice(this.allDiagnosisStart, this.allDiagnosisEnd);
  }

  allDiagnosisGoToPage(page: number): void {
    if (page >= 1 && page <= this.allDiagnosisTotalPages) {
      this.allDiagnosisCurrentPage = page;
      this.allDiagnosisUpdatePagination();
    }
  }

  allDiagnosisPrevPage(): void {
    if (this.allDiagnosisCurrentPage > 1) {
      this.allDiagnosisGoToPage(this.allDiagnosisCurrentPage - 1);
    }
  }

  allDiagnosisNextPage(): void {
    if (this.allDiagnosisCurrentPage < this.allDiagnosisTotalPages) {
      this.allDiagnosisGoToPage(this.allDiagnosisCurrentPage + 1);
    }
  }
  // AllDiagnosis Pagination End
//#endregion

//#region MyCPTCode Pagination Start
// MyCPTCode Pagination Start
pagedMyCptCode: any[] = [];
MyCptCodeCurrentPage = 1;
MyCptCodePageSize = 5;
MyCptCodeTotalItems = 0;

get MyCptCodeTotalPages(): number {
  return Math.ceil(this.MyCptCodeTotalItems / this.MyCptCodePageSize);
}

get MyCptCodeStart(): number {
  return (this.MyCptCodeCurrentPage - 1) * this.MyCptCodePageSize;
}

get MyCptCodeEnd(): number {
  return Math.min(this.MyCptCodeStart + this.MyCptCodePageSize, this.MyCptCodeTotalItems);
}

get MyCptCodePageNumbers(): (number | string)[] {
  const total = this.MyCptCodeTotalPages;
  const current = this.MyCptCodeCurrentPage;
  const delta = 2;

  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1); // always show first page

  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total); // always show last page

  return range;
}

MyCptCodeSetPagedData() {
  const startIndex = (this.MyCptCodeCurrentPage - 1) * this.MyCptCodePageSize;
  const endIndex = startIndex + this.MyCptCodePageSize;
  this.pagedMyCptCode = this.MyCPTCode.slice(startIndex, endIndex);
}

MyCptCodeGoToPage(page: number) {
  if (typeof page !== 'number' || page < 1 || page > this.MyCptCodeTotalPages) return;
  this.MyCptCodeCurrentPage = page;
  this.MyCptCodeSetPagedData();
}

MyCptCodeNextPage() {
  if (this.MyCptCodeCurrentPage < this.MyCptCodeTotalPages) {
    this.MyCptCodeCurrentPage++;
    this.MyCptCodeSetPagedData();
  }
}

MyCptCodePrevPage() {
  if (this.MyCptCodeCurrentPage > 1) {
    this.MyCptCodeCurrentPage--;
    this.MyCptCodeSetPagedData();
  }
}
// MyCPTCode Pagination End
//#endregion

//#region MyHCPCSCode Pagination Start
pagedMyHCPCSCode: any[] = [];
MyHCPCSCodeCurrentPage = 1;
MyHCPCSCodePageSize = 5;
MyHCPCSCodeTotalItems = 0;

get MyHCPCSCodeTotalPages(): number {
  return Math.ceil(this.MyHCPCSCodeTotalItems / this.MyHCPCSCodePageSize);
}

get MyHCPCSCodeStart(): number {
  return (this.MyHCPCSCodeCurrentPage - 1) * this.MyHCPCSCodePageSize;
}

get MyHCPCSCodeEnd(): number {
  return Math.min(this.MyHCPCSCodeStart + this.MyHCPCSCodePageSize, this.MyHCPCSCodeTotalItems);
}
get MyHCPCSCodePageNumbers(): (number | string)[] {
  const total = this.MyHCPCSCodeTotalPages;
  const current = this.MyHCPCSCodeCurrentPage;
  const delta = 2;

  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1); // always show first page

  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total); // always show last page

  return range;
}

MyHCPCSCodeSetPagedData() {
  const startIndex = (this.MyHCPCSCodeCurrentPage - 1) * this.MyHCPCSCodePageSize;
  const endIndex = startIndex + this.MyHCPCSCodePageSize;
  this.pagedMyHCPCSCode = this.MyHCPCSCode.slice(startIndex, endIndex);
}

MyHCPCSCodeGoToPage(page: number) {
  if (typeof page !== 'number' || page < 1 || page > this.MyHCPCSCodeTotalPages) return;
  this.MyHCPCSCodeCurrentPage = page;
  this.MyHCPCSCodeSetPagedData();
}

MyHCPCSCodeNextPage() {
  if (this.MyHCPCSCodeCurrentPage < this.MyHCPCSCodeTotalPages) {
    this.MyHCPCSCodeCurrentPage++;
    this.MyHCPCSCodeSetPagedData();
  }
}

MyHCPCSCodePrevPage() {
  if (this.MyHCPCSCodeCurrentPage > 1) {
    this.MyHCPCSCodeCurrentPage--;
    this.MyHCPCSCodeSetPagedData();
  }
}

// MyHCPCSCode API Call
async MyHCPCSCodebyProvider() {
  await this.service.MyHCPCSCodebyProvider(this.ProviderId || 0, this.MyHCPSGroupId || 0, this.HCPCSCode || 0 , this.DescriptionFilter || '', this.PairId || 0).then((response: any) => {
    if (response) {
      this.MyHCPCSCode = response?.table1 || [];
      this.AllMyHCPCSCode = response?.table1 || [];
      this.MyHCPCSCodeTotalItems = this.MyHCPCSCode.length;
      this.MyHCPCSCodeCurrentPage = 1;
      this.MyHCPCSCodeSetPagedData();
      console.log(this.MyHCPCSCode, 'MyHCPCSCode');
      this.loader.hide();
    }
  });
}
//#endregion

//#region MyDentalCode Pagination start
pagedMyDentalCode: any[] = [];
MyDentalCodeCurrentPage = 1;
MyDentalCodePageSize = 5;
MyDentalCodeTotalItems = 0;

get MyDentalCodeTotalPages(): number {
  return Math.ceil(this.MyDentalCodeTotalItems / this.MyDentalCodePageSize);
}

get MyDentalCodeStart(): number {
  return (this.MyDentalCodeCurrentPage - 1) * this.MyDentalCodePageSize;
}

get MyDentalCodeEnd(): number {
  return Math.min(this.MyDentalCodeStart + this.MyDentalCodePageSize, this.MyDentalCodeTotalItems);
}

get MyDentalCodePageNumbers(): (number | string)[] {
  const total = this.MyDentalCodeTotalPages;
  const current = this.MyDentalCodeCurrentPage;
  const delta = 2;

  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1); // always show first page

  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total); // always show last page

  return range;
}

MyDentalCodeSetPagedData() {
  const startIndex = (this.MyDentalCodeCurrentPage - 1) * this.MyDentalCodePageSize;
  const endIndex = startIndex + this.MyDentalCodePageSize;
  this.pagedMyDentalCode = this.MyDentalCode.slice(startIndex, endIndex);
}

MyDentalCodeGoToPage(page: number) {
  if (typeof page !== 'number' || page < 1 || page > this.MyDentalCodeTotalPages) return;
  this.MyDentalCodeCurrentPage = page;
  this.MyDentalCodeSetPagedData();
}

MyDentalCodeNextPage() {
  if (this.MyDentalCodeCurrentPage < this.MyDentalCodeTotalPages) {
    this.MyDentalCodeCurrentPage++;
    this.MyDentalCodeSetPagedData();
  }
}

MyDentalCodePrevPage() {
  if (this.MyDentalCodeCurrentPage > 1) {
    this.MyDentalCodeCurrentPage--;
    this.MyDentalCodeSetPagedData();
  }
}

// API Call
async MyDentalCodebyProvider() {
  await this.service.MyDentalCodebyProvider(this.ProviderId, this.GroupId, this.ProviderDescription, this.DentalCode).then((response: any) => {
    if (response) {
      this.MyDentalCode = response?.table1 || [];
      this.AllMyDentalCode = response?.table1 || [];
      this.MyDentalCodeTotalItems = this.MyDentalCode.length;
      this.MyDentalCodeCurrentPage = 1;
      this.MyDentalCodeSetPagedData();
      console.log(this.MyDentalCode, 'this.MyDentalCode');
    }
  });
}
//#endregion

//#region CPTCode Pagination start
CPTTotalItems = 0;
CPTPaginationInfo: any = {
  Page: 1,
  RowsPerPage: 5
};
    async onCPTPageChanged(page: number) {
    this.CPTPaginationInfo.Page = page;
    await this.GetAllCPT();
    }

// API Call
async GetAllCPT() {
   this.CPTTotalItems = 0;
   const data = { AllCPTCode: this.AllCPTCode, CPTStartCode: this.CPTStartCode, CPTEndCode: this.CPTEndCode, DescriptionFilter: this.DescriptionFilter, page: this.CPTPaginationInfo.Page, rowsPerPage: this.CPTPaginationInfo.RowsPerPage };

   await this.service.GetAllCPTCode(data).then((response: any) => {
      this.CPTCode = response?.table1 || [];
      this.CPTTotalItems = response?.table2[0]?.totalRecords || 0;      
      console.log(this.CPTCode, 'this.CPTCode');
    })
}
//#endregion

//#region HCPCSCode Pagination Start
HCPCSCodeTotalItems = 0;
HCPCSCodePaginationInfo: any = {
  Page: 1,
  RowsPerPage: 5
};
    async onHCPCSCodePageChanged(page: number) {
    this.HCPCSCodePaginationInfo.Page = page;
    await this.GetAllHCPCS();
    }

// API Call
async GetAllHCPCS() {
   this.HCPCSCodeTotalItems = 0;

   const data = { AllHCPCSCode: this.AllHCPCSCode, HCPCStartCode: this.HCPCStartCode, HCPCSEndCode: this.HCPCSEndCode, DescriptionFilter: this.DescriptionFilter, page: this.HCPCSCodePaginationInfo.Page, rowsPerPage: this.HCPCSCodePaginationInfo.RowsPerPage };

    await this.service.GetAllHCPCSCode(data).then((response: any) => {
    this.HCPCSCodeGrid = response?.table1 || [];
    this.HCPCSCodeTotalItems = response?.table2?.[0]?.totalRecords || 0;
    console.log(this.HCPCSCodeGrid, 'this.HCPCSCodeGrid');
    });
}
//#endregion

//#region DentalCode Pagination Start
DentalCodeTotalItems = 0;
DentalCodePaginationInfo: any = {
  Page: 1,
  RowsPerPage: 5
};
    async onDentalCodePageChanged(page: number) {
    this.DentalCodePaginationInfo.Page = page;
    await this.GetAllDental();
    }

// API Call
async GetAllDental() {
   this.DentalCodeTotalItems = 0;

   const data = { AllDentalCode: this.AllDentalCode, DentalStartCode: this.DentalStartCode, DentalEndCode: this.DentalEndCode, DescriptionFilter: this.DescriptionFilter, page: this.DentalCodePaginationInfo.Page, rowsPerPage: this.DentalCodePaginationInfo.RowsPerPage };

    await this.service.GetAllDentalCode(data).then((response: any) => {
    this.AllMyDentalCode = response?.table1 || [];
    this.DentalCodeTotalItems = response?.table2?.[0]?.totalRecords || 0;
    console.log(this.AllMyDentalCode, 'this.AllMyDentalCode');
});
}
//#endregion

//#region UnclassifiedService Pagination Start
UnclassifiedServiceTotalItem = 0;
UnclassifiedServicePaginationInfo: any = {
  Page: 1,
  RowsPerPage: 5
};
    async onUnclassifiedServicePageChanged(page: number) {
    this.UnclassifiedServicePaginationInfo.Page = page;
    await this.GetAllUnclassifiedService();
    }

// API Call
async GetAllUnclassifiedService() {
   this.UnclassifiedServiceTotalItem = 0;

   const data = { AllCode: this.AllCode, UCStartCode: this.UCStartCode, DescriptionFilter: this.DescriptionFilter, page: this.UnclassifiedServicePaginationInfo.Page, rowsPerPage: this.UnclassifiedServicePaginationInfo.RowsPerPage }

   await this.service.GetAllUnclassifiedService(data).then((response: any) => {
      this.UnclassifiedService = response?.table1 || [];
      this.UnclassifiedServiceTotalItem = response?.table2[0]?.totalRecords || 0;      
      console.log(this.UnclassifiedService, 'this.UnclassifiedService');
    })
}
//#endregion

//#region ServiceItem Pagination start
ServiceItemsTotalItems = 0;
ServiceItemsPaginationInfo: any = {
  Page: 1,
  RowsPerPage: 5
};
    async onServiceItemsPageChanged(page: number) {
    this.ServiceItemsPaginationInfo.Page = page;
    await this.GetAllServiceItem();
    }

// API Call
async GetAllServiceItem() {
   this.ServiceItemsTotalItems = 0;

   const data = { AllCode: this.AllCode, ServiceStartCode: this.ServiceStartCode, DescriptionFilter: this.DescriptionFilter, page: this.ServiceItemsPaginationInfo.Page, rowsPerPage: this.ServiceItemsPaginationInfo.RowsPerPage }

   await this.service.GetAllServiceItems(data).then((response: any) => {
      this.ServicesGrid = response?.table1 || [];
      this.ServiceItemsTotalItems = response?.table2[0]?.totalRecords || 0;      
      console.log(this.ServicesGrid, 'this.ServicesGrid');
    })
}
//#endregion

//#region All Service
pagedAllService: any[] = [];
AllServiceCurrentPage = 1;
AllServicePageSize = 5;
AllServiceTotalItems = 0;

get AllServiceTotalPages(): number {
  return Math.ceil(this.AllServiceTotalItems / this.AllServicePageSize);
}

get AllServiceStart(): number {
  return (this.AllServiceCurrentPage - 1) * this.AllServicePageSize;
}

get AllServiceEnd(): number {
  return Math.min(this.AllServiceStart + this.AllServicePageSize, this.AllServiceTotalItems);
}

get AllServicePageNumbers(): (number | string)[] {
  const total = this.AllServiceTotalPages;
  const current = this.AllServiceCurrentPage;
  const delta = 2;

  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1); // always show first page

  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total); // always show last page

  return range;
}

AllServiceSetPagedData() {
  const startIndex = (this.AllServiceCurrentPage - 1) * this.AllServicePageSize;
  const endIndex = startIndex + this.AllServicePageSize;
  this.pagedAllService = this.MyServicesData.slice(startIndex, endIndex);
}

AllServiceGoToPage(page: number) {
  if (typeof page !== 'number' || page < 1 || page > this.AllServiceTotalPages) return;
  this.AllServiceCurrentPage = page;
  this.AllServiceSetPagedData();
}

AllServiceNextPage() {
  if (this.AllServiceCurrentPage < this.AllServiceTotalPages) {
    this.AllServiceCurrentPage++;
    this.AllServiceSetPagedData();
  }
}

AllServicePrevPage() {
  if (this.AllServiceCurrentPage > 1) {
    this.AllServiceCurrentPage--;
    this.AllServiceSetPagedData();
  }
}

// API Call
async GetAllService(Data: any) {
      this.ServiceItems = Data || [];
      this.AllServiceTotalItems = this.ServiceItems?.length;
      this.AllServiceCurrentPage = 1;
      this.AllServiceSetPagedData();
      console.log(this.ServiceItems, 'this.ServiceItem');
}
//#endregion


   get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }
  }
}
