import { ClinicalApiService } from './../clinical.api.service';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIconComponent, FormsModule,TranslatePipe ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',

})
export class FavoritesComponent implements OnInit {
  favoritesForm!: FormGroup;
  @Output() searchICD9Code = new EventEmitter<any>();
  @Output() selectIcdCode = new EventEmitter<any>();

  ICDVersions: any[] = [];
  universaltoothcodearray: any [] = [];
  searchResults: any[] = [];
  favoritesData: any = [];
  Searchby: any = [
    { code: 1, name: 'Diagnosis Code' }, 
    { code: 2, name: 'Diagnosis Code Range' }, 
    { code: 3, name: 'Description' }
  ];
  cacheItems: string[] = [
    'BLUniversalToothCodes',
    'BLICDVersion',
  ];
  selectedYear!: number;
  searchText: string = '';
  selectedCode: string = '';
  selectedVersion: string = '';
  selectedStartCode: string = '';
  years: number[] = [];
  currentPage: number = 1;
  ProviderId: any=0;
  pageSize: number = 10;
  pageSizes = [5, 10, 25, 50];
 pageNumbers: number[] = [];
  totalPages: number = 0;
    ICT9Group: any[] = [];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clinicalApiService: ClinicalApiService, 

  ) {}

  ngOnInit(): void {
    this.favoritesForm = this.fb.group({
      icdVersionId: [''],
      searchById: [''],
      startingCode: [''],
      endingCode: [''],
      description: ['']
    });

    this.loadYears();
  }

  async FillCache() {

    await this.clinicalApiService.getCacheItems({ entities: this.cacheItems }).then((response: any) => {
      if (response.cache != null) {
        this.FillDropDown(response);
      }
    })
      .catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Something went wrong!',
          confirmButtonColor: '#d33'
        })
      })
  }
  FillDropDown(response: any) {
    debugger
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let iCDVersion = JSON.parse(jParse).BLICDVersion;
    let universaltoothcode = JSON.parse(jParse).BLUniversalToothCodes;


    if (universaltoothcode) {
      debugger;
      universaltoothcode = universaltoothcode.map(
        (item: { ToothCode: any; Tooth: any }) => {
          return {
            name: item.Tooth,
            code: item.ToothCode,
          };
        });
      // this.universaltoothid = universaltoothcode[0].code
      this.universaltoothcodearray = universaltoothcode;
      console.log(this.universaltoothcodearray, 'universal tooth code');
    }
    if (iCDVersion) {
      debugger;
      iCDVersion = iCDVersion.map(
        (item: { ICDVersionId: any; ICDVersion: any }) => {
          return {
            name: item.ICDVersion,
            code: item.ICDVersionId,
          };
        });
      debugger
      const item = {
        name: 'ALL',
        code: 0,
      };
      iCDVersion.push(item);
      this.ICDVersions = iCDVersion;
      console.log(this.ICDVersions);


    }
  }

  loadYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  }

  onSearch(): void {


  }

  onSelectCode(code: string): void {
    this.selectIcdCode.emit(code);
  }

  get start(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get end(): number {
    const endValue = this.start + this.pageSize;
    return endValue > this.favoritesData.length ? this.favoritesData.length : endValue;
  }

  get paginatedData() {
    return this.favoritesData.slice(this.start, this.end);
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.end < this.favoritesData.length) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }


}
