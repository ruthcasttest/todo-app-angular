import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { AuthService } from "../../../features/auth/services/auth.service";
import { AuthState } from "../../../features/auth/state/auth.state";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let authServiceMock: jasmine.SpyObj<AuthService>;
    let authStateMock: Partial<AuthState>;

    beforeEach(async () => {
        authServiceMock = jasmine.createSpyObj("AuthService", ["logout"]);
        authStateMock = {
            isAuthenticated: signal(false),
            userEmail: signal("")
        };

        await TestBed.configureTestingModule({
            imports: [HeaderComponent, NoopAnimationsModule],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: AuthState, useValue: authStateMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("display", () => {
        it("should display app title", () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("Task Manager");
        });

        it("should not display user email when not authenticated", () => {
            const compiled = fixture.nativeElement;
            const userEmail = compiled.querySelector(".user-email");
            expect(userEmail).toBeFalsy();
        });

        it("should display user email when authenticated", () => {
            (authStateMock.isAuthenticated as any).set(true);
            (authStateMock.userEmail as any).set("test@example.com");
            fixture.detectChanges();

            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("test@example.com");
        });

        it("should not display logout button when not authenticated", () => {
            const compiled = fixture.nativeElement;
            const logoutButton = compiled.querySelector("button[aria-label=\"Logout\"]");
            expect(logoutButton).toBeFalsy();
        });

        it("should display logout button when authenticated", () => {
            (authStateMock.isAuthenticated as any).set(true);
            fixture.detectChanges();

            const compiled = fixture.nativeElement;
            const logoutButton = compiled.querySelector("button[aria-label=\"Logout\"]");
            expect(logoutButton).toBeTruthy();
        });
    });

    describe("onLogout", () => {
        it("should call authService.logout", () => {
            component.onLogout();
            expect(authServiceMock.logout).toHaveBeenCalled();
        });
    });

    describe("signals", () => {
        it("should reflect isAuthenticated from authState", () => {
            expect(component.isAuthenticated()).toBeFalse();

            (authStateMock.isAuthenticated as any).set(true);
            expect(component.isAuthenticated()).toBeTrue();
        });

        it("should reflect userEmail from authState", () => {
            expect(component.userEmail()).toBe("");

            (authStateMock.userEmail as any).set("new@example.com");
            expect(component.userEmail()).toBe("new@example.com");
        });
    });
});
