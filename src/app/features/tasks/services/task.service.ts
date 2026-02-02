import { inject, Injectable } from "@angular/core";
import {
    catchError, EMPTY, finalize, Observable, tap
} from "rxjs";

import { AuthState } from "../../auth/state/auth.state";
import { CreateTaskRequest, Task, UpdateTaskRequest } from "../models/task.model";
import { TasksState } from "../state/tasks.state";
import { TaskApiService } from "./task-api.service";

@Injectable({ providedIn: "root" })
export class TaskService {
    private readonly taskApiService = inject(TaskApiService);
    private readonly tasksState = inject(TasksState);
    private readonly authState = inject(AuthState);

    loadTasks(): Observable<Task[]> {
        const userId = this.authState.userId();
        if (!userId) {
            return EMPTY;
        }

        this.tasksState.setLoading(true);
        this.tasksState.setError(null);

        return this.taskApiService.getTasks(userId).pipe(
            tap((tasks) => this.tasksState.setTasks(tasks)),
            finalize(() => this.tasksState.setLoading(false)),
            catchError(() => {
                this.tasksState.setError("Error loading tasks");
                return EMPTY;
            })
        );
    }

    createTask(title: string, description: string): Observable<Task> {
        const userId = this.authState.userId();
        if (!userId) {
            return EMPTY;
        }

        const request: CreateTaskRequest = { title, description, userId };

        this.tasksState.setLoading(true);
        this.tasksState.setError(null);

        return this.taskApiService.createTask(request).pipe(
            tap((task) => this.tasksState.addTask(task)),
            finalize(() => this.tasksState.setLoading(false)),
            catchError(() => {
                this.tasksState.setError("Error creating task");
                return EMPTY;
            })
        );
    }

    updateTask(request: UpdateTaskRequest): Observable<Task> {
        this.tasksState.setLoading(true);
        this.tasksState.setError(null);

        return this.taskApiService.updateTask(request).pipe(
            tap((task) => this.tasksState.updateTask(task)),
            finalize(() => this.tasksState.setLoading(false)),
            catchError(() => {
                this.tasksState.setError("Error updating task");
                return EMPTY;
            })
        );
    }

    toggleTaskCompletion(taskId: string, completed: boolean): Observable<Task> {
        return this.updateTask({ id: taskId, completed });
    }

    deleteTask(taskId: string): Observable<void> {
        this.tasksState.setLoading(true);
        this.tasksState.setError(null);

        return this.taskApiService.deleteTask(taskId).pipe(
            tap(() => this.tasksState.removeTask(taskId)),
            finalize(() => this.tasksState.setLoading(false)),
            catchError(() => {
                this.tasksState.setError("Error deleting task");
                return EMPTY;
            })
        );
    }
}
