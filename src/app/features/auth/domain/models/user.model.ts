export interface User {
    id: string;
    email: string;
    createdAt: Date;
}

export interface CreateUserRequest {
    email: string;
}

export interface CheckUserResponse {
    exists: boolean;
    user?: User;
}
