import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(public authService: AuthService, private alertifyService: AlertifyService,
    private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => {
        this.photoUrl = photoUrl;
      }
    )
  }

  login() {
    this.authService.login(this.model).subscribe(
      (response) => {
        this.alertifyService.success('Logged in successfully');
        this.router.navigate(['/members']);
      }, (error) => {
        this.alertifyService.error(error);
      }
    )
  }

  loggedIn() {
    return this.authService.loggedIn();
    // An alternate way to check token without Auth0 service
    // const token = localStorage.getItem('token');
    // return !!token;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertifyService.success('Logged out successfully');
    this.router.navigate(['/home']);
  }

}
