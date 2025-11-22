import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ivf-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 1050; }
    .dialog   { position: fixed; inset: 0; z-index: 1060; display: flex; align-items: center; justify-content: center; }
    .w-md { width: min(420px, 95vw); }
  `],
  template: `
    <div *ngIf="open">
      <div class="backdrop" (click)="onCancel()"></div>
      <div class="dialog">
        <div class="card w-md shadow">
          <div class="card-header">{{ title || 'Confirm' }}</div>
          <div class="card-body">
            <p class="mb-0">{{ message }}</p>
          </div>
          <div class="card-footer d-flex justify-content-end gap-2">
            <button class="btn btn-primary" (click)="onYes()">Yes</button>
            <button class="btn btn-outline-secondary" (click)="onNo()">No</button>
            <button class="btn btn-secondary" (click)="onCancel()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IvfConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirm';
  @Input() message = '';

  @Output() yes = new EventEmitter<void>();
  @Output() no = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onYes() { this.yes.emit(); }
  onNo() { this.no.emit(); }
  onCancel() { this.cancel.emit(); }
}
