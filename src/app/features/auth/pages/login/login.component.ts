import { Component, inject, OnInit } from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";

import { CreateUserDialogComponent } from "../../components/create-user-dialog/create-user-dialog.component";
import { AuthService } from "../../services/auth.service";
import { AuthState } from "../../state/auth.state";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly authState = inject(AuthState);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);

    loginForm!: FormGroup;
    isLoading = this.authState.isLoading;

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ["", [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const email = this.loginForm.get("email")?.value;

        this.authService.checkUser(email).subscribe((response) => {
            if (response.exists) {
                this.router.navigate(["/tasks"]);
            } else {
                this.openCreateUserDialog(email);
            }
        });
    }

    private openCreateUserDialog(email: string): void {
        const dialogRef = this.dialog.open(CreateUserDialogComponent, {
            width: "400px",
            data: { email },
            disableClose: false
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.authService.createUser(email).subscribe(() => {
                    this.router.navigate(["/tasks"]);
                });
            }
        });
    }

    get emailControl() {
        return this.loginForm.get("email");
    }
}
