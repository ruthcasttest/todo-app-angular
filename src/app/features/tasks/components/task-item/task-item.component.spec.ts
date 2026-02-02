import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";

import { Task } from "../../models/task.model";
import { TaskItemComponent } from "./task-item.component";

describe("TaskItemComponent", () => {
    let component: TaskItemComponent;
    let fixture: ComponentFixture<TaskItemComponent>;
    let dialogMock: jasmine.SpyObj<MatDialog>;

    const mockTask: Task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        completed: false,
        createdAt: new Date("2024-01-15"),
        userId: "user1"
    };

    const mockCompletedTask: Task = {
        ...mockTask,
        completed: true
    };

    beforeEach(async () => {
        dialogMock = jasmine.createSpyObj("MatDialog", ["open"]);

        await TestBed.configureTestingModule({
            imports: [TaskItemComponent, NoopAnimationsModule],
            providers: [
                { provide: MatDialog, useValue: dialogMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskItemComponent);
        component = fixture.componentInstance;
        component.task = mockTask;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("display", () => {
        it("should display task title", () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("Test Task");
        });

        it("should display task description", () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain("Test Description");
        });
    });

    describe("onToggleComplete", () => {
        it("should emit false directly when task is already completed", () => {
            component.task = mockCompletedTask;
            spyOn(component.toggleComplete, "emit");

            const event = new MouseEvent("click");
            component.onToggleComplete(event);

            expect(component.toggleComplete.emit).toHaveBeenCalledWith(false);
            expect(dialogMock.open).not.toHaveBeenCalled();
        });

        it("should open confirmation dialog when completing task", () => {
            const dialogRefMock = {
                afterClosed: () => of(false)
            } as MatDialogRef<any>;
            dialogMock.open.and.returnValue(dialogRefMock);

            const event = new MouseEvent("click");
            component.onToggleComplete(event);

            expect(dialogMock.open).toHaveBeenCalled();
        });

        it("should emit true when user confirms completion", () => {
            const dialogRefMock = {
                afterClosed: () => of(true)
            } as MatDialogRef<any>;
            dialogMock.open.and.returnValue(dialogRefMock);
            spyOn(component.toggleComplete, "emit");

            const event = new MouseEvent("click");
            component.onToggleComplete(event);

            expect(component.toggleComplete.emit).toHaveBeenCalledWith(true);
        });

        it("should not emit when user cancels completion", () => {
            const dialogRefMock = {
                afterClosed: () => of(false)
            } as MatDialogRef<any>;
            dialogMock.open.and.returnValue(dialogRefMock);
            spyOn(component.toggleComplete, "emit");

            const event = new MouseEvent("click");
            component.onToggleComplete(event);

            expect(component.toggleComplete.emit).not.toHaveBeenCalled();
        });

        it("should prevent default event behavior", () => {
            const dialogRefMock = {
                afterClosed: () => of(false)
            } as MatDialogRef<any>;
            dialogMock.open.and.returnValue(dialogRefMock);

            const event = new MouseEvent("click");
            spyOn(event, "preventDefault");
            component.onToggleComplete(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe("onEdit", () => {
        it("should emit edit event", () => {
            spyOn(component.edit, "emit");

            component.onEdit();

            expect(component.edit.emit).toHaveBeenCalled();
        });
    });

    describe("onDelete", () => {
        it("should emit delete event", () => {
            spyOn(component.delete, "emit");

            component.onDelete();

            expect(component.delete.emit).toHaveBeenCalled();
        });
    });

    describe("completed state styling", () => {
        it("should have completed class when task is completed", () => {
            component.task = mockCompletedTask;
            fixture.detectChanges();

            const card = fixture.nativeElement.querySelector(".task-card");
            expect(card.classList.contains("completed")).toBeTrue();
        });

        it("should not have completed class when task is pending", () => {
            component.task = mockTask;
            fixture.detectChanges();

            const card = fixture.nativeElement.querySelector(".task-card");
            expect(card.classList.contains("completed")).toBeFalse();
        });
    });

    describe("status badge", () => {
        it("should show 'Completada' badge when task is completed", () => {
            component.task = mockCompletedTask;
            fixture.detectChanges();

            const badge = fixture.nativeElement.querySelector(".status-badge");
            expect(badge.textContent).toContain("Completada");
        });

        it("should show 'Pendiente' badge when task is pending", () => {
            component.task = mockTask;
            fixture.detectChanges();

            const badge = fixture.nativeElement.querySelector(".status-badge");
            expect(badge.textContent).toContain("Pendiente");
        });
    });
});
