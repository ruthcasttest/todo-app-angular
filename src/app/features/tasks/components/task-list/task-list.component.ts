import { Component, computed, EventEmitter, Input, Output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";

import { Task } from "../../models/task.model";
import { TaskItemComponent } from "../task-item/task-item.component";

type TaskFilter = "all" | "pending" | "completed";

@Component({
    selector: "app-task-list",
    standalone: true,
    imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatTabsModule,
        TaskItemComponent
    ],
    templateUrl: "./task-list.component.html",
    styleUrl: "./task-list.component.scss"
})
export class TaskListComponent {
    @Input({ required: true }) tasks: Task[] = [];
    @Output() toggleComplete = new EventEmitter<{ taskId: string; completed: boolean }>();
    @Output() editTask = new EventEmitter<Task>();
    @Output() deleteTask = new EventEmitter<string>();

    readonly searchTerm = signal("");
    readonly activeFilter = signal<TaskFilter>("all");

    readonly allTasks = computed(() => this.filterBySearch(this.tasks));
    readonly pendingTasks = computed(() => this.filterBySearch(this.tasks.filter(t => !t.completed)));
    readonly completedTasks = computed(() => this.filterBySearch(this.tasks.filter(t => t.completed)));

    readonly filteredTasks = computed(() => {
        const filter = this.activeFilter();
        switch (filter) {
            case "pending":
                return this.pendingTasks();
            case "completed":
                return this.completedTasks();
            default:
                return this.allTasks();
        }
    });

    readonly allCount = computed(() => this.allTasks().length);
    readonly pendingCount = computed(() => this.pendingTasks().length);
    readonly completedCount = computed(() => this.completedTasks().length);

    onSearchChange(value: string): void {
        this.searchTerm.set(value);
    }

    onTabChange(index: number): void {
        const filters: TaskFilter[] = ["all", "pending", "completed"];
        this.activeFilter.set(filters[index]);
    }

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

    private filterBySearch(tasks: Task[]): Task[] {
        const term = this.searchTerm().toLowerCase().trim();
        if (!term) {
            return tasks;
        }
        return tasks.filter(task =>
            task.title.toLowerCase().includes(term) ||
            task.description.toLowerCase().includes(term)
        );
    }
}
