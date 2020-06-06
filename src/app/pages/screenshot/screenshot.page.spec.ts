import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScreenshotPage } from './screenshot.page';

describe('ScreenshotPage', () => {
  let component: ScreenshotPage;
  let fixture: ComponentFixture<ScreenshotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenshotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenshotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
