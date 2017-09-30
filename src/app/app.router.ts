import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ControllableSlideshowComponent } from './components/controllableslideshowcomponent/controllableslideshowcomponent.component';
import { MainmenuComponent } from './pages/mainmenu/mainmenu.component';
import { NaturegridComponent } from './pages/naturegrid/naturegrid.component';
import { FullscreenIntroductionComponent } from './pages/fullscreenintroduction/fullscreenintroduction.component';

export const router: Routes = [
  {path: '', redirectTo: 'introduction', pathMatch: 'full'}, 
  {path: 'introduction', component: FullscreenIntroductionComponent},     
  {path: 'home', component: MainmenuComponent},
  {path: 'controllable', component: ControllableSlideshowComponent},  
  {path: '**', redirectTo: 'introduction', pathMatch: 'full'}
];


export const routes: ModuleWithProviders = RouterModule.forRoot(router);