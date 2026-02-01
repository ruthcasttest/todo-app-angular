import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthService } from "../../features/auth/application/services/auth.service";
import { AuthState } from "../../features/auth/application/state/auth.state";

export const authGuard: CanActivateFn = () => {
    inject(AuthService); // Forzar inicialización del servicio
    const authState = inject(AuthState);
    const router = inject(Router);

    if (authState.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(["/login"]);
};

export const noAuthGuard: CanActivateFn = () => {
    inject(AuthService); // Forzar inicialización del servicio
    const authState = inject(AuthState);
    const router = inject(Router);

    if (!authState.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(["/tasks"]);
};
