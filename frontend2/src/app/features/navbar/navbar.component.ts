import {Component, EventEmitter, HostBinding, OnDestroy, OnInit, Output} from '@angular/core';
import {SidenavService} from '../sidenav/sidenav.service';
import {AuthService} from '../auth/auth.service';
import {NavbarService} from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(public sidenavService: SidenavService,
              public authService: AuthService,
              public navbarService: NavbarService) { }
  visibility = {
    test: 'off'
  };
  // add class "static" to the component if the NavbarService is set to static
  @HostBinding('class.static') static: boolean;
  @Output() navToggle = new EventEmitter<boolean>();
  public navbarSubscriptionRef;
  toggleVisibility(service) {
    if (this.visibility[service] === 'off') {
      this.visibility[service] = 'on';
    } else {
      this.visibility[service] = 'off';
    }
  }
  toggleSidenav() {
    return this.sidenavService.toggle();
  }
  ngOnInit() {
    this.navbarSubscriptionRef = this.navbarService.static.subscribe(res => {
      this.static = res;
    });
  }
  ngOnDestroy() {
    this.navbarSubscriptionRef.unsubscribe();
  }

}
