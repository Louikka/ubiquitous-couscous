import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAside } from './chat-aside';

describe('ChatAside', () => {
  let component: ChatAside;
  let fixture: ComponentFixture<ChatAside>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAside]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAside);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
