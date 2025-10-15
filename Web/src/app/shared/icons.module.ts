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
  Search,
  AlertCircle,
  CheckCircle
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
  Search,
  AlertCircle,
  CheckCircle
};
@NgModule({
  imports: [LucideAngularModule.pick(icons)],
  exports: [LucideAngularModule]
})
export class IconsModule { }
