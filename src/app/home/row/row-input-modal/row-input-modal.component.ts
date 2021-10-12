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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    this.modalTitle = this.editingTask ? 'Edit Record' : 'Add New Record';
    this.showInputError = false;
    this.formField = {};

    this.generateFormGroup();
    this.generateDOM();
  }

  generateFormGroup() {
    const formBuilder: FormBuilder = new FormBuilder();

    this.columnSetting.forEach((col: any) => {
      let value = null;
      if (this.editingTask) {
        value = this.editingTask[col.field];
      } else {
        if (col.field == 'taskID' || col.field == 'taskCode') {
          value = this.taskID;
        }
      }
      this.formField[col.field] = [value, Validators.required];
    });
    this.rowInputForm = formBuilder.group(this.formField);
  }

  generateDOM() {
    const modalBody = this.location.element.nativeElement.querySelector('.modal-body');
    this.columnSetting.forEach((col: any) => {
      if (col.visible) {
        let colInputComponent = this.resolver.resolveComponentFactory(RowInputComponent);

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

  save(): void {
    this.showInputError = false;
    if (this.rowInputForm.invalid) {
      this.showInputError = true;
      return;
    }
    this.closeModal.emit(this.rowInputForm.value);
  }

  close(): void {
    this.closeModal.emit(false);
  }
}
