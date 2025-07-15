import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovrageCreateComponent } from './covrage-create.component';

describe('CovrageCreateComponent', () => {
  let component: CovrageCreateComponent;
  let fixture: ComponentFixture<CovrageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovrageCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovrageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
