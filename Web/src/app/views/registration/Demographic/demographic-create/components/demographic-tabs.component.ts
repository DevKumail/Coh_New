import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

// Using content projection; no direct child component imports here

@Component({
  selector: 'app-demographic-tabs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbNavModule, LucideAngularModule],
  template: `
  <div class="card-body">
    <ul ngbNav #nav="ngbNav" [(activeId)]="activeTabId" (activeIdChange)="activeTabIdChange.emit($event)" class="nav nav-tabs mb-3">
      <!-- Contact Tab -->
      <li [ngbNavItem]="1">
        <a ngbNavLink>
          Contact
          <lucide-icon *ngIf="isFormSubmitted && !contactTabValid" name="AlertCircle" class="text-danger ms-1" size="16"></lucide-icon>
          <!-- <lucide-icon *ngIf="isFormSubmitted && contactTabValid" name="CheckCircle" class="text-success ms-1" size="16"></lucide-icon> -->
        </a>
        <ng-template ngbNavContent>
          <ng-content select="[contactTab]"></ng-content>
        </ng-template>
      </li>

      <!-- Emergency Contact Tab -->
      <li [ngbNavItem]="2">
        <a ngbNavLink>
          Emergency Contact
          <lucide-icon *ngIf="!emergencyContactTabValid" name="AlertCircle" class="text-danger ms-1" size="16"></lucide-icon>
          <!-- <lucide-icon *ngIf="emergencyContactTabValid" name="CheckCircle" class="text-success ms-1" size="16"></lucide-icon> -->
        </a>
        <ng-template ngbNavContent>
          <ng-content select="[emergencyTab]"></ng-content>
        </ng-template>
      </li>

      <!-- Next Of Kin Tab -->
      <li [ngbNavItem]="3">
        <a ngbNavLink>
          Next Of Kin
          <lucide-icon *ngIf="!nextOfKinTabValid" name="AlertCircle" class="text-danger ms-1" size="16"></lucide-icon>
          <!-- <lucide-icon *ngIf="nextOfKinTabValid" name="CheckCircle" class="text-success ms-1" size="16"></lucide-icon> -->
        </a>
        <ng-template ngbNavContent>
          <ng-content select="[nextOfKinTab]"></ng-content>
        </ng-template>
      </li>

      <!-- Spouse Tab -->
      <li [ngbNavItem]="4">
        <a ngbNavLink>
          Spouse
          <lucide-icon *ngIf="!spouseTabValid" name="AlertCircle" class="text-danger ms-1" size="16"></lucide-icon>
          <!-- <lucide-icon *ngIf="spouseTabValid" name="CheckCircle" class="text-success ms-1" size="16"></lucide-icon> -->
        </a>
        <ng-template ngbNavContent>
          <ng-content select="[spouseTab]"></ng-content>
        </ng-template>
      </li>

      <!-- Parents Tab -->
      <li [ngbNavItem]="5">
        <a ngbNavLink>
          Parents info
          <lucide-icon *ngIf="!parentsTabValid" name="AlertCircle" class="text-danger ms-1" size="16"></lucide-icon>
          <!-- <lucide-icon *ngIf="parentsTabValid" name="CheckCircle" class="text-success ms-1" size="16"></lucide-icon> -->
        </a>
        <ng-template ngbNavContent>
          <ng-content select="[parentsTab]"></ng-content>
        </ng-template>
      </li>

      <!-- Assignments Tab -->
      <li [ngbNavItem]="6">
        <a ngbNavLink>
          Assignments
          <lucide-icon *ngIf="!assignmentTabValid" name="AlertCircle" class="text-danger ms-1" size="16"></lucide-icon>
          <!-- <lucide-icon *ngIf="assignmentTabValid" name="CheckCircle" class="text-success ms-1" size="16"></lucide-icon> -->
        </a>
        <ng-template ngbNavContent>
          <ng-content select="[assignmentsTab]"></ng-content>
        </ng-template>
      </li>

      <!-- Family Tab -->
      <li [ngbNavItem]="7">
        <a ngbNavLink>
          Family Members
          <lucide-icon *ngIf="!familyTabValid" name="AlertCircle" class="text-danger ms-1" size="16"></lucide-icon>
          <!-- <lucide-icon *ngIf="familyTabValid" name="CheckCircle" class="text-success ms-1" size="16"></lucide-icon> -->
        </a>
        <ng-template ngbNavContent>
          <ng-content select="[familyTab]"></ng-content>
        </ng-template>
      </li>
    </ul>

    <div [ngbNavOutlet]="nav"></div>
  </div>
  `
})
export class DemographicTabsComponent {
  // state
  @Input() activeTabId!: number;
  @Output() activeTabIdChange = new EventEmitter<number>();
  @Input() isFormSubmitted = false;
  // validity flags provided by parent
  @Input() contactTabValid = false;
  @Input() emergencyContactTabValid = true;
  @Input() nextOfKinTabValid = true;
  @Input() spouseTabValid = true;
  @Input() parentsTabValid = true;
  @Input() assignmentTabValid = true;
  @Input() familyTabValid = true;
}
