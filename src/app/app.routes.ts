import { Routes } from "@angular/router";

import { authGuard, noAuthGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "login",
        loadComponent: () => import("./features/auth/ui/pages/login/login.component")
            .then((m) => m.LoginComponent),
        canActivate: [noAuthGuard]
    },
    {
        path: "tasks",
        loadComponent: () => import("./features/tasks/ui/pages/tasks-page/tasks-page.component")
            .then((m) => m.TasksPageComponent),
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "/login"
    }
];
