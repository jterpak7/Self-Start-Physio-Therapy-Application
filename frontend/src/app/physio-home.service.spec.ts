import { TestBed, inject } from '@angular/core/testing';

import { PhysioHomeService } from './physio-home.service';

describe('PhysioHomeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhysioHomeService]
    });
  });

  it('should be created', inject([PhysioHomeService], (service: PhysioHomeService) => {
    expect(service).toBeTruthy();
  }));
});
