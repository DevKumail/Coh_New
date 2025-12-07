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
  selected: Array<{ id: number; name: string; size: number; ext: string; isExisting?: boolean; fileId?: number; previewUrl?: string | null }> = [];
  private idCounter = 1;
  isLoading: boolean = false;
  // For image preview modal
  imagePreviewUrl: string | null = null;
  private files: File[] = [];
  private existingIds: number[] = [];
  constructor(private shared: SharedService) {}
  
  onFilesChosen(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;
    const toAdd: Array<{ id: number; name: string; size: number; ext: string; isExisting?: boolean; fileId?: number; previewUrl?: string | null }> = [];
    for (let i = 0; i < files.length; i++) {
      const f = files.item(i)!;
      if (!this.existsInList(f)) {
        const ext = this.getExt(f.name);
        const previewUrl = this.isImageExt(ext) ? URL.createObjectURL(f) : null;
        toAdd.push({ id: this.idCounter++, name: f.name, size: f.size, ext, previewUrl });
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
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
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

  getPreview(meta: { name: string; size: number; ext: string; previewUrl?: string | null }): string | null {
    if (!this.isImageExt(meta?.ext)) return null;
    return meta.previewUrl ?? null;
  }

  // Open image in a simple viewer (used by template when clicking image thumbnails)
  openImagePreview(meta: { name: string; size: number; ext: string; previewUrl?: string | null }) {
    const url = this.getPreview(meta);
    if (!url) return;
    this.imagePreviewUrl = url;
  }

  closeImagePreview() {
    this.imagePreviewUrl = null;
  }

  // Bind existing attachments (from server) by their file metadata
  setExisting(docs: Array<{ fileId: number; fileName: string; fileSize: number; previewUrl?: string | null }>) {
    if (!Array.isArray(docs) || !docs.length) return;
    for (const d of docs) {
      const name = d.fileName;
      const size = Number(d.fileSize) || 0;
      if (this.selected.some(s => s.name === name && s.size === size)) continue;
      const fileId = Number(d.fileId);
      const ext = this.getExt(name);
      const base: { id: number; name: string; size: number; ext: string; isExisting?: boolean; fileId?: number; previewUrl?: string | null } = {
        id: this.idCounter++,
        name,
        size,
        ext,
        isExisting: true,
        fileId,
        // If caller provided a previewUrl (e.g. data:image/*;base64,...) for images, use it.
        // Otherwise, for images, fall back to direct download URL as preview.
        previewUrl: this.isImageExt(ext) && Number.isFinite(fileId) && fileId > 0
          ? (d.previewUrl ?? `/api/RsUpload/download/?fileId=${fileId}`)
          : null
      };

      this.selected = [...this.selected, base];
      this.existingIds.push(fileId);
    }
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
        if (item.previewUrl) {
          try { URL.revokeObjectURL(item.previewUrl); } catch {}
        }
        this.selected = this.selected.filter(d => d.id !== rowId);
        this.existingIds = this.existingIds.filter(x => x !== item.fileId);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
