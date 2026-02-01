import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { AuthState } from "../../features/auth/application/state/auth.state";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authState = inject(AuthState);
    const currentUser = authState.currentUser();

    if (currentUser) {
        const clonedReq = req.clone({
            setHeaders: {
                "X-User-Id": currentUser.id,
                "X-User-Email": currentUser.email
            }
        });
        return next(clonedReq);
    }

    return next(req);
};
