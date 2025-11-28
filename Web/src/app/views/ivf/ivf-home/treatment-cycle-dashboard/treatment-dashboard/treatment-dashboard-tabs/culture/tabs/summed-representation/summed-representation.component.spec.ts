import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummedRepresentationComponent } from './summed-representation.component';

describe('SummedRepresentationComponent', () => {
  let component: SummedRepresentationComponent;
  let fixture: ComponentFixture<SummedRepresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummedRepresentationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummedRepresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
