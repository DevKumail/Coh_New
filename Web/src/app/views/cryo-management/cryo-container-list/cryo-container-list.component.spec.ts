import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryoContainerListComponent } from './cryo-container-list.component';

describe('CryoContainerListComponent', () => {
  let component: CryoContainerListComponent;
  let fixture: ComponentFixture<CryoContainerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryoContainerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryoContainerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
