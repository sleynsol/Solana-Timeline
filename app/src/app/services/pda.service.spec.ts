import { TestBed } from '@angular/core/testing';

import { PdaService } from './pda.service';

describe('PdaService', () => {
  let service: PdaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
