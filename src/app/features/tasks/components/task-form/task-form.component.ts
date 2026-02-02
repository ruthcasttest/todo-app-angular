import {
    Component, EventEmitter, inject, OnInit, Output
} from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

export interface TaskFormData {
    title: string;
    description: string;
}

@Component({
    selector: "app-task-form",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: "./task-form.component.html",
    styleUrl: "./task-form.component.scss"
})
export class TaskFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);

    @Output() taskSubmit = new EventEmitter<TaskFormData>();

    taskForm!: FormGroup;

    ngOnInit(): void {
        this.taskForm = this.fb.group({
            title: ["", [Validators.required, Validators.maxLength(100)]],
            description: ["", [Validators.required, Validators.maxLength(500)]]
        });
    }

    onSubmit(): void {
        if (this.taskForm.invalid) {
            this.taskForm.markAllAsTouched();
            return;
        }

        const formData: TaskFormData = this.taskForm.value;
        this.taskSubmit.emit(formData);
        this.taskForm.reset();
    }

    get titleControl() {
        return this.taskForm.get("title");
    }

    get descriptionControl() {
        return this.taskForm.get("description");
    }
}
