import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicListComponent } from './demographic-list.component';

describe('DemographicListComponent', () => {
  let component: DemographicListComponent;
  let fixture: ComponentFixture<DemographicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemographicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
