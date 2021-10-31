import { Component } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';

interface Link {
  title: string;
  route: string;
}

@Component({
  selector: 'ce-currency-exchange-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public links: Link[] = [
    { title: 'Currency converter', route: '/conversion' },
    { title: 'View conversion history', route: '/conversion-history' },
  ];

  public activeLink$ = this.router.events.pipe(
    filter((evt) => evt instanceof NavigationStart),
    map((evt) => (evt as NavigationStart).url),
    shareReplay({ bufferSize: 1, refCount: true }),
    distinctUntilChanged()
  );

  constructor(private router: Router, private route: ActivatedRoute) {}

  public navigate(link: Link) {
    this.router.navigate([link.route]);
  }
}
