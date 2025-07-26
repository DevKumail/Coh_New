import { Component, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '@/app/shared/icons.module';
import { PaginationComponent } from './pagination/pagination.component';
import Swal from 'sweetalert2'; 
import { ChargeCaptureService } from '@/app/shared/Services/Charge-Capture/charge-capture.service';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
// import { NgxPermissionsDirective } from 'ngx-permissions';

@Component({
  selector: 'app-charge-capture',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    NgbNavModule,
    PaginationComponent,
    IconsModule,
    FormsModule,
    // NgxPermissionsDirective
  ],
  standalone: true, 
  templateUrl: './charge-capture.component.html',
  styles: ``,
})
export class ChargeCaptureComponent {
  @Output() yearFilterChange = new EventEmitter<any>();
  selectedYear: any;
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

  ICT9Group:any[]=[];
  ICT9GroupId:number=0;
  DescriptionFilter: any = '';
  DiagnosisEndCode: any = '';
  DiagnosisStartCode: any = '';
  ICDVersionId: number=0;
  ProviderId: any=0;
  ProviderBind: any
  GroupId: any = 0;
  universaltoothid:any;


  //CPTCode parameter
  AllCPTCode: any = 0;
  CPTStartCode: any = '2';
  CPTEndCode: any = '0';
  Description: any = '0';
  ProcedureEndCode: any = '';
  ProcedureStartCode: any = '';

  //MyDentalCode parameter
  DentalCode: any = '';
  ProviderDescription: any = '' ;

  //DentalCode parameter
  AllDentalCode: any = 0;
  DentalStartCode: any = '1';
  DentalEndCode: any = '0';

  //HCPCSCode parameter
  HCPCSCode: any  = '';
  AllHCPCSCode: any = 0;
  HCPCStartCode: any = '1';
  HCPCSEndCode: any = '0';

  //UnclassifiedService parameter
  AllCode: any = 0;
  UCStartCode: any = '1';
  ServiceStartCode: any = '1';


  //All Grid Fill by this array
  MyDiagnosisCode: any = [];
  DiagnosisCode: any = [];
  MyCPTCode: any = [];
  CPTCode: any = [];
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

  ngOnInit(): void {
    // this.chargecapture = this.fb.group({
    //   provider: [''],
    //   providerName: [''],
    //   code: [''],
    //   problem: [''],
    //   icdVersion: [''],
    //   confidential: [''],
    //   startDate: [''],
    //   endDate: [''],
    //   comments: [''],
    //   status: ['']
    // });


    var visitAccountDetail=localStorage.getItem("LoadvisitDetail");
     
    if(!(visitAccountDetail==undefined)  && !(visitAccountDetail=="") && !(visitAccountDetail==null))
    {
      this.visitDetail=JSON.parse(localStorage.getItem("LoadvisitDetail") || "");
      console.log(this.visitDetail);
      this.VisitAccountNO=  this.visitDetail.visitAccountNo;
      this.MrNo=  this.visitDetail.mrNo;

      //alert( this.visitDetail.visitAccountNo)
    }


     
    this.FillCache();
    this.populateYearDropdown();
  }

