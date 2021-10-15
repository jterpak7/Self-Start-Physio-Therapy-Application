import { TestBed, inject } from '@angular/core/testing';

import { RehabPlansService } from './rehab-plans.service';

describe('RehabPlansService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RehabPlansService]
    });
  });

  it('should be created', inject([RehabPlansService], (service: RehabPlansService) => {
    expect(service).toBeTruthy();
  }));
});
