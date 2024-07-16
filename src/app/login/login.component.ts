import { HttpClient, HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { catchError, tap, throwError } from 'rxjs';
import { DialogComponent } from './dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emaill: string = '';
  passwordd: string = '';
  error: string = '';

  constructor(private ngZone: NgZone, private dataService: DataService, private userService: UserService, private http: HttpClient, private router: Router, private dialog: MatDialog) {

  }

  openDialog(message: string) {
    this.dialog.open(DialogComponent, {
      data: { message: message },
      width: '425px',
      height: '300px'
    });
  }

  onLogin() {
    const email = this.emaill;
    const password = this.passwordd;

    this.dataService.login(email, password, "login").pipe(
      tap((event: HttpResponse<any>) => {
        if (event.type === HttpEventType.Response) {
          const response = event as HttpResponse<any>;
          if (response.body.status.remarks === 'success') {
            this.userService.setUserId(response.body.payload);
            this.ngZone.run(() => {
              this.router.navigate(['/landing-page']);
            });
          } else {
            this.openDialog("Email or password is incorrect. Please try again");
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error here
        // For example, open a dialog or log the error
        this.openDialog("Email or password is incorrect. Please try again");
        // Return an observable with a user-facing error message
        return throwError(() => new Error('Something bad happened; please try again later.'));
      })
    ).subscribe();
  }


}
