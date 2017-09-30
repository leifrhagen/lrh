import { Injectable } from '@angular/core';
import { SlideshowCanvasComponent } from '../components/slideshowcanvas/slideshowcanvas.component';
import { ControllableSlideshowComponent } from '../components/controllableslideshowcomponent/controllableslideshowcomponent.component';

@Injectable()
export class SlideshowService {
    private imageFolder = './assets/images/';

    public IMAGE_TYPE_INTRO      = 1;
    public IMAGE_TYPE_CONCEPTUAL = 2;  
    public IMAGE_TYPE_PEOPLE     = 3;         
    public IMAGE_TYPE_NATURE     = 4;  
    private currentImageType = this.IMAGE_TYPE_INTRO;

    /*
     * MAIN variables for current slideshow status.
     * displayedImageNo = the image that is 100% shown
     * fadeInImageNo = image that is not (yet) 100% opaquen
     * displayedImageNo = fadeInImageNo when no transition 
     * */
    private displayedImageNo = 1;
    private fadeInImageNo = 1;    

    private canvasWidth  = 1;
    private canvasHeight = 1;

    private fullPage = false;
    private fitInWindow = false;    
    private autoPlay = true;     

    private increasing = true;
    
    private inTransition = false;    
    private currentDisplayer: SlideshowCanvasComponent ;
    private currentController: ControllableSlideshowComponent ;

    private slideshowObjectId = 0;

    setCurrentDisplayer(currentDisplayer: SlideshowCanvasComponent) {
        this.currentDisplayer = currentDisplayer;
    }
    setCurrentController(currentController: ControllableSlideshowComponent) {
        this.currentController = currentController;
        this.updateImageInfo();
    }    

    setStartImageNo(n: number) {
        this.displayedImageNo = n;
        this.fadeInImageNo = n;        
    }
    lastImageIsDisplayed() {
        return this.displayedImageNo == this.getLastImageNo();
    }
    updateImageInfo() {
      if (this.currentController) {
        this.currentController.updateImageInfo(this.getImageTypeName() + ' ' + this.getFadeInImageNo()  + ' of ' + this. getLastImageNo());
      }
    }
    fadeInNextImage() {
        if (this.isInTransition()) {
            // End last transiton in order to update currently displayed image
            this.setInTransition(false);
        } 
        this.setInTransition(true);        
        this.fadeInImageNo = this.getNextFadeInImageNo();
        // console.log('CHANGED CURRENT IMAGE FROM ' + nOld + ' to ' + this.currentImageNo)
        if (this.currentDisplayer) {
            this.currentDisplayer.startTransition();
        }
        this.updateImageInfo();
    }
    gotoNextImage() {
        this.increasing = true;
        this.fadeInNextImage();
    }
    gotoPreviousImage() {
        this.increasing = false;
        this.fadeInNextImage(); 
    }   

    setInTransition(b: boolean) {
        if (!b && this.inTransition) {
            if (this.currentDisplayer) {
                this.currentDisplayer.stopTransitionTimer();
            }
        }
        this.inTransition = b;
        if (!this.inTransition) {
            this.displayedImageNo = this.fadeInImageNo;
        }
        this.updateImageInfo();
    }
    isInTransition(): boolean {
        return this.inTransition;
    }

    setFullPage(b: boolean) {
        this.fullPage = b;
    }
    isFullPage(): boolean {
        return this.fullPage;
    }

    setFitInWindow(b: boolean) {
        this.fitInWindow = b;
    }
    doFitInWindow(): boolean {
        return this.fitInWindow;
    }
    
    setAutoPlay(b: boolean) {
        this.autoPlay = b;
        if (this.currentDisplayer) {
            if (this.autoPlay) {
                this.increasing = true;
                this.fadeInNextImage();
            }
            else {
                this.currentDisplayer.stopAutoPlay();
            }
        }    
    }
    toggleAutoPlay() {
      this.setAutoPlay(!this.autoPlay);
    }
    doAutoPlay(): boolean {
        return this.autoPlay;
    }

