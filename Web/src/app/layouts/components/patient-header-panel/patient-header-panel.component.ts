import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { IconsModule } from '@/app/shared/icons.module';
import { DataStorageService } from '@/app/shared/data-storage.service';
import { SharedApiService } from '@/app/shared/shared.api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-header-panel',
  standalone: true,
  templateUrl: './patient-header-panel.component.html',
  styleUrls: ['./patient-header-panel.component.scss'],
  imports: [CommonModule, IconsModule,
    ReactiveFormsModule,
    NgbNavModule,
    FormsModule,
  ],
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0', opacity: 0, overflow: 'hidden', padding: '0', margin: '0' })),
      state('visible', style({ height: '*', opacity: 1, overflow: 'visible', padding: '*', margin: '*' })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')])
    ])
  ]
})
export class PatientHeaderPanelComponent {
  
  constructor(
    private sharedApiService: SharedApiService,
    private dataStorageService: DataStorageService,
    // private datePipe: DatePipe,
  ) {
  }

  result: any;
  patient: any;
  activeTabId = 1;
  dropdownOptions: any;
  selectedAppointmentId: any;
  filteredVisitDetail: any;
  visitDetail: any;
  searchMr: any;
  dateOfBirth: any;






   ngOnInit(): void {
    this.dataStorageService.searchData$.subscribe((data) => {
      debugger
        if (data) {
          this.result = data;
          this.patient = data.table2[0];
          this.GetAppointmentsByMRNO(this.patient.mrNo)
        }
        console.log( 'baner patient',this.patient);
        
      });

    }



      AppointmentDetail() {
          debugger;
          localStorage.removeItem('LoadvisitDetail');
          console.log('Appointment Id =', this.selectedAppointmentId);

          console.log( this.visitDetail);
          this.filteredVisitDetail = this.visitDetail.find((item: any) => {

              return item.appointmentId === this.selectedAppointmentId;
          });
          localStorage.setItem('LoadvisitDetail', JSON.stringify(this.filteredVisitDetail));
          console.log(this.filteredVisitDetail);
        }


      GetAppointmentsByMRNO(MrNo: string = ''){
            this.visitDetail = {};
            let defaultSelected = false;
          this.searchMr=MrNo;
            this.sharedApiService.GetAppointmentByMRNO(MrNo).subscribe((Response : any)=>{
              this.visitDetail=Response.table;

              console.log("Load Visit new work  ", this.visitDetail);

              this.dropdownOptions =  Response.table.map((item: any) => {

                //const date = new Date(item.appDateTime);
                this.dateOfBirth =  Response.table[0].age.slice(0,8)
              const formattedDate = item.appDateTime
              //  this.datePipe.transform(, 'dd-MM-yyyy');
              const providerName = formattedDate + ' - ' + item.fullName ;
              return { label: providerName, value: item.appointmentId }
              });
              if (this.dropdownOptions.length > 0) {
                this.selectedAppointmentId = this.dropdownOptions[0].value;
                this.AppointmentDetail();
            }
            })
        }


    GetlaodAllVisitbyMrno(){
    debugger
    var currentLoadVisit = localStorage.getItem('LoadvisitDetail');
    if (
      !(currentLoadVisit == undefined) &&
      !(currentLoadVisit == '') &&
      !(currentLoadVisit == null)
    ){
    this.filteredVisitDetail= JSON.parse(
      localStorage.getItem('LoadvisitDetail') || ''
    );
    this.searchMr=this.filteredVisitDetail.mrNo;

  this.sharedApiService.GetAppointmentByMRNO(this.filteredVisitDetail.mrNo).subscribe((Response: any)=>{
    this.visitDetail=Response.table;

    this.dropdownOptions =  Response.table.map((item: any) => {

      //const date = new Date(item.appDateTime);
      this.dateOfBirth =  Response.table[0].age.slice(0,8)
     const formattedDate = item.appDateTime
    //  this.datePipe.transform(, 'dd-MM-yyyy hh:mm');
     const providerName = formattedDate + ' - ' + item.fullName ;
     return { label: providerName, value: item.appointmentId }
    });

    this.filteredVisitDetail = this.visitDetail.find((item: any) => {

      return item.appointmentId === this.filteredVisitDetail.appointmentId;
  });
debugger
    if (this.dropdownOptions.length > 0) {



      this.selectedAppointmentId = this.filteredVisitDetail.appointmentId;

  }
  })
}
}
}
