import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageListComponent } from './coverage-list.component';

describe('CoverageListComponent', () => {
  let component: CoverageListComponent;
  let fixture: ComponentFixture<CoverageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
