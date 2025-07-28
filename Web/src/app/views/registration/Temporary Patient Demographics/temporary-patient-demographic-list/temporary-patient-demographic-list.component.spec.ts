import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryPatientDemographicListComponent } from './temporary-patient-demographic-list.component';

describe('TemporaryPatientDemographicListComponent', () => {
  let component: TemporaryPatientDemographicListComponent;
  let fixture: ComponentFixture<TemporaryPatientDemographicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporaryPatientDemographicListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporaryPatientDemographicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
