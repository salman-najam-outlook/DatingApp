import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';

@Injectable({
    providedIn: 'root'
})

export class MemberDetailResolver implements Resolve<User> {
    constructor(private userService: UserService, private alertifyservice: AlertifyService,
        private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(+route.params['id']).pipe(
            catchError(error => {
                this.alertifyservice.error('An error occured with retrieving data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }
}