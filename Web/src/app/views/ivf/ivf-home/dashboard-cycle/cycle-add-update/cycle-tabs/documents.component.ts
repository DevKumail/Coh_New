import { Component, ViewChild } from '@angular/core';
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
  @ViewChild(GenericDocumentUploadComponent) uploader?: GenericDocumentUploadComponent;
  getFiles(): File[] {
    return this.uploader?.getFiles() || [];
  }
}
