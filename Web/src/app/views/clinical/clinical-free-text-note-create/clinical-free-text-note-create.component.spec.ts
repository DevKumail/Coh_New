import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalFreeTextNoteCreateComponent } from './clinical-free-text-note-create.component';

describe('ClinicalFreeTextNoteCreateComponent', () => {
  let component: ClinicalFreeTextNoteCreateComponent;
  let fixture: ComponentFixture<ClinicalFreeTextNoteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalFreeTextNoteCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalFreeTextNoteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
