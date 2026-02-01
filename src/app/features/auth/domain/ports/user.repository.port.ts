import { Observable } from "rxjs";

import { CheckUserResponse, CreateUserRequest, User } from "../models/user.model";

export abstract class UserRepositoryPort {
    abstract checkUserExists(email: string): Observable<CheckUserResponse>;
    abstract createUser(request: CreateUserRequest): Observable<User>;
}
