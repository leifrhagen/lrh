import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SlideshowService } from '../../services/slideshow.service';
import { MainmenuService } from '../../pages/mainmenu/mainmenu.service';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {
  public mousePointingAtItem = -1;  
  public selectedItem = 0;

  constructor(private slideshowService: SlideshowService,
              private mainmenuService: MainmenuService,
              private router: Router) { }

  ngOnInit() {
    this.selectedItem = this.mainmenuService.getSelectedItem();
    this.slideshowService.setImageType(this.slideshowService.IMAGE_TYPE_INTRO);
    this.slideshowService.setFullPage(false);   
    this.slideshowService.setAutoPlay(true);
    this.slideshowService.setStartImageNo(1);  
    let n  = this.slideshowService.getNextSlideshowObjectId();
  }

  setSelectedItem(n: number) {
    this.selectedItem = n;
    this.mainmenuService.setSelectedItem(n);
  }

  enterItem(n: number) {
    this.mousePointingAtItem = n;
  }
  leaveItem(n: number) {
    this.mousePointingAtItem = -1;
  }

  logoClick() {
    this.slideshowService.setImageType(this.slideshowService.IMAGE_TYPE_INTRO);
    this.slideshowService.setFullPage(true);   
    this.slideshowService.setAutoPlay(true);
    this.slideshowService.setStartImageNo(1);  
    this.router.navigate(['/introduction']);
  }
}
