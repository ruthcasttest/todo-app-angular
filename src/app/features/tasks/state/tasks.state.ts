import { computed, Injectable, signal } from "@angular/core";

import { Task } from "../models/task.model";

@Injectable({ providedIn: "root" })
export class TasksState {
    private readonly _tasks = signal<Task[]>([]);
    private readonly _isLoading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    readonly tasks = this._tasks.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly error = this._error.asReadonly();

    readonly pendingTasks = computed(() => [...this._tasks()]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    readonly completedTasks = computed(() => this._tasks().filter((task) => task.completed));

    readonly taskCount = computed(() => this._tasks().length);

    setTasks(tasks: Task[]): void {
        this._tasks.set(tasks);
    }

    addTask(task: Task): void {
        this._tasks.update((tasks) => [...tasks, task]);
    }

    updateTask(updatedTask: Task): void {
        this._tasks.update((tasks) => tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    }

    removeTask(taskId: string): void {
        this._tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
    }

    setLoading(loading: boolean): void {
        this._isLoading.set(loading);
    }

    setError(error: string | null): void {
        this._error.set(error);
    }
}
