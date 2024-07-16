import { Component, Inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageStoreService } from '../services/image-store.service';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrl: './delete-comment.component.css'
})
export class DeleteCommentComponent {
  comment_id!: number;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DeleteCommentComponent>, private imageStoreService: ImageStoreService, private dataService: DataService, private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: { comment_id: any }) {
    this.comment_id = data.comment_id;
  }

  close() {
    this.dialogRef.close();
  }

  deleteComment(comment_id: number) {

    this.dataService.deleteComment(comment_id, "deleteComment").pipe(
      tap((event: HttpResponse<any>) => {
        if (event.type === HttpEventType.Response) {
          if (event.body.status.remarks === 'success') {

            this.imageStoreService.deleteComment(comment_id);

            this._snackBar.open('Successfully deleted a comment', 'Close', {
              duration: 5000,
            });

            this.dialogRef.close();
          }
        }
      })
    ).subscribe();

    // this.imageStoreService.comments$.subscribe(comments => {
    //   this.comments = comments;
    // });
  }
}
