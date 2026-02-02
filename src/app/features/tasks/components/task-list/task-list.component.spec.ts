import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { Task } from "../../models/task.model";
import { TaskListComponent } from "./task-list.component";

describe("TaskListComponent", () => {
    let component: TaskListComponent;
    let fixture: ComponentFixture<TaskListComponent>;

    const mockTasks: Task[] = [
        {
            id: "1",
            title: "Pending Task",
            description: "Pending Description",
            completed: false,
            createdAt: new Date(),
            userId: "user1"
        },
        {
            id: "2",
            title: "Completed Task",
            description: "Completed Description",
            completed: true,
            createdAt: new Date(),
            userId: "user1"
        },
        {
            id: "3",
            title: "Another Pending",
            description: "Another Description",
            completed: false,
            createdAt: new Date(),
            userId: "user1"
        }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaskListComponent, NoopAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskListComponent);
        component = fixture.componentInstance;
        component.tasks = mockTasks;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("initial state", () => {
        it("should have empty search term", () => {
            expect(component.searchTerm()).toBe("");
        });

        it("should have 'all' as active filter", () => {
            expect(component.activeFilter()).toBe("all");
        });
    });

    describe("task counts", () => {
        it("should count all tasks correctly", () => {
            expect(component.allCount()).toBe(3);
        });

        it("should count pending tasks correctly", () => {
            expect(component.pendingCount()).toBe(2);
        });

        it("should count completed tasks correctly", () => {
            expect(component.completedCount()).toBe(1);
        });
    });

    describe("filtering by status", () => {
        it("should show all tasks when filter is 'all'", () => {
            component.onTabChange(0);
            expect(component.filteredTasks().length).toBe(3);
        });

        it("should show only pending tasks when filter is 'pending'", () => {
            component.onTabChange(1);
            expect(component.filteredTasks().length).toBe(2);
            expect(component.filteredTasks().every(t => !t.completed)).toBeTrue();
        });

        it("should show only completed tasks when filter is 'completed'", () => {
            component.onTabChange(2);
            expect(component.filteredTasks().length).toBe(1);
            expect(component.filteredTasks().every(t => t.completed)).toBeTrue();
        });
    });

    describe("search functionality", () => {
        it("should filter tasks by title", () => {
            component.onSearchChange("Pending");
            expect(component.filteredTasks().length).toBe(2);
        });

        it("should filter tasks by description", () => {
            component.onSearchChange("Completed Description");
            expect(component.filteredTasks().length).toBe(1);
        });

        it("should be case insensitive", () => {
            component.onSearchChange("pending");
            expect(component.filteredTasks().length).toBe(2);
        });

        it("should return all tasks when search is empty", () => {
            component.onSearchChange("");
            expect(component.filteredTasks().length).toBe(3);
        });

        it("should return no tasks when search has no matches", () => {
            component.onSearchChange("xyz123");
            expect(component.filteredTasks().length).toBe(0);
        });

        it("should work with whitespace", () => {
            component.onSearchChange("  Pending  ");
            expect(component.filteredTasks().length).toBe(2);
        });
    });

    describe("combined filtering", () => {
        it("should apply both search and status filter", () => {
            component.onTabChange(1);
            component.onSearchChange("Another");
            expect(component.filteredTasks().length).toBe(1);
            expect(component.filteredTasks()[0].title).toBe("Another Pending");
        });

        it("should update counts when searching", () => {
            component.onSearchChange("Pending");
            expect(component.pendingCount()).toBe(2);
            expect(component.completedCount()).toBe(0);
        });
    });

    describe("event emitters", () => {
        it("should emit toggleComplete event", () => {
            spyOn(component.toggleComplete, "emit");
            const task = mockTasks[0];

            component.onToggleComplete(task, true);

            expect(component.toggleComplete.emit).toHaveBeenCalledWith({
                taskId: task.id,
                completed: true
            });
        });

        it("should emit editTask event", () => {
            spyOn(component.editTask, "emit");
            const task = mockTasks[0];

            component.onEditTask(task);

            expect(component.editTask.emit).toHaveBeenCalledWith(task);
        });

        it("should emit deleteTask event", () => {
            spyOn(component.deleteTask, "emit");

            component.onDeleteTask("1");

            expect(component.deleteTask.emit).toHaveBeenCalledWith("1");
        });
    });

    describe("trackByTaskId", () => {
        it("should return task id", () => {
            const task = mockTasks[0];
            expect(component.trackByTaskId(0, task)).toBe(task.id);
        });
    });

    describe("onTabChange", () => {
        it("should set filter to 'all' for index 0", () => {
            component.onTabChange(0);
            expect(component.activeFilter()).toBe("all");
        });

        it("should set filter to 'pending' for index 1", () => {
            component.onTabChange(1);
            expect(component.activeFilter()).toBe("pending");
        });

        it("should set filter to 'completed' for index 2", () => {
            component.onTabChange(2);
            expect(component.activeFilter()).toBe("completed");
        });
    });
});
