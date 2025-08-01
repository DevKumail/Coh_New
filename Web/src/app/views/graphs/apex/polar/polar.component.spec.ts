import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexPolarComponent } from './polar.component';

describe('PolarComponent', () => {
  let component: PolarComponent;
  let fixture: ComponentFixture<PolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
