import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CanvasDirective} from "../../canvas.directive";

@Component({
  selector: 'app-game',
  templateUrl: 'game.component.html'
})
export class GameComponent {
  @ViewChild('myCanvas') myCanvas: any;

  constructor() {
  }

  sendDraw(event: Event) {
    console.log(event);
    this.saveCanvasAs(this.myCanvas.canvas, 'test.png');
  }

  saveCanvasAs(canvas: any, fileName: string) {
    // get image data and transform mime type to application/octet-stream
    var canvasDataUrl = canvas.toDataURL()
        .replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
    var link = document.createElement('a'); // create an anchor tag

    // set parameters for downloading
    link.setAttribute('href', canvasDataUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', fileName);

    // compat mode for dispatching click on your anchor
    if (document.createEvent) {
      var evtObj = document.createEvent('MouseEvents');
      evtObj.initEvent('click', true, true);
      link.dispatchEvent(evtObj);
    } else if (link.click) {
      link.click();
    }
  }
}
