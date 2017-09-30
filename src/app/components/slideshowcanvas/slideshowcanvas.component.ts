import {Component, HostBinding, HostListener, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { WindowService } from '../../services/window.service';
import { SlideshowService } from '../../services/slideshow.service';

@Component({
    selector: 'slideshowcanvas',
    templateUrl: './slideshowcanvas.component.html',
    styleUrls: ['./slideshowcanvas.component.css']
})
export class SlideshowCanvasComponent implements OnInit, OnDestroy {
    constructor(private windowService: WindowService, 
                private slideshowService: SlideshowService,
                private router: Router) {
    }

    private readonly startImageInterval = 3000;
    private readonly intermediateImageInterval = 3000;
    private readonly transitionInterval = 1;

    private imageIntervalTimer;
    private imageIntervalSubscription: Subscription;


    private transitionTicks = 0;
    private imageTransitionTimer;
    private imageTransitionSubscription: Subscription;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private logoImage;
    private displayedImage;
    private fadeInImage;

                                 // Mapped directly to canvas size in HTML
    public canvasHeight = 2000;  // Keep canvas as small as possible for performance reasons
    public canvasWidth  = 2000;  // ...as drawing the same shape is slower at a large canvase than a small one
                                 // but not too small as increasing size causes image to be redrawn from white...

    public intervalTimerCount = 0;
    public transitionTimerCount = 0;    
    
    private myObjectId = -1;


    @ViewChild('canvasContainer') canvasContainer; 


    // this is to ensure the image is preloaded in
    // time for when the image src is changed such that
    // a flicker effect won't happen
    downloadImage(url,  fn) {
        if (url) {
            var img = new Image();
            img.onload = () => {
                setTimeout(fn, 300);
            };
            img.src = url;
            return img;
        }
        else {
            console.log('downloadImage called with undefined url');
        }
        return null;
    }


    navigateToMenu() {
      // console.log('NOW NAVIGATE BY CODE TO HOME');
      this.router.navigate(['/home']);
    }

    doClick() {
        if (this.slideshowService.isFullPage()) {
          this.navigateToMenu();
        }
    }
    redrawAfterResize() {
       if (this.displayedImage)
          console.log('Redraw after resize - image wxh = ' + this.displayedImage.width + 'x' + this.displayedImage.height + 
                     ' canvas wxh = ' + this.canvasWidth + 'x' + this.canvasHeight);
       else
          console.log('Redraw after resize - NO IMAGe ' +
                      ' canvas wxh = ' + this.canvasWidth + 'x' + this.canvasHeight);

       this.stopTransitionTimer();
       this.stopIntervalTimer();
       if (this.displayedImage) {
         // Drawing directly did for some reason not work - start a transition but do not fade via white as 
         // displayed and fade in image probably are equal...
         /*
         this.slideshowService.setFadeMethod (this.slideshowService.FADE_IMMEDIATE);
         this.startTransition();
         */
        this.ctx.fillStyle = "#ffffff";
        this.ctx.globalAlpha = 1;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawImage(this.displayedImage, 1);
        this.drawLogo();
       }
       this.startIntervalTimer();       
    }

    ngOnInit() {
        // console.log("NGONINIT for slideshoW at URL " + this.router.url);
        this.myObjectId = this.slideshowService.getNextSlideshowObjectId();
        this.slideshowService.setCurrentDisplayer(this);
        if (this.slideshowService.isFullPage()) {
            // Restart at first image when started as full page - otherwise will 
            // we soon go back to home screen
            // console.log('restart current image no at 1');
            this.slideshowService.setStartImageNo(1);
        }
  
        this.startIntervalTimer();

        this.canvas = <HTMLCanvasElement>document.getElementById('slideshowcanvas');
        this.ctx = this.canvas.getContext("2d");

        this.logoImage = this.downloadImage(this.slideshowService.getLogoImageName(), null);    
        this.displayedImage = this.downloadImage(this.slideshowService.getDisplayedImageName() , () => {
            this.drawImage(this.displayedImage, 1);  
            this.drawLogo();;    
        });
        
        this.windowService.height$.subscribe((value:any) => {
            let newDisplayableHeight = value;
            if (this.canvasContainer.nativeElement.offsetTop) {
                newDisplayableHeight -= this.canvasContainer.nativeElement.offsetTop; 
            }
            if (this.canvasContainer.nativeElement.offsetBottom) {
                newDisplayableHeight -= this.canvasContainer.nativeElement.offsetBottom; 
            }   
            if (newDisplayableHeight < 2000) // I am sure there is a library for this
              this.canvasHeight = 2000;                     
            else
              this.canvasHeight = newDisplayableHeight;            
            this.slideshowService.setCanvasHeight(newDisplayableHeight);
            this.redrawAfterResize();
        });
        this.windowService.width$.subscribe((value:any) => {
            let newDisplayableWidth = value;
            if (this.canvasContainer.nativeElement.offsetLeft) {
                newDisplayableWidth -= this.canvasContainer.nativeElement.offsetLeft; 
            }
            if (this.canvasContainer.nativeElement.offsetRight) {
                newDisplayableWidth -= this.canvasContainer.nativeElement.offsetRight; 
            }      
            if (newDisplayableWidth < 2000) // I am sure there is a library for this
                this.canvasWidth = 2000;                     
              else
                this.canvasWidth = newDisplayableWidth;                           
            this.slideshowService.setCanvasWidth(newDisplayableWidth);
            this.redrawAfterResize();
        });
    }

    drawLogo() {
        if (this.logoImage && this.ctx && this.slideshowService.isFullPage()) {
          this.ctx.globalAlpha = 0.3;
          let scale = 0.33;
          if (this.logoImage.height*scale > 0.1*this.slideshowService.getCanvasHeight()) {
              scale = (0.1*this.slideshowService.getCanvasHeight())/this.logoImage.height;
          }
          this.ctx.drawImage(this.logoImage, 10, 20, this.logoImage.width*scale, this.logoImage.height*scale); 
        }
    }
    drawImage(image, alpha) {
        /*
        if (image === this.currentImage) {
            console.log('DRAW CURRENT IMAGE' + this.currentImageName + ' with Alpha ' + alpha );
        }
        else {
            console.log('DRAW NEXT IMAGE' + this.nextImageName + ' with Alpha ' + alpha ); 
        }
        */
        // console.log('DRAW IMAGE');
        let x = 0;
        let y = 0;
        let iwScaled = 0;
        let ihScaled = 0;
        const iw = image.width;
        const ih = image.height;

        if (this.slideshowService.doFitInWindow()) {
            // scale so all of image is shown in available space
            const wScale = this.slideshowService.getCanvasWidth() / iw;
            const hScale = this.slideshowService.getCanvasHeight() / ih;
            // console.log('drawImage w-h = ' + iw + '-' + ih +', canvas w-h'+ this.slideshowService.getCanvasWidth() + '-' + this.slideshowService.getCanvasHeight());
            // console.log('drawImage wScale = ' + wScale + ', hScale '+ hScale);
            let scale = 1;

            if (wScale < hScale) {
                scale = wScale;
                y = (this.slideshowService.getCanvasHeight() - (ih * scale))/2;
                // console.log('Crop width, start x = ' + x);
            }
            else {
                scale = hScale;
                x = (this.slideshowService.getCanvasWidth() - (iw * scale))/2;                
                // console.log('Crop height, start y = ' + y);
            }
            iwScaled = iw * scale;
            ihScaled = ih * scale;
        }
        else {
            // Scale so smallest matches window size and "crop" the image equal amount in both edges in the other direction            
            const wScale = this.slideshowService.getCanvasWidth() / iw;
            const hScale = this.slideshowService.getCanvasHeight() / ih;
            // console.log('drawImage w-h = ' + iw + '-' + ih +', canvas w-h'+ this.slideshowService.getCanvasWidth() + '-' + this.slideshowService.getCanvasHeight());
            // console.log('drawImage wScale = ' + wScale + ', hScale '+ hScale);
            let scale = 1;

            if (wScale < hScale) {
                scale = hScale;
                x = (this.slideshowService.getCanvasWidth() - (iw * scale))/2;
                // console.log('Crop width, start x = ' + x);
            }
            else {
                scale = wScale;
                y = (this.slideshowService.getCanvasHeight() - (ih * scale))/2;
                // console.log('Crop height, start y = ' + y);
            }
            iwScaled = iw * scale;
            ihScaled = ih * scale;
        }
        this.ctx.globalAlpha = alpha;
        this.ctx.drawImage(image, x, y, iwScaled, ihScaled);
        // console.log('DRAWN IMAGE x = ' + x + ', y = ' + y+ ', iwScaled = ' + iwScaled+ ', ihScaled = ' + ihScaled);        
    }
    startIntervalTimer() {
        this.stopIntervalTimer(); // In case out of sync...        
        // DO NOT ALWAYS SUCCEED in killing all timers
        // do not start unless this canvas is the current one :-o
        if (this.myObjectId < this.slideshowService.getCurrentSlideshowObjectId()) {
            return;
        }
        if (this.slideshowService.doAutoPlay()) {
            console.log('');
            console.log('startIntervalTimer ' +  this.myObjectId + ': no of previous timers = ' + this.intervalTimerCount + ' - ' + this.slideshowService.toString());
            if (this.slideshowService.isFullPage() && this.slideshowService.lastImageIsDisplayed()) {
                this.navigateToMenu();
            }
            else {        
                if (!this.imageIntervalTimer) {
                    this.imageIntervalTimer = Observable.timer(this.startImageInterval, this.intermediateImageInterval); 
                }
                this.intervalTimerCount += 1;
                this.imageIntervalSubscription = this.imageIntervalTimer.subscribe(t => this.slideshowService.fadeInNextImage()); 
            } 
        }
    } 
    stopIntervalTimer() {
        if (this.imageIntervalSubscription && this.intervalTimerCount > 0) {
            console.log('stopIntervalTimer ' +  this.myObjectId + ': no of timers = ' + this.intervalTimerCount + '- ' + this.slideshowService.toString());;  
            this.intervalTimerCount -= 1;                      
            this.imageIntervalSubscription.unsubscribe();
        }
    } 
    startTransitionTimer() {
        this.stopIntervalTimer(); // out of sync...
        this.stopTransitionTimer(); // out of sync...     
        // DO NOT ALWAYS SUCCEED in killing all timers
        // do not start unless this canvas is the current one :-o
        if (this.myObjectId < this.slideshowService.getCurrentSlideshowObjectId()) {
            return;
        }                
        console.log('startTransitionTimer ' +  this.myObjectId + ': no of previous timers = ' + this.transitionTimerCount + ' - ' + this.slideshowService.toString());;            
        // console.log("startTransitionTimer");
        this.transitionTicks = 0;
        if (!this.imageTransitionTimer) {
          this.imageTransitionTimer = Observable.timer(this.transitionInterval, this.transitionInterval); 
        }
        this.transitionTimerCount += 1;           
        this.imageTransitionSubscription = this.imageTransitionTimer.subscribe(t => this.handleTransition()); 
    }   
    stopTransitionTimer(){ 
        // console.log("stopTransitionTimer");
        if (this.imageTransitionSubscription && this.transitionTimerCount > 0) {
            console.log('stopTransitionTimer ' +  this.myObjectId + ': no of timers = ' + this.transitionTimerCount + ' - ' + this.slideshowService.toString());
            this.transitionTimerCount -= 1;               
            this.imageTransitionSubscription.unsubscribe();
        }
    } 
    handleTransition(){
        this.slideshowService.updateImageInfo();
        // console.log("Inside handleTransition");
        // Draw current image
        this.drawImage(this.displayedImage, 1);

        this.transitionTicks = this.transitionTicks+1;

        // Fade current image out to white at the same time as fading in new image
        // Looks a lot better than just fading inn new!
        let nextWhitoutAlpha = this.transitionTicks*0.015;
        if (nextWhitoutAlpha > 1) {
            nextWhitoutAlpha = 1; 
        }        
        this.ctx.fillStyle = "#ffffff";
        this.ctx.globalAlpha = nextWhitoutAlpha;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // And draw in new image
        let step = 0.015;
        let nextImageAlpha = this.transitionTicks*step;
        if (nextImageAlpha > 1) {
            nextImageAlpha = 1;
        }        
        this.drawImage(this.fadeInImage, nextImageAlpha);
        
        this.drawLogo();

        if (nextImageAlpha === 1) {
            // console.log("Stop subscription handleTransition");
            // Transition completed, stop fast timer and start slow (which will be ignored unless auto play) 
            this.stopTransitionTimer();
            this.displayedImage = this.fadeInImage;
            this.slideshowService.setInTransition(false);
            this.startIntervalTimer();
        } 
        
    }

    ngOnDestroy(){
        // console.log("Destroy timers");

        this.stopIntervalTimer();
        this.stopTransitionTimer();
        
        this.imageIntervalTimer = null;
        this.imageTransitionTimer = null;
    } 

    /*
     * Callbacks from service
     */ 
    startTransition() {
        console.log('startTransition - ' + this.slideshowService.toString());
        this.fadeInImage = this.downloadImage(this.slideshowService.getFadeInImageName() , null);
        this.startTransitionTimer();
    }
    stopAutoPlay() {
        // console.log('STOP autoplay now');        
        // Stop the INTERVAL timer - let the transisiton finish if it is running.
        // It will not start interval timer when it is done
        // (as long as autoplay is inactive)        
        this.stopIntervalTimer();    
    }
}
