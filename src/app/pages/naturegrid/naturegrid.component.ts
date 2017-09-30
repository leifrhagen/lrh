import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlideshowService } from '../../services/slideshow.service';

@Component({
  selector: 'naturegrid',
  templateUrl: './naturegrid.component.html',
  styleUrls: ['./naturegrid.component.css']
})
export class NaturegridComponent implements OnInit {

  constructor(private slideshowService: SlideshowService,
              private router: Router) { }

  ngOnInit() {
  }

  imageSelected(n: number) {
    this.slideshowService.setAutoPlay(false);
    this.slideshowService.setStartImageNo(n);
    this.router.navigate(['/controllable']);
  }

}
