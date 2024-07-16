import { Component, Inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageStoreService } from '../services/image-store.service';

@Component({
  selector: 'app-delete-image',
  templateUrl: './delete-image.component.html',
  styleUrl: './delete-image.component.css'
})
export class DeleteImageComponent {
  image_id!: number;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DeleteImageComponent>, private imageStoreService: ImageStoreService, private dataService: DataService, private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: { image_id: any }) {
    this.image_id = data.image_id;
  }

  close() {
    this.dialogRef.close();
  }

  deleteComment() {

    this.dataService.deleteImage(this.image_id, "deleteImage").pipe(
      tap((event: HttpResponse<any>) => {
        if (event.type === HttpEventType.Response) {
          if (event.body.status.remarks === 'success') {

            this.imageStoreService.deleteImage(this.image_id);

            this._snackBar.open('Successfully deleted an image', 'Close', {
              duration: 5000,
            });
            this.dialog.closeAll();
          }
        }
      })
    ).subscribe();
  }
}
