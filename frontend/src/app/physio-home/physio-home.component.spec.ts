import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysioHomeComponent } from './physio-home.component';

describe('PhysioHomeComponent', () => {
  let component: PhysioHomeComponent;
  let fixture: ComponentFixture<PhysioHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysioHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysioHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
