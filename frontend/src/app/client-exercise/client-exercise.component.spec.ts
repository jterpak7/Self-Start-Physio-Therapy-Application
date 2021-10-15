import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientExerciseComponent } from './client-exercise.component';

describe('ClientExerciseComponent', () => {
  let component: ClientExerciseComponent;
  let fixture: ComponentFixture<ClientExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
