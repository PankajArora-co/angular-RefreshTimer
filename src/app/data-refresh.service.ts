import { Injectable } from '@angular/core';
import { interval, Subject } from 'rxjs';

const CLOCK_INTERVAL = 1000;

@Injectable({
  providedIn: 'root'
})
export class DataRefreshService {
  clockReset: Subject<void> = new Subject();

  constructor() { }

  public getClockSource() {
    return interval(CLOCK_INTERVAL);
  }

  public resetClock() {
    this.clockReset.next();
  }
}
