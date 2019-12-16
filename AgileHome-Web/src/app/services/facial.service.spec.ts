import { TestBed } from '@angular/core/testing';

import { FacialService } from './facial.service';

describe('FacialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FacialService = TestBed.get(FacialService);
    expect(service).toBeTruthy();
  });
});
