import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbryoTransferComponent } from './embryo-transfer.component';

describe('EmbryoTransferComponent', () => {
  let component: EmbryoTransferComponent;
  let fixture: ComponentFixture<EmbryoTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbryoTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmbryoTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
