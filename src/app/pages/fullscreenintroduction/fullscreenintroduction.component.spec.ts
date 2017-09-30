import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenIntroductionComponent } from './fullscreenintroduction.component';

describe('FullscreenslideshowComponent', () => {
  let component: FullscreenIntroductionComponent;
  let fixture: ComponentFixture<FullscreenIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullscreenIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
