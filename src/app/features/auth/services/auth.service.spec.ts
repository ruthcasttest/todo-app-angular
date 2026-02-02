import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";

import { StorageService } from "../../../core/services/storage.service";
import { User } from "../models/user.model";
import { AuthState } from "../state/auth.state";
import { AuthService } from "./auth.service";
import { UserApiService } from "./user.service";

describe("AuthService", () => {
    let service: AuthService;
    let userApiServiceMock: jasmine.SpyObj<UserApiService>;
    let authStateMock: jasmine.SpyObj<AuthState>;
    let storageMock: jasmine.SpyObj<StorageService>;
    let routerMock: jasmine.SpyObj<Router>;

    const mockUser: User = {
        id: "user1",
        email: "test@example.com",
        createdAt: new Date()
    };

    beforeEach(() => {
        userApiServiceMock = jasmine.createSpyObj("UserApiService", ["checkUserExists", "createUser"]);
        authStateMock = jasmine.createSpyObj("AuthState", ["setUser", "setLoading", "setError", "clearState"]);
        storageMock = jasmine.createSpyObj("StorageService", ["get", "set", "remove"]);
        routerMock = jasmine.createSpyObj("Router", ["navigate"]);

        storageMock.get.and.returnValue(null);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: UserApiService, useValue: userApiServiceMock },
                { provide: AuthState, useValue: authStateMock },
                { provide: StorageService, useValue: storageMock },
                { provide: Router, useValue: routerMock }
            ]
        });

        service = TestBed.inject(AuthService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("constructor", () => {
        it("should load user from storage on init", () => {
            storageMock.get.and.returnValue(mockUser);

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    AuthService,
                    { provide: UserApiService, useValue: userApiServiceMock },
                    { provide: AuthState, useValue: authStateMock },
                    { provide: StorageService, useValue: storageMock },
                    { provide: Router, useValue: routerMock }
                ]
            });

            TestBed.inject(AuthService);
            expect(authStateMock.setUser).toHaveBeenCalledWith(mockUser);
        });

        it("should not set user if no stored user", () => {
            storageMock.get.and.returnValue(null);
            authStateMock.setUser.calls.reset();

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    AuthService,
                    { provide: UserApiService, useValue: userApiServiceMock },
                    { provide: AuthState, useValue: authStateMock },
                    { provide: StorageService, useValue: storageMock },
                    { provide: Router, useValue: routerMock }
                ]
            });

            TestBed.inject(AuthService);
            expect(authStateMock.setUser).not.toHaveBeenCalled();
        });
    });

    describe("checkUser", () => {
        it("should set loading and clear error on start", () => {
            userApiServiceMock.checkUserExists.and.returnValue(of({ exists: false }));

            service.checkUser("test@example.com").subscribe();

            expect(authStateMock.setLoading).toHaveBeenCalledWith(true);
            expect(authStateMock.setError).toHaveBeenCalledWith(null);
        });

        it("should set user when user exists", (done) => {
            const response = { exists: true, user: mockUser };
            userApiServiceMock.checkUserExists.and.returnValue(of(response));

            service.checkUser("test@example.com").subscribe(() => {
                expect(authStateMock.setUser).toHaveBeenCalledWith(mockUser);
                expect(storageMock.set).toHaveBeenCalledWith("currentUser", mockUser);
                done();
            });
        });

        it("should not set user when user does not exist", (done) => {
            const response = { exists: false };
            userApiServiceMock.checkUserExists.and.returnValue(of(response));
            authStateMock.setUser.calls.reset();

            service.checkUser("test@example.com").subscribe(() => {
                expect(authStateMock.setUser).not.toHaveBeenCalled();
                done();
            });
        });

        it("should set loading to false after completion", () => {
            userApiServiceMock.checkUserExists.and.returnValue(of({ exists: false }));

            service.checkUser("test@example.com").subscribe();

            expect(authStateMock.setLoading).toHaveBeenCalledWith(false);
        });

        it("should handle error", () => {
            userApiServiceMock.checkUserExists.and.returnValue(throwError(() => new Error("API Error")));

            service.checkUser("test@example.com").subscribe();

            expect(authStateMock.setError).toHaveBeenCalledWith("Error checking user. Please try again.");
        });
    });

    describe("createUser", () => {
        it("should set loading and clear error on start", () => {
            userApiServiceMock.createUser.and.returnValue(of(mockUser));

            service.createUser("test@example.com").subscribe();

            expect(authStateMock.setLoading).toHaveBeenCalledWith(true);
            expect(authStateMock.setError).toHaveBeenCalledWith(null);
        });

        it("should set user on success", (done) => {
            userApiServiceMock.createUser.and.returnValue(of(mockUser));

            service.createUser("test@example.com").subscribe(() => {
                expect(authStateMock.setUser).toHaveBeenCalledWith(mockUser);
                expect(storageMock.set).toHaveBeenCalledWith("currentUser", mockUser);
                done();
            });
        });

        it("should call API with correct request", () => {
            userApiServiceMock.createUser.and.returnValue(of(mockUser));

            service.createUser("test@example.com").subscribe();

            expect(userApiServiceMock.createUser).toHaveBeenCalledWith({ email: "test@example.com" });
        });

        it("should handle error", () => {
            userApiServiceMock.createUser.and.returnValue(throwError(() => new Error("API Error")));

            service.createUser("test@example.com").subscribe();

            expect(authStateMock.setError).toHaveBeenCalledWith("Error creating user. Please try again.");
        });
    });

    describe("logout", () => {
        it("should clear auth state", () => {
            service.logout();
            expect(authStateMock.clearState).toHaveBeenCalled();
        });

        it("should remove user from storage", () => {
            service.logout();
            expect(storageMock.remove).toHaveBeenCalledWith("currentUser");
        });

        it("should navigate to login", () => {
            service.logout();
            expect(routerMock.navigate).toHaveBeenCalledWith(["/login"]);
        });
    });
});
