import { TestBed } from '@angular/core/testing';

import { AuthService } from './authlogin.service';

describe('AuthloginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
