import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { ConfirmDialogComponent, ConfirmDialogData } from "./confirm-dialog.component";

describe("ConfirmDialogComponent", () => {
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let dialogRefMock: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

    const mockData: ConfirmDialogData = {
        title: "Test Title",
        message: "Test Message",
        confirmText: "Yes",
        cancelText: "No"
    };

    beforeEach(async () => {
        dialogRefMock = jasmine.createSpyObj("MatDialogRef", ["close"]);

        await TestBed.configureTestingModule({
            imports: [ConfirmDialogComponent, NoopAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefMock },
                { provide: MAT_DIALOG_DATA, useValue: mockData }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("display", () => {
        it("should display the title", () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("Test Title");
        });

        it("should display the message", () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("Test Message");
        });

        it("should display custom confirm text", () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("Yes");
        });

        it("should display custom cancel text", () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("No");
        });
    });

    describe("default texts", () => {
        beforeEach(async () => {
            const dataWithDefaults: ConfirmDialogData = {
                title: "Title",
                message: "Message"
            };

            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [ConfirmDialogComponent, NoopAnimationsModule],
                providers: [
                    { provide: MatDialogRef, useValue: dialogRefMock },
                    { provide: MAT_DIALOG_DATA, useValue: dataWithDefaults }
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(ConfirmDialogComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it("should display default confirm text when not provided", () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("Confirmar");
        });

        it("should display default cancel text when not provided", () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("Cancelar");
        });
    });

    describe("onConfirm", () => {
        it("should close dialog with true", () => {
            component.onConfirm();
            expect(dialogRefMock.close).toHaveBeenCalledWith(true);
        });
    });

    describe("onCancel", () => {
        it("should close dialog with false", () => {
            component.onCancel();
            expect(dialogRefMock.close).toHaveBeenCalledWith(false);
        });
    });

    describe("data injection", () => {
        it("should have access to dialog data", () => {
            expect(component.data).toEqual(mockData);
        });

        it("should have access to dialogRef", () => {
            expect(component.dialogRef).toBeDefined();
        });
    });
});
