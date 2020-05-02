import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LabelinputPage } from './labelinput.page';

describe('LabelinputPage', () => {
  let component: LabelinputPage;
  let fixture: ComponentFixture<LabelinputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelinputPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LabelinputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
