import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { CLINICAL_ROUTES } from './clinical.routes';

@NgModule({
  declarations: [],
  imports: [
     CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
     RouterModule.forChild(CLINICAL_ROUTES)
  ]
})
export class ClinicalModule { }
