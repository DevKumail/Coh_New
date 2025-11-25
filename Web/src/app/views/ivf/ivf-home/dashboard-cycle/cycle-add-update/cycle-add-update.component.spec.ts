import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleAddUpdateComponent } from './cycle-add-update.component';

describe('CycleAddUpdateComponent', () => {
  let component: CycleAddUpdateComponent;
  let fixture: ComponentFixture<CycleAddUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleAddUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
