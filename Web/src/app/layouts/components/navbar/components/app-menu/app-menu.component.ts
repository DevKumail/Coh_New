import { Component, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MenuItemType } from '@/app/types/layout';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { horizontalMenuItems } from '@layouts/components/data';
import { filter, Subject, Subscription } from 'rxjs';
import { LucideAngularModule, Search } from 'lucide-angular';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-menu-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    NgbDropdown,
    NgbDropdownToggle,
    RouterLink,
    NgbDropdownMenu,
    LucideAngularModule,
    FormsModule
  ],
  templateUrl: './app-menu.component.html',
})
export class AppMenuComponent implements OnDestroy {
  Search = Search;
  mrNo: string = '';
  private searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  constructor(
    public router: Router,
    private patientBannerService: PatientBannerService,
    private demographicapi: DemographicApiServices
  ) {}

  ngOnInit() {
    debugger
    this.searchSub = this.searchSubject
      .pipe(
        debounceTime(3000), // 3 seconds delay
        distinctUntilChanged()
      )
      .subscribe((mrNo: string) => {
        if (mrNo && mrNo.length >= 3) {
          this.searchPatient(mrNo);
        } else {
          this.patientBannerService.setPatientData(null);
        }
      });
  }

  onSearchInput() {
    debugger
    this.searchSubject.next(this.mrNo);
  }

  searchPatient(mrNo: string) {
    debugger
    this.demographicapi.getPatientByMrNo(mrNo).subscribe({
      next: (res: any) => {
        if (res?.table2?.length > 0) {
          this.patientBannerService.setPatientData(res);
        } else {
          this.patientBannerService.setPatientData(null);
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.patientBannerService.setPatientData(null);
      }
    });
  }

  @ViewChild('MenuItemWithChildren', { static: true })
  menuItemWithChildren!: TemplateRef<{ item: MenuItemType; wrapperClass?: string; togglerClass?: string }>;

  @ViewChild('MenuItem', { static: true })
  menuItem!: TemplateRef<{ item: MenuItemType; linkClass?: string }>;

  menuItems = horizontalMenuItems;

  hasSubMenu(item: MenuItemType): boolean {
    return !!item.children;
  }

  isChildActive(item: MenuItemType): boolean {
    if (item.url && this.router.url === item.url) return true;
    if (!item.children) return false;
    return item.children.some((child: any) => this.isChildActive(child));
  }

  isActive(item: MenuItemType): boolean {
    return item.url === this.router.url;
  }

  ngOnDestroy() {
    if (this.searchSub) this.searchSub.unsubscribe();
  }
}
