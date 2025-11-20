import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CryoStoragePlaceComponent } from '../cryo-storage-place/cryo-storage-place.component';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';

@Component({
  selector: 'app-preservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CryoStoragePlaceComponent],
  templateUrl: './preservation.component.html',
  styleUrls: ['./preservation.component.scss']
})
export class PreservationComponent {
  form: FormGroup;
  showStorage: boolean = false;
  hrEmployees: any = [];
  cacheItems: string[] = ['Provider'];

  constructor(
    private fb: FormBuilder,
    private patientBannerService: PatientBannerService,
    private sharedservice: SharedService
  ) {
    this.form = this.fb.group({
      collectionDate: [null],
      collectionTime: [null],
      freezingDate: [null],
      freezingTime: [null],
      patientId: [''],
      cryoContract: [''],
      cryopreservedBy: [''],
      originallyFromClinic: [false],
      storageDate: [null],
      storedBy: [''],
      typeOfMaterial: [''],
      sampleId: [''],
      strawId: [''],
      status: [''],
      numberOfStraws: [1],
      useCryoStorage: [true],
      storagePlace: [''],
      position: [''],
      colour: [''],
      forResearch: [false],
      reasonForResearch: [''],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.FillCache();
  }


   FillCache() {
        this.sharedservice.getCacheItem({ entities: this.cacheItems }).subscribe((response: any) => {
                if (response.cache != null) {
                    this.FillDropDown(response);
                }
            })
    }
    FillDropDown(response: any) {
        let jParse = JSON.parse(JSON.stringify(response)).cache;
        let provider = JSON.parse(jParse).Provider;

        if (provider) {
            provider = provider.map(
                (item: { EmployeeId: any; FullName: any; EmployeeType: any }) => {
                    return {
                        name: item.FullName,
                        providerId: item.EmployeeId,
                        employeeType: item.EmployeeType,
                    };
                },
            );
            this.hrEmployees = provider;
            try {
            } catch {}
        }
    }



  submit() {}

  openStoragePlace(){
    this.showStorage = true;
  }

  onStorageBack() {
    this.showStorage = false;
  }

  onStorageSelected(e: any) {
    if (e) {
      this.form.patchValue({
        storagePlace: e.storagePlace ?? '',
        position: e.position ?? '',
        colour: e.colour ?? ''
      });
    }
    this.showStorage = false;
  }
}
