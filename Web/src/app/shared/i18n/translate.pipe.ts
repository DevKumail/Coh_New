import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: TranslationService, private cdr: ChangeDetectorRef) {
    this.i18n.currentLang$.subscribe(() => this.cdr.markForCheck());
  }

  transform(key: string): string {
    return this.i18n.t(key);
  }
}
