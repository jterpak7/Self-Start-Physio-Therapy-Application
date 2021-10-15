import { TestBed, inject } from '@angular/core/testing';

import { DynamicFormsService } from './dynamic-forms.service';

describe('DynamicFormsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicFormsService]
    });
  });

  it('should be created', inject([DynamicFormsService], (service: DynamicFormsService) => {
    expect(service).toBeTruthy();
  }));
});
