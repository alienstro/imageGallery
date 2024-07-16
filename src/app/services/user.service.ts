import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId!: number | null;
  private isLoggedIn: boolean = false;

  setUserId(userId: number): void {
    this.userId = userId;
    localStorage.setItem('userId', userId.toString());
    this.isLoggedIn = true;
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    if (userId !== null) {
      return Number(userId);
    } else {
      return null;
    }
  }

  getLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  logout(): void {
    this.userId = null;
    localStorage.removeItem('userId');
    this.isLoggedIn = false;
  }
}