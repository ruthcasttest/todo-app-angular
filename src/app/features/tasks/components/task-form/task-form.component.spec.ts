import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { TaskFormComponent, TaskFormData } from "./task-form.component";

describe("TaskFormComponent", () => {
    let component: TaskFormComponent;
    let fixture: ComponentFixture<TaskFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaskFormComponent, ReactiveFormsModule, NoopAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("form initialization", () => {
        it("should create the form on init", () => {
            expect(component.taskForm).toBeDefined();
        });

        it("should have title control", () => {
            expect(component.titleControl).toBeDefined();
        });

        it("should have description control", () => {
            expect(component.descriptionControl).toBeDefined();
        });

        it("should have empty initial values", () => {
            expect(component.titleControl?.value).toBe("");
            expect(component.descriptionControl?.value).toBe("");
        });
    });

    describe("form validation", () => {
        it("should be invalid when empty", () => {
            expect(component.taskForm.valid).toBeFalse();
        });

        it("should be invalid when title is empty", () => {
            component.descriptionControl?.setValue("Description");
            expect(component.taskForm.valid).toBeFalse();
        });

        it("should be invalid when description is empty", () => {
            component.titleControl?.setValue("Title");
            expect(component.taskForm.valid).toBeFalse();
        });

        it("should be valid with both fields filled", () => {
            component.titleControl?.setValue("Title");
            component.descriptionControl?.setValue("Description");
            expect(component.taskForm.valid).toBeTrue();
        });

        it("should be invalid when title exceeds 100 characters", () => {
            component.titleControl?.setValue("a".repeat(101));
            component.descriptionControl?.setValue("Description");
            expect(component.titleControl?.hasError("maxlength")).toBeTrue();
        });

        it("should be invalid when description exceeds 500 characters", () => {
            component.titleControl?.setValue("Title");
            component.descriptionControl?.setValue("a".repeat(501));
            expect(component.descriptionControl?.hasError("maxlength")).toBeTrue();
        });

        it("should have required error when title is empty and touched", () => {
            component.titleControl?.markAsTouched();
            expect(component.titleControl?.hasError("required")).toBeTrue();
        });
    });

    describe("onSubmit", () => {
        it("should not emit when form is invalid", () => {
            spyOn(component.taskSubmit, "emit");
            component.onSubmit();
            expect(component.taskSubmit.emit).not.toHaveBeenCalled();
        });

        it("should mark form as touched when invalid", () => {
            component.onSubmit();
            expect(component.titleControl?.touched).toBeTrue();
            expect(component.descriptionControl?.touched).toBeTrue();
        });

        it("should emit form data when valid", () => {
            spyOn(component.taskSubmit, "emit");
            const formData: TaskFormData = {
                title: "Test Title",
                description: "Test Description"
            };

            component.titleControl?.setValue(formData.title);
            component.descriptionControl?.setValue(formData.description);

            component.onSubmit();

            expect(component.taskSubmit.emit).toHaveBeenCalledWith(formData);
        });

        it("should reset form after successful submit", () => {
            component.titleControl?.setValue("Test Title");
            component.descriptionControl?.setValue("Test Description");

            component.onSubmit();

            expect(component.titleControl?.value).toBeFalsy();
            expect(component.descriptionControl?.value).toBeFalsy();
        });
    });

    describe("getters", () => {
        it("titleControl should return the title form control", () => {
            const control = component.titleControl;
            expect(control).toBe(component.taskForm.get("title"));
        });

        it("descriptionControl should return the description form control", () => {
            const control = component.descriptionControl;
            expect(control).toBe(component.taskForm.get("description"));
        });
    });
});
