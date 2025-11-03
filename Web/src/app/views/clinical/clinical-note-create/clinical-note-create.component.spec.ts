import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalNoteCreateComponent } from './clinical-note-create.component';

describe('ClinicalNoteCreateComponent', () => {
  let component: ClinicalNoteCreateComponent;
  let fixture: ComponentFixture<ClinicalNoteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalNoteCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalNoteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
