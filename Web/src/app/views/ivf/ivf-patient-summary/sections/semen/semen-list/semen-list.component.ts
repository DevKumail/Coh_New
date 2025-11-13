import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemenAddEditComponent } from '../semen-add-edit/semen-add-edit.component';

@Component({
  selector: 'app-semen-list',
  standalone: true,
  imports: [CommonModule, SemenAddEditComponent],
  templateUrl: './semen-list.component.html',
  styleUrls: ['./semen-list.component.scss']
})
export class SemenListComponent {
  showAdd = false;
  isLoading = false;
  rows = [
    {
      collectionDate: '01/09/2025',
      thawingDate: '',
      time: '12:00 AM',
      sampleId: 'T-12',
      purpose: 'Cryo sperm',
      method: 'Cryo sperm',
      vol: 2,
      conc: 15,
      totalCountM: 30,
      whoA: 30,
      whoC: 10,
      whoD: 10,
      norm: 4,
      cryoStatus: '',
      status: ''
    }
  ];

  openAdd() { this.showAdd = true; }
  onCancel() { this.showAdd = false; }
  onSaved(_payload: any) { this.showAdd = false; }
}
