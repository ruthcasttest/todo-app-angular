import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";

import { AuthService } from "../../../features/auth/services/auth.service";
import { AuthState } from "../../../features/auth/state/auth.state";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule],
    template: `
        <mat-toolbar color="primary">
            <span class="title">Task Manager</span>
            <span class="spacer"></span>
            @if (isAuthenticated()) {
                <span class="user-email">{{ userEmail() }}</span>
                <button mat-icon-button (click)="onLogout()" aria-label="Logout">
                    <mat-icon>logout</mat-icon>
                </button>
            }
        </mat-toolbar>
    `,
    styles: [`
        .title {
            font-size: 20px;
            font-weight: 500;
        }

        .spacer {
            flex: 1 1 auto;
        }

        .user-email {
            margin-right: 16px;
            font-size: 14px;
        }
    `]
})
export class HeaderComponent {
    private readonly authService = inject(AuthService);
    private readonly authState = inject(AuthState);

    readonly isAuthenticated = this.authState.isAuthenticated;
    readonly userEmail = this.authState.userEmail;

    onLogout(): void {
        this.authService.logout();
    }
}
