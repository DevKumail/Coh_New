import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownConfigrationComponent } from './dropdown-configration.component';

describe('DropdownConfigrationComponent', () => {
  let component: DropdownConfigrationComponent;
  let fixture: ComponentFixture<DropdownConfigrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownConfigrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownConfigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
