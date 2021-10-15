import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsOfTherapistComponent } from './clients-of-therapist.component';

describe('ClientsOfTherapistComponent', () => {
  let component: ClientsOfTherapistComponent;
  let fixture: ComponentFixture<ClientsOfTherapistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsOfTherapistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsOfTherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
