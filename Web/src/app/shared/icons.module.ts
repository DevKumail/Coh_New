import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  Stethoscope,
  User,
  UserCheck,
  PanelTop,
  ChevronDown,
  ChevronUp,
  Pin,
  PinOff,
  Pencil,
  RefreshCcw,
  Search


} from 'lucide-angular';

const icons = {
  Stethoscope,
  User,
  UserCheck,
  PanelTop,
  ChevronDown,
  ChevronUp,
  Pin,
  PinOff,
  Pencil,
  RefreshCcw,
  Search

};
@NgModule({
  imports: [LucideAngularModule.pick(icons)],
  exports: [LucideAngularModule]
})
export class IconsModule { }
