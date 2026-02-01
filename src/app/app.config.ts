import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { httpErrorInterceptor } from "./core/interceptors/http-error.interceptor";
import { UserApiRepository } from "./features/auth/infrastructure/adapters/user-api.repository";
import { UserRepositoryPort } from "./features/auth/domain/ports/user.repository.port";
import { TaskApiRepository } from "./features/tasks/infrastructure/adapters/task-api.repository";
import { TaskRepositoryPort } from "./features/tasks/domain/ports/task.repository.port";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor])),
        { provide: UserRepositoryPort, useClass: UserApiRepository },
        { provide: TaskRepositoryPort, useClass: TaskApiRepository }
    ]
};
