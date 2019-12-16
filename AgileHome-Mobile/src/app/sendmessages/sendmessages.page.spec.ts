import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendmessagesPage } from './sendmessages.page';

describe('SendmessagesPage', () => {
  let component: SendmessagesPage;
  let fixture: ComponentFixture<SendmessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendmessagesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendmessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
