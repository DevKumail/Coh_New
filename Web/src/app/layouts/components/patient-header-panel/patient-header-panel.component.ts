// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   trigger,
//   state,
//   style,
//   transition,
//   animate
// } from '@angular/animations';
// import { IconsModule } from '@/app/shared/icons.module';

// @Component({
//   selector: 'app-patient-header-panel',
//   standalone: true,
//   templateUrl: './patient-header-panel.component.html',
//   styleUrls: ['./patient-header-panel.component.scss'],
//   imports: [CommonModule,IconsModule],
//   animations: [
//     trigger('slideToggle', [
//       state( 'hidden', style({ height: '0',opacity: 0,overflow: 'hidden',padding: '0',margin: '0'})),
//       state( 'visible',style({ height: '*',opacity: 1,overflow: 'visible',padding: '*',margin: '*'})),
//       transition('hidden <=> visible', [animate('300ms ease-in-out')])
//     ])
//   ]
// })
// export class PatientHeaderPanelComponent {

//   @Input() state: 'visible' | 'hidden' = 'hidden';
// @Input() pinned: boolean = false;
// @Output() pinnedChange = new EventEmitter<boolean>();
// @Output() tryToToggleWhilePinned = new EventEmitter<void>();


// isCollapsed: boolean = true;


//   togglePin() {
//   this.pinned = !this.pinned;
//   this.pinnedChange.emit(this.pinned);
// }

// toggleVisibilityRequest() {
//   if (this.pinned) {
//     this.tryToToggleWhilePinned.emit();
//   }

// }

// toggleCollapse() {
//     if (!this.pinned) {
//       this.isCollapsed = !this.isCollapsed;
//     }

// }




// }
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { IconsModule } from '@/app/shared/icons.module';

@Component({
  selector: 'app-patient-header-panel',
  standalone: true,
  templateUrl: './patient-header-panel.component.html',
  styleUrls: ['./patient-header-panel.component.scss'],
  imports: [CommonModule, IconsModule],
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0', opacity: 0, overflow: 'hidden', padding: '0', margin: '0' })),
      state('visible', style({ height: '*', opacity: 1, overflow: 'visible', padding: '*', margin: '*' })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')])
    ])
  ]
})
export class PatientHeaderPanelComponent {
  

  @Input() state: 'visible' | 'hidden' = 'hidden';
  @Input() patient: any = null;
  @Input() pinned: boolean = false;
  @Output() pinnedChange = new EventEmitter<boolean>();
  @Output() tryToToggleWhilePinned = new EventEmitter<void>();


  togglePin() {
    this.pinned = !this.pinned;
    this.pinnedChange.emit(this.pinned);
  }

  toggleVisibilityRequest() {
    if (this.pinned) {
      this.tryToToggleWhilePinned.emit();
    }
  }
}
