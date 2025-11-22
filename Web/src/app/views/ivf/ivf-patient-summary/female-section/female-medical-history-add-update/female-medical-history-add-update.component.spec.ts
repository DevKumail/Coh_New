import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FemaleMedicalHistoryAddUpdateComponent } from './female-medical-history-add-update.component';

describe('FemaleMedicalHistoryAddUpdateComponent', () => {
  let component: FemaleMedicalHistoryAddUpdateComponent;
  let fixture: ComponentFixture<FemaleMedicalHistoryAddUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FemaleMedicalHistoryAddUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FemaleMedicalHistoryAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
