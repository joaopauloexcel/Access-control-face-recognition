import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusDropdownPage } from './menus-dropdown.page';

describe('MenusDropdownPage', () => {
  let component: MenusDropdownPage;
  let fixture: ComponentFixture<MenusDropdownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenusDropdownPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenusDropdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
