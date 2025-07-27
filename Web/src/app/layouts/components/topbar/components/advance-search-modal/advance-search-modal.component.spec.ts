import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchModalComponent } from './advance-search-modal.component';

describe('AdvanceSearchModalComponent', () => {
  let component: AdvanceSearchModalComponent;
  let fixture: ComponentFixture<AdvanceSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceSearchModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
