import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../../environments/environment";
import { CreateTaskRequest, Task, UpdateTaskRequest } from "../models/task.model";

@Injectable({ providedIn: "root" })
export class TaskApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/tasks`;

    getTasks(userId: string): Observable<Task[]> {
        return this.http.get<Task[]>(this.baseUrl, {
            params: { userId }
        });
    }

    createTask(request: CreateTaskRequest): Observable<Task> {
        return this.http.post<Task>(this.baseUrl, request);
    }

    updateTask(request: UpdateTaskRequest): Observable<Task> {
        return this.http.put<Task>(`${this.baseUrl}/${request.id}`, request);
    }

    deleteTask(taskId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${taskId}`);
    }
}
