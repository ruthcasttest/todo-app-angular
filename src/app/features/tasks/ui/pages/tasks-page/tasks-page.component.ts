import { Component, inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { ConfirmDialogComponent } from "../../../../../shared/components/confirm-dialog/confirm-dialog.component";
import { HeaderComponent } from "../../../../../shared/components/header/header.component";
import { TaskService } from "../../../application/services/task.service";
import { TasksState } from "../../../application/state/tasks.state";
import { Task } from "../../../domain/models/task.model";
import { TaskFormComponent, TaskFormData } from "../../components/task-form/task-form.component";
import { TaskListComponent } from "../../components/task-list/task-list.component";
import {
    TaskEditDialogComponent,
    TaskEditDialogResult
} from "../../components/task-edit-dialog/task-edit-dialog.component";

@Component({
    selector: "app-tasks-page",
    standalone: true,
    imports: [
        HeaderComponent,
        TaskFormComponent,
        TaskListComponent,
        MatProgressSpinnerModule
    ],
    templateUrl: "./tasks-page.component.html",
    styleUrl: "./tasks-page.component.scss"
})
export class TasksPageComponent implements OnInit {
    private readonly taskService = inject(TaskService);
    private readonly tasksState = inject(TasksState);
    private readonly dialog = inject(MatDialog);

    readonly pendingTasks = this.tasksState.pendingTasks;
    readonly isLoading = this.tasksState.isLoading;

    ngOnInit(): void {
        this.taskService.loadTasks().subscribe();
    }

    onTaskSubmit(formData: TaskFormData): void {
        this.taskService.createTask(formData.title, formData.description).subscribe();
    }

    onToggleComplete(event: { taskId: string; completed: boolean }): void {
        this.taskService.toggleTaskCompletion(event.taskId, event.completed).subscribe();
    }

    onEditTask(task: Task): void {
        const dialogRef = this.dialog.open(TaskEditDialogComponent, {
            width: "500px",
            data: { task }
        });

        dialogRef.afterClosed().subscribe((result: TaskEditDialogResult) => {
            if (result) {
                this.taskService.updateTask({
                    id: task.id,
                    title: result.title,
                    description: result.description
                }).subscribe();
            }
        });
    }

    onDeleteTask(taskId: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "400px",
            data: {
                title: "Eliminar Tarea",
                message: "¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.",
                confirmText: "Eliminar",
                cancelText: "Cancelar"
            }
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.taskService.deleteTask(taskId).subscribe();
            }
        });
    }
}
