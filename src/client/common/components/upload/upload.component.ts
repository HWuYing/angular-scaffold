import { forwardRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadChangeParam, UploadFile, UploadFilter } from 'ng-zorro-antd/upload';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadComponent),
      multi: true
    }
  ],
  host: {
    '[class.upload-flex]': `isFlex`
  }
})
export class UploadComponent implements ControlValueAccessor, OnInit {
  @Input() isFlex: boolean = false;
  @Input() nzAccept: string = '';
  @Input() nzAction: string = '';
  @Input() nzDirectory: boolean;
  @Input() nzBeforeUpload: (file: UploadFile, fileList: UploadFile[]) => boolean | Observable<boolean>;
  @Input() nzCustomRequest: (item: any) => Subscription;
  @Input() nzData: object | ((file: UploadFile) => object);
  @Input() nzDisabled: boolean = false;
  @Input() nzLimit: number = 0;
  @Input() nzSize: number = 0;
  @Input() nzFileType: string = '';
  @Input() nzFilter: UploadFilter[] = [];
  @Input() nzHeaders: object | ((file: UploadFile) => object);
  @Input() nzListType: string = 'text';
  @Input() nzMultiple: boolean = false;
  @Input() nzName: string = 'file';
  @Input() nzShowUploadList: boolean | { showPreviewIcon?: boolean, showRemoveIcon?: boolean } = true;
  @Input() nzShowButton: boolean = true;
  @Input() nzOpenFileDialogOnClick: boolean = true;
  @Input() nzPreview: (file: UploadFile) => void;
  @Input() nzRemove: (file: UploadFile) => boolean | Observable<boolean>;
  @Input() uploadText: string = 'Upload';
  @Input() maxFile: number;
  @Output() readonly nzChange: EventEmitter<UploadChangeParam> = new EventEmitter();
  @Output() readonly nzStart: EventEmitter<UploadFile> = new EventEmitter();
  @Output() readonly nzSuccess: EventEmitter<UploadFile> = new EventEmitter();
  @Output() readonly nzError: EventEmitter<UploadFile> = new EventEmitter();
  @Output() readonly nzProgress: EventEmitter<UploadFile> = new EventEmitter();
  private _nzFileList: UploadFile[] = [];
  private onChange: (value: any) => void = () => null;
  private onTouched: () => any = () => null;
  constructor() { }

  private _onStart(file: UploadFile, files?: UploadFile[]) {
    this.nzStart.emit(file);
  }

  private _onSuccess(file: UploadFile, files?: UploadFile[]) {
    this.nzFileList = [ ...this.nzFileList, file];
    this.onChange(this.nzFileList);
    this.nzSuccess.emit(file);
  }

  private _onError(file: UploadFile, files?: UploadFile[]) {
    this.remove(file);
    this.nzError.emit(file);
  }

  private _onProgress(file: UploadFile, files?: UploadFile[]) {
    this.nzProgress.emit(file);
  }

  beforeUpload(file: UploadFile, fileList: UploadFile[]) {
    const nzBeforeUpload = this.nzBeforeUpload;
    let status = true;
    if (nzBeforeUpload) {
      // this._nzFileList = fileList;
      status = nzBeforeUpload.apply(this, [file, fileList]);
    }

    if (!status) {
      this.change({ type: 'success', file, fileList });
    }

    return status;
  }

  remove (file: UploadFile) {
    this.nzFileList = this.nzFileList.filter((_file: UploadFile) => _file.uid !== file.uid);
    this.onChange(this.nzFileList);
  }

  change(uploadChangeParam: UploadChangeParam) {
    const eventType = uploadChangeParam.type;
    const { file, fileList } = uploadChangeParam;
    switch (eventType) {
      case 'start': this._onStart(file, fileList); break;
      case 'progress': this._onProgress(file, fileList); break;
      case 'success': this._onSuccess(file, fileList); break;
      case 'error': this._onError(file, fileList); break;
    }
    this.nzChange.emit(uploadChangeParam);
  }

  ngOnInit() { }

  writeValue(value: any) {
    if (this.nzFileList === value) {
      return ;
    }
    if (Array.isArray(value)) {
      this.nzFileList = value;
    } else if (value) {
      this.nzFileList = [ value ];
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.nzDisabled = isDisabled;
  }

  get nzFileList() {
    return this._nzFileList;
  }

  set nzFileList(files: UploadFile[]) {
    this._nzFileList = files;
    this.onChange(this._nzFileList);
  }
}
