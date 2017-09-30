import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideshowCanvasComponent } from './slideshowcanvas.component';

describe('SlideshowComponent', () => {
  let component: SlideshowCanvasComponent;
  let fixture: ComponentFixture<SlideshowCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideshowCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideshowCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
