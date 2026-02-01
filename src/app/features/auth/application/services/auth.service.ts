import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, finalize, Observable, tap } from "rxjs";

import { StorageService } from "../../../../core/services/storage.service";
import { CheckUserResponse, User } from "../../domain/models/user.model";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";
import { AuthState } from "../state/auth.state";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly userRepository = inject(UserRepositoryPort);
    private readonly authState = inject(AuthState);
    private readonly storage = inject(StorageService);
    private readonly router = inject(Router);

    private readonly USER_STORAGE_KEY = "currentUser";

    constructor() {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const storedUser = this.storage.get<User>(this.USER_STORAGE_KEY);
        if (storedUser) {
            this.authState.setUser(storedUser);
        }
    }

    checkUser(email: string): Observable<CheckUserResponse> {
        this.authState.setLoading(true);
        this.authState.setError(null);

        return this.userRepository.checkUserExists(email).pipe(
            tap(response => {
                if (response.exists && response.user) {
                    this.setAuthenticatedUser(response.user);
                }
            }),
            finalize(() => this.authState.setLoading(false)),
            catchError(() => {
                this.authState.setError("Error checking user. Please try again.");
                return EMPTY;
            })
        );
    }

    createUser(email: string): Observable<User> {
        this.authState.setLoading(true);
        this.authState.setError(null);

        return this.userRepository.createUser({ email }).pipe(
            tap(user => this.setAuthenticatedUser(user)),
            finalize(() => this.authState.setLoading(false)),
            catchError(() => {
                this.authState.setError("Error creating user. Please try again.");
                return EMPTY;
            })
        );
    }

    private setAuthenticatedUser(user: User): void {
        this.authState.setUser(user);
        this.storage.set(this.USER_STORAGE_KEY, user);
    }

    logout(): void {
        this.authState.clearState();
        this.storage.remove(this.USER_STORAGE_KEY);
        this.router.navigate(["/login"]);
    }
}
