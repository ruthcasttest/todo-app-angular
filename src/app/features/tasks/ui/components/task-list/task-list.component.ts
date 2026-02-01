import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Task } from "../../../domain/models/task.model";
import { TaskItemComponent } from "../task-item/task-item.component";

@Component({
    selector: "app-task-list",
    standalone: true,
    imports: [TaskItemComponent],
    templateUrl: "./task-list.component.html",
    styleUrl: "./task-list.component.scss"
})
export class TaskListComponent {
    @Input({ required: true }) tasks: Task[] = [];
    @Output() toggleComplete = new EventEmitter<{ taskId: string; completed: boolean }>();
    @Output() editTask = new EventEmitter<Task>();
    @Output() deleteTask = new EventEmitter<string>();

    onToggleComplete(task: Task, completed: boolean): void {
        this.toggleComplete.emit({ taskId: task.id, completed });
    }

    onEditTask(task: Task): void {
        this.editTask.emit(task);
    }

    onDeleteTask(taskId: string): void {
        this.deleteTask.emit(taskId);
    }

    trackByTaskId(_index: number, task: Task): string {
        return task.id;
    }
}
