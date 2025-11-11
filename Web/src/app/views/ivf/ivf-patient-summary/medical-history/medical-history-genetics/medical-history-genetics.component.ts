import { Component } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-history-genetics',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './medical-history-genetics.component.html',
  styleUrls: ['./medical-history-genetics.component.scss']
})
export class MedicalHistoryGeneticsComponent {
  geneticsData = {
    // Add genetics and opinion related fields here
  };

  editorContent = '';
  quillModules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean']
    ]
  };
}
