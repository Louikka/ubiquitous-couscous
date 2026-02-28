import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEnter } from './chat-enter';


describe('ChatEnter', () => {
    let component: ChatEnter;
    let fixture: ComponentFixture<ChatEnter>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatEnter]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChatEnter);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
