import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryoContainerAddComponent } from './cryo-container-add.component';

describe('CryoContainerAddComponent', () => {
  let component: CryoContainerAddComponent;
  let fixture: ComponentFixture<CryoContainerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryoContainerAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryoContainerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
