import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { ApiService } from '@/app/core/services/api.service';

@Component({
  selector: 'app-birth-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FilledOnValueDirective],
  templateUrl: './birth.component.html',
  styleUrls: ['./birth.component.scss']
})
export class BirthComponent {
  @Input() dropdowns: any = {};
  @Input() genders: any[] = [];
  @Input() countries: any[] = [];
  @Input() pregnancyDeterminedOnDate: string | null = null;
  
  form: FormGroup;
  childrenCount: number = 0;
  childrenData: any[] = [];
  isLoading: boolean = false;

  // ICD Chromosome Anomaly
  chromosomeOptions: string[] = [];
  searchChromosome = '';
  private chromosomeLimit = 50;
  private chromosomeLoading = false;

  // ICD Congenital Malformation
  malformationOptions: string[] = [];
  searchMalformation = '';
  private malformationLimit = 50;
  private malformationLoading = false;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      children: this.fb.array([])
    });
  }

  ngOnInit() {
    // Initial load for ICD codes
    this.fetchChromosomeAnomalies();
    this.fetchMalformations();
  }

  get childrenFA(): FormArray {
    return this.form.get('children') as FormArray;
  }

  setChildrenCount(count: number) {
    console.log('Setting children count:', count);
    this.childrenCount = count;
    this.updateChildrenArray(count);
  }

  updateChildrenArray(count: number) {
    const childrenArray = this.childrenFA;
    const currentCount = childrenArray.length;

    // If increasing count, add new children
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        this.childrenData.push({ index: i + 1, label: `Child ${i + 1}` });
        childrenArray.push(this.createChildFormGroup());
      }
    }
    // If decreasing count, remove extra children
    else if (count < currentCount) {
      const removeCount = currentCount - count;
      for (let i = 0; i < removeCount; i++) {
        childrenArray.removeAt(childrenArray.length - 1);
        this.childrenData.pop();
      }
    }
  }

  createChildFormGroup(): FormGroup {
    return this.fb.group({
      dateOfBirth: [null],
      cdb: [{ value: null, disabled: true }],
      week: [null],
      gender: [null],
      deliveryMethod: [null],
      weight: [null],
      length: [null],
      headCircumference: [null],
      apgar1: [null],
      apgar5: [null],
      condition: [null],
      infantFeeding: [null],
      deathPostPartumOn: [null],
      diedPerinatallyOn: [null],
      identityNumber: [null],
      firstName: [null],
      surname: [null],
      placeOfBirth: [null],
      countryOfBirth: [null],
      note: [null],
      icd10Codes: this.fb.array([]),
      malfCodes: this.fb.array([]),
    });
  }

  bindChildrenData(children: any[]) {
    console.log('Binding children data:', children);
    if (!children || children.length === 0) return;

    children.forEach((child, index) => {
      if (index < this.childrenFA.length) {
        const formGroup = this.childrenFA.at(index);
        
        // Format date fields
        const formatDate = (dateStr: string | null) => {
          if (!dateStr) return null;
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        };

        // Calculate CDB (Calculated Date of Birth) based on pregnancyDeterminedOnDate + 280 days (40 weeks)
        // Same calculation as in progress component
        let calculatedCDB = null;
        if (this.pregnancyDeterminedOnDate) {
          const pregnancyDate = new Date(this.pregnancyDeterminedOnDate);
          // Add 280 days (40 weeks) to get calculated birth date
          pregnancyDate.setDate(pregnancyDate.getDate() + 280);
          
          // Format to YYYY-MM-DD (same format as progress component)
          const year = pregnancyDate.getFullYear();
          const month = String(pregnancyDate.getMonth() + 1).padStart(2, '0');
          const day = String(pregnancyDate.getDate()).padStart(2, '0');
          calculatedCDB = `${year}-${month}-${day}`;
          
          console.log('CDB Calculation:', {
            pregnancyDeterminedOnDate: this.pregnancyDeterminedOnDate,
            calculatedCDB: calculatedCDB
          });
        }

        // Map API fields to form fields
        formGroup.patchValue({
          dateOfBirth: formatDate(child.dateOfBirth),
          cdb: calculatedCDB,
          week: child.week !== null && child.week !== undefined ? child.week : null,
          gender: child.genderId,
          deliveryMethod: child.deliveryMethodCategoryId,
          weight: child.weight,
          length: child.length,
          headCircumference: child.headCircumference,
          apgar1: child.apgar1 !== null && child.apgar1 !== undefined ? child.apgar1 : null,
          apgar5: child.apgar5 !== null && child.apgar5 !== undefined ? child.apgar5 : null,
          condition: child.conditionCategoryId,
          infantFeeding: child.infantFeedingCategoryId,
          deathPostPartumOn: formatDate(child.deathPostPartumOn),
          diedPerinatallyOn: formatDate(child.diedPerinatallyOn),
          identityNumber: child.identityNumber,
          firstName: child.firstName,
          surname: child.surname,
          placeOfBirth: child.placeOfBirth,
          countryOfBirth: child.countryId,
          note: child.note
        });

        // Bind ICD-10 Chromosome Anomaly codes
        const icd10Array = this.getIcd10CodesFA(index);
        icd10Array.clear();
        if (child.chromosomeAnomalyCategoryIds && Array.isArray(child.chromosomeAnomalyCategoryIds)) {
          child.chromosomeAnomalyCategoryIds.forEach((code: string) => {
            if (code && code.trim() !== '') {
              icd10Array.push(this.fb.control(code));
            }
          });
        }

        // Bind Congenital Malformation codes
        const malfArray = this.getMalfCodesFA(index);
        malfArray.clear();
        if (child.congenitalMalformationCategoryIds && Array.isArray(child.congenitalMalformationCategoryIds)) {
          child.congenitalMalformationCategoryIds.forEach((code: string) => {
            if (code && code.trim() !== '') {
              malfArray.push(this.fb.control(code));
            }
          });
        }
      }
    });
  }

  getIcd10CodesFA(childIndex: number): FormArray {
    return this.childrenFA.at(childIndex).get('icd10Codes') as FormArray;
  }

  getMalfCodesFA(childIndex: number): FormArray {
    return this.childrenFA.at(childIndex).get('malfCodes') as FormArray;
  }

  // Helper to read dropdown options by key
  options(key: string) {
    return (this.dropdowns && this.dropdowns[`IVFBirthEpisode:${key}`]) || [];
  }

  // ========== CHROMOSOME ANOMALY (ICD) ==========
  onChromosomeSearchChange(q: string, childIndex: number) {
    this.searchChromosome = q || '';
    this.chromosomeLimit = 50;
    this.fetchChromosomeAnomalies();
  }

  onChromosomeScroll(e: Event, childIndex: number) {
    const el = e.target as HTMLElement;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (nearBottom && !this.chromosomeLoading) {
      this.chromosomeLimit += 50;
      this.fetchChromosomeAnomalies(true);
    }
  }

  private fetchChromosomeAnomalies(append: boolean = false) {
    this.chromosomeLoading = true;
    const params: any = { searchKey: this.searchChromosome || '', limit: this.chromosomeLimit };
    this.api.get('Common/GetICDCodesBySearch', params).subscribe({
      next: (res: any) => {
        const items: any[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        const labels = items.map(it => this.icdLabel(it)).filter((s: any) => typeof s === 'string' && s.length > 0);
        this.chromosomeOptions = append ? Array.from(new Set([...(this.chromosomeOptions || []), ...labels])) : labels;
        this.chromosomeLoading = false;
      },
      error: () => {
        this.chromosomeLoading = false;
      }
    });
  }

  getSelectedChromosomes(childIndex: number): string[] {
    const icd10Codes = this.getIcd10CodesFA(childIndex).value || [];
    return icd10Codes.filter((code: string) => code);
  }

  isChromosomeSelected(value: string, childIndex: number): boolean {
    const code = (value || '').split(' | ')[0].trim();
    return !!code && this.getSelectedChromosomes(childIndex).includes(code);
  }

  toggleChromosome(value: string, childIndex: number) {
    const code = (value || '').split(' | ')[0].trim();
    if (!code) return;
    const current = new Set(this.getSelectedChromosomes(childIndex));
    if (current.has(code)) current.delete(code); else current.add(code);
    
    const icd10Array = this.getIcd10CodesFA(childIndex);
    const newValues = Array.from(current);
    
    // Update FormArray
    icd10Array.clear();
    newValues.forEach(val => icd10Array.push(this.fb.control(val)));
  }

  get filteredChromosomeOptions(): string[] {
    const q = this.searchChromosome.trim().toLowerCase();
    if (q.length <= 3) return this.chromosomeOptions;
    return this.chromosomeOptions.filter(o => o.toLowerCase().includes(q));
  }

  // ========== CONGENITAL MALFORMATION (ICD) ==========
  onMalformationSearchChange(q: string, childIndex: number) {
    this.searchMalformation = q || '';
    this.malformationLimit = 50;
    this.fetchMalformations();
  }

  onMalformationScroll(e: Event, childIndex: number) {
    const el = e.target as HTMLElement;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (nearBottom && !this.malformationLoading) {
      this.malformationLimit += 50;
      this.fetchMalformations(true);
    }
  }

  private fetchMalformations(append: boolean = false) {
    this.malformationLoading = true;
    const params: any = { searchKey: this.searchMalformation || '', limit: this.malformationLimit };
    this.api.get('Common/GetICDCodesBySearch', params).subscribe({
      next: (res: any) => {
        const items: any[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        const labels = items.map(it => this.icdLabel(it)).filter((s: any) => typeof s === 'string' && s.length > 0);
        this.malformationOptions = append ? Array.from(new Set([...(this.malformationOptions || []), ...labels])) : labels;
        this.malformationLoading = false;
      },
      error: () => {
        this.malformationLoading = false;
      }
    });
  }

  getSelectedMalformations(childIndex: number): string[] {
    const malfCodes = this.getMalfCodesFA(childIndex).value || [];
    return malfCodes.filter((code: string) => code);
  }

  isMalformationSelected(value: string, childIndex: number): boolean {
    const code = (value || '').split(' | ')[0].trim();
    return !!code && this.getSelectedMalformations(childIndex).includes(code);
  }

  toggleMalformation(value: string, childIndex: number) {
    const code = (value || '').split(' | ')[0].trim();
    if (!code) return;
    const current = new Set(this.getSelectedMalformations(childIndex));
    if (current.has(code)) current.delete(code); else current.add(code);
    
    const malfArray = this.getMalfCodesFA(childIndex);
    const newValues = Array.from(current);
    
    // Update FormArray
    malfArray.clear();
    newValues.forEach(val => malfArray.push(this.fb.control(val)));
  }

  get filteredMalformationOptions(): string[] {
    const q = this.searchMalformation.trim().toLowerCase();
    if (q.length <= 3) return this.malformationOptions;
    return this.malformationOptions.filter(o => o.toLowerCase().includes(q));
  }

  private icdLabel(it: any): string {
    if (typeof it === 'string') return it;
    const code = it?.icdCode || it?.ICDCode || it?.code || '';
    const descShort = it?.descriptionShort || it?.ICDName || it?.name || it?.description || it?.term || it?.icdName || '';
    const label = [code, descShort].filter(Boolean).join(' | ');
    return label || (descShort || code || '');
  }

  save() {
    const payload = this.form.getRawValue();
    console.log('Birth save:', payload);
    // TODO: hook to API
  }
}
