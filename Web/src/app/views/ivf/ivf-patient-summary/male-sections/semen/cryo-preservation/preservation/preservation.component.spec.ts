import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreservationComponent } from './preservation.component';

describe('PreservationComponent', () => {
  let component: PreservationComponent;
  let fixture: ComponentFixture<PreservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
