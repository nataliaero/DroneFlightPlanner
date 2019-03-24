import { Component, OnInit } from '@angular/core';

import { Point } from '../shared/point';
import { Line } from '../shared/line';
import { Map } from '../shared/map';

import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  lastPosition: Point;
  currentPosition: Point;
  maps: Map[];
  currentMap: Map;
  line: Line;

  constructor(@Inject(DOCUMENT) document) {
  }

  ngOnInit() {
    const canvas: any = document.getElementById('imgCanvas');
    canvas.width  = 600;
    canvas.height = 400;
  }

  addLine(canvas, currentPosition, lastPosition) {
    if (lastPosition !== undefined) {
      if (canvas.getContext) {
        const context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.lineWidth = 5;
        context.strokeStyle = 'blue';
        context.stroke();
        this.line = {
          initialPoint: lastPosition,
          finalPoint: currentPosition
        };
        console.log('currentPosition: ', currentPosition)
        console.log('lastPosition: ', lastPosition)

        // this.currentMap.lines.push(this.line);
      }
    }
  }

  getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }

  addDot(e) {
    const canvas: any = document.getElementById('imgCanvas');
    this.currentPosition = this.getMousePos(canvas, e);

    if (canvas.getContext) {
      const context = canvas.getContext('2d');
      context.beginPath();
      context.moveTo(this.currentPosition.x, this.currentPosition.y);
      context.arc(this.currentPosition.x, this.currentPosition.y, 5, 0, 2 * Math.PI);
      context.lineWidth = 1;
      context.fillStyle = 'blue';
      context.fill();
      context.stroke();
      this.addLine(canvas, this.currentPosition, this.lastPosition);
      this.lastPosition = this.currentPosition;
    }
  }

   drawLine(e) {
  //   const canvas = document.getElementById('imgCanvas');
  //   mousePos = getMousePos(canvas, e);
  //   if (canvas.getContext) {

  }




}
