import { Component, HostListener, OnInit } from '@angular/core';
import { SlideshowService } from '../../services/slideshow.service';
import { Router } from '@angular/router';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  X_KEY = 88
}

@Component({
  selector: 'app-controllableslideshowcomponent',
  templateUrl: './controllableslideshowcomponent.component.html',
  styleUrls: ['./controllableslideshowcomponent.component.css']
})
export class ControllableSlideshowComponent implements OnInit {
  public PREVIOUS_IMAGE  = 1;
  public START_STOP_PLAY = 2;  
  public NEXT_IMAGE      = 3;         
  public EXIT_SCREEN     = 4;  

  private imageInfo = 'Nature     4 of 13';
  private previousImageIcon = 'assets/images/controllers/previous_image.jpg';
  private playImageIcon = 'assets/images/controllers/start_auto.jpg';
  private nextImageIcon = 'assets/images/controllers/next_image.jpg';
  private exitScreenIcon = 'assets/images/controllers/exit_screen.jpg';

  private selectedIcon = -1;

  constructor(private slideshowService: SlideshowService,
              private router: Router) { }

  ngOnInit() {
    /* TO BE MOVED TO WRAPPER CLASS FOR NATURE */
    this.slideshowService.setImageType(this.slideshowService.IMAGE_TYPE_NATURE);
    /* END of TO BE MOVED TO WRAPPER CLASS FOR NATURE */    
    
    this.slideshowService.setCurrentController(this);
    this.slideshowService.setFitInWindow(true);
    this.slideshowService.setAutoPlay(false);
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.keyCode === KEY_CODE.X_KEY) {
      this.executeItem(this.EXIT_SCREEN);
    }
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.executeItem(this.NEXT_IMAGE);
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) { 
      this.executeItem(this.PREVIOUS_IMAGE);
    }
  }

  executeItem(n: number) {
    console.log('Execute item ' + n);
    switch (n) {
      case this.PREVIOUS_IMAGE: {
        if (this.slideshowService.doAutoPlay()) {
          this.slideshowService.setAutoPlay(false);
        }
        this.slideshowService.gotoPreviousImage();
        break;
      }
      case this.START_STOP_PLAY: {
        this.slideshowService.toggleAutoPlay()
        break;
      }
      case this.NEXT_IMAGE: {
        if (this.slideshowService.doAutoPlay()) {
          this.slideshowService.setAutoPlay(false);
        }
        this.slideshowService.gotoNextImage();
        break;
      }
      case this.EXIT_SCREEN: {
        this.router.navigate(['/home']);
        break;
      }
    }

    this.updateControllerIconNames();

  }  

  updateImageInfo(s: string) {
    this.imageInfo = s;
  }

  updateControllerIconNames() {
     // start by setting all inactive
    this.previousImageIcon = 'assets/images/controllers/previous_image.jpg';    
    if  (!this.slideshowService.doAutoPlay()) {
      this.playImageIcon = 'assets/images/controllers/start_auto.jpg';
    }
    else {
      this.playImageIcon = 'assets/images/controllers/stop_auto.jpg';
    }
    this.nextImageIcon = 'assets/images/controllers/next_image.jpg';    
    this.exitScreenIcon = 'assets/images/controllers/exit_screen.jpg';    
    
    // replace icon name of the one that is active - if anyone is.
    switch (this.selectedIcon) {
      case this.PREVIOUS_IMAGE:
          this.previousImageIcon = 'assets/images/controllers/previous_image_selected.jpg'; 
          break;
      case this.START_STOP_PLAY:
          if  (!this.slideshowService.doAutoPlay()) {
            this.playImageIcon = 'assets/images/controllers/start_auto_selected.jpg';
          }
          else {
            this.playImageIcon = 'assets/images/controllers/stop_auto_selected.jpg';
          }
          break;             
      case this.NEXT_IMAGE:
          this.nextImageIcon = 'assets/images/controllers/next_image_selected.jpg'; 
          break;    
      case this.EXIT_SCREEN:
          this.exitScreenIcon = 'assets/images/controllers/exit_screen_selected.jpg'; 
          break;    
    }
  }
  enterItem(n: number) {
    this.selectedIcon = n;
    this.updateControllerIconNames();
  }
  leaveItem(n: number) {
    this.selectedIcon = -1;
    this.updateControllerIconNames();
  }
}
