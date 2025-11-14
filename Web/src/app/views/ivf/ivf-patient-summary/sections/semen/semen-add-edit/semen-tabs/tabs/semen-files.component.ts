import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-semen-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './semen-files.component.html'
})
export class SemenFilesComponent {
  files: Array<{name: string; size: string}> = [];
}
