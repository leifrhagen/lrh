import { Component, OnInit, ViewChild } from '@angular/core';
import { SlideshowService } from '../../services/slideshow.service';

@Component({
  selector: 'fullscreenintroduction',
  templateUrl: './fullscreenintroduction.component.html',
  styleUrls: ['./fullscreenintroduction.component.css']
})



export class FullscreenIntroductionComponent implements OnInit {
  constructor(private slideshowService: SlideshowService) { }

  ngOnInit() {
    this.slideshowService.setImageType(this.slideshowService.IMAGE_TYPE_INTRO);
    this.slideshowService.setFullPage(true);
  }

}
