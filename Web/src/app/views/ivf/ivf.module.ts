import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IVF_ROUTES } from './ivf.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(IVF_ROUTES)
  ]
})
export class IVFModule {}
