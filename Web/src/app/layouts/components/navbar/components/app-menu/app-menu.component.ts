// import { Component, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
// import { MenuItemType } from '@/app/types/layout';
// import { CommonModule } from '@angular/common';
// import { NgIcon } from '@ng-icons/core';
// import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
// import { NavigationEnd, Router, RouterLink } from '@angular/router';
// import { horizontalMenuItems } from '@layouts/components/data';
// import { filter, Subject, Subscription } from 'rxjs';
// import { LucideAngularModule, Search } from 'lucide-angular';
// import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
// import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
// import { FormsModule } from '@angular/forms';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// @Component({
//   selector: 'app-menu-navbar',
//   standalone: true,
//   imports: [
//     CommonModule,
//     NgIcon,
//     NgbDropdown,
//     NgbDropdownToggle,
//     RouterLink,
//     NgbDropdownMenu,
//     LucideAngularModule,
//     FormsModule
//   ],
//   templateUrl: './app-menu.component.html',
// })
// export class AppMenuComponent implements OnDestroy {
//   Search = Search;
//   mrNo: string = '';
//   private searchSubject = new Subject<string>();
//   private searchSub!: Subscription;

//   constructor(
//     public router: Router,
//     private patientBannerService: PatientBannerService,
//     private demographicapi: DemographicApiServices
//   ) {}

//   ngOnInit() {
//     debugger
//     this.searchSub = this.searchSubject
//       .pipe(
//         debounceTime(3000), // 3 seconds delay
//         distinctUntilChanged()
//       )
//       .subscribe((mrNo: string) => {
//         if (mrNo && mrNo.length >= 3) {
//           this.searchPatient(mrNo);
//         } else {
//           this.patientBannerService.setPatientData(null);
//         }
//       });
      
//   }

//   onSearchInput() {
//     debugger
//     this.searchSubject.next(this.mrNo);
//   }

//   searchPatient(mrNo: string) {
//     debugger
//     this.demographicapi.getPatientByMrNo(mrNo).subscribe({
//       next: (res: any) => {
//         if (res?.table2?.length > 0) {
//           this.patientBannerService.setPatientData(res);
//         } else {
//           this.patientBannerService.setPatientData(null);
//         }
//       },
//       error: (err) => {
//         console.error('API Error:', err);
//         this.patientBannerService.setPatientData(null);
//       }
//     });
//   }

//   @ViewChild('MenuItemWithChildren', { static: true })
//   menuItemWithChildren!: TemplateRef<{ item: MenuItemType; wrapperClass?: string; togglerClass?: string }>;

//   @ViewChild('MenuItem', { static: true })
//   menuItem!: TemplateRef<{ item: MenuItemType; linkClass?: string }>;

//   menuItems = horizontalMenuItems;

//   hasSubMenu(item: MenuItemType): boolean {
//     return !!item.children;
//   }

//   isChildActive(item: MenuItemType): boolean {
//     if (item.url && this.router.url === item.url) return true;
//     if (!item.children) return false;
//     return item.children.some((child: any) => this.isChildActive(child));
//   }

//   isActive(item: MenuItemType): boolean {
//     return item.url === this.router.url;
//   }

//   ngOnDestroy() {
//     if (this.searchSub) this.searchSub.unsubscribe();
//   }
// }


