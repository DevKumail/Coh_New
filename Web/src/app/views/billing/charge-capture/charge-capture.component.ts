import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '@/app/shared/icons.module';
import { PaginationComponent } from './pagination/pagination.component';
import Swal from 'sweetalert2'; 
import { ChargeCaptureService } from '@/app/shared/Services/Charge-Capture/charge-capture.service';
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
  styleUrl: './charge-capture.component.scss'
})
export class ChargeCaptureComponent {
  chargecapture!: FormGroup;
  MyDiagnosisCode: any = [];
  activeTabId = 1;
  Provider: any = [];
  visibleData: any[] = [];
  ICDVersions: any[] = [];
  universaltoothcodearray: any[] = [];
  ICT9Group:any[]=[];
  selectedDiagnosis: any[] = [];
  MyDiagnosisData:any=[];
  selectedallDiagnosis: any[] = [];
  ICT9GroupId: any;
  ICDVersionId: any;


  @ViewChild('MyDiagnosis') MyDiagnosis: any;
  @ViewChild('MyCPT')  MyCPT: any;
  @ViewChild('MYHCPCS')  MYHCPCS: any;
  @ViewChild('MyDental')  MyDental: any;

  myData = [
    {
      id: 1,
      code: '0011',
      unit: 1.00,
      description: 'hello world'
    }, {
      id: 2,
      code: '0012',
      unit: 1.00,
      description: 'hello world'
    }, {
      id: 3,
      code: '0013',
      unit: 1.00,
      description: 'hello world'
    }, {
      id: 4,
      code: '0014',
      unit: 2.00,
      description: 'hello world'
    },
    {
      id: 1,
      code: '0011',
      unit: 1.00,
      description: 'hello world'
    }, {
      id: 2,
      code: '0012',
      unit: 1.00,
      description: 'hello world'
    }, {
      id: 3,
      code: '0013',
      unit: 1.00,
      description: 'hello world'
    }, {
      id: 4,
      code: '0014',
      unit: 2.00,
      description: 'hello world'
    },
    {
      id: 1,
      code: '0011',
      unit: 1.00,
      description: 'hello world'
    }, {
      id: 2,
      code: '0012',
      unit: 1.00,
      description: 'hello world'
    }, {
      id: 3,
      code: '0013',
      unit: 1.00,
      description: 'hello world'
    }, {
      id: 4,
      code: '0014',
      unit: 2.00,
      description: 'hello world'
    },
  ]

  universaltoothid: any;
  ProviderId: any = 0;


  constructor(
    private fb: FormBuilder,
    private http_service :ChargeCaptureService) { }

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

    this.FillCache();
  }


  provider(event: any) {
    this.AllDignosisApis();
    this.loadICD9Gropu();
    // this.loadCPTGroup();
    // this.loadHCPCSGroup();
    // this.loadDentalGroupGroup();
    // this.AllServicesApis();
  }

   FillCache() {
    const cacheItems = [
    'Provider',
    'BLUniversalToothCodes',
    'BLICDVersion',
    ];
    this.http_service.getCacheItem({ entities: cacheItems }).then((response: any) => {
      if (response.cache != null) {
        this.FillDropDown(response);
      }
    })
      .catch((error: any) => 
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        }));
  }

  FillDropDown(response: any) {
    debugger
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let hremploeevar = JSON.parse(jParse).Provider;
    let universaltoothcode = JSON.parse(jParse).BLUniversalToothCodes;
    let iCDVersion = JSON.parse(jParse).BLICDVersion;

    if (hremploeevar) {
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
      this.ProviderId = 0;
      hremploeevar = hremploeevar.sort((a: any, b: any) => {
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
    }

    if (iCDVersion) {
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
  }

    loadICD9Gropu(){
    this.http_service.GetICD9CMGroupByProvider(this.ProviderId).then((response:any) => {
      console.log(response , 'Group');
      this.ICT9Group=response;

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


  }).catch((error:any) =>           
     Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        })
  );


  }


    filter(e: any) {
    debugger
    const inputString = e.target.value;
    const trimmedString = inputString.split(' ').filter(Boolean).join(' ');
    console.log(trimmedString); // Output: "Hello, World!"
    this.MyDiagnosis.filterGlobal(trimmedString, 'contains');
  }

 filteVersion(e: any) {
    debugger
    this.AllDignosisApis();
   //this.MyDiagnosis.filterGlobal(e.value, 'contains');
  }

    AllDignosisApis() {
      debugger

    this.http_service.MyDiagnosisCodebyProvider(this.ProviderId, this.ICT9GroupId, this.ICDVersionId).then((response: any) => {
      this.MyDiagnosisCode = response.table1;
      console.log(this.MyDiagnosisCode, 'MyDiagnosisCode');
    })
  }

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

  onPageChange(event: { start: number, end: number, currentPage: number, pageSize: number }) {
    this.visibleData = this.myData.slice(event.start, event.end);
  }
}
