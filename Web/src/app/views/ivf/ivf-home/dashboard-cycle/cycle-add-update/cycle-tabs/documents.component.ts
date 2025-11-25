import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDocumentUploadComponent } from '@/app/shared/generic-document-upload/generic-document-upload.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, GenericDocumentUploadComponent],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {
  selected: Array<{ id: number; name: string; size: number; ext: string }> = [];
  private idCounter = 1;
  isLoading: boolean = false;

  onFilesChosen(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;
    const toAdd: Array<{ id: number; name: string; size: number; ext: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const f = files.item(i)!;
      if (!this.existsInList(f)) {
        toAdd.push({ id: this.idCounter++, name: f.name, size: f.size, ext: this.getExt(f.name) });
      }
    }
    this.selected = [...this.selected, ...toAdd];
    input.value = '';
  }

  existsInList(f: File) {
    const match = (d: { name: string; size: number }) => d.name === f.name && d.size === f.size;
    return this.selected.some(match);
  }

  removeOne(id: number) {
    const item = this.selected.find(d => d.id === id);
    if (!item) return;
    this.selected = this.selected.filter(d => d.id !== id);
  }

  private getExt(name: string) {
    const dot = name.lastIndexOf('.');
    return dot > -1 ? name.substring(dot + 1).toLowerCase() : '';
  }
}
