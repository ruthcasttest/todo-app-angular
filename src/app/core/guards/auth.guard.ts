import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthState } from "../../features/auth/application/state/auth.state";

export const authGuard: CanActivateFn = () => {
    const authState = inject(AuthState);
    const router = inject(Router);

    if (authState.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(["/login"]);
};

export const noAuthGuard: CanActivateFn = () => {
    const authState = inject(AuthState);
    const router = inject(Router);

    if (!authState.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(["/tasks"]);
};
