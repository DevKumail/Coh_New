import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexCandlestickComponent } from './candlestick.component';

describe('CandlestickComponent', () => {
  let component: CandlestickComponent;
  let fixture: ComponentFixture<CandlestickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandlestickComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandlestickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
