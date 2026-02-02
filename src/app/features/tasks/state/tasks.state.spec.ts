import { Task } from "../models/task.model";
import { TasksState } from "./tasks.state";

describe("TasksState", () => {
    let state: TasksState;

    const mockTasks: Task[] = [
        {
            id: "1",
            title: "Task 1",
            description: "Description 1",
            completed: false,
            createdAt: new Date("2024-01-01"),
            userId: "user1"
        },
        {
            id: "2",
            title: "Task 2",
            description: "Description 2",
            completed: true,
            createdAt: new Date("2024-01-02"),
            userId: "user1"
        },
        {
            id: "3",
            title: "Task 3",
            description: "Description 3",
            completed: false,
            createdAt: new Date("2024-01-03"),
            userId: "user1"
        }
    ];

    beforeEach(() => {
        state = new TasksState();
    });

    describe("initial state", () => {
        it("should have empty tasks array", () => {
            expect(state.tasks()).toEqual([]);
        });

        it("should have isLoading as false", () => {
            expect(state.isLoading()).toBeFalse();
        });

        it("should have error as null", () => {
            expect(state.error()).toBeNull();
        });

        it("should have taskCount as 0", () => {
            expect(state.taskCount()).toBe(0);
        });
    });

    describe("setTasks", () => {
        it("should set tasks correctly", () => {
            state.setTasks(mockTasks);
            expect(state.tasks()).toEqual(mockTasks);
        });

        it("should update taskCount", () => {
            state.setTasks(mockTasks);
            expect(state.taskCount()).toBe(3);
        });
    });

    describe("addTask", () => {
        it("should add a new task to the list", () => {
            const newTask: Task = {
                id: "4",
                title: "New Task",
                description: "New Description",
                completed: false,
                createdAt: new Date(),
                userId: "user1"
            };

            state.addTask(newTask);
            expect(state.tasks()).toContain(newTask);
            expect(state.taskCount()).toBe(1);
        });

        it("should append task to existing tasks", () => {
            state.setTasks(mockTasks);
            const newTask: Task = {
                id: "4",
                title: "New Task",
                description: "New Description",
                completed: false,
                createdAt: new Date(),
                userId: "user1"
            };

            state.addTask(newTask);
            expect(state.taskCount()).toBe(4);
        });
    });

    describe("updateTask", () => {
        it("should update an existing task", () => {
            state.setTasks(mockTasks);
            const updatedTask: Task = {
                ...mockTasks[0],
                title: "Updated Title",
                completed: true
            };

            state.updateTask(updatedTask);

            const task = state.tasks().find((t) => t.id === "1");
            expect(task?.title).toBe("Updated Title");
            expect(task?.completed).toBeTrue();
        });

        it("should not affect other tasks", () => {
            state.setTasks(mockTasks);
            const updatedTask: Task = {
                ...mockTasks[0],
                title: "Updated Title"
            };

            state.updateTask(updatedTask);

            const otherTask = state.tasks().find((t) => t.id === "2");
            expect(otherTask?.title).toBe("Task 2");
        });

        it("should maintain the same number of tasks", () => {
            state.setTasks(mockTasks);
            const updatedTask: Task = {
                ...mockTasks[0],
                title: "Updated Title"
            };

            state.updateTask(updatedTask);
            expect(state.taskCount()).toBe(3);
        });
    });

    describe("removeTask", () => {
        beforeEach(() => {
            state.setTasks(mockTasks);
        });

        it("should remove a task by id", () => {
            state.removeTask("1");

            const task = state.tasks().find((t) => t.id === "1");
            expect(task).toBeUndefined();
        });

        it("should decrease taskCount", () => {
            state.removeTask("1");
            expect(state.taskCount()).toBe(2);
        });

        it("should not affect other tasks", () => {
            state.removeTask("1");

            const task2 = state.tasks().find((t) => t.id === "2");
            const task3 = state.tasks().find((t) => t.id === "3");
            expect(task2).toBeDefined();
            expect(task3).toBeDefined();
        });
    });

    describe("pendingTasks", () => {
        it("should return all tasks sorted by createdAt descending", () => {
            state.setTasks(mockTasks);

            const pending = state.pendingTasks();
            expect(pending[0].id).toBe("3");
            expect(pending[1].id).toBe("2");
            expect(pending[2].id).toBe("1");
        });
    });

    describe("completedTasks", () => {
        it("should return only completed tasks", () => {
            state.setTasks(mockTasks);

            const completed = state.completedTasks();
            expect(completed.length).toBe(1);
            expect(completed[0].id).toBe("2");
            expect(completed[0].completed).toBeTrue();
        });

        it("should return empty array when no completed tasks", () => {
            const incompleteTasks = mockTasks.map((t) => ({ ...t, completed: false }));
            state.setTasks(incompleteTasks);

            expect(state.completedTasks().length).toBe(0);
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
});
