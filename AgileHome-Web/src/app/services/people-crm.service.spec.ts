import { TestBed } from '@angular/core/testing';

import { PeopleCrmService } from './people-crm.service';

describe('PeopleCrmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeopleCrmService = TestBed.get(PeopleCrmService);
    expect(service).toBeTruthy();
  });
});
