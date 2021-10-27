import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BooleanInputComponent } from '../input-component/boolean-input/boolean-input.component';
import { DropdownInputComponent } from '../input-component/dropdown-input/dropdown-input.component';
import { RowInputComponent } from '../input-component/text-input/text-input.component';

@Component({
  selector: 'app-row-add-modal',
  templateUrl: './row-input-modal.component.html',
  styleUrls: ['./row-input-modal.component.scss'],
})
export class RowInputModalComponent implements OnInit {
  @Input() declare taskID: number;
  @Input() declare editingTask: any;
  @Input() declare columnSetting: any[];
  @Output() closeModal = new EventEmitter<any>();

  declare modalTitle: string;
  declare showInputError: boolean;
  declare rowInputForm: FormGroup;
  declare formField: any;

  constructor(
    private resolver: ComponentFactoryResolver,
    private location: ViewContainerRef,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    // console.log(this.columnSetting)
    this.modalTitle = this.editingTask ? 'Edit Record' : 'Add New Record';
    this.showInputError = false;
    this.formField = {};

    this.generateFormGroup();
    this.generateDOM();
  }

  generateFormGroup() {
    const formBuilder: FormBuilder = new FormBuilder();

    this.columnSetting.forEach((col: any) => {
      if (!col.noEditor) {
        let value = null;
        if (this.editingTask) {
          value = this.editingTask[col.field];
        } else {
          if (col.field == 'taskCode') {
            value = this.taskID;
          }
        }
        if (!value && col.hasDefaultValue) {
          value = col.defaultValue;
        }
        this.formField[col.field] = new FormControl(value);
      }
    });
    this.rowInputForm = formBuilder.group({ ...this.formField });
  }

  generateDOM() {
    const modalBody = this.location.element.nativeElement.querySelector('.modal-body');
    this.columnSetting.forEach((col: any) => {
      if (!col.noEditor) {
        let colInputComponent = this.switchResolverComponentFactory(col.type);

        let newNode = document.createElement('div');
        newNode.className = 'input-field';
        if (this.rowInputForm.controls[col.field].hasValidator(Validators.required)) {
          newNode.className += ' input-field-required';
        }
        modalBody.appendChild(newNode);

        const ref = colInputComponent.create(this.injector, [], newNode);
        ref.instance.columnInfo = { ...col };
        ref.instance.formControl = this.rowInputForm.controls[col.field];
        ref.changeDetectorRef.detectChanges();
      }
    });
  }

  switchResolverComponentFactory(type: string) {
    switch (type) {
      case 'dropdown':
        return this.resolver.resolveComponentFactory(DropdownInputComponent);
      case 'boolean':
        return this.resolver.resolveComponentFactory(BooleanInputComponent);
      default:
        return this.resolver.resolveComponentFactory(RowInputComponent);
    }
  }

  save(): void {
    this.showInputError = false;
    console.log(this.rowInputForm);
    if (this.rowInputForm.invalid) {
      this.showInputError = true;
      return;
    }
    this.closeModal.emit({ ...this.rowInputForm.value, taskID: this.rowInputForm.controls['taskCode'].value });
  }

  close(): void {
    this.closeModal.emit(false);
  }
}
