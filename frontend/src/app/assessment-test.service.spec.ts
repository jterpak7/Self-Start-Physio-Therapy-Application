import { TestBed, inject } from '@angular/core/testing';

import { AssessmentTestService } from './assessment-test.service';

describe('AssessmentTestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentTestService]
    });
  });

  it('should be created', inject([AssessmentTestService], (service: AssessmentTestService) => {
    expect(service).toBeTruthy();
  }));
});
