import { Directive, HostBinding, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appFilledOnValue], input[formControlName], select[formControlName], textarea[formControlName], input[formControl], select[formControl], textarea[formControl], input[ngModel], select[ngModel], textarea[ngModel]',
  standalone: true,
})
export class FilledOnValueDirective {
  private sub?: Subscription;
  private _filled = false;

  @HostBinding('style.background-color') get bg() {
    return this._filled ? '#f5f5f5' : '';
  }

  constructor(@Optional() @Self() private ngControl: NgControl) {}

  ngOnInit() {
    // initialize state
    this.updateState(this.ngControl?.value);
    // subscribe to changes
    this.sub = this.ngControl?.valueChanges?.subscribe(v => this.updateState(v));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private updateState(value: any) {
    // consider non-empty strings, non-null/undefined, and non-empty arrays as filled
    if (Array.isArray(value)) {
      this._filled = value.length > 0;
      return;
    }
    const v = (value ?? '').toString().trim();
    this._filled = v !== '';
  }
}
