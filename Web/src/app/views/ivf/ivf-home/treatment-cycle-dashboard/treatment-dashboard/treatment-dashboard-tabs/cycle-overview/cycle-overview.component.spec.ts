import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleOverviewComponent } from './cycle-overview.component';

describe('CycleOverviewComponent', () => {
  let component: CycleOverviewComponent;
  let fixture: ComponentFixture<CycleOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
