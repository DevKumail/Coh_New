import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FemaleMedicalHistoryListComponent } from './female-medical-history-list.component';

describe('FemaleMedicalHistoryListComponent', () => {
  let component: FemaleMedicalHistoryListComponent;
  let fixture: ComponentFixture<FemaleMedicalHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FemaleMedicalHistoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FemaleMedicalHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
