import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() total: number;
  @Input() dataSource: any[];
  @Input() templateMap: object; // 对应的template缓存 key对应为属性值
  @Input() loading: boolean; // table数据加载状态
  @Input() isHeadFixed: boolean = false; // 表头固定
  @Input() showCheckbox: boolean = false; // 显示checkbox
  @Input() showPagination: boolean = true; // 显示分页
  @Input() isSerial: boolean = false; // 数据的序号
  @Input() borderd: boolean = true; // 是否有边框
  @Input() title: string | TemplateRef<void>; // 表格头
  @Input() footer: string | TemplateRef<void>; // 表格尾
  @Input() trTemplateRef: TemplateRef<any>; // tr的templateRef 存在就采用传入的处理
  @Input() tdTemplateRef: TemplateRef<any>; // td的templateRef 存在就采用传入的处理
  @Input() pageSize: number = 20; // 每页调数
  @Input() cellAlign: string = 'center'; // 单元格对齐方式 center left right
  @Input() size: string = 'small'; // 表格类型
  @Input() set columns(value: any[]) {
    this._columns = [].concat(this.isSerial ? this._serialColumn : [], value).map((_column: object) => ({
      align: this.cellAlign,
      getTableSpan: () => () => ({ }),
      ..._column
    }));
    this.resetMaxWidth();
    this.resetWidthConfig();
  }
  @Input() set theadColumns(value: any[]) {
    if (value && !!value.length) {
      this._theadColumns = value;
    }
  }
  @ViewChild(NzTableComponent, { static: true }) table: NzTableComponent;
  @Output() readonly paginationChange: EventEmitter<any> = new EventEmitter(); // 分页信息改变事件
  @Output() readonly currentPageDataChange: EventEmitter<any> = new EventEmitter(); // 分页数据改变事件
  @Output() readonly checkChange: EventEmitter<any> = new EventEmitter(); // 选择数据改变事件
  private _serialColumn: object = { title: '序号', width: 70, isSerial: true };
  private _maxWidth: any; // 最大宽对
  private _theadColumns: any[] = [];
  private _widthConfig: string[] = [];
  private _columns: any[] = []; // 配置对象
  private _defaultColumnWidth: number = 120; // 默认每列宽度
  private _selectedRowKeys: any[] = []; // 选中的列的key值
  private _selectedRows: any[] = []; // 选中的列表值
  public pageSizeOptions: number[] = [10, 20, 30, 40, 50];
  public pageNum: number = 1; // 当前页数
  public scroll: any = {}; // table 滚动设置
  public isAllDisplayDataChecked: boolean = false; // 全选
  public isIndeterminate: any; // 部分选择
  public mapOfCheckedId: { [key: string]: boolean } = {}; // checkbox 双向绑定对象
  // 浏览器改变大小时 从新设置高度
  @HostListener('window:resize', [])
  resizeChange() {
    this._resetScroll(this.isHeadFixed);
  }

  constructor(
    private elementRef: ElementRef,
  ) {}

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges ) {
  }

  ngAfterViewInit() {
    this._resetScroll(this.isHeadFixed);
  }

  /**
   * 选中数据
   * @param checkList 选中key列表
   */
  checkRows(checkList: any, isNotMerge?: boolean) {
    if ([null, undefined].includes(checkList)) {
      return ;
    }
    const checks = Array.isArray(checkList) ? checkList : [checkList];
    const mapOfCheckedId = checks.reduce((o: object, key: string) => ({
      ...o,
      [key.toString()]: true
    }), {});
    this.mapOfCheckedId = isNotMerge ? mapOfCheckedId : {
      ...this.mapOfCheckedId,
      ...mapOfCheckedId
    };
    this._rowCheckChange();
  }

  /**
   * 清除数据
   * @param clearList 清除列表
   */
  clearCheckRows(clearList: any) {
    const clears = (Array.isArray(clearList) ? clearList : [clearList]).map((key: any) => String(key));
    this.checkRows(Object.keys(this.mapOfCheckedId)
      .filter((key: string) => !(clears.includes(key) || !this.mapOfCheckedId[key])), true);
  }

  /**
   * 选中所有选项
   */
  checkAll() {
    this._checkAll(true);
  }

  /**
   * 清除所有选择项目
   */
  clearSelectRowKeys() {
    if (!this._selectedRowKeys.length) {
      return;
    }
    this._checkAll(false);
  }

  /**
   * 表头固定
   * @param isHeadFixed boolean
   */
  _resetScroll(isHeadFixed: boolean): void {
    if (!isHeadFixed) {
      if (this.scroll.y) {
        this.scroll = {};
      }
      return ;
    }
    setTimeout(() => {
      const { nativeElement } = this.elementRef;
      const thead = nativeElement.querySelector('thead');
      const title = nativeElement.querySelector('.ant-table-title');
      const titleHeight = title ? title.offsetHeight : 0;
      const theadHeight = thead ? thead.offsetHeight : 0;
      const rootHeight = nativeElement.parentNode.offsetHeight;
      this.scroll = {
        y: `${rootHeight - (this.showPagination ? 64 : 0) - theadHeight - titleHeight}px`
      };
    });
  }

  /**
   * 分页参数改变后调用
   */
  _paginationChange() {
    this.paginationChange.emit(this.page);
  }

  /**
   * 每页条数改变后调用
   * @param pageSize 每页条数
   */
  _paginationSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    if (this.pageNum <= this.maxPageNum) {
      this._paginationChange();
    }
  }

  /**
   * 当前页数改变调用
   * @param pageNum 页数
   */
  _paginationIndexChange(pageNum: number) {
    this.pageNum = pageNum;
    this._paginationChange();
  }

  /**
   * 分页数据改变 (如果当前分页数据为0  并且 总条数不为0 时 重新改变为数据最后一页)
   * @param data 数据
   */
  _pageDataChange(data: any[]) {
    const isNotData = !data.length;
    const maxPageNum = this.maxPageNum;
    if (isNotData && this.total !== 0 && this.pageNum !== 1 && this.pageNum > maxPageNum) {
      setTimeout(() => this._paginationIndexChange(maxPageNum));
    } else {
      this.toTop();
      this.currentPageDataChange.emit(data);
      this.clearSelectRowKeys();
    }
  }

  /**
   * 数据选择发生改变
   */
  _checkChange() {
    this.checkChange.emit(this.checkedOption);
  }

  /**
   * 数据全选\不全选
   * @param checkd checkbox值
   */
  _checkAll(checkd: boolean) {
    this.mapOfCheckedId = this.dataSource.reduce((o: object, item: any, index: number) => ({
      ...o,
      [this.getRowKey(index, item)]: !item.disabled ? checkd : false
    }), {});
    this._rowCheckChange();
  }

  /**
   * 行数据选择改变
   */
  _rowCheckChange() {
    const _dataSource = this.dataSource.filter((_data: any) => !_data.disabled);
    this._selectedRowKeys = Object.keys(this.mapOfCheckedId).filter((key: string) => this.mapOfCheckedId[key]);
    this._selectedRows = _dataSource.filter((_data: any, index: number) => this._selectedRowKeys.includes(this.getRowKey(index, _data)));
    this.isAllDisplayDataChecked = this._selectedRowKeys.length !== 0 && this._selectedRowKeys.length === _dataSource.length;
    this.isIndeterminate = this._selectedRowKeys.length !== 0 && !this.isAllDisplayDataChecked;
    this._checkChange();
  }

  /**
   * 重置table的最大宽度（头部固定下有效）
   */
  resetMaxWidth() {
    let _maxWidth = 0;
    if (this.isHeadFixed) {
      _maxWidth = this.columns.reduce((sum: number, column: any) => {
        return sum + (column.width ? Number(column.width) : this._defaultColumnWidth);
      }, this.showCheckbox ? 70 : 0);
    }
    this._maxWidth = _maxWidth;
  }

  /**
   * 重置宽度配置
   */
  resetWidthConfig() {
    this._widthConfig = this.columns.map((column: any) => this.getWdith(column));
    if (this.showCheckbox) {
      this._widthConfig.unshift(this.getWdith({ width: 70 }));
    }
  }

  /**
   * 回到tbody顶部
   */
  toTop() {
    let tableBodyContainer: Element;
    const { nativeElement } = this.elementRef;
    if (this.isHeadFixed && nativeElement) {
      tableBodyContainer = nativeElement.querySelector('.ant-table-body');
      if (tableBodyContainer) {
        tableBodyContainer.scrollTop = 0;
      }
    }
  }

  /**
   * 获取列宽度
   * @param column 列配置
   */
  getWdith(column: any): any {
    if (!this.isHeadFixed) {
      return void 0;
    }
    const width = ['string', 'number'].includes(typeof column) ? column : column.width;
    return (width || this._defaultColumnWidth) / this._maxWidth * 100 + '%';
  }

  /**
   * 当前类型是否选择
   * @param data 数据
   * @param key key值
   */
  isChecked(data: any, key: number | string): boolean {
    const { rowKey } = data;
    return this._selectedRowKeys.includes(rowKey || key);
  }

  /**
   * 当前表格标签可点击
   * @param data 数据
   * @param column column
   */
  isClickCeel(data: any, column: object) {
    return Object.prototype.hasOwnProperty.call(column, 'click');
  }

  /**
   * 获取数据的key值
   * @param data 数据
   * @param index 索引
   */
  getRowKey(index: number, data: any) {
    return data.rowKey || index.toString();
  }

  /**
   * 获取checkbox禁用
   * @param data 数据
   */
  getDisabled(index: any) {
    return this.dataSource[index].disabled;
  }

  /**
   * 优化column循环
   * @param index number
   * @param column column
   */
  trackByColumn(index: number, column: any) {
    return column.key || index;
  }

  /**
   * 获取宽度配置
   */
  get widthConfig(): string[] {
    if (!this.isTheadGroup) {
      return void 0;
    }
    return this._widthConfig;
  }

  get isTheadGroup(): boolean {
    return !!(this._theadColumns && this._theadColumns.length);
  }

  /**
   * 获取最大分页
   */
  get maxPageNum(): number {
    const remainder = this.total % this.pageSize;
    return (this.total - remainder) / this.pageSize + remainder / (remainder || 1);
  }

  /**
   * 获取选择信息
   */
  get checkedOption(): { selectedRowKeys: string[], selectedRows: any[] } {
    return {
      selectedRowKeys: this._selectedRowKeys,
      selectedRows: this._selectedRows
    };
  }

  /**
   * 获取表头单独配置信息
   */
  get theadColumns(): any[] {
    return this._theadColumns;
  }

  /**
   * 获取列配置信息
   */
  get columns(): any[] {
    return this._columns;
  }

  set page(page: any) {
    this.pageNum = page.pageNum || 1;
    this.pageSize = page.pageSize || 20;
  }

  /**
   * 获取分页参数
   */
  get page() {
    return {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
  }
}
