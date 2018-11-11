
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';


import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthUserService {
  constructor(private http: HttpClient) {}
  private get(endpoint, params?) {
    return this.http.get<any>(`user/${endpoint}`, { params: params });
  }
  private post(endpoint, data = {}) {
    return this.http.post<any>(`user/${endpoint}`, data);
  }
  private put(endpoint, data = {}) {
    return this.http.put<any>(`user/${endpoint}`, data);
  }
  private delete(endpoint) {
    return this.http.delete<any>(`user/${endpoint}`);
  }
}
