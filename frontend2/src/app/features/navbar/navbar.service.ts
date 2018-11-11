import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';


@Injectable()
export class NavbarService {
  public static = new BehaviorSubject(true);
  constructor(private router: Router) {
    // router.events.distinctUntilChanged().filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
    // if (event.url === '/') {
    //   this.static.next(true);
    // } else {
    //   this.static.next(false);
    // }
    // });
  }
}
