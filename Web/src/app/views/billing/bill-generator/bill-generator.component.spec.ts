import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillGeneratorComponent } from './bill-generator.component';

describe('BillGeneratorComponent', () => {
  let component: BillGeneratorComponent;
  let fixture: ComponentFixture<BillGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
