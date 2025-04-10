
# Angular 可拖拽尺寸调整组件实现指南

## 组件概述

本组件实现了通过鼠标拖拽动态调整元素尺寸的功能，适用于需要灵活调整布局区域的场景。组件支持设置最小/最大宽度限制，并提供视觉反馈增强用户体验。

## 核心特性

- **尺寸限制**：通过 `wrapperSpec` 输入属性配置最小/最大宽度
- **拖拽交互**：右侧手柄触发尺寸调整，带有悬停提示
- **视觉反馈**：拖拽时显示激活状态样式
- **边界检测**：自动限制在容器范围内调整

## 使用方式

```html
<div style="width:100%;display:flex;gap:12px">
  <app-resizable-box [wrapperSpec]="{ minWidth: 380, maxWidth: 576 }">
    <h1>Hello Angular!</h1>
  </app-resizable-box>
  <aside style="width:100px background:#f0f0f0;border:1px solid #ddd">
    Right
  </aside>
</div>
```

## 实现详解

### 组件类 (resizable.component.ts)

```typescript
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// 状态枚举
const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2,
}

@Component({
  selector: 'app-resizable-box',
  template: `
    <div class="resize-action"
         (mousedown)="setStatus($event, 1)"
         nz-tooltip
         nzTooltipTitle="按住鼠标可调整尺寸">
    </div>
    <ng-content></ng-content>
  `,
  styleUrls: ['./resizable.component.scss'],
  host: { '[class.active]': 'status === 1' },
  standalone: true,
  imports: [CommonModule],
})
export class ResizableComponent implements AfterViewInit {
  @Input() public wrapperSpec = { minWidth: 0, maxWidth: 0 };
  public _width: number | undefined = 0;
  private boxPosition = { left: 0, top: 0, right: 0, bottom: 0 };
  private containerPos = { left: 0, right: 0 };
  public mouse = { x: 0, y: 0 };
  public status: Status = Status.OFF;

  constructor(private elementRef: ElementRef) {}

  // 动态宽度绑定
  @HostBinding('style.width') get width() {
    return `${this._width}px`;
  }

  ngAfterViewInit() {
    this.initDimensions();
  }
  setStatus(event: MouseEvent, status: number) {
    if (status === 1) {
      event.stopPropagation();
      this.elementRef.nativeElement.style['user-select'] = 'none';
    } else {
      this.elementRef.nativeElement.style['user-select'] = 'auto';
      this.updateBoxPosition();
    }
    this.status = status;
  }

  // 事件处理
  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.setStatus(event, Status.OFF);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse = { x: event.clientX, y: event.clientY };
    if (this.status === Status.RESIZE) {
      this.resize();
    }
  }

  // 尺寸调整逻辑
  private resize() {
    if (this.isWithinBounds()) {
      const newWidth = this.calculateNewWidth();
      this._width = Math.max(
        this.wrapperSpec.minWidth,
        Math.min(newWidth, this.wrapperSpec.maxWidth)
      );
    }
  }

  private calculateNewWidth(): number {
    return this.mouse.x - this.boxPosition.left;
  }

  private isWithinBounds(): boolean {
    return this.mouse.x < this.containerPos.right;
  }

  private initDimensions() {
    this._width = this.wrapperSpec.minWidth;
    this.updateBoxPosition();
    this.updateContainerBounds();
  }

  private updateBoxPosition() {
    const { left, top, right, bottom } =
      this.elementRef.nativeElement.getBoundingClientRect();
    this.boxPosition = { left, top, right, bottom };
  }
  private updateContainerBounds() {
    const { left } = this.elementRef.nativeElement.getBoundingClientRect();
    const rightPos = left + this.wrapperSpec.maxWidth;
    this.containerPos = { left, right: rightPos };
  }
}
```

### 样式实现 (resizable.component.scss)

```scss
:host {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  padding-right: 8px;
  outline: 1px dashed rgba(0, 128, 0, 0.5);
  transition: outline 0.2s ease;

  &.active {
    outline: 2px solid green;
    background-color: rgba(128, 255, 128, 0.05);
  }
}

.resize-action {
  position: absolute;
  left: 100%;
  top: 0;
  height: 100%;
  width: 16px;
  transform: translateX(-50%);
  z-index: 999;
  cursor: col-resize;

  &:hover {
    cursor: col-resize;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 24px;
    background: rgba(0, 0, 0, 0.2);
  }
}
```

## 优化建议

1. **性能优化**：

   - 添加 `requestAnimationFrame` 节流处理拖拽事件
   - 实现 `OnDestroy` 生命周期清理事件监听

2. **功能扩展**：

   - 添加垂直方向尺寸调整支持
   - 支持通过服务保存/恢复组件尺寸状态

3. **可访问性**：
   - 添加键盘操作支持
   - 完善 ARIA 属性

## 延伸阅读

[创建可调整大小和可拖动的 Angular 组件的最简单方法](https://medium.com/swlh/create-a-resizable-and-draggable-angular-component-in-the-easiest-way-bb67031866cb)

> 提示：实际使用时建议将组件封装为独立模块，便于在不同项目中复用。
