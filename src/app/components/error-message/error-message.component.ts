import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  @Input() message: string = 'Este campo es inválido';
  @Input() control?: AbstractControl | null;
  @Input() shouldShow?: boolean;
  @Input() showWhen: 'touched' | 'always' = 'touched';

  get shouldDisplay(): boolean {
    if (this.shouldShow !== undefined) return this.shouldShow;

    if (!this.control) return false;

    if (this.showWhen === 'always') {
      return this.control.invalid;
    }

    return this.control.invalid && this.control.touched;
  }
}
