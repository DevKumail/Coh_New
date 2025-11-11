import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import Tooltip from 'bootstrap/js/dist/tooltip';

@Component({
  selector: 'app-ivf-side-menu',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './ivf-side-menu.component.html',
  styleUrls: ['./ivf-side-menu.component.scss']
})
export class IvfSideMenuComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() selected: string = 'demographic';
  @Input() collapsed: boolean = false;
  @Output() select = new EventEmitter<string>();
  @ViewChildren('menuLink') links!: QueryList<ElementRef<HTMLElement>>;

  private tooltips: Tooltip[] = [];

  // Match patient-summary structure: main menu + optional orders section
  mainItems = [
    { id: 'demographic', label: 'Demographic', icon: 'tablerUsers' },
    { id: 'medical-history', label: 'Fertility History', icon: 'tablerNotes' },
    { id: 'social-history', label: 'Social History', icon: 'tablerNotes' },
    { id: 'family-history', label: 'Family History', icon: 'tablerNotes' },
    { id: 'lab-diagnostics', label: 'Lab Diagnostics', icon: 'tablerSearch' },
    { id: 'billing', label: 'Billing', icon: 'tablerReceipt' },
    { id: 'message', label: 'Message', icon: 'tablerMessage2' },
    { id: 'cycle', label: 'Cycle', icon: 'tablerActivity' }
  ];

  switchItem = { id: 'switch-partner', label: 'Switch to partner', icon: 'tablerUsers' };

  // Placeholder for potential future orders
  orderItems: Array<{ id: string; label: string; icon: string }> = [];

  onSelect(id: string) {
    this.select.emit(id);
  }

  ngAfterViewInit(): void {
    this.refreshTooltips();
    this.links.changes.subscribe(() => this.refreshTooltips());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('collapsed' in changes) {
      this.refreshTooltips();
    }
  }

  ngOnDestroy(): void {
    this.destroyTooltips();
  }

  private refreshTooltips(): void {
    // Ensure links exist before acting
    if (!this.links) return;
    // Recreate when state changes
    this.destroyTooltips();
    if (!this.collapsed) return; // Tooltips only when collapsed
    this.links.forEach((ref, index) => {
      const el = ref.nativeElement;
      const label = el.getAttribute('data-label') || '';
      // Use Bootstrap Tooltip with custom template to mimic Inspinia flyout
      const tt = new Tooltip(el, {
        placement: 'right',
        container: 'body',
        trigger: 'hover focus',
        fallbackPlacements: ['bottom', 'left'],
        customClass: 'menu-flyout',
        html: true,
        title: `<div class="flyout-title">${label}</div>`
      } as any);
      this.tooltips.push(tt);
    });
  }

  private destroyTooltips(): void {
    this.tooltips.forEach(t => t.dispose());
    this.tooltips = [];
  }
}
