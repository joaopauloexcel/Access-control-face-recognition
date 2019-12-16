import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensageuserPage } from './mensageuser.page';

describe('MensageuserPage', () => {
  let component: MensageuserPage;
  let fixture: ComponentFixture<MensageuserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensageuserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensageuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
