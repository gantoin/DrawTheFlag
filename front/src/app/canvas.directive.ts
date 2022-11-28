import {AfterViewInit, Directive, ElementRef, HostBinding, HostListener, Input,} from '@angular/core';
import {GameComponent} from "./components/game/game.component";

declare interface Position {
  offsetX: number;
  offsetY: number;
}
@Directive({
  selector: '[myCanvas]',
  exportAs:'myCanvas'
})
export class CanvasDirective implements AfterViewInit {
  color: string = 'black';

  constructor(private el: ElementRef) {
    // We use the ElementRef to get direct access to the canvas element. Here we set up the properties of the element.
    this.canvas = this.el.nativeElement;
    this.canvas.width = 600;
    this.canvas.height = 350;
    // We create a canvas context.
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;
  }

  canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  // Stroke styles for user and guest
  userStrokeStyle = this.color;
  position: {
    start: {};
    stop: {};
  } | undefined;
  // This will hold a list of positions recorded throughout the duration of a paint event
  line = [];
  // This object will hold the start point of any paint event.
  prevPos: Position = {
    offsetX: 0,
    offsetY: 0,
  };
  // This will be set to true when a user starts painting
  isPainting = false;

  @HostListener('mousedown', ['$event'])
  private onMouseDown({offsetX, offsetY}: { offsetX: any; offsetY: any }) {
    this.isPainting = true;
    // Get the offsetX and offsetY properties of the event.
    this.prevPos = {
      offsetX,
      offsetY,
    };
  }
  @HostListener('mousemove', ['$event'])
  private onMouseMove({offsetX, offsetY}: { offsetX: any; offsetY: any }) {
    if (this.isPainting) {
      const offSetData = { offsetX, offsetY };
      // Set the start and stop position of the paint event.
      this.position = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      // Add the position to the line array
      this.line = this.line.concat(this.position as any);
      this.draw(this.prevPos, offSetData, this.userStrokeStyle);
    }
  }
  @HostListener('mouseup')
  onMouseUp() {
    if (this.isPainting) {
      this.isPainting = false;
    }
  }
  @HostListener('mouseleave')
  onmouseleave() {
    if (this.isPainting) {
      this.isPainting = false;
    }
  }
  @HostBinding('style.background') background = 'white';

  // The draw method takes three parameters; the prevPosition, currentPosition and the strokeStyle
  draw(
      { offsetX: x, offsetY: y }: Position,
      { offsetX, offsetY }: Position,
      strokeStyle: string
  ){
    // begin drawing
    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(offsetX, offsetY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();
    this.prevPos = {
      offsetX,
      offsetY,
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  changeColor(color: string) {
    this.userStrokeStyle = color;
  }

  biggerOffset(offset: number) {
    this.ctx.lineWidth = this.ctx.lineWidth + offset;
  }

  fillCanvasWithColor() {
    this.ctx.fillStyle = this.userStrokeStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  fillZone() {
    this.ctx.fillStyle = this.userStrokeStyle;
    this.ctx.fillRect(0, 0, 100, 100);
  }
  ngAfterViewInit() {}
}
