import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
}
