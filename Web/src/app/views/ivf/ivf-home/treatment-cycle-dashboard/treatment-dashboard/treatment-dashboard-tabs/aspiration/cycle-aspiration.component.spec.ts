import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleAspirationComponent } from './cycle-aspiration.component';

describe('CycleAspirationComponent', () => {
  let component: CycleAspirationComponent;
  let fixture: ComponentFixture<CycleAspirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleAspirationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleAspirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
