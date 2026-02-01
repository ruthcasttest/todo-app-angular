import { Observable } from "rxjs";

import { CreateTaskRequest, Task, UpdateTaskRequest } from "../models/task.model";

export abstract class TaskRepositoryPort {
    abstract getTasks(userId: string): Observable<Task[]>;
    abstract createTask(request: CreateTaskRequest): Observable<Task>;
    abstract updateTask(request: UpdateTaskRequest): Observable<Task>;
    abstract deleteTask(taskId: string): Observable<void>;
}
