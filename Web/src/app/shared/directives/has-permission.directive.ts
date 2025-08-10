import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { PermissionService } from '@core/services/permission.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Input() hasPermission!: string; // Format: "Module:Component:Action"
  @Input() hasPermissionModule?: string;
  @Input() hasPermissionComponent?: string;
  @Input() hasPermissionAction?: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.checkPermission();
    
    // Re-check permissions when they are refreshed
    this.permissionService.onPermissionsRefreshed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkPermission();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkPermission() {
    let hasAccess = false;

    if (this.hasPermission) {
      // Direct permission string format: "Module:Component:Action"
      const parts = this.hasPermission.split(':');
      if (parts.length === 3) {
        hasAccess = this.permissionService.hasActionAccess(parts[0], parts[1], parts[2]);
      } else if (parts.length === 2) {
        hasAccess = this.permissionService.hasComponentAccess(parts[0], parts[1]);
      } else if (parts.length === 1) {
        hasAccess = this.permissionService.hasModuleAccess(parts[0]);
      }
    } else if (this.hasPermissionModule && this.hasPermissionComponent && this.hasPermissionAction) {
      // Separate inputs
      hasAccess = this.permissionService.hasActionAccess(
        this.hasPermissionModule,
        this.hasPermissionComponent,
        this.hasPermissionAction
      );
    }

    // Always clear the view container first to prevent duplicates
    this.viewContainer.clear();
    
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
