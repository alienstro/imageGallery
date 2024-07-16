import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageEditorComponent } from '@syncfusion/ej2-angular-image-editor';

@Component({
  selector: 'app-image-editor-dialog',
  templateUrl: './image-editor-dialog.component.html',
  styleUrl: './image-editor-dialog.component.css'
})
export class ImageEditorDialogComponent {
  imagePath: string = '';

  constructor(public dialogRef: MatDialogRef<ImageEditorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { image_path: string }) {
    this.imagePath = this.data.image_path;

  }
  @ViewChild('imageEditor')
  public editorObject !: ImageEditorComponent;

  public openImage(): void {
    this.editorObject.open(this.imagePath);
  }

}
