import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type User = any;

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }
}
