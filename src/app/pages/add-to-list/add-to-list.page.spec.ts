import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddToListPage } from './add-to-list.page';

describe('AddToListPage', () => {
  let component: AddToListPage;
  let fixture: ComponentFixture<AddToListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddToListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
