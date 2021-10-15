import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabPlansComponent } from './rehab-plans.component';

describe('RehabPlansComponent', () => {
  let component: RehabPlansComponent;
  let fixture: ComponentFixture<RehabPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
