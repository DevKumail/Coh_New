import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-generic-document-upload',
  imports: [CommonModule],
  templateUrl: './generic-document-upload.component.html',
  styleUrls: ['./generic-document-upload.component.scss']
})
export class GenericDocumentUploadComponent {
  selected: Array<{ id: number; name: string; size: number; ext: string }> = [];
  private idCounter = 1;
  isLoading: boolean = false;
  private files: File[] = [];
  
  onFilesChosen(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;
    const toAdd: Array<{ id: number; name: string; size: number; ext: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const f = files.item(i)!;
      if (!this.existsInList(f)) {
        toAdd.push({ id: this.idCounter++, name: f.name, size: f.size, ext: this.getExt(f.name) });
        this.files.push(f);
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
    this.files = this.files.filter(f => !(f.name === item.name && f.size === item.size));
  }

  private getExt(name: string) {
    const dot = name.lastIndexOf('.');
    return dot > -1 ? name.substring(dot + 1).toLowerCase() : '';
  }

  getFiles(): File[] {
    return this.files;
  }
}
