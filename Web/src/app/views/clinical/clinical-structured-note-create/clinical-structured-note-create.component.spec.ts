import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalStructuredNoteCreateComponent } from './clinical-structured-note-create.component';

describe('ClinicalStructuredNoteCreateComponent', () => {
  let component: ClinicalStructuredNoteCreateComponent;
  let fixture: ComponentFixture<ClinicalStructuredNoteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalStructuredNoteCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalStructuredNoteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
