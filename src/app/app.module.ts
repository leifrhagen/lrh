import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

import {routes} from './app.router';
import { AppComponent } from './app.component';

import { WindowService } from './services/window.service';
import { SlideshowService } from './services/slideshow.service';
import { SlideshowCanvasComponent } from './components/slideshowcanvas/slideshowcanvas.component';

import { MainmenuService } from './pages/mainmenu/mainmenu.service';
import { MainmenuComponent } from './pages/mainmenu/mainmenu.component';
import { NaturegridComponent } from './pages/naturegrid/naturegrid.component';
import { PeoplegridComponent } from './pages/peoplegrid/peoplegrid.component';
import { AboutComponent } from './pages/about/about.component';
import { FullscreenIntroductionComponent } from './pages/fullscreenintroduction/fullscreenintroduction.component';
import { ConceptualgridComponent } from './pages/conceptualgrid/conceptualgrid.component';
import { ControllableSlideshowComponent } from './components/controllableslideshowcomponent/controllableslideshowcomponent.component';

@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    SlideshowCanvasComponent,
    NaturegridComponent,
    PeoplegridComponent,
    AboutComponent,
    FullscreenIntroductionComponent,
    ConceptualgridComponent,
    ControllableSlideshowComponent
  ],
  imports: [
    BrowserModule,
    routes
  ],
  providers: [WindowService, SlideshowService, MainmenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
