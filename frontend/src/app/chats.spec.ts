import { TestBed } from '@angular/core/testing';

import { Chats } from './chats';

describe('Chats', () => {
  let service: Chats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Chats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
