import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { HasPermissionDirective } from '@/app/shared/directives/has-permission.directive';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIcon, NgIconComponent } from '@ng-icons/core';
import { LucideAngularModule, LucideHome, LucideUsers } from 'lucide-angular';

@Component({
  selector: 'app-cryo-container-list',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
        NgIcon,
        TranslatePipe,
        LucideAngularModule,
        HasPermissionDirective,
        GenericPaginationComponent,
        FilledOnValueDirective
    ],  templateUrl: './cryo-container-list.component.html',
  styleUrl: './cryo-container-list.component.scss',
   animations: [
        trigger('slideFade', [
          transition(':enter', [
            style({ height: 0, opacity: 0, overflow: 'hidden' }),
            animate('250ms ease-out', style({ height: '*', opacity: 1 }))
          ]),
          transition(':leave', [
            style({ height: '*', opacity: 1, overflow: 'hidden' }),
            animate('200ms ease-in', style({ height: 0, opacity: 0 }))
          ])
        ])
      ]
})
export class CryoContainerListComponent {
 /**
  *
  */
 constructor(    public router: Router,
) { }
    protected readonly homeIcon = LucideHome;
    protected readonly headingIcon = LucideUsers;
  

     get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }
  }
}
