import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, throwError } from "rxjs";

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(MatSnackBar);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = "An unexpected error occurred";

            if (error.error instanceof ErrorEvent) {
                errorMessage = error.error.message;
            } else {
                switch (error.status) {
                    case 0:
                        errorMessage = "Cannot connect to server. Please check your connection.";
                        break;
                    case 400:
                        errorMessage = error.error?.message || "Bad request";
                        break;
                    case 401:
                        errorMessage = "Unauthorized access";
                        break;
                    case 404:
                        errorMessage = "Resource not found";
                        break;
                    case 500:
                        errorMessage = "Server error. Please try again later.";
                        break;
                    default:
                        errorMessage = error.error?.message || errorMessage;
                }
            }

            snackBar.open(errorMessage, "Close", {
                duration: 5000,
                horizontalPosition: "center",
                verticalPosition: "bottom",
                panelClass: ["error-snackbar"]
            });

            return throwError(() => error);
        })
    );
};
