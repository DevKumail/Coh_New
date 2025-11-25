import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDocumentUploadComponent } from './generic-document-upload.component';

describe('GenericDocumentUploadComponent', () => {
  let component: GenericDocumentUploadComponent;
  let fixture: ComponentFixture<GenericDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDocumentUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