    setImageType(n: number) {
        this.currentImageType = n;
    }
    getImageType(): number {
        return this.currentImageType;
    }

    setCanvasWidth(n: number) {
        this.canvasWidth = n;
    }
    getCanvasWidth(): number {
        return this.canvasWidth;
    }

    setCanvasHeight(n: number) {
        this.canvasHeight = n;
    }
    getCanvasHeight(): number {
        return this.canvasHeight;
    }

    getLastImageNo(): number {
        // HardCoded number of images in folders
        let lastImageNo = -1;        
        if (this.getImageType() === this.IMAGE_TYPE_INTRO) {
            lastImageNo = 8;
        }
        if (this.getImageType() === this.IMAGE_TYPE_NATURE) {
            lastImageNo = 13;
        }        
        return lastImageNo;
      } 

    getImageTypeName() {
        let name = '';
        switch (this.getImageType()) {
            case this.IMAGE_TYPE_INTRO: {
              name = 'Introduction';
              break;
            }
            case this.IMAGE_TYPE_CONCEPTUAL: {
                name = 'Conceptual';
                break;
            }
            case this.IMAGE_TYPE_PEOPLE: {
                name = 'People';
                break;
            }
            case this.IMAGE_TYPE_NATURE: {
                name = 'Nature';
                break;
            }            
          }
          return name;
    }
    getDisplayedImageNo(): number { 
        return this.displayedImageNo;
    }
    getFadeInImageNo(): number { 
        return this.fadeInImageNo;
    }

    getNextFadeInImageNo(): number { 
        if (this.increasing) {
            let n = this.displayedImageNo + 1;
            if (n > this.getLastImageNo()) {
            n = 1;
            }
            return n;
        }
        else {
            let n = this.displayedImageNo - 1;
            if (n < 1) {
              n = this.getLastImageNo();
            }
            return n;
        }
    }


    getLogoImageName(): String {
       return this.imageFolder + 'LOGO3.png';
    }

    private getImageTypeFolder() {
        let folder = '';

        if (this.getImageType() === this.IMAGE_TYPE_INTRO) {
            folder =  'introduction/';  
        }
        else if (this.getImageType() === this.IMAGE_TYPE_NATURE) {
            folder =  'nature/';  
        }   

        return folder;
    }
    private getImageOrientationFolder() {
        let folder = '';

        // currently only used for introduction
        if (this.getImageType() == this.IMAGE_TYPE_INTRO) {
            if (this.canvasHeight > this.canvasWidth) {
                return 'portrait/';
            }
            return 'landscape/';
        }

        return folder;
    }
    private getImageSizeFolder() {
        let folder = '';

        // To be implemented...

        return folder;
    }    
    getDisplayedImageName(): string  {
        const imageName = this.imageFolder +
                          this.getImageTypeFolder() +
                          this.getImageOrientationFolder() + 
                          this.getImageSizeFolder() + 
                           this.displayedImageNo + '.jpg';   
        //console.log('FOUND full file name as ' + imageName)                           ;
        return imageName;
     }
     getFadeInImageName(): string  {
        const imageName = this.imageFolder +
                          this.getImageTypeFolder() +
                          this.getImageOrientationFolder() + 
                          this.getImageSizeFolder() + 
                           this.fadeInImageNo + '.jpg';   
        //console.log('FOUND full file name as ' + imageName)                           ;
        return imageName;
     }  


     /**
      * Get a unique id for each slideshow instance
      */
     getNextSlideshowObjectId(): number {
         this.slideshowObjectId += 1;
         return this.slideshowObjectId;
     }
     getCurrentSlideshowObjectId(): number {
        return this.slideshowObjectId;
    }
     
     toString() {
         return 'displayed image ' +  this.getDisplayedImageName() + 
                 ", fade in image " + this.getFadeInImageName();
     }

}