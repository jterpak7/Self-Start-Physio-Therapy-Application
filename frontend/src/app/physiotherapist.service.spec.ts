import { TestBed, inject } from '@angular/core/testing';

import { PhysiotherapistService } from './physiotherapist.service';

describe('PhysiotherapistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhysiotherapistService]
    });
  });

  it('should be created', inject([PhysiotherapistService], (service: PhysiotherapistService) => {
    expect(service).toBeTruthy();
  }));
});
