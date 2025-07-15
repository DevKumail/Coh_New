import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MenuItemType} from '@/app/types/layout';
import {CommonModule} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {NgbCollapse} from '@ng-bootstrap/ng-bootstrap';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs';
import {scrollToElement} from '@/app/utils/layout-utils';
import {menuItems} from '@layouts/components/data';
import {LayoutStoreService} from '@core/services/layout-store.service';

@Component({
    selector: 'app-menu',
    imports: [NgIcon, NgbCollapse, RouterLink,CommonModule],
    templateUrl: './app-menu.component.html'
})
export class AppMenuComponent implements OnInit {

    router = inject(Router)
    layout = inject(LayoutStoreService)

    @ViewChild('MenuItemWithChildren', {static: true})
    menuItemWithChildren!: TemplateRef<{ item: MenuItemType }>;

    @ViewChild('MenuItem', {static: true})
    menuItem!: TemplateRef<{ item: MenuItemType }>;

    menuItems = menuItems;

    // ngOnInit(): void {
    //     this.router.events
    //         .pipe(filter(event => event instanceof NavigationEnd))
    //         .subscribe(() => {
    //             this.expandActivePaths(this.menuItems);
    //             setTimeout(() => this.scrollToActiveLink(), 50);
    //         });

    //     this.expandActivePaths(this.menuItems);
    //     setTimeout(() => this.scrollToActiveLink(), 100);
    // }

    ngOnInit(): void {
         // debugger
            const sessionData = sessionStorage.getItem('allowscreens');
const allowedScreens = JSON.parse(sessionStorage.getItem('allowscreens') || '[]');

        //const allowedScreens = JSON.parse(localStorage.getItem('allowscreens') || '[]');

    const loginData = JSON.parse(localStorage.getItem('allowscreens') || '{}');
    if (allowedScreens?.length) {
        this.menuItems = this.buildMenuItemsFromScreens(allowedScreens);
    }

    this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
            this.expandActivePaths(this.menuItems);
            setTimeout(() => this.scrollToActiveLink(), 50);
        });

    this.expandActivePaths(this.menuItems);
    setTimeout(() => this.scrollToActiveLink(), 100);
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



// buildMenuItemsFromScreens(screens: string[]): MenuItemType[] {
//   const menuMap: Map<string, MenuItemType> = new Map();

//   const iconLookup = new Map<string, string>();
//   for (const item of menuItems) {
//     const key = item.module || item.label;
//     if (key && item.icon) {
//       iconLookup.set(key, item.icon);
//     }
//   }


//   for (const screen of screens) {
//     const parts = screen.split(':');
//     const moduleName = parts[0];
//     const screenName = parts[1] ?? moduleName;

//     if (!menuMap.has(moduleName)) {
//       menuMap.set(moduleName, {
//         label: moduleName,
//         isCollapsed: true,
//          icon: iconLookup.get(moduleName), 
//         children: []
//       });
//     }

//     const parent = menuMap.get(moduleName)!;

//     // Avoid putting the module title itself as a child
//     if (screen !== moduleName) {
//       // ✅ Check for duplicates
//       const alreadyExists = parent.children!.some(
//         child => child.label === screenName
//       );

//       if (!alreadyExists) {
//         parent.children!.push({
//           label: screenName,
//           url: `/${moduleName.toLowerCase().replace(/ /g, '-')}/${screenName.toLowerCase().replace(/ /g, '-')}`
//         });
//       }
//     }
//   }

//   return Array.from(menuMap.values());
// }


buildMenuItemsFromScreens(screens: string[]): MenuItemType[] {
  const menuMap: Map<string, MenuItemType> = new Map();

  // ✅ Step 1: Build lookup maps from static menuItems
  const validModules = new Set<string>();
  const iconLookup = new Map<string, string>();

  for (const item of menuItems) {
    const key = item.module || item.label;
    if (key) {
      validModules.add(key);
      if (item.icon) iconLookup.set(key, item.icon);
    }
  }

  // ✅ Step 2: Loop through allowed screens
  for (const screen of screens) {
    const parts = screen.split(':');
    const moduleName = parts[0];
    const screenName = parts[1] ?? moduleName;

    // ❌ Skip if module is not in static menu (data.ts)
    if (!validModules.has(moduleName)) continue;

    // ✅ Create module if not exists
    if (!menuMap.has(moduleName)) {
      menuMap.set(moduleName, {
        label: moduleName,
        isCollapsed: true,
        icon: iconLookup.get(moduleName),
        children: []
      });
    }

    const parent = menuMap.get(moduleName)!;

    // ✅ Add child screen (avoiding module-only rows and duplicates)
    if (screen !== moduleName) {
      const alreadyExists = parent.children!.some(child => child.label === screenName);

      if (!alreadyExists) {
        parent.children!.push({
          label: screenName,
          url: `/${moduleName.toLowerCase().replace(/ /g, '-')}/${screenName.toLowerCase().replace(/ /g, '-')}`
        });
      }
    }
  }

  return Array.from(menuMap.values());
}


}
