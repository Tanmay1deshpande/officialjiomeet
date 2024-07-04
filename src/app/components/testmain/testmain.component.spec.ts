import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestmainComponent } from './testmain.component';

describe('TestmainComponent', () => {
  let component: TestmainComponent;
  let fixture: ComponentFixture<TestmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestmainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
