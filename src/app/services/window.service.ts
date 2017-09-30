import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class WindowService {
    height$: Observable<number>;
    width$: Observable<number>;

    

    constructor() {
        let windowSize$ = new BehaviorSubject(getWindowSize());

        this.height$ = (windowSize$.pluck('height') as Observable<number>).distinctUntilChanged();
        this.width$ = (windowSize$.pluck('width') as Observable<number>).distinctUntilChanged();

        Observable.fromEvent(window, 'resize')
            .map(getWindowSize)
            .subscribe(windowSize$);
    }  

}


function getWindowSize() {
    return {
        height: window.innerHeight, 
        width: window.innerWidth
    };

};