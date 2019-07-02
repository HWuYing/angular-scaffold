export class DynamicLayout {
  public type: string;
  public children: any[];
  public col: string | number;
  public spanCol: string | number;
  /**
   * @param config 布局配置
   * @param children 字节点（布局， formItem）
   */
  constructor(config: any, children: any[]) {
    const { col, spanCol } = config;
    this.col = col;
    this.spanCol = spanCol;
    this.children = children;
    this.type = 'layout';
  }

  private getNzSpan() {
    const col = this.col;
    let currentSpan = 24;
    let currentCol = Number(col);
    return (child: any) => {
      const nzSpan = child.spanCol || currentSpan / currentCol;
      currentSpan = currentSpan - nzSpan;
      currentCol = currentCol - 1;
      if (currentSpan <= 0) {
        currentSpan = 24;
        currentCol = Number(col);
      }
      return nzSpan;
    };
  }

  /**
   * 获取布局的template
   */
  public getTemplate(): string {
    const children = this.children;
    const getNzSpan = this.getNzSpan();
    let template = ``;
    let isShowProps = ``;
    template += `<div nz-row>`;
    children.forEach((child: any) => {
      isShowProps = ``;
      if (child.getIsShowTemplate) {
        isShowProps = child.getIsShowTemplate();
      }
      template += `<div nz-col nzSpan="${getNzSpan(child)}" ${isShowProps}>`;
      template += child.getTemplate();
      template += `</div>`;
    });
    template += `</div>`;
    return template;
  }
}
