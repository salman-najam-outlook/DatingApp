import { Injectable } from "@angular/core";
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/members-list/member-edit/member-edit.component';
import { MemberListComponent } from '../members/members-list/member-list/member-list.component';

@Injectable({
    providedIn: 'root'
})

export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {
    canDeactivate(component: MemberEditComponent) {
        if (component.editForm.dirty) {
            return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
        }
        return true;
    }
}