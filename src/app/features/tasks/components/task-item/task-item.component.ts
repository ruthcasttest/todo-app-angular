import { DatePipe } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

import { ConfirmDialogComponent } from "../../../../shared/components/confirm-dialog/confirm-dialog.component";

import { Task } from "../../models/task.model";

@Component({
    selector: "app-task-item",
    standalone: true,
    imports: [
        DatePipe,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
    templateUrl: "./task-item.component.html",
    styleUrl: "./task-item.component.scss"
})
export class TaskItemComponent {
    private readonly dialog = inject(MatDialog);

    @Input({ required: true }) task!: Task;
    @Output() toggleComplete = new EventEmitter<boolean>();
    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    onToggleComplete(event: MouseEvent): void {
        event.preventDefault();

        if (this.task.completed) {
            this.toggleComplete.emit(false);
            return;
        }

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "400px",
            data: {
                title: "Completar tarea",
                message: `¿Estás seguro de que deseas marcar "${this.task.title}" como completada?`,
                confirmText: "Completar",
                cancelText: "Cancelar"
            }
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.toggleComplete.emit(true);
            }
        });
    }

    onEdit(): void {
        this.edit.emit();
    }

    onDelete(): void {
        this.delete.emit();
    }
}