import {
  Component,
  TemplateRef,
  ViewChild,
  OnInit,
  OnDestroy,
  inject
} from '@angular/core';
import { MenuItemType } from '@/app/types/layout';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle
} from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Subject, Subscription } from 'rxjs';
import { horizontalMenuItems } from '@layouts/components/data';
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
  templateUrl: './app-menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {
  Search = Search;
  mrNo: string = '';
  private searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  router = inject(Router);
  private patientBannerService = inject(PatientBannerService);
  private demographicapi = inject(DemographicApiServices);

  @ViewChild('MenuItemWithChildren', { static: true })
  menuItemWithChildren!: TemplateRef<{
    item: MenuItemType;
    wrapperClass?: string;
    togglerClass?: string;
  }>;

  @ViewChild('MenuItem', { static: true })
  menuItem!: TemplateRef<{ item: MenuItemType; linkClass?: string }>;

  menuItems: MenuItemType[] = horizontalMenuItems;

  ngOnInit() {
    // Dynamic menu filtering based on allowed screens
    
  
        debugger
        const allowedScreens = JSON.parse(sessionStorage.getItem('allowscreens') || '[]');
    
        if (allowedScreens?.length) {
          this.menuItems = this.buildMenuItemsFromScreens(allowedScreens, horizontalMenuItems);
        }
    

    // Watch for navigation changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.expandActivePaths(this.menuItems);
      });

    this.expandActivePaths(this.menuItems);

    // Search patient input subscription
    this.searchSub = this.searchSubject
      .pipe(debounceTime(3000), distinctUntilChanged())
      .subscribe((mrNo: string) => {
        if (mrNo && mrNo.length >= 3) {
          this.searchPatient(mrNo);
        } else {
          this.patientBannerService.setPatientData(null);
        }
      });
  }

  onSearchInput() {
    this.searchSubject.next(this.mrNo);
  }

  searchPatient(mrNo: string) {
    this.demographicapi.getPatientByMrNo(mrNo).subscribe({
      next: (res: any) => {
        if (res?.table2?.length > 0) {
          this.patientBannerService.setPatientData(res);
        } else {
          this.patientBannerService.setPatientData(null);
        }
      },
      error: err => {
        console.error('API Error:', err);
        this.patientBannerService.setPatientData(null);
      }
    });
  }

  hasSubMenu(item: MenuItemType): boolean {
    return !!item.children;
  }

  isChildActive(item: MenuItemType): boolean {
    if (item.url && this.router.url === item.url) return true;
    if (!item.children) return false;
    return item.children.some(child => this.isChildActive(child));
  }

  isActive(item: MenuItemType): boolean {
    return item.url === this.router.url;
  }

  expandActivePaths(items: MenuItemType[]) {
    for (const item of items) {
      if (this.hasSubMenu(item)) {
        item.isCollapsed = !this.isChildActive(item);
        this.expandActivePaths(item.children || []);
      }
    }
  }

 buildMenuItemsFromScreens(screens: string[], staticMenu: MenuItemType[]): MenuItemType[] {
    debugger
    const menuMap = new Map<string, MenuItemType>();
    const validModules = new Set<string>();
    const validComponentsPerModule = new Map<string, Set<string>>();
    const iconLookup = new Map<string, string>();

    for (const item of staticMenu) {
      const module = item.module || item.label;
      if (!module) continue;

      validModules.add(module);

      if (!validComponentsPerModule.has(module)) {
        validComponentsPerModule.set(module, new Set());
      }

      if (item.children) {
        for (const child of item.children) {
          validComponentsPerModule.get(module)?.add(child.label);
        }
      }

      if (item.icon) {
        iconLookup.set(module, item.icon);
      }
    }

    for (const screen of screens) {
      const [moduleName, componentName] = screen.split(':');

      if (!validModules.has(moduleName)) continue;

      const validComponents = validComponentsPerModule.get(moduleName);
      if (componentName && componentName !== moduleName && !validComponents?.has(componentName)) {
        continue;
      }

      if (!menuMap.has(moduleName)) {
        menuMap.set(moduleName, {
          label: moduleName,
          module: moduleName,
          isCollapsed: true,
          icon: iconLookup.get(moduleName),
          children: []
        });
      }

      const parent = menuMap.get(moduleName)!;
      if (componentName && componentName !== moduleName) {
        const alreadyExists = parent.children!.some(child => child.label === componentName);
        if (!alreadyExists) {
          parent.children!.push({
            label: componentName,
            url: `/${moduleName.toLowerCase()}/${componentName.toLowerCase()}`
          });
        }
      }
    }

    return Array.from(menuMap.values());
  }

  ngOnDestroy() {
    if (this.searchSub) this.searchSub.unsubscribe();
  }
}
