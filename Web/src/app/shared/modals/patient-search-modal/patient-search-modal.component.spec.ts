import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSearchModalComponent } from './patient-search-modal.component';

describe('PatientSearchModalComponent', () => {
  let component: PatientSearchModalComponent;
  let fixture: ComponentFixture<PatientSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSearchModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
