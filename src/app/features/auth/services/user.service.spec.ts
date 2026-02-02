import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { environment } from "../../../../environments/environment";
import { User } from "../models/user.model";
import { UserApiService } from "./user.service";

describe("UserApiService", () => {
    let service: UserApiService;
    let httpMock: HttpTestingController;

    const mockUser: User = {
        id: "user1",
        email: "test@example.com",
        createdAt: new Date()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserApiService]
        });

        service = TestBed.inject(UserApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("checkUserExists", () => {
        it("should return user exists response", () => {
            const email = "test@example.com";
            const mockResponse = { exists: true, user: mockUser };

            service.checkUserExists(email).subscribe((response) => {
                expect(response.exists).toBeTrue();
                expect(response.user).toEqual(mockUser);
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/users/check?email=${email}`);
            expect(req.request.method).toBe("GET");
            req.flush(mockResponse);
        });

        it("should return user not exists response", () => {
            const email = "notfound@example.com";
            const mockResponse = { exists: false };

            service.checkUserExists(email).subscribe((response) => {
                expect(response.exists).toBeFalse();
                expect(response.user).toBeUndefined();
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/users/check?email=${email}`);
            expect(req.request.method).toBe("GET");
            req.flush(mockResponse);
        });

        it("should handle error response", () => {
            const email = "test@example.com";

            service.checkUserExists(email).subscribe({
                error: (error) => {
                    expect(error.status).toBe(500);
                }
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/users/check?email=${email}`);
            req.flush("Server error", { status: 500, statusText: "Internal Server Error" });
        });
    });

    describe("createUser", () => {
        it("should create user and return created user", () => {
            const request = { email: "test@example.com" };

            service.createUser(request).subscribe((user) => {
                expect(user).toEqual(mockUser);
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/users`);
            expect(req.request.method).toBe("POST");
            expect(req.request.body).toEqual(request);
            req.flush(mockUser);
        });

        it("should handle error when creating user", () => {
            const request = { email: "test@example.com" };

            service.createUser(request).subscribe({
                error: (error) => {
                    expect(error.status).toBe(400);
                }
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/users`);
            req.flush("Bad request", { status: 400, statusText: "Bad Request" });
        });
    });
});
