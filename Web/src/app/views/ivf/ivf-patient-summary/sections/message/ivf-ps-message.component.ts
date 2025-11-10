import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ivf-ps-message',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="p-3 text-muted small">No data to display (Message)</div>`
})
export class IvfPsMessageComponent {}
