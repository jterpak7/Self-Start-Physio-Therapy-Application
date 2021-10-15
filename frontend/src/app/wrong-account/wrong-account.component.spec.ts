import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongAccountComponent } from './wrong-account.component';

describe('WrongAccountComponent', () => {
  let component: WrongAccountComponent;
  let fixture: ComponentFixture<WrongAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrongAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
