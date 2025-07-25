import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexScatterComponent } from './scatter.component';

describe('ScatterComponent', () => {
  let component: ScatterComponent;
  let fixture: ComponentFixture<ScatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScatterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
