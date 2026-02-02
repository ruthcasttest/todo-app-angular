import { Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
    selector: "app-task-skeleton",
    standalone: true,
    imports: [MatCardModule],
    templateUrl: "./task-skeleton.component.html",
    styleUrl: "./task-skeleton.component.scss"
})
export class TaskSkeletonComponent {
    @Input() count = 3;

    get skeletonItems(): number[] {
        return Array(this.count).fill(0);
    }
}
