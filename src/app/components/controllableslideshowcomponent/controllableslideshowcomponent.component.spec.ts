import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllableslideshowcomponentComponent } from './controllableslideshowcomponent.component';

describe('ControllableslideshowcomponentComponent', () => {
  let component: ControllableslideshowcomponentComponent;
  let fixture: ComponentFixture<ControllableslideshowcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllableslideshowcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllableslideshowcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
