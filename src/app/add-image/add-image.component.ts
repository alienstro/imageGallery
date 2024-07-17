import { Component, ElementRef, ViewChild } from '@angular/core';
import { ImageStoreService } from '../services/image-store.service';
import { DataService } from '../services/data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageObject } from '../interfaces/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, concatMap, finalize, from, tap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrl: './add-image.component.css'
})
export class AddImageComponent {
  trigger: any;
  userId!: number;

  constructor(private userService: UserService, private imageStoreService: ImageStoreService, private dataService: DataService, public dialogRef: MatDialogRef<AddImageComponent>, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.userId = this.userService.getUserId()!;
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile?: File
  myFiles: File[] = [];
  folderName: string = '';
  fileNames: string[] = [];
  isUploaded = false;
  isLoading = false;
  filePreviews: (string | ArrayBuffer | null)[] = [];

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
    const files = event.target.files;
    this.myFiles = [...this.myFiles, ...files];
    this.generateFilePreviews(this.myFiles); 
    console.log(this.myFiles.length);
  }
  generateFilePreviews(files: File[]) {
    this.filePreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = (event: any) => {
        this.filePreviews.push(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  deleteFile(index: number) {
    this.myFiles.splice(index, 1);
    this.filePreviews.splice(index, 1);
  }

  createNewImageFromPayload(payload: any): ImageObject {
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

  onUpload() {
    console.log('Upload files:', this.myFiles);
    console.log(this.userId);

    this.isLoading = true;
    from(this.myFiles).pipe(
      concatMap(file => {
        return this.dataService.uploadImages(file, this.userId, "imageUpload").pipe(
          tap((event: HttpResponse<any>) => {
            if (event.type === HttpEventType.Response) {

              if (event.body.status.remarks === 'success') {
                const newImage = this.createNewImageFromPayload(JSON.parse(event.body.payload));
                this.imageStoreService.addImage(newImage);
                this.dialogRef.close();
                this._snackBar.open('Image uploaded successfully!', 'Close', {
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
            this.myFiles = []; // reset the count
            this.isLoading = false;
          })
        );
      })
    ).subscribe();
  }
}
