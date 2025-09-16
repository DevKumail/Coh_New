import { Pipe, PipeTransform } from '@angular/core';

/**
 * dirIcon pipe
 * Usage examples:
 *  <ng-icon [name]="'tablerChevronRight' | dirIcon:'tablerChevronLeft'"></ng-icon>
 *  <ng-icon [name]="'tablerArrowNarrowRight' | dirIcon"></ng-icon> <!-- auto-swap Right/Left in RTL -->
 *
 * If the second argument (rtlName) is provided, it will be used when dir === 'rtl'.
 * If not provided, the pipe will try to auto-swap common LTR/RTL suffixes such as
 * Left/Right, ArrowLeft/ArrowRight, ChevronLeft/ChevronRight, CaretLeft/CaretRight.
 */
@Pipe({
  name: 'dirIcon',
  standalone: true,
})
export class DirIconPipe implements PipeTransform {
  transform(ltrName: string, rtlName?: string): string {
    try {
      const dir = (typeof document !== 'undefined')
        ? (document.documentElement.getAttribute('dir') || 'ltr')
        : 'ltr';

      if (dir !== 'rtl') return ltrName;

      // If explicit RTL icon name provided, use it
      if (rtlName && typeof rtlName === 'string' && rtlName.trim().length) {
        return rtlName;
      }

      // Auto-swap common directional tokens in icon names
      // e.g., 'ChevronRight' -> 'ChevronLeft', 'ArrowNarrowRight' -> 'ArrowNarrowLeft'
      const swaps: Array<[RegExp, string]> = [
        [/Right(?![a-zA-Z])/g, 'Left'],
        [/Left(?![a-zA-Z])/g, 'Right'],
        [/ArrowRight(?![a-zA-Z])/g, 'ArrowLeft'],
        [/ArrowLeft(?![a-zA-Z])/g, 'ArrowRight'],
        [/ChevronRight(?![a-zA-Z])/g, 'ChevronLeft'],
        [/ChevronLeft(?![a-zA-Z])/g, 'ChevronRight'],
        [/CaretRight(?![a-zA-Z])/g, 'CaretLeft'],
        [/CaretLeft(?![a-zA-Z])/g, 'CaretRight'],
      ];

      let swapped = ltrName;
      for (const [pattern, replacement] of swaps) {
        if (pattern.test(swapped)) {
          swapped = swapped.replace(pattern, replacement);
          // Stop at first successful swap to avoid double swapping
          break;
        }
      }

      return swapped;
    } catch {
      return ltrName;
    }
  }
}