  loadICD9Gropu(){
    this.service.GetICD9CMGroupByProvider(this.ProviderId).then((response: any) => {
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
  loadCPTGroup(){
    this.service.GetCPTByProvider(this.ProviderId).then((response: any) => {
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

loadHCPCSGroup() {
  debugger
  
  this.service.GetHCPCSByProvider(this.ProviderId)
    .then((response: any) => {
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

  AllMyDiagnosisCode: any [] = []

    async filter(e: any) {
    debugger
    // await this.AllDignosisApis();
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

  this.MyDiagnosisCodeTotalItems = this.MyDiagnosisCode.length;
  this.MyDiagnosisCodeCurrentPage = 1;
  this.MyDiagnosisCodeSetPagedData();

}

  async filteVersion(e: any) {
     debugger
      const response: any = await this.service.MyDiagnosisCodebyProvider(this.ProviderId, this.ICT9GroupId, this.ICDVersionId);
      this.AllMyDiagnosisCode = response?.table1 || [];

      this.AllMyDiagnosisCode.map((e: any) => {
        const isSelected = this.MyDiagnosisData.some((item: any) => item.ICDCode  === e.icD9Code); 
        if (isSelected) {
          e.selected = true;
        } else {
          e.selected = false;
        }
      });


  this.MyDiagnosisCode = [...this.AllMyDiagnosisCode];
  this.MyDiagnosisCodeTotalItems = this.MyDiagnosisCode.length;
  this.MyDiagnosisCodeCurrentPage = 1;
  this.MyDiagnosisCodeSetPagedData();
  }


AllMyCPTCode: any [] = [];

  async filterCPT(e: any) {
    debugger
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
    debugger
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
      debugger
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

  FillCache() {
    this.service.getCacheItem({ entities: this.cacheItems }).then((response: any) => {
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
     ;
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let hremploeevar = JSON.parse(jParse).Provider;
    let universaltoothcode= JSON.parse(jParse).BLUniversalToothCodes;
    let iCDVersion=JSON.parse(jParse).BLICDVersion;




    if (hremploeevar) {
       ;
      hremploeevar = hremploeevar.map(
        (item: { EmployeeId: any; FullName: any }) => {
          return {
            name: item.FullName,
            code: item.EmployeeId,
          };
        });

        const item = {
          name: "--- Select Provider ---",
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
       ;
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

    this.loadICD9Gropu();
    this.loadCPTGroup();
    this.loadHCPCSGroup();
    this.loadDentalGroupGroup();
  }

  provider(event:any) {
     
    this.AllServicesApis();
    this.AllDignosisApis();
    this.loadICD9Gropu();
    this.loadCPTGroup();
    this.loadHCPCSGroup();
    this.loadDentalGroupGroup();
  }



  // async AllDignosisApis() {
      
  //   await this.service.MyDiagnosisCodebyProvider(this.ProviderId, this.ICT9GroupId, this.ICDVersionId).then((response: any) => {
  //     this.MyDiagnosisCode = response?.table1 || [];
  //     console.log(this.MyDiagnosisCode, 'MyDiagnosisCode');
  //   })
  // }

  // SearchDiagnosis()
  // {
  //   this.showSpinner = true
  //   this.DiagnosisCode=[];
  //   this.service.DiagnosisCodebyProvider(this.ICDVersionId, this.DiagnosisStartCode, this.DiagnosisEndCode, this.DescriptionFilter).then((response: any) => {
  //     this.DiagnosisCode = response.table1;
  //     console.log(this.DiagnosisCode, 'this.DiagnosisCode');
  //   this.showSpinner = false
  //   })
  //   this.showSpinner = false
  // }


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
  AllMyHCPCSCode: any [] = [];
  async AllServicesApis() {
    await this.MyCptCodebyProvider()
    await this.MyHCPCSCodebyProvider()
    await this.MyDentalCodebyProvider();

    this.service.CPTCodebyProvider(this.AllCPTCode, this.CPTStartCode, this.CPTEndCode, this.Description).then((response: any) => {
      if(response){
      this.CPTCode = response?.table1 || [];
      console.log(this.CPTCode, 'this.CPTCode');
      }
    })

    this.service.HCPCSCodebyProvider(this.AllHCPCSCode, this.HCPCStartCode, this.HCPCSEndCode, this.DescriptionFilter).then((response: any) => {
      if(response){
      this.HCPCSCodeGrid = response?.table1 || [];
      console.log(this.HCPCSCodeGrid, 'this.HCPCSCodeGrid');
      }
    })

    this.service.DentalCodebyProvider(this.AllDentalCode, this.DentalStartCode, this.DentalEndCode, this.DescriptionFilter).then((response: any) => {
      if(response){
      this.DentalCodeGridData = response?.table1 || []
      console.log(this.DentalCodeGridData, 'this.DentalCodeGridData');
      }
    })



    this.service.UnclassifiedServicebyProvider(this.AllCode, this.UCStartCode, this.DescriptionFilter).then((response: any) => {
      if(response){
      this.UnclassifiedService = response?.table1 || [];
      console.log(this.UnclassifiedService, 'this.UnclassifiedService');
      }
    })

    this.service.ServiceItemsbyProvider(this.AllCode, this.ServiceStartCode, this.DescriptionFilter).then((response:any) => {
      if(response){
      this.ServiceItems = response?.table1 || []
      console.log(this.ServiceItems, 'this.ServiceItems');
      }
    })

  }

selectedgrid:any=[]
  submit() {
   
    if(!(this.VisitAccountNO>0))
    {

      Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please load Visit'
          });
      return;
    }
     
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
    const currentDate = new Date();
    let ChargCaptureModel = {
      VisitAccountNo:parseInt(this.VisitAccountNO),
      BLSupperBillDiagnosisModel: [],
      BlSuperBillProcedureModel:[]
  }
    let data:any=[];
    for(let i=0;i<this.MyDiagnosisData.length;i++)
    {

      let Array={

        DiagnosisId : 0,
        VisitAccountNo : parseInt(this.VisitAccountNO),
        Icd9code: this.MyDiagnosisData[i].ICDCode,
        LastUpdatedBy:this.currentUser.userId,
        CreatedBy: this.currentUser.userId,
        CreatedDate : currentDate,
        DiagnosisPriority: 'Primary',
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
    for (let i = 0; i < this.selectedServices.length; i++) {
      let procedure = {
        ProcedureId: 0,
        VisitAccountNo: parseInt(this.VisitAccountNO),
        DateOfServiceFrom: currentDate,
        DateOfServiceTo: currentDate,
        ProcedureCode: this.selectedServices[i].code,
        Description: this.selectedServices[i].descriptionFull,
        ProcedureType: this.selectedServices[i].itemType,
        Units: this.selectedServices[i].units,
        Modifier1: this.selectedServices[i].M1,
        Modifier2: this.selectedServices[i].M2,
        Modifier3: this.selectedServices[i].M3,
        Modifier4: this.selectedServices[i].M4,
        CreatedBy: this.currentUser.userId,
        CreatedDate: currentDate
      };
      procedureData.push(procedure);
    }

    ChargCaptureModel.BlSuperBillProcedureModel = procedureData;

        this.service.SaveChargeCapture(ChargCaptureModel).then((response: any) => {
          if (response.success) {
             Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Successfully Inserted',
                    timer: 1500,
                    showConfirmButton: false
                  });
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
    debugger
    let data:any=[];


    for(let i=0;i<this.selectedDiagnosis.length;i++)
    {
      let oldData={
        // Sno:0,
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
        // Sno:0,
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
  item.procedureType = item.procedureType || 'Dental'; // Fallback agar type missing ho
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
        description: undefined
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
        oldData.cptCode = svc.dentalCode;
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
        oldData.cptCode = svc.cptCode;
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
        oldData.cptCode = svc.cptCode;
        oldData.description = svc.descriptionFull;
        this.HCPCS = true;
        this.cpt = false;
        this.Dental = false;
        data.push(oldData);
      }
    }

    this.MyServicesData = data;
    console.log(this.MyServicesData, "Processed Selected Services");
  }


  // CPTRows(){
     
  //   let data:any=[];
  //   for(let i=0;i<this.selectedServices.length;i++)
  //   {
  //     let oldData={
  //       type: "",
  //       cptCode:undefined,
  //       description:undefined
  //     };

  //     if(this.selectedServices[i].procedureType == "Dental"){

  //       oldData.type=this.selectedServices[i].procedureType;
  //       oldData.cptCode=this.selectedServices[i].dentalCode;
  //       oldData.description=this.selectedServices[i].providerDescription;
  //       this.Dental = true;
  //       this.cpt = false;
  //       this.HCPCS = false;
  //       data.push(oldData);

  //     }
  //     if(this.selectedServices[i].procedureType == "ALLDental"){

  //       oldData.type="Dental";
  //       oldData.cptCode=this.selectedServices[i].dentalCode;
  //       oldData.description=this.selectedServices[i].descriptionFull;
  //       this.Dental = true;
  //       this.cpt = false;
  //       this.HCPCS = false;
  //       data.push(oldData);

  //     }
  //     //this.MyServicesData = data;

  //     if(this.selectedServices[i].procedureType == "CPT"){
  //       oldData.type=this.selectedServices[i].procedureType;
  //       oldData.cptCode=this.selectedServices[i].cptCode;
  //       oldData.description=this.selectedServices[i].providerDescription;
  //       this.cpt = true;
  //       this.Dental = false;
  //       this.HCPCS = false;
  //       data.push(oldData);

  //     }
  //     if(this.selectedServices[i].procedureType == "ALLCPT"){
  //       oldData.type= "CPT";
  //       oldData.cptCode=this.selectedServices[i].cptCode;
  //       oldData.description=this.selectedServices[i].descriptionFull;
  //       this.cpt = true;
  //       this.Dental = false;
  //       this.HCPCS = false;
  //       data.push(oldData);

  //     }

  //     if(this.selectedServices[i].procedureType == "HCPCS"){
  //       oldData.type=this.selectedServices[i].procedureType;
  //       oldData.cptCode=this.selectedServices[i].hcpcsCode;
  //       oldData.description=this.selectedServices[i].providerDescription;
  //       this.HCPCS = true;
  //       this.cpt = false;
  //       this.Dental = false;
  //       data.push(oldData);

  //     }

  //     if(this.selectedServices[i].procedureType == "ALLHCPCS"){
  //       oldData.type= "HCPCS";
  //       oldData.cptCode=this.selectedServices[i].cptCode;
  //       oldData.description=this.selectedServices[i].descriptionFull;
  //       this.cpt = true;
  //       this.Dental = false;
  //       this.HCPCS = false;
  //       data.push(oldData);

  //     }
  //   }

  //   this.MyServicesData = data;
  //   console.log(this.MyServicesData,"kun");
  // }

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
onPageChange(event: { start: number, end: number, currentPage: number }) {
  this.visibleData = this.myData.slice(event.start, event.end);
}


// DiagnosisCode Pagination Start
pagedDiagnosisCode: any[] = [];

diagnosisCodeCurrentPage = 1;
diagnosisCodePageSize = 10;
diagnosisCodeTotalItems = 0;

get diagnosisCodeTotalPages(): number {
  return Math.ceil(this.diagnosisCodeTotalItems / this.diagnosisCodePageSize);
}

get diagnosisCodeStart(): number {
  return (this.diagnosisCodeCurrentPage - 1) * this.diagnosisCodePageSize;
}

get diagnosisCodeEnd(): number {
  return Math.min(this.diagnosisCodeStart + this.diagnosisCodePageSize, this.diagnosisCodeTotalItems);
}

// ✅ Smart page numbers with ellipsis
get diagnosisCodePageNumbers(): (number | string)[] {
  const total = this.diagnosisCodeTotalPages;
  const current = this.diagnosisCodeCurrentPage;
  const delta = 2;

  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1); // Always show first page

  if (left > 2) {
    range.push('...');
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) {
    range.push('...');
  }

  if (total > 1) {
    range.push(total); // Always show last page
  }

  return range;
}

SearchDiagnosis() {
  this.showSpinner = true;
  this.service.DiagnosisCodebyProvider(this.ICDVersionId,this.DiagnosisStartCode,this.DiagnosisEndCode,this.DescriptionFilter).then((response: any) => {
      this.DiagnosisCode = response.table1 || [];

        this.DiagnosisCode.map((e: any) => {
        const isSelected = this.MyDiagnosisData.some((item: any) => item.ICDCode  === e.icD9Code); 
        if (isSelected) {
          e.selected = true;
        } else {
          e.selected = false;
        }
      });
      
      this.diagnosisCodeTotalItems = this.DiagnosisCode.length;
      this.diagnosisCodeCurrentPage = 1;
      this.diagnosisCodeSetPagedData();
      this.showSpinner = false;
    });
}

diagnosisCodeSetPagedData() {
  const startIndex = (this.diagnosisCodeCurrentPage - 1) * this.diagnosisCodePageSize;
  const endIndex = startIndex + this.diagnosisCodePageSize;
  this.pagedDiagnosisCode = this.DiagnosisCode.slice(startIndex, endIndex);
}

diagnosisCodeGoToPage(page: number) {
  if (typeof page !== 'number' || page < 1 || page > this.diagnosisCodeTotalPages) return;
  this.diagnosisCodeCurrentPage = page;
  this.diagnosisCodeSetPagedData();
}

diagnosisCodeNextPage() {
  if (this.diagnosisCodeCurrentPage < this.diagnosisCodeTotalPages) {
    this.diagnosisCodeCurrentPage++;
    this.diagnosisCodeSetPagedData();
  }
}

diagnosisCodePrevPage() {
  if (this.diagnosisCodeCurrentPage > 1) {
    this.diagnosisCodeCurrentPage--;
    this.diagnosisCodeSetPagedData();
  }
}

trackByCode(index: number, item: any) {
  return item.icD9Code;
}
// DiagnosisCode Pagination End


// MyDiagnosisCode Pagination Start
pagedMyDiagnosisCode: any[] = [];

MyDiagnosisCodeCurrentPage = 1;
MyDiagnosisCodePageSize = 10;
MyDiagnosisCodeTotalItems = 0;

get MyDiagnosisCodeTotalPages(): number {
  return Math.ceil(this.MyDiagnosisCodeTotalItems / this.MyDiagnosisCodePageSize);
}

get MyDiagnosisCodeStart(): number {
  return (this.MyDiagnosisCodeCurrentPage - 1) * this.MyDiagnosisCodePageSize;
}

get MyDiagnosisCodeEnd(): number {
  return Math.min(this.MyDiagnosisCodeStart + this.MyDiagnosisCodePageSize, this.MyDiagnosisCodeTotalItems);
}

get MyDiagnosisCodePageNumbers(): (number | string)[] {
  const total = this.MyDiagnosisCodeTotalPages;
  const current = this.MyDiagnosisCodeCurrentPage;
  const delta = 2;

  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);

  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total);

  return range;
}

async AllDignosisApis() {
  const response: any = await this.service.MyDiagnosisCodebyProvider(this.ProviderId, this.ICT9GroupId, this.ICDVersionId);
  this.AllMyDiagnosisCode = response?.table1 || [];
  this.MyDiagnosisCode = [...this.AllMyDiagnosisCode];
  this.MyDiagnosisCodeTotalItems = this.MyDiagnosisCode.length;
  this.MyDiagnosisCodeCurrentPage = 1;
  this.MyDiagnosisCodeSetPagedData();
}

MyDiagnosisCodeSetPagedData() {
  const startIndex = (this.MyDiagnosisCodeCurrentPage - 1) * this.MyDiagnosisCodePageSize;
  const endIndex = startIndex + this.MyDiagnosisCodePageSize;
  this.pagedMyDiagnosisCode = this.MyDiagnosisCode.slice(startIndex, endIndex);
}

MyDiagnosisCodeGoToPage(page: number) {
  if (typeof page !== 'number' || page < 1 || page > this.MyDiagnosisCodeTotalPages) return;
  this.MyDiagnosisCodeCurrentPage = page;
  this.MyDiagnosisCodeSetPagedData();
}

MyDiagnosisCodeNextPage() {
  if (this.MyDiagnosisCodeCurrentPage < this.MyDiagnosisCodeTotalPages) {
    this.MyDiagnosisCodeCurrentPage++;
    this.MyDiagnosisCodeSetPagedData();
  }
}

MyDiagnosisCodePrevPage() {
  if (this.MyDiagnosisCodeCurrentPage > 1) {
    this.MyDiagnosisCodeCurrentPage--;
    this.MyDiagnosisCodeSetPagedData();
  }
}

// MyDiagnosisCode Pagination End


// AllDiagnosis Pagination Start
  // Paginated data from allDiagnosisList
  allDiagnosisPaginatedItems: any[] = [];

  // Pagination settings
  allDiagnosisItemsPerPage: number = 10;
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



// MyCPTCode Pagination Start

pagedMyCptCode: any[] = [];

MyCptCodeCurrentPage = 1;
MyCptCodePageSize = 10;
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


// MyHCPCSCode Pagination Start
pagedMyHCPCSCode: any[] = [];

MyHCPCSCodeCurrentPage = 1;
MyHCPCSCodePageSize = 10;
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
  await this.service.MyHCPCSCodebyProvider(this.ProviderId, this.MyHCPSGroupId, this.HCPCSCode, this.DescriptionFilter, this.PairId).then((response: any) => {
    if (response) {
      this.MyHCPCSCode = response?.table1 || [];
      this.AllMyHCPCSCode = response?.table1 || [];
      this.MyHCPCSCodeTotalItems = this.MyHCPCSCode.length;
      this.MyHCPCSCodeCurrentPage = 1;
      this.MyHCPCSCodeSetPagedData();
      console.log(this.MyHCPCSCode, 'MyHCPCSCode');
    }
  });
}


// MyDentalCode Pagination start

pagedMyDentalCode: any[] = [];

MyDentalCodeCurrentPage = 1;
MyDentalCodePageSize = 10;
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

// MyDentalCode Pagination start


}
