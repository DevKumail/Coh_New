import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { PermissionService } from "@core/services/permission.service";

@Directive({
    selector: '[appPermission]',
    standalone: true
})
export class PermissionDirective implements OnInit {
    @Input('appPermission') permission!: {
        module: string;
        component: string;
        action?: string;
    };

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private permissionService: PermissionService
    ) { }

    ngOnInit(): void {
        const { module, component, action } = this.permission;

        const hasAccess = action
            ? this.permissionService.hasActionAccess(module, component, action)
            : this.permissionService.hasComponentAccess(module, component);

        hasAccess
            ? this.viewContainer.createEmbeddedView(this.templateRef)
            : this.viewContainer.clear();
    }
}
