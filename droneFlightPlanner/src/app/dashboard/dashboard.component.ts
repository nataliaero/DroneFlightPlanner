import { Component, OnInit } from '@angular/core';

import { Point } from '../shared/point';
import { Line } from '../shared/line';
import { Map } from '../shared/map';

import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  lastPosition: Point;
  currentPosition: Point;
  maps: Map[];
  currentMapName: string;
  currentMapLines: Line[];
  buttonDisabled: boolean;


  constructor(@Inject(DOCUMENT) document) {
  }

  ngOnInit() {
    const canvas: any = document.getElementById('imgCanvas');
    canvas.width  = 600;
    canvas.height = 600;
    this.currentMapName = '';
    this.maps = [];
    this.currentMapLines = [];
    this.buttonDisabled = true;
  }

  addLine(canvas, currentPosition, lastPosition) {
    if (lastPosition !== undefined) {
      if (canvas.getContext) {
        const context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.lineWidth = 3;
        context.strokeStyle = 'blue';
        context.stroke();
        this.currentMapLines.push({
          initialPoint: lastPosition,
          finalPoint: currentPosition
        });
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
      this.drawPoint(context, this.currentPosition);
      this.addLine(canvas, this.currentPosition, this.lastPosition);
      this.lastPosition = this.currentPosition;
    }
  }

  clearCanvas() {
    this.currentMapName = '';
    this.currentMapLines = [];
    const canvas: any = document.getElementById('imgCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.lastPosition = undefined;
    this.currentPosition = undefined;
    this.buttonDisabled = true;
  }

  clearInput() {
    const input: any = document.getElementById('imgCanvas');
  }

  onKey() {
    console.log('currentMapName', this.currentMapName)
    if (this.currentMapName) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
  }

  saveMap() {
    this.maps.push({
      name: this.currentMapName,
      lines: this.currentMapLines,
      date: Date.now()
    });
    this.clearCanvas();
  }

  uploadMap(i: number) {
    this.clearCanvas();
    const selectedMap = this.maps[i];
    this.currentMapName = selectedMap.name;
    this.buttonDisabled = false;
    const canvas: any = document.getElementById('imgCanvas');
    const context = canvas.getContext('2d');
    selectedMap.lines.forEach(line => {
      const initialPoint = line.initialPoint;
      const finalPoint = line.finalPoint;
      this.drawPoint(context, initialPoint);
      this.drawPoint(context, finalPoint);
      this.addLine(canvas, initialPoint, finalPoint);
    });
  }

  drawPoint(context, position) {
    context.beginPath();
    context.moveTo(position.x, position.y);
    context.arc(position.x, position.y, 5, 0, 2 * Math.PI);
    context.lineWidth = 1;
    context.fillStyle = 'blue';
    context.fill();
    context.stroke();
  }

}
