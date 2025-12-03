import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltrasoundComponent } from './ultrasound.component';

describe('UltrasoundComponent', () => {
  let component: UltrasoundComponent;
  let fixture: ComponentFixture<UltrasoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltrasoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltrasoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
