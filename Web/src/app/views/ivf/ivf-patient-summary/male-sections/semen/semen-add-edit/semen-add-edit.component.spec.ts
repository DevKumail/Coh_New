import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemenAddEditComponent } from './semen-add-edit.component';

describe('SemenAddEditComponent', () => {
  let component: SemenAddEditComponent;
  let fixture: ComponentFixture<SemenAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemenAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemenAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
