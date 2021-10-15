import { TestBed, inject } from '@angular/core/testing';

import { NewClientService } from './new-client.service';

describe('NewClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewClientService]
    });
  });

  it('should be created', inject([NewClientService], (service: NewClientService) => {
    expect(service).toBeTruthy();
  }));
});
