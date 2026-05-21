import { Component, input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-forms-error-display',
  imports: [],
  templateUrl: './forms-error-display.html',
  styleUrl: './forms-error-display.scss',
})
export class FormsErrorDisplay {
  control = input.required<AbstractControl<any, any, any>>();
  name = input.required<string>();
}
