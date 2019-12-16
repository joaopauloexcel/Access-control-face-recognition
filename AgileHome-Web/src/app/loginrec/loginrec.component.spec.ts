import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginrecComponent } from './loginrec.component';

describe('LoginrecComponent', () => {
  let component: LoginrecComponent;
  let fixture: ComponentFixture<LoginrecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginrecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginrecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
