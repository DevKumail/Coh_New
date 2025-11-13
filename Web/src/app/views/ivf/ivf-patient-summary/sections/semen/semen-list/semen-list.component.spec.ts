import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemenListComponent } from './semen-list.component';

describe('SemenListComponent', () => {
  let component: SemenListComponent;
  let fixture: ComponentFixture<SemenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemenListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
