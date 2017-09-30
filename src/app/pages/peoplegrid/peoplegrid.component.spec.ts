import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplegridComponent } from './peoplegrid.component';

describe('PeoplegridComponent', () => {
  let component: PeoplegridComponent;
  let fixture: ComponentFixture<PeoplegridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeoplegridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeoplegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
