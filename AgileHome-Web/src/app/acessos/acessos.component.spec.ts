import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessosComponent } from './acessos.component';

describe('AcessosComponent', () => {
  let component: AcessosComponent;
  let fixture: ComponentFixture<AcessosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcessosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcessosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
