import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryoStoragePlaceComponent } from './cryo-storage-place.component';

describe('CryoStoragePlaceComponent', () => {
  let component: CryoStoragePlaceComponent;
  let fixture: ComponentFixture<CryoStoragePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryoStoragePlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryoStoragePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
