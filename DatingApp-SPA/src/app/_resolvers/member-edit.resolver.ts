import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class MemberEditResolver implements Resolve<User> {
    constructor(private userService: UserService, private alertifyservice: AlertifyService,
        private authService: AuthService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertifyservice.error('An error occured with retrieving your data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}