import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewscreenComponent } from './previewscreen.component';

describe('PreviewscreenComponent', () => {
  let component: PreviewscreenComponent;
  let fixture: ComponentFixture<PreviewscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewscreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
