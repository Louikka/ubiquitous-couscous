import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCreate } from './chat-create';

describe('ChatCreate', () => {
  let component: ChatCreate;
  let fixture: ComponentFixture<ChatCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
