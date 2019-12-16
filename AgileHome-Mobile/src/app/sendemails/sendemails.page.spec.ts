import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendemailsPage } from './sendemails.page';

describe('SendemailsPage', () => {
  let component: SendemailsPage;
  let fixture: ComponentFixture<SendemailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendemailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendemailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
