import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LayoutStoreService} from '@core/services/layout-store.service';
import {SidenavComponent} from '@layouts/components/sidenav/sidenav.component';
import {TopbarComponent} from '@layouts/components/topbar/topbar.component';
import {FooterComponent} from '@layouts/components/footer/footer.component';
import {debounceTime, fromEvent, Subscription} from 'rxjs';
import { PatientHeaderPanelComponent } from "../components/patient-header-panel/patient-header-panel.component";
import { CommonModule } from '@angular/common';
import { DataStorageService } from '@/app/shared/data-storage.service';

@Component({
    selector: 'app-vertical-layout',
    imports: [RouterOutlet, SidenavComponent, TopbarComponent, FooterComponent, PatientHeaderPanelComponent,CommonModule],
    templateUrl: './vertical-layout.component.html',
    styles: ``
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {
    constructor(
        public layout: LayoutStoreService,
        private DataStorage: DataStorageService
    ) {
    }
    showPatientBanner = true;
    isPinned : boolean = false;
    resizeSubscription!: Subscription;

    ngOnInit() {


        this.DataStorage.searchData$.subscribe((data) => {
        debugger
        if (data) {
          var patient = data.table2[0];
           console.log( 'patient => ',patient);
        }
        if(patient){
            debugger
            this.DataStorage.show$.subscribe(value => {
                debugger
                this.isPinned = value;
            console.log( 'this.isPinned => ',this.isPinned);
            
        });
        }
       
        
      });

       
    }


    ngOnDestroy(): void {
    }
     

   togglePatientBanner(visible: boolean) {
    this.showPatientBanner = visible;
  }
}
