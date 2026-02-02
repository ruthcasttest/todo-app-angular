import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../../environments/environment";
import { CheckUserResponse, CreateUserRequest, User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class UserApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/users`;

    checkUserExists(email: string): Observable<CheckUserResponse> {
        return this.http.get<CheckUserResponse>(`${this.baseUrl}/check`, {
            params: { email }
        });
    }

    createUser(request: CreateUserRequest): Observable<User> {
        return this.http.post<User>(this.baseUrl, request);
    }
}
