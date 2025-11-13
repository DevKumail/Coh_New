import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SemenParameterNativeComponent } from './tabs/semen-parameter-native.component';
import { SemenParameterAfterPrepComponent } from './tabs/semen-parameter-after-prep.component';
import { SemenParameterDocumentsComponent } from './tabs/semen-parameter-documents.component';
import { SemenFilesComponent } from './tabs/semen-files.component';

@Component({
  selector: 'app-semen-parameter-tabs',
  standalone: true,
  imports: [CommonModule, NgbNavModule, SemenParameterNativeComponent, SemenParameterAfterPrepComponent, SemenParameterDocumentsComponent, SemenFilesComponent],
  templateUrl: './semen-parameter-tabs.component.html',
  styleUrls: ['./semen-parameter-tabs.component.scss']
})
export class SemenParameterTabsComponent {
  active = 1;
  parameterActive = 1;
}
