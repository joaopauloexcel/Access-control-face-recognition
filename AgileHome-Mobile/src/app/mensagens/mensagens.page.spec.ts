import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagensPage } from './mensagens.page';

describe('MensagensPage', () => {
  let component: MensagensPage;
  let fixture: ComponentFixture<MensagensPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensagensPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensagensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
