import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewListPage } from './new-list.page';

describe('NewListPage', () => {
  let component: NewListPage;
  let fixture: ComponentFixture<NewListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
