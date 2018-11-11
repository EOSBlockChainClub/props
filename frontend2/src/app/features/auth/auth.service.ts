import {Injectable} from '@angular/core';
import {filter} from 'rxjs/internal/operators';
import {BehaviorSubject} from 'rxjs/index';

export class User {

}

@Injectable()
export class AuthService {
  loggedIn = false;

  currentUser: User = new User();
  private _profile: BehaviorSubject<any> = new BehaviorSubject(undefined);
  public profile;
  public readonly profile$ = this._profile.asObservable().pipe(filter(res => !!res));

  constructor() {
  }
}
