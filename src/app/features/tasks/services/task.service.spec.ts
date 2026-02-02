import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";

import { AuthState } from "../../auth/state/auth.state";
import { Task } from "../models/task.model";
import { TasksState } from "../state/tasks.state";
import { TaskService } from "./task.service";
import { TaskApiService } from "./task-api.service";

describe("TaskService", () => {
    let service: TaskService;
    let taskApiServiceMock: jasmine.SpyObj<TaskApiService>;
    let tasksStateMock: jasmine.SpyObj<TasksState>;
    let userIdSignal: ReturnType<typeof signal<string | null>>;

    const mockTask: Task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        completed: false,
        createdAt: new Date(),
        userId: "user1"
    };

    const mockTasks: Task[] = [mockTask];

    beforeEach(() => {
        taskApiServiceMock = jasmine.createSpyObj("TaskApiService", [
            "getTasks",
            "createTask",
            "updateTask",
            "deleteTask"
        ]);

        tasksStateMock = jasmine.createSpyObj("TasksState", [
            "setTasks",
            "addTask",
            "updateTask",
            "removeTask",
            "setLoading",
            "setError"
        ]);

        userIdSignal = signal<string | null>("user1");

        const authStateMock = {
            userId: userIdSignal
        };

        TestBed.configureTestingModule({
            providers: [
                TaskService,
                { provide: TaskApiService, useValue: taskApiServiceMock },
                { provide: TasksState, useValue: tasksStateMock },
                { provide: AuthState, useValue: authStateMock }
            ]
        });

        service = TestBed.inject(TaskService);
    });

    describe("loadTasks", () => {
        it("should load tasks and update state", (done) => {
            taskApiServiceMock.getTasks.and.returnValue(of(mockTasks));

            service.loadTasks().subscribe({
                next: (tasks) => {
                    expect(tasks).toEqual(mockTasks);
                    expect(tasksStateMock.setLoading).toHaveBeenCalledWith(true);
                    expect(tasksStateMock.setError).toHaveBeenCalledWith(null);
                    expect(tasksStateMock.setTasks).toHaveBeenCalledWith(mockTasks);
                    done();
                }
            });
        });

        it("should set loading to false after completion", () => {
            taskApiServiceMock.getTasks.and.returnValue(of(mockTasks));

            service.loadTasks().subscribe();

            expect(tasksStateMock.setLoading).toHaveBeenCalledWith(true);
            expect(tasksStateMock.setLoading).toHaveBeenCalledWith(false);
        });

        it("should handle error and set error state", () => {
            taskApiServiceMock.getTasks.and.returnValue(throwError(() => new Error("API Error")));

            service.loadTasks().subscribe();

            expect(tasksStateMock.setError).toHaveBeenCalledWith("Error loading tasks");
            expect(tasksStateMock.setLoading).toHaveBeenCalledWith(false);
        });

        it("should return EMPTY if no userId", (done) => {
            userIdSignal.set(null);

            let emitted = false;
            service.loadTasks().subscribe({
                next: () => {
                    emitted = true;
                },
                complete: () => {
                    expect(emitted).toBeFalse();
                    expect(taskApiServiceMock.getTasks).not.toHaveBeenCalled();
                    done();
                }
            });
        });
    });

    describe("createTask", () => {
        it("should create task and add to state", (done) => {
            taskApiServiceMock.createTask.and.returnValue(of(mockTask));

            service.createTask("Test Task", "Test Description").subscribe({
                next: (task) => {
                    expect(task).toEqual(mockTask);
                    expect(tasksStateMock.addTask).toHaveBeenCalledWith(mockTask);
                    done();
                }
            });
        });

        it("should set loading states correctly", () => {
            taskApiServiceMock.createTask.and.returnValue(of(mockTask));

            service.createTask("Test Task", "Test Description").subscribe();

            expect(tasksStateMock.setLoading).toHaveBeenCalledWith(true);
            expect(tasksStateMock.setLoading).toHaveBeenCalledWith(false);
        });

        it("should handle error when creating task", () => {
            taskApiServiceMock.createTask.and.returnValue(throwError(() => new Error("API Error")));

            service.createTask("Test Task", "Test Description").subscribe();

            expect(tasksStateMock.setError).toHaveBeenCalledWith("Error creating task");
        });

        it("should return EMPTY if no userId", (done) => {
            userIdSignal.set(null);

            let emitted = false;
            service.createTask("Test", "Description").subscribe({
                next: () => {
                    emitted = true;
                },
                complete: () => {
                    expect(emitted).toBeFalse();
                    expect(taskApiServiceMock.createTask).not.toHaveBeenCalled();
                    done();
                }
            });
        });
    });

    describe("updateTask", () => {
        const updatedTask: Task = { ...mockTask, title: "Updated Title" };

        it("should update task and update state", (done) => {
            taskApiServiceMock.updateTask.and.returnValue(of(updatedTask));

            service.updateTask({ id: "1", title: "Updated Title" }).subscribe({
                next: (task) => {
                    expect(task).toEqual(updatedTask);
                    expect(tasksStateMock.updateTask).toHaveBeenCalledWith(updatedTask);
                    done();
                }
            });
        });

        it("should handle error when updating task", () => {
            taskApiServiceMock.updateTask.and.returnValue(throwError(() => new Error("API Error")));

            service.updateTask({ id: "1", title: "Updated Title" }).subscribe();

            expect(tasksStateMock.setError).toHaveBeenCalledWith("Error updating task");
        });
    });

    describe("toggleTaskCompletion", () => {
        it("should call updateTask with completed status", (done) => {
            const completedTask: Task = { ...mockTask, completed: true };
            taskApiServiceMock.updateTask.and.returnValue(of(completedTask));

            service.toggleTaskCompletion("1", true).subscribe({
                next: (task) => {
                    expect(task.completed).toBeTrue();
                    expect(taskApiServiceMock.updateTask).toHaveBeenCalledWith({
                        id: "1",
                        completed: true
                    });
                    done();
                }
            });
        });
    });

    describe("deleteTask", () => {
        it("should delete task and remove from state", () => {
            taskApiServiceMock.deleteTask.and.returnValue(of(void 0));

            service.deleteTask("1").subscribe();

            expect(tasksStateMock.removeTask).toHaveBeenCalledWith("1");
            expect(tasksStateMock.setLoading).toHaveBeenCalledWith(false);
        });

        it("should handle error when deleting task", () => {
            taskApiServiceMock.deleteTask.and.returnValue(throwError(() => new Error("API Error")));

            service.deleteTask("1").subscribe();

            expect(tasksStateMock.setError).toHaveBeenCalledWith("Error deleting task");
        });
    });
});
