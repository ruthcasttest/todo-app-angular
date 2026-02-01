import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

import { Task } from "../../../domain/models/task.model";

@Component({
    selector: "app-task-item",
    standalone: true,
    imports: [
        DatePipe,
        MatCardModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
    templateUrl: "./task-item.component.html",
    styleUrl: "./task-item.component.scss"
})
export class TaskItemComponent {
    @Input({ required: true }) task!: Task;
    @Output() toggleComplete = new EventEmitter<boolean>();
    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    onToggleComplete(completed: boolean): void {
        this.toggleComplete.emit(completed);
    }

    onEdit(): void {
        this.edit.emit();
    }

    onDelete(): void {
        this.delete.emit();
    }
}
