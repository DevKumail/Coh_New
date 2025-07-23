import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { ContactComponent } from './Components/contact/contact.component';
import { Registration_ROUTES } from './registration.routes';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
     RouterModule.forChild(Registration_ROUTES)
  ]
})
export class RegistrationModule { }
