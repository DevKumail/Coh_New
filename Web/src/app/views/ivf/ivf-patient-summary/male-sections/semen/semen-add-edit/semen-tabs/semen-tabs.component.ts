import { Component, AfterViewInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SemenParameterDocumentsComponent } from './tabs/semen-parameter-documents.component';
import { SemenFilesComponent } from './tabs/semen-files.component';
import { NativeParameterComponent } from './native-tab/native-parameter.component';
import { PreparationParameterComponent } from './after-preparation-tab/preparation-parameter.component';
import { PreparationPreparationComponent } from './after-preparation-tab/preparation-preparation.component';

@Component({
  selector: 'app-semen-tabs',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    // New wrappers for correct hierarchy
    NativeParameterComponent,
    SemenFilesComponent,
    PreparationParameterComponent,
    PreparationPreparationComponent,
    // Existing
    SemenParameterDocumentsComponent,
  ],
  templateUrl: './semen-tabs.component.html',
  styleUrls: ['./semen-tabs.component.scss']
})
export class SemenTabsComponent implements AfterViewInit {
  active = 1;
  nativeActive = 1;
  afterActive = 1;
  @Input() dropdowns: { [key: string]: Array<{ valueId: number; name: string }> } = {};
  @Input() labelFor: (key: string) => string = (k) => k;
  @Input() hrEmployees: Array<{ name: string; providerId: number; employeeType: number }> = [];
  @ViewChild(NativeParameterComponent) nativeTab?: NativeParameterComponent;
  @ViewChild(PreparationParameterComponent) afterParamTab?: PreparationParameterComponent;
  @ViewChild(PreparationPreparationComponent) prepTab?: PreparationPreparationComponent;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Nudge ngbNav to render initial content reliably
    Promise.resolve().then(() => {
      this.active = 1;
      this.nativeActive = 1;
      this.afterActive = 1;
      this.cdr.detectChanges();
    });
  }

  getNativeObservation() {
    return this.nativeTab?.buildObservation('Native');
  }

  getAfterObservation() {
    return this.afterParamTab?.buildObservation();
  }

  getPreparation() {
    return this.prepTab?.buildPreparation();
  }

  patchFromModel(nativeObs: any, afterObs: any) {
    try { this.nativeTab?.patchFromObservation?.(nativeObs); } catch {}
    try { this.afterParamTab?.patchFromObservation?.(afterObs); } catch {}
    const prep = afterObs?.preparations?.[0] || null;
    try { this.prepTab?.patchFromPreparation?.(prep); } catch {}
  }

  private hasValues(obj: any): boolean {
    if (!obj) return false;
    const values = Object.values(obj);
    return values.some((v: any) => {
      if (typeof v === 'boolean') return v === true;
      if (typeof v === 'number') return v !== 0 && !Number.isNaN(v);
      if (typeof v === 'string') return v.trim().length > 0;
      if (Array.isArray(v)) return v.length > 0;
      return false;
    });
  }

  hasNativeValues(): boolean {
    const v = this.nativeTab?.form?.value;
    return this.hasValues(v);
  }

  hasAfterValues(): boolean {
    const v = this.afterParamTab?.form?.value;
    return this.hasValues(v);
  }

  hasPreparationValues(): boolean {
    const fv: any = this.prepTab?.form?.value || {};
    const methodsSelected = !!this.prepTab?.methodsFA?.controls?.some(c => !!c.value);
    const hasDate = !!fv.prepDate;
    const hasTime = typeof fv.prepTime === 'string' && fv.prepTime.trim().length > 0;
    const hasBy = !!fv.prepBy && Number(fv.prepBy) > 0;
    return hasDate || hasTime || hasBy || methodsSelected;
  }
}
