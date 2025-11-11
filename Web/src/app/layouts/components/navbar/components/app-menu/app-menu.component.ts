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
import { LucideAngularModule, Search, Sliders, Home, User, Users, ChevronDown, ChevronRight, Bell, IdCard, LayoutDashboard, ClipboardList, Stethoscope, UserPlus, FileText, AlertTriangle, List, HeartPulse, Receipt, Syringe, Calendar, CalendarDays } from 'lucide-angular';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { ModalTriggerService } from '@core/services/modal-trigger.service';
import { PermissionService } from '@core/services/permission.service';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';

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
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './app-menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {

  router = inject(Router);
  patientBannerService = inject(PatientBannerService);
  modalTriggerService = inject(ModalTriggerService)
  isPatientAvailable = false;
  permissionService = inject(PermissionService);

  @ViewChild('MenuItemWithChildren', { static: true })
  menuItemWithChildren!: TemplateRef<{
    item: MenuItemType;
    wrapperClass?: string;
    togglerClass?: string;
  }>;

  @ViewChild('MenuItem', { static: true })
  menuItem!: TemplateRef<{ item: MenuItemType; linkClass?: string }>;

  menuItems: MenuItemType[] = horizontalMenuItems;
  private subscription = new Subscription();

  // Map existing icon string keys to lucide components
  private iconMap: Record<string, any> = {
    // Common
    tablerHome: Home,
    tablerUser: User,
    tablerUsers: Users,
    tablerChevronDown: ChevronDown,
    tablerChevronRight: ChevronRight,
    tablerLayoutDashboard: LayoutDashboard,
    tablerClipboardText: ClipboardList,
    tablerStethoscope: Stethoscope,
    tablerAlertTriangle: AlertTriangle,
    tablerListDetails: List,
    tablerHeartbeat: HeartPulse,
    tablerReceipt: Receipt,
    tablerSyringe: Syringe,
    tablerIdBadge2: IdCard,
    tablerBell: Bell,
    tablerUserPlus: UserPlus,
    tablerFiles: FileText,
    tablerCalendar: Calendar,
    tablerCalendarEvent: CalendarDays,
  };

  getIcon(key?: string) {
    if (!key) return Users; // fallback
    return this.iconMap[key] || Users; // fallback to a generic icon
  }

  ngOnInit() {
    // Dynamic menu filtering based on allowed screens

    const allowedScreens = JSON.parse(sessionStorage.getItem('allowscreens') || '[]');

    if (allowedScreens?.length) {
      this.menuItems = this.buildMenuItemsFromScreens(allowedScreens, horizontalMenuItems);
    }

    // Subscribe to permission changes
    this.subscription.add(
      this.permissionService.onPermissionsRefreshed().subscribe(() => {
        const updatedScreens = JSON.parse(sessionStorage.getItem('allowscreens') || '[]');
        if (updatedScreens?.length) {
          this.menuItems = this.buildMenuItemsFromScreens(updatedScreens, horizontalMenuItems);
        }
      })
    );

    // Watch for navigation changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.expandActivePaths(this.menuItems);
      });

    this.expandActivePaths(this.menuItems);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    const menuMap = new Map<string, MenuItemType>();
    const validModules = new Set<string>();
    const validComponentsPerModule = new Map<string, Set<string>>();
    // Map of module -> (component label -> url/icon) pulled from static menu config
    const childUrlLookup = new Map<string, Map<string, string>>();
    const childIconLookup = new Map<string, Map<string, string>>();
    const iconLookup = new Map<string, string>();

    for (const item of staticMenu) {
      const module = item.module || item.label;
      if (!module) continue;

      validModules.add(module);

      if (!validComponentsPerModule.has(module)) {
        validComponentsPerModule.set(module, new Set());
      }

      if (item.children) {
        // Build lookup of child label -> url and icon for each module
        const childMap = childUrlLookup.get(module) || new Map<string, string>();
        const iconMap = childIconLookup.get(module) || new Map<string, string>();
        for (const child of item.children) {
          validComponentsPerModule.get(module)?.add(child.label);
          if (child.label && child.url) {
            childMap.set(child.label, child.url);
          }
          if (child.label && child.icon) {
            iconMap.set(child.label, child.icon);
          }
        }
        childUrlLookup.set(module, childMap);
        childIconLookup.set(module, iconMap);
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
          // Prefer the exact url from static menu if available, else slugify the label
          const staticUrl = childUrlLookup.get(moduleName)?.get(componentName);
          const safeSlug = componentName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-');
          parent.children!.push({
            label: componentName,
            url: staticUrl || `/${moduleName.toLowerCase()}/${safeSlug}`,
            icon: childIconLookup.get(moduleName)?.get(componentName)
          });
        }
      }
    }

    return Array.from(menuMap.values());
  }

  onPatientSummaryClick() {
    this.patientBannerService.patientData$.pipe(
      take(1)
    ).subscribe((data: any) => {
      this.isPatientAvailable = data;
      console.log('isPatientAvailable', this.isPatientAvailable);
      
      if (this.isPatientAvailable) {
        this.router.navigate(['/patient-summary']);
      } else {
        this.openAdvancedSearchModal();
      }
    });
  }

  onDashboardClick() {
    this.router.navigate(['/dashboards/dashboard']);
  }

  openAdvancedSearchModal() {
    this.modalTriggerService.openModal('advance-filter-modal', 'patient-summary');
  }

  // Normalize dynamic labels for translation keys
  normalizeKey(input: any): string {
    if (input == null) { return ''; }
    return input
      .toString()
      .replace(/[^A-Za-z0-9]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toUpperCase();
  }
}