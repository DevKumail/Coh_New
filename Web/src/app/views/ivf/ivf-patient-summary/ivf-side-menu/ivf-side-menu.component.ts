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
  @Input() selected: string = 'medical-history';
  @Input() collapsed: boolean = false;
  @Input() isMalesidebar: boolean = true;
  @Output() select = new EventEmitter<string>();
  @Output() genderChange = new EventEmitter<'male' | 'female'>();
  @ViewChildren('menuLink') links!: QueryList<ElementRef<HTMLElement>>;

  private tooltips: Tooltip[] = [];

  // All menu items
  private allMenuItems = [
    { id: 'medical-history', label: 'Fertility History', icon: 'tablerNotes' },
    { id: 'social-history', label: 'Social History', icon: 'tablerNotes' },
    { id: 'family-history', label: 'Family History', icon: 'tablerNotes' },
    { id: 'vital-signs', label: 'Vital Signs', icon: 'tablerNotes' },
    { id: 'pathology-results', label: 'Pathology results', icon: 'tablerSearch' },
    { id: 'lab-orders', label: 'Lab orders', icon: 'tablerSearch' },
    { id: 'semen-analysis', label: 'Semen Analysis', icon: 'tablerSearch' },
  ];
  
  // Female-only menu items (limited items)
  private femaleOnlyItems = [
    { id: 'medical-history', label: 'Fertility History', icon: 'tablerNotes' },
    { id: 'social-history', label: 'Social History', icon: 'tablerNotes' },
    { id: 'family-history', label: 'Family History', icon: 'tablerNotes' },
    { id: 'vital-signs', label: 'Vital Signs', icon: 'tablerNotes' },
    // { id: 'cycle', label: 'Cycle', icon: 'tablerActivity' },
  ];

  // Dynamic main items based on gender
  mainItems = this.allMenuItems;

  // Placeholder for potential future orders
  orderItems: Array<{ id: string; label: string; icon: string }> = [];

  onSelect(id: string) {
    this.select.emit(id);
  }

  onGenderToggle(g: 'male' | 'female') {
    this.genderChange.emit(g);
  }

  ngAfterViewInit(): void {
    this.refreshTooltips();
    this.links.changes.subscribe(() => this.refreshTooltips());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('collapsed' in changes) {
      this.refreshTooltips();
    }
    
    // Update menu items when gender changes
    if ('isMalesidebar' in changes) {
      this.updateMenuItems();
    }
  }

  private updateMenuItems(): void {
    // If male is selected, show all items
    // If female is selected, show only limited items
    this.mainItems = this.isMalesidebar ? this.allMenuItems : this.femaleOnlyItems;
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
