import { computed, Injectable, signal } from "@angular/core";

import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthState {
    private readonly _currentUser = signal<User | null>(null);
    private readonly _isLoading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    readonly currentUser = this._currentUser.asReadonly();
    readonly isAuthenticated = computed(() => this._currentUser() !== null);
    readonly isLoading = this._isLoading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly userEmail = computed(() => this._currentUser()?.email ?? "");
    readonly userId = computed(() => this._currentUser()?.id ?? null);

    setUser(user: User | null): void {
        this._currentUser.set(user);
        this._error.set(null);
    }

    setLoading(loading: boolean): void {
        this._isLoading.set(loading);
    }

    setError(error: string | null): void {
        this._error.set(error);
    }

    clearState(): void {
        this._currentUser.set(null);
        this._isLoading.set(false);
        this._error.set(null);
    }
}
