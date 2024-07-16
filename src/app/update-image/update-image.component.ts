import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ImageStoreService } from '../services/image-store.service';
import { DataService } from '../services/data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageObject } from '../interfaces/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, concatMap, finalize, from, tap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-update-image',
  templateUrl: './update-image.component.html',
  styleUrl: './update-image.component.css'
})
export class UpdateImageComponent {
  trigger: any;
  userId!: number;
  imageId!: number;

  constructor(private userService: UserService, private imageStoreService: ImageStoreService, private dataService: DataService, public dialogRef: MatDialogRef<UpdateImageComponent>, public dialog: MatDialog, private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: { image_id: any }) {
    this.userId = this.userService.getUserId()!;
    this.imageId = this.data.image_id;

  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile?: File
  myFiles: File[] = [];
  folderName: string = '';
  fileNames: string[] = [];
  isUploaded = false;
  isLoading = false;
  filePreview: string | ArrayBuffer | null = null;

  onExit(): void {
    this.dialogRef.close();
  }

  onDrop(event: CdkDragDrop<File[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.myFiles, event.previousIndex, event.currentIndex);
    } else {
      event.item.data.forEach((file: File) => {
        this.myFiles.push(file);
      });
    }
  }

  onFileChanged(event: any) {
    this.myFiles = []; 
    const file = event.target.files[0];
    this.myFiles.push(file); 
    this.generateFilePreview(file);
  }

  generateFilePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.filePreview = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  deleteFile(index: number) {
    this.myFiles.splice(index, 1);

    if (this.myFiles.length === 1) {
      this.generateFilePreview(this.myFiles[0]);
    }
  }


  updateNewImageFromPayload(payload: any): ImageObject {
    return {
      image_id: payload.imageId,
      user_id: payload.userId,
      image_name: payload.imageName,
      image_size: payload.imageSize,
      image_ext: payload.imageExt,
      image_date_created: payload.imageDateCreated,
      image_path: payload.imagePath
    };
  }

  onUpdate() {
    console.log('Upload file:', this.myFiles[0]);
    console.log(this.userId);
    console.log(this.myFiles[0])
  
    this.isLoading = true;
    from([this.myFiles[0]]).pipe(
      concatMap(file => {
        return this.dataService.updateImage(file, this.userId, this.imageId, "editImage").pipe(
          tap((event: HttpResponse<any>) => {
            if (event.type === HttpEventType.Response) {
              if (event.body.status.remarks === 'success') {
                const newImage = this.updateNewImageFromPayload(JSON.parse(event.body.payload));
                this.imageStoreService.updateImage(newImage);
                this.dialogRef.close();
                this.dialog.closeAll();
                this._snackBar.open('Image updated successfully!', 'Close', {
                  duration: 5000,
                });
              }
            }
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 404 && error.error.status.message === 'Only image files are allowed') {
              this._snackBar.open('Only image files are allowed', 'Close', {
                duration: 8000,
              });
              this.dialogRef.close();
            } else {
              this._snackBar.open('Error uploading file', 'Close', {
                duration: 5000,
              });
              this.dialogRef.close();
            }
            return throwError(error);
          }),
          finalize(() => {
            this.myFiles = []; 
            this.isLoading = false;
          })
        );
      })
    ).subscribe();
  }
}
