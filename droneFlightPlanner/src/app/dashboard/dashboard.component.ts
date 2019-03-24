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

  lastPosition: Point; // Last position selected in the canvas
  currentPosition: Point; // Current position selected in the canvas
  maps: Map[]; // List of maps created
  currentMapName: string; // Name of the current map
  currentMapLines: Line[]; // List of lines for a specific map
  buttonDisabled: boolean; // Flag to enable/disable the save button
  canvas: any; // Canvas
  canvasContext: any; // Context of the canvas

  constructor(@Inject(DOCUMENT) document) {
  }

  ngOnInit() {

    // Initialise canvas
    this.canvas = document.getElementById('imgCanvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.canvas.width  = 600;
    this.canvas.height = 600;
    this.currentMapName = '';
    this.maps = [];
    this.currentMapLines = [];

    // Initially disable save button
    this.buttonDisabled = true;
  }

  // Add a line that connects two points in the canvas
  addLine(currentPosition, lastPosition) {
    if (lastPosition !== undefined) {
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(lastPosition.x, lastPosition.y);
      this.canvasContext.lineTo(currentPosition.x, currentPosition.y);
      this.canvasContext.lineWidth = 3;
      this.canvasContext.strokeStyle = 'blue';
      this.canvasContext.stroke();
      this.currentMapLines.push({
        initialPoint: lastPosition,
        finalPoint: currentPosition
      });
    }
  }

  // Get mouse position
  getMousePos(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width,
      y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height
    };
  }

  // Add a point in the canvas
  addDot(e) {
    this.currentPosition = this.getMousePos(e);
    if (this.canvas.getContext) {
      this.drawPoint(this.currentPosition);
      this.addLine(this.currentPosition, this.lastPosition);
      this.lastPosition = this.currentPosition;
    }
  }

  // Clear the canvas
  clearCanvas() {
    this.currentMapName = '';
    this.currentMapLines = [];
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lastPosition = undefined;
    this.currentPosition = undefined;
    this.buttonDisabled = true;
  }

  // Enable/disable save button based on input value existence
  onKey() {
    if (this.currentMapName) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
  }

  // Save the map when the save button is clicked
  saveMap() {
    this.maps.push({
      name: this.currentMapName,
      lines: this.currentMapLines,
      date: Date.now()
    });
    this.clearCanvas();
  }

  // Upload an existent map on the canvas
  uploadMap(i: number) {
    this.clearCanvas();
    const selectedMap = this.maps[i];
    this.currentMapName = selectedMap.name;
    this.buttonDisabled = false;
    selectedMap.lines.forEach(line => {
      const initialPoint = line.initialPoint;
      const finalPoint = line.finalPoint;
      this.drawPoint(initialPoint);
      this.drawPoint(finalPoint);
      this.addLine(initialPoint, finalPoint);
    });
  }

  // Draw a point on the canvas
  drawPoint(position) {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(position.x, position.y);
    this.canvasContext.arc(position.x, position.y, 5, 0, 2 * Math.PI);
    this.canvasContext.lineWidth = 1;
    this.canvasContext.fillStyle = 'blue';
    this.canvasContext.fill();
    this.canvasContext.stroke();
  }

}
