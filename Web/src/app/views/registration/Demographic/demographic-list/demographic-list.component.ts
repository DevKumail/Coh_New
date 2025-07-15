import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { PageTitleComponent} from '@app/components/page-title.component';
import { UiCardComponent} from '@app/components/ui-card.component';
import { NgIcon} from '@ng-icons/core';
import { NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demographic-list',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgIconComponent,],
  templateUrl: './demographic-list.component.html',
  styleUrl: './demographic-list.component.scss'
})
export class DemographicListComponent {


editPatient(_t33: { mrNo: string; personFirstName: string; personEmail: string; personCellPhone: string; personSex: string; personSocialSecurityNo: string; personZipCode: string; patientBirthDate: Date; }) {
throw new Error('Method not implemented.');
}
color: any;

 constructor(public router: Router){}

    reloadData(){

    }
    ClickFilter(){

    }
buttonRoute(){

  }
   Patient = [
    {
      mrNo: '1001',
      personFirstName: 'Hassan',
      personEmail: 'hassan@example.com',
      personCellPhone: '03001234567',
      personSex: 'Male',
      personSocialSecurityNo: '123-45-6789',
      personZipCode: '75000',
      patientBirthDate: new Date(1990, 4, 20)
    }
  ];
}

