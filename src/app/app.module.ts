import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SocialSharing} from '@ionic-native/social-sharing';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {SearchPageModule} from "./pages/search/search.module";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {LoginPageModule} from "./pages/login/login.module";
import {SignupPageModule} from "./pages/signup/signup.module";
import {LabelinputPageModule} from "./pages/labelinput/labelinput.module";

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase), AngularFirestoreModule,
        AngularFireAuthModule, SearchPageModule, LoginPageModule, SignupPageModule, LabelinputPageModule],
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
