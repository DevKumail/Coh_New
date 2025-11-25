import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LutealPhaseComponent } from './luteal-phase.component';

describe('LutealPhaseComponent', () => {
  let component: LutealPhaseComponent;
  let fixture: ComponentFixture<LutealPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LutealPhaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LutealPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
