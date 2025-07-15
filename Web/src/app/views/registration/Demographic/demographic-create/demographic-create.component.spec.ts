import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicCreateComponent } from './demographic-create.component';

describe('DemographicCreateComponent', () => {
  let component: DemographicCreateComponent;
  let fixture: ComponentFixture<DemographicCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemographicCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
