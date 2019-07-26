import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-basic-modal',
  templateUrl: './basic-modal.component.html',
  styleUrls: ['./basic-modal.component.scss']
})
export class BasicModalComponent implements OnInit {
  @Input() title: TemplateRef<any> | string;
  @Input() isShowCancel: boolean = true;
  @Input() isShowOk: boolean = true;
  @Input() width: number = 650;
  @Input() bodyStyle: object;
  @Input() cancelText: string = 'cancel';
  @Input() okText: string = 'submit';
  @Input() footer: TemplateRef<void>;
  @Output() readonly nzOnOk: EventEmitter<any> = new EventEmitter();
  @Output() readonly nzOnCancel: EventEmitter<any> = new EventEmitter();
  @Input() openLoading: boolean = false;
  public _loading: boolean = false;
  private _isVisible: boolean = false;
  constructor() {}

  ngOnInit() {}

  show() {
    this._isVisible = true;
  }

  close() {
    this.loading = false;
    this._isVisible = false;
  }

  eventOnOk() {
    this.loading = true;
    this.nzOnOk.emit((isNotClose?: boolean) => {
      this._isVisible = isNotClose ? isNotClose : false;
      this.loading = false;
    });
  }

  eventOnCancel() {
    this.close();
    this.nzOnCancel.emit();
  }

  get isVisible() {
    return this._isVisible;
  }

  set isVisible(value: boolean) {
    this._isVisible = value;
  }

  get loading(): boolean {
    return this.openLoading && this._loading;
  }

  set loading(loading: boolean) {
    this._loading = loading;
  }
}
