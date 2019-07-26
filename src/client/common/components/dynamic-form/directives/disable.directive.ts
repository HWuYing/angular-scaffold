import { Directive, ElementRef, Input, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[dynamicDisable], dynamicDisable'
})
export class DisableDirective {
  private _disabled: boolean;
  @Input() set dynamicDisable(value: boolean) {
    if (this._disabled !== value) {
      this._disabled = value;
      this.resetDisabled();
    }
  }
  constructor(
      private element: ElementRef,
      private render: Renderer2,
      @Optional() @Self() private ngControl: NgControl
    ) { }

  private resetDisabled() {
    const element = this.element.nativeElement;
    const control = this.ngControl && this.ngControl.control;
    if (control) {
      setTimeout(() => {
        this._disabled !== true ? control.enable() :  control.disable();
      });
    } else {
      this._disabled !== true ? this.render.removeAttribute(element, 'disabled') : this.render.setAttribute(element, 'disabled', 'disabled');
    }
  }

  get disabled() {
    return this.ngControl.disabled;
  }
}
