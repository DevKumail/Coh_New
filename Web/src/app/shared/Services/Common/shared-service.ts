import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  constructor(private api: ApiService) {}

  getDropDownValuesByName(name: string): Observable<any> {
    return this.api.get(`DropDownLookUp/GetDropDownValuesByName?page=${name}`);
  }

  getCacheItem(object: any): Observable<any> {
    return this.api.post('Cache/GetCache', object);
  }

  // RsUpload APIs
  uploadDocuments(files: File[], extraFields?: { [key: string]: string | number | boolean }): Observable<any> {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    if (extraFields) {
      Object.keys(extraFields).forEach(k => form.append(k, String(extraFields[k])));
    }
    // POST https://localhost:44320/api/RsUpload/upload-multiple
    return this.api.post('RsUpload/upload-multiple', form);
  }

  // Exact shape matching the provided curl command
  uploadDocumentsWithModule(moduleName: string, files: File[]): Observable<any> {
    const form = new FormData();
    form.append('moduleName', moduleName);
    files.forEach(f => form.append('files', f));
    // ApiService.post likely accepts only (url, body). Backend may return text/plain.
    return this.api.post('RsUpload/upload-multiple', form);
  }

  deleteDocument(id: number): Observable<any> {
    // DELETE https://localhost:44320/api/RsUpload/delete/{id}
    return this.api.delete(`RsUpload/delete/${id}`);
  }

  getDocumentInfo(id: number): Observable<any> {
    // GET https://localhost:44320/api/RsUpload/info/{id}
    return this.api.get(`RsUpload/info/${id}`);
  }

  // Get multiple attachment files by their ids
  getAttachmentFiles(fileIds: number[]): Observable<any> {
    // Backend: [HttpGet("GetAttachmentFiles")] on RsUpload controller
    // GET https://localhost:44320/api/RsUpload/GetAttachmentFiles?fileIds=1&fileIds=2
    if (!Array.isArray(fileIds) || !fileIds.length) {
      return this.api.get('RsUpload/GetAttachmentFiles', { fileIds: [] });
    }
    return this.api.get('RsUpload/GetAttachmentFiles', { fileIds });
  }
}