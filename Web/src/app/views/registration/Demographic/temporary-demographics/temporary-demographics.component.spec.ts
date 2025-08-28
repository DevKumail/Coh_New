import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryDemographicsComponent } from './temporary-demographics.component';

describe('TemporaryDemographicsComponent', () => {
  let component: TemporaryDemographicsComponent;
  let fixture: ComponentFixture<TemporaryDemographicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporaryDemographicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporaryDemographicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
