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
  @Input() cancelText: string = '取消';
  @Input() okText: string = '确定';
  @Output() readonly nzOnOk: EventEmitter<any> = new EventEmitter();
  @Output() readonly nzOnCancel: EventEmitter<any> = new EventEmitter();
  private _isVisible: boolean = false;
  constructor() {}

  ngOnInit() {}

  show() {
    this._isVisible = true;
  }

  close() {
    this._isVisible = false;
  }

  _onOk() {
    this.nzOnOk.emit(() => {
      this._isVisible = false;
    });
  }

  _onCancel() {
    this.close();
    this.nzOnCancel.emit();
  }

  get isVisible() {
    return this._isVisible;
  }

  set isVisible(value: boolean) {
    this._isVisible = value;
  }
}
