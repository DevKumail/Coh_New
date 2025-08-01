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
import { LucideAngularModule, Search, Sliders } from 'lucide-angular';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ModalTriggerService } from '@core/services/modal-trigger.service';

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
export class AppMenuComponent implements OnInit {

  router = inject(Router);
  patientBannerService = inject(PatientBannerService);
  modalTriggerService = inject(ModalTriggerService)
  isPatientAvailable = false;

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

    this.patientBannerService.patientData$.subscribe(data => {
      this.isPatientAvailable = data;
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

  isActive(item: any): boolean {
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

  onPatientSummaryClick() {
    if (this.isPatientAvailable) {
      this.router.navigate(['/patient-summary']);
    } else {
      this.openAdvancedSearchModal();
    }
  }

  openAdvancedSearchModal() {
    this.modalTriggerService.openModal('advance-filter-modal', 'patient-summary');
  }

}
