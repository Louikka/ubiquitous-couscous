import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  public logIn(username: string, password: string)
  {
    //
  }

  public logOut()
  {
    //
  }

  public isLoggedIn(): boolean
  {
    return true;
  }
}
