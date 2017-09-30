import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConseptualgridComponent } from './conseptualgrid.component';

describe('ConseptualgridComponent', () => {
  let component: ConseptualgridComponent;
  let fixture: ComponentFixture<ConseptualgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConseptualgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConseptualgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
