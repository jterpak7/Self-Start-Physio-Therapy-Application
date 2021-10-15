import { TestBed, async, inject } from '@angular/core/testing';

import { PhysioAuthGuard } from './physio-auth.guard';

describe('PhysioAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhysioAuthGuard]
    });
  });

  it('should ...', inject([PhysioAuthGuard], (guard: PhysioAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
