import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

export interface CreateUserDialogData {
    email: string;
}

@Component({
    selector: "app-create-user-dialog",
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
        <h2 mat-dialog-title>Usuario no encontrado</h2>
        <mat-dialog-content>
            <p>El correo <strong>{{ data.email }}</strong> no está registrado.</p>
            <p>¿Deseas crear un nuevo usuario?</p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button (click)="onCancel()">Cancelar</button>
            <button mat-raised-button color="primary" (click)="onConfirm()">
                Crear Usuario
            </button>
        </mat-dialog-actions>
    `,
    styles: [`
        mat-dialog-content {
            padding: 20px 0;
        }

        p {
            margin: 8px 0;
            color: rgba(0, 0, 0, 0.87);

            &:first-child {
                margin-top: 0;
            }
        }

        strong {
            color: #ff6600;
        }
    `]
})
export class CreateUserDialogComponent {
    readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);
    readonly data = inject<CreateUserDialogData>(MAT_DIALOG_DATA);

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
