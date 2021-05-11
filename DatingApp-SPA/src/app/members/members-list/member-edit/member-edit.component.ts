import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AlertifyService } from '../../../_services/alertify.service';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})

export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: false }) editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  user: User;
  photoUrl: string;

  constructor(private route: ActivatedRoute, private alertifyService: AlertifyService,
    private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => {
        this.photoUrl = photoUrl;
      }
    )
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
      (next) => {
        this.alertifyService.success('Profile updated');
        this.editForm.reset(this.user);
      },
      (error) => {
        this.alertifyService.error(error);
      }
    )
  }

  updateMainPhoto(photoUrl: any) {
    this.user.photoUrl = photoUrl;
  }
}
