import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalNoteComponent } from './clinical-note.component';

describe('ClinicalNoteComponent', () => {
  let component: ClinicalNoteComponent;
  let fixture: ComponentFixture<ClinicalNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
