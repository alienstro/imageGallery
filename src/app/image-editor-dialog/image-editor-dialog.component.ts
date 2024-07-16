import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageEditorComponent } from '@syncfusion/ej2-angular-image-editor';
import { ImageStoreService } from '../services/image-store.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';
import { DataService } from '../services/data.service';
import { ImageObject } from '../interfaces/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-editor-dialog',
  templateUrl: './image-editor-dialog.component.html',
  styleUrls: ['./image-editor-dialog.component.css']
})
export class ImageEditorDialogComponent {
  imagePath: string = '';
  images: any[] = [];

  constructor(public dialogRef: MatDialogRef<ImageEditorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { image_path: string }, private imageStoreService: ImageStoreService, private dataService: DataService, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.imagePath = this.data.image_path;
  }

  @ViewChild('imageEditor') public editorObject!: ImageEditorComponent;

  public openImage(): void {
    this.editorObject.open(this.imagePath);
  }

  // updateNewImageFromPayload(payload: any): ImageObject {
  //   return {
  //     image_id: payload.imageId,
  //     user_id: payload.userId,
  //     image_name: payload.imageName,
  //     image_size: payload.imageSize,
  //     image_ext: payload.imageExt,
  //     image_date_created: payload.imageDateCreated,
  //     image_path: payload.imagePath
  //   };
  // }
}