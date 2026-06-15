import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatJoin } from './chat-join';

describe('ChatJoin', () => {
  let component: ChatJoin;
  let fixture: ComponentFixture<ChatJoin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatJoin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatJoin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
