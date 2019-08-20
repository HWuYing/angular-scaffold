import { Directive, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';

@Directive({
  selector: '[appTableSpan]'
})
export class TableSpanDirective implements OnInit {
  @Input() appTableSpan: () => boolean | object;
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<void>,
    private render: Renderer2
  ) { }

  ngOnInit(): void {
    this.update();
  }

  private update() {
    const result = this.appTableSpan();
    let viewRef: any;
    if (result !== false) {
      viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    if (Object.prototype.toString.call(result) === '[object Object]') {
      const element = viewRef.rootNodes[0];
      if (element) {
        Object.keys(result || {}).forEach((key: string) => {
          this.render.setAttribute(element, key, result[key]);
        });
      }
    }
  }
}
