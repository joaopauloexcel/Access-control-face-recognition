import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRecoverPage } from './login-recover.page';

describe('LoginRecoverPage', () => {
  let component: LoginRecoverPage;
  let fixture: ComponentFixture<LoginRecoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginRecoverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRecoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
