import { TestBed } from '@angular/core/testing';

import { RxdbHelperService } from './rxdb-helper.service';

describe('RxdbHelperService', () => {
  let service: RxdbHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxdbHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
