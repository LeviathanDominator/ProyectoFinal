import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy, IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {SearchPageModule} from './pages/search/search.module';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {LoginPageModule} from './pages/login/login.module';
import {SignupPageModule} from './pages/signup/signup.module';
import {LabelinputPageModule} from './pages/labelinput/labelinput.module';
import {FilterPageModule} from './pages/filter/filter.module';
import {NewListPageModule} from './pages/new-list/new-list.module';
import {SendMessagePageModule} from './pages/send-message/send-message.module';
import {MessagePageModule} from './pages/message/message.module';
import {ListPageModule} from './pages/list/list.module';
import {AddToListPageModule} from './pages/add-to-list/add-to-list.module';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase), AngularFirestoreModule,
        AngularFireAuthModule, SearchPageModule, FilterPageModule, LoginPageModule, SignupPageModule,
        LabelinputPageModule, ListPageModule, NewListPageModule, AddToListPageModule, MessagePageModule,
        SendMessagePageModule],
    providers: [
        StatusBar,
        SplashScreen,
        BarcodeScanner,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
