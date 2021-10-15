import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteAssessmentTestComponent } from './complete-assessment-test.component';

describe('CompleteAssessmentTestComponent', () => {
  let component: CompleteAssessmentTestComponent;
  let fixture: ComponentFixture<CompleteAssessmentTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteAssessmentTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteAssessmentTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
