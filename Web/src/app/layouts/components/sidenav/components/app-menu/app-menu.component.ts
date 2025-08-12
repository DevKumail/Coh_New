import { Component, inject, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MenuItemType } from '@/app/types/layout';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { scrollToElement } from '@/app/utils/layout-utils';
import { menuItems } from '@layouts/components/data';
import { LayoutStoreService } from '@core/services/layout-store.service';
import { PermissionService } from '@core/services/permission.service';

@Component({
  selector: 'app-menu',
  imports: [NgIcon, NgbCollapse, RouterLink, CommonModule],
  templateUrl: './app-menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {

  router = inject(Router)
  layout = inject(LayoutStoreService)
  permissionService = inject(PermissionService)

  @ViewChild('MenuItemWithChildren', { static: true })
  menuItemWithChildren!: TemplateRef<{ item: MenuItemType }>;

  @ViewChild('MenuItem', { static: true })
  menuItem!: TemplateRef<{ item: MenuItemType }>;

  menuItems = menuItems;
  private subscription = new Subscription();

  ngOnInit(): void {

    const allowedScreens = JSON.parse(sessionStorage.getItem('allowscreens') || '[]');

    if (allowedScreens?.length) {
      this.menuItems = this.buildMenuItemsFromScreens(allowedScreens, menuItems);
    }

    // Subscribe to permission changes
    this.subscription.add(
      this.permissionService.onPermissionsRefreshed().subscribe(() => {
        const updatedScreens = JSON.parse(sessionStorage.getItem('allowscreens') || '[]');
        if (updatedScreens?.length) {
          this.menuItems = this.buildMenuItemsFromScreens(updatedScreens, menuItems);
        }
      })
    );

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.expandActivePaths(this.menuItems);
        setTimeout(() => this.scrollToActiveLink(), 50);
      });

    this.expandActivePaths(this.menuItems);
    setTimeout(() => this.scrollToActiveLink(), 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hasSubMenu(item: MenuItemType): boolean {
    return !!item.children;
  }

  expandActivePaths(items: MenuItemType[]) {
    for (const item of items) {
      if (this.hasSubMenu(item)) {
        item.isCollapsed = !this.isChildActive(item);
        this.expandActivePaths(item.children || []);
      }
    }
  }

  isChildActive(item: MenuItemType): boolean {
    if (item.url && this.router.url === item.url) return true;
    if (!item.children) return false;
    return item.children.some((child: MenuItemType) => this.isChildActive(child));
  }

  isActive(item: MenuItemType): boolean {
    return this.router.url === item.url;
  }

  scrollToActiveLink(): void {
    const activeItem = document.querySelector('[data-active-link="true"]') as HTMLElement;
    const scrollContainer = document.querySelector("#sidenav .simplebar-content-wrapper") as HTMLElement;

    if (activeItem && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      const offset = itemRect.top - containerRect.top - window.innerHeight * 0.4;

      scrollToElement(scrollContainer, scrollContainer.scrollTop + offset, 500);
    }
  }


  buildMenuItemsFromScreens(screens: string[], staticMenu: MenuItemType[]): MenuItemType[] {
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



}
