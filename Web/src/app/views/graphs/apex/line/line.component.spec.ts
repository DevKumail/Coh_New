import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexLineComponent } from './line.component';

describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
