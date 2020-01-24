import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Clock } from './clock.interface';
import { DataRefreshService } from './data-refresh.service';
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'refreshtimer';
  timer: Observable<number>;
  clock: Clock = {
    seconds: 0,
    minutes: 0,
    hours: 0
  };
  subscriptions = new Subscription();

  constructor(private refreshClockService: DataRefreshService) {
  }

  public showClock() {
    const digits = (value) => (value < 10 ? `0${value}` : value);
    const secs = digits(this.clock.seconds);
    const minutes = digits(this.clock.minutes);
    const hours = digits(this.clock.hours);

    return `Last refresh: ${hours}h ${minutes} min ${secs}s ago`;
  }

  public refresh() {
    this.refreshClockService.resetClock();
  }

  ngOnInit(): void {
    this.timer = this.refreshClockService.getClockSource();

    const timerSub = this.timer.subscribe(time => {
      if (time && !(time % 3600)) {
        this.clock.hours += 1;
        this.clock.minutes = 0;
        this.clock.seconds = 0;
      } else if (time && !(time % 60)) {
        this.clock.minutes += 1;
        this.clock.seconds = 0;
      } else {
        this.clock.seconds += 1;
      }
    });

    const resetSubscription = this.refreshClockService.clockReset.subscribe(() => {
      this.resetClock();
    });

    this.subscriptions.add(timerSub);
    this.subscriptions.add(resetSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private resetClock() {
    this.timer = this.refreshClockService.getClockSource();
    this.clock.hours = this.clock.minutes = this.clock.seconds = 0;
  }
}
