import { TestBed } from '@angular/core/testing';

import { PeopleService } from './people.service';

describe('PessoasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeopleService = TestBed.get(PeopleService);
    expect(service).toBeTruthy();
  });
});
