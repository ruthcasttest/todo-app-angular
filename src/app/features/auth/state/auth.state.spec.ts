import { User } from "../models/user.model";
import { AuthState } from "./auth.state";

describe("AuthState", () => {
    let state: AuthState;

    const mockUser: User = {
        id: "user1",
        email: "test@example.com",
        createdAt: new Date()
    };

    beforeEach(() => {
        state = new AuthState();
    });

    describe("initial state", () => {
        it("should have null currentUser", () => {
            expect(state.currentUser()).toBeNull();
        });

        it("should have isAuthenticated as false", () => {
            expect(state.isAuthenticated()).toBeFalse();
        });

        it("should have isLoading as false", () => {
            expect(state.isLoading()).toBeFalse();
        });

        it("should have error as null", () => {
            expect(state.error()).toBeNull();
        });

        it("should have empty userEmail", () => {
            expect(state.userEmail()).toBe("");
        });

        it("should have null userId", () => {
            expect(state.userId()).toBeNull();
        });
    });

    describe("setUser", () => {
        it("should set the current user", () => {
            state.setUser(mockUser);
            expect(state.currentUser()).toEqual(mockUser);
        });

        it("should set isAuthenticated to true when user is set", () => {
            state.setUser(mockUser);
            expect(state.isAuthenticated()).toBeTrue();
        });

        it("should clear error when user is set", () => {
            state.setError("Some error");
            state.setUser(mockUser);
            expect(state.error()).toBeNull();
        });

        it("should set userEmail correctly", () => {
            state.setUser(mockUser);
            expect(state.userEmail()).toBe("test@example.com");
        });

        it("should set userId correctly", () => {
            state.setUser(mockUser);
            expect(state.userId()).toBe("user1");
        });

        it("should handle setting null user", () => {
            state.setUser(mockUser);
            state.setUser(null);
            expect(state.currentUser()).toBeNull();
            expect(state.isAuthenticated()).toBeFalse();
        });
    });

    describe("setLoading", () => {
        it("should set loading to true", () => {
            state.setLoading(true);
            expect(state.isLoading()).toBeTrue();
        });

        it("should set loading to false", () => {
            state.setLoading(true);
            state.setLoading(false);
            expect(state.isLoading()).toBeFalse();
        });
    });

    describe("setError", () => {
        it("should set error message", () => {
            state.setError("Test error");
            expect(state.error()).toBe("Test error");
        });

        it("should clear error when set to null", () => {
            state.setError("Test error");
            state.setError(null);
            expect(state.error()).toBeNull();
        });
    });

    describe("clearState", () => {
        it("should clear current user", () => {
            state.setUser(mockUser);
            state.clearState();
            expect(state.currentUser()).toBeNull();
        });

        it("should set isAuthenticated to false", () => {
            state.setUser(mockUser);
            state.clearState();
            expect(state.isAuthenticated()).toBeFalse();
        });

        it("should set loading to false", () => {
            state.setLoading(true);
            state.clearState();
            expect(state.isLoading()).toBeFalse();
        });

        it("should clear error", () => {
            state.setError("Test error");
            state.clearState();
            expect(state.error()).toBeNull();
        });
    });
});
