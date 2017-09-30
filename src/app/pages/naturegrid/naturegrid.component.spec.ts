import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturegridComponent } from './naturegrid.component';

describe('NaturegridComponent', () => {
  let component: NaturegridComponent;
  let fixture: ComponentFixture<NaturegridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaturegridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaturegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
