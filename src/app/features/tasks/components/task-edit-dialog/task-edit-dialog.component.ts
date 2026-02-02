import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { Task } from "../../models/task.model";

export interface TaskEditDialogData {
    task: Task;
}

export interface TaskEditDialogResult {
    title: string;
    description: string;
}

@Component({
    selector: "app-task-edit-dialog",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: "./task-edit-dialog.component.html",
    styleUrl: "./task-edit-dialog.component.scss"
})
export class TaskEditDialogComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    readonly dialogRef = inject(MatDialogRef<TaskEditDialogComponent>);
    readonly data = inject<TaskEditDialogData>(MAT_DIALOG_DATA);

    editForm!: FormGroup;

    ngOnInit(): void {
        this.editForm = this.fb.group({
            title: [this.data.task.title, [Validators.required, Validators.maxLength(100)]],
            description: [this.data.task.description, [Validators.required, Validators.maxLength(500)]]
        });
    }

    onSave(): void {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }

        const result: TaskEditDialogResult = this.editForm.value;
        this.dialogRef.close(result);
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    get titleControl() {
        return this.editForm.get("title");
    }

    get descriptionControl() {
        return this.editForm.get("description");
    }
}
