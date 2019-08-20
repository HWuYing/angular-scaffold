import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { LoadingComponent } from './loading.component';

@Directive({
  selector: '[appLoading], [app-loading], appLoading, app-loading'
})
export class LoadingDirective implements OnDestroy, OnInit {
  private destoryFn: () => void = () => ({});
  private _loadingRef: ComponentRef<LoadingComponent>;
  @Input() set appLoading(value: boolean) {
    this.resetLoadingStatus(value);
  }
  constructor(
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private resole: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    this.renderLoading();
  }

  ngOnDestroy() {
    this.destoryFn();
    this.destoryFn = null;
    this._loadingRef = null;
  }

  /**
   * 渲染loading element
   */
  renderLoading() {
    if (!this._loadingRef) {
      const rootElement = this.viewContainerRef.element.nativeElement;
      const componentFactory = this.resole.resolveComponentFactory(LoadingComponent);
      const ref = this.viewContainerRef.createComponent(
        componentFactory, this.viewContainerRef.length,
        this.viewContainerRef.injector
      );
      this.destoryFn = () => {
        ref.destroy();
        this.render.removeChild(rootElement, ref.location.nativeElement);
      };
      this._loadingRef = ref;
      this.render.appendChild(rootElement, ref.location.nativeElement);
    }
    return this._loadingRef;
  }

  /**
   * 设置loading 状态
   * @param value boolean
   */
  resetLoadingStatus(value: boolean) {
    const ref = this.renderLoading();
    const rootElement = this.viewContainerRef.element.nativeElement;
    if (value === true) {
      this.render.setStyle(rootElement, 'position', 'relative');
    } else {
      this.render.removeStyle(rootElement, 'position');
    }
    ref.instance.loading = value;
  }
}
