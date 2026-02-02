import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { of } from "rxjs";

import { AuthService } from "../../services/auth.service";
import { AuthState } from "../../state/auth.state";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceMock: jasmine.SpyObj<AuthService>;
    let authStateMock: Partial<AuthState>;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        authServiceMock = jasmine.createSpyObj("AuthService", ["checkUser", "createUser"]);
        authStateMock = {
            isLoading: signal(false)
        };
        routerMock = jasmine.createSpyObj("Router", ["navigate"]);

        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule, NoopAnimationsModule, MatDialogModule],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: AuthState, useValue: authStateMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("form initialization", () => {
        it("should create login form on init", () => {
            expect(component.loginForm).toBeDefined();
        });

        it("should have email control", () => {
            expect(component.emailControl).toBeDefined();
        });

        it("should have email control with empty initial value", () => {
            expect(component.emailControl?.value).toBe("");
        });
    });

    describe("form validation", () => {
        it("should be invalid when email is empty", () => {
            component.emailControl?.setValue("");
            expect(component.loginForm.invalid).toBeTrue();
        });

        it("should be invalid when email format is incorrect", () => {
            component.emailControl?.setValue("invalid-email");
            expect(component.emailControl?.hasError("email")).toBeTrue();
        });

        it("should be valid with correct email format", () => {
            component.emailControl?.setValue("test@example.com");
            expect(component.loginForm.valid).toBeTrue();
        });

        it("should have required error when email is empty", () => {
            component.emailControl?.setValue("");
            component.emailControl?.markAsTouched();
            expect(component.emailControl?.hasError("required")).toBeTrue();
        });
    });

    describe("onSubmit", () => {
        it("should not call authService when form is invalid", () => {
            component.emailControl?.setValue("");
            component.onSubmit();

            expect(authServiceMock.checkUser).not.toHaveBeenCalled();
        });

        it("should mark form as touched when invalid", () => {
            component.emailControl?.setValue("");
            component.onSubmit();

            expect(component.emailControl?.touched).toBeTrue();
        });

        it("should call checkUser when form is valid", () => {
            authServiceMock.checkUser.and.returnValue(of({ exists: true, userId: "123" }));
            component.emailControl?.setValue("test@example.com");

            component.onSubmit();

            expect(authServiceMock.checkUser).toHaveBeenCalledWith("test@example.com");
        });

        it("should navigate to tasks when user exists", () => {
            authServiceMock.checkUser.and.returnValue(of({ exists: true, userId: "123" }));
            component.emailControl?.setValue("test@example.com");

            component.onSubmit();

            expect(routerMock.navigate).toHaveBeenCalledWith(["/tasks"]);
        });
    });

    describe("isLoading", () => {
        it("should reflect auth state loading", () => {
            expect(component.isLoading()).toBeFalse();
        });
    });

    describe("emailControl getter", () => {
        it("should return the email form control", () => {
            const control = component.emailControl;
            expect(control).toBe(component.loginForm.get("email"));
        });
    });
});
