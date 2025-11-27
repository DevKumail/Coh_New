import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedService } from '@/app/shared/Services/Common/shared-service';

@Component({
  selector: 'app-generic-document-upload',
  imports: [CommonModule],
  templateUrl: './generic-document-upload.component.html',
  styleUrls: ['./generic-document-upload.component.scss']
})
export class GenericDocumentUploadComponent {
  selected: Array<{ id: number; name: string; size: number; ext: string; isExisting?: boolean; fileId?: number }> = [];
  private idCounter = 1;
  isLoading: boolean = false;
  private files: File[] = [];
  private existingIds: number[] = [];
  constructor(private shared: SharedService) {}
  
  onFilesChosen(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;
    const toAdd: Array<{ id: number; name: string; size: number; ext: string; isExisting?: boolean; fileId?: number }> = [];
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
    if (item.isExisting) {
      this.deleteExisting(id);
      return;
    }
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

  // Thumbnail helpers
  private isImageExt(ext: string | undefined) {
    const e = (ext || '').toLowerCase();
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].includes(e);
  }

  getPreview(meta: { name: string; size: number; ext: string }): string | null {
    if (!this.isImageExt(meta?.ext)) return null;
    const f = this.files.find(x => x.name === meta.name && x.size === meta.size);
    return f ? URL.createObjectURL(f) : null;
  }

  // Bind existing attachments (from server) by their file metadata
  setExisting(docs: Array<{ fileId: number; fileName: string; fileSize: number }>) {
    if (!Array.isArray(docs) || !docs.length) return;
    const toAdd: Array<{ id: number; name: string; size: number; ext: string; isExisting?: boolean; fileId?: number }> = [];
    for (const d of docs) {
      const name = d.fileName;
      const size = Number(d.fileSize) || 0;
      if (this.selected.some(s => s.name === name && s.size === size)) continue;
      toAdd.push({ id: this.idCounter++, name, size, ext: this.getExt(name), isExisting: true, fileId: Number(d.fileId) });
      this.existingIds.push(Number(d.fileId));
    }
    if (toAdd.length) this.selected = [...this.selected, ...toAdd];
  }

  getExistingIds(): number[] { return Array.from(new Set(this.existingIds)); }

  // Delete an existing server-side document, then remove from UI
  deleteExisting(rowId: number) {
    const item = this.selected.find(x => x.id === rowId && x.isExisting && Number.isFinite(x.fileId));
    if (!item || !item.fileId) return;
    this.isLoading = true;
    this.shared.deleteDocument(item.fileId).subscribe({
      next: () => {
        this.isLoading = false;
        this.selected = this.selected.filter(d => d.id !== rowId);
        this.existingIds = this.existingIds.filter(x => x !== item.fileId);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
