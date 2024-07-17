import { Component, Inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageStoreService } from '../services/image-store.service';
import { CommentObject, ImageObject } from '../interfaces/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { ImageEditorComponent } from '@syncfusion/ej2-angular-image-editor';
import { ImageEditorDialogComponent } from '../image-editor-dialog/image-editor-dialog.component';
import { UpdateImageComponent } from '../update-image/update-image.component';
import { DeleteCommentComponent } from '../delete-comment/delete-comment.component';
import { DeleteImageComponent } from '../delete-image/delete-image.component';

@Component({
  selector: 'app-open-image',
  templateUrl: './open-image.component.html',
  styleUrl: './open-image.component.css'
})
export class OpenImageComponent implements OnInit {
  imageId: number;
  imagePath: string;
  image: ImageObject[] = [];
  comments: CommentObject[] = [];
  imageChangedEvent: any;
  commentForm!: FormGroup;
  userId!: number;
  ownersUserId!: number;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<OpenImageComponent>, @Inject(MAT_DIALOG_DATA) public data: { image: any }, private imageStoreService: ImageStoreService, private _snackBar: MatSnackBar, private dataService: DataService, private userService: UserService) {
    this.imageId = data.image.image_id;
    this.imagePath = `http://localhost/AppDevSoloProject/photoGallery/server/modules/backend_uploadedImages/${data.image.image_path}`
    this.ownersUserId = data.image.user_id;
    this.userId = this.userService.getUserId()!;

    console.log("owner: ", this.ownersUserId);


  }

  onExit(): void {
    this.dialogRef.close();
  }

  imageEditor(image_path: string) {
    console.log(image_path)
    this.dialog.open(ImageEditorDialogComponent, { width: '70rem', height: '50rem', data: { image_path } });
  }

  updateImage(image_id: number) {
    this.dialog.open(UpdateImageComponent, { width: '100rem', height: '50rem', data: { image_id } });

    console.log(image_id)
  }

  onFileSelected(event: any) {
    this.imageChangedEvent = event;
  }

  updateVariables() {
    this.imagePath = `http://localhost/AppDevSoloProject/photoGallery/server/modules/backend_uploadedImages/${this.image[0].image_path}`
    console.log(this.image[0].image_path)
  }

  createNewCommentFromPayload(payload: any): CommentObject {
    return {
      comment_id: payload.commentId,
      image_id: payload.imageId,
      user_id: payload.userId,
      messages: payload.messages,
      comment_date: payload.commentDate,
      user_fname: payload.userFName,
      user_lname: payload.userLName
    }
  }


  deleteImage() {
    const image_id = this.imageId;

    this.dialog.open(DeleteImageComponent, { width: '25rem', height: '8rem', data: { image_id } });

  }

  deleteComment(comment_id: number) {
    console.log(comment_id)

    this.dialog.open(DeleteCommentComponent, { width: '25rem', height: '8rem', data: { comment_id } });
  }


  onSubmit() {
    if (this.commentForm.valid) {

      console.log(this.commentForm.value);

      const comment = this.commentForm.value.comment;
      const imageId = this.imageId;

      this.commentForm.reset();

      console.log(comment)
      console.log(imageId)
      console.log(this.userId);


      this.dataService.addComment(comment, imageId, this.userId, "addComment").pipe(
        tap((event: HttpResponse<any>) => {
          if (event.type === HttpEventType.Response) {
            if (event.body.status.remarks === 'success') {
              const newComment = this.createNewCommentFromPayload(JSON.parse(event.body.payload));
              console.log(newComment);
              this.imageStoreService.addComment(newComment, imageId);

              this._snackBar.open('Successfully commented', 'Close', {
                duration: 5000,
              });
            }
          }
        })
      ).subscribe();
    }

    this.imageStoreService.comments$.subscribe(comments => {
      this.comments = comments;
    });
  }

  ngOnInit(): void {
    // this.imageStoreService.getImage(this.imageId).subscribe(image => {
    //   this.image = image;
    //   this.updateVariables();
    //   console.log(this.image);
    // })

    this.commentForm = new FormGroup({
      comment: new FormControl('', Validators.required)
    });

    // this.imageStoreService.comments$.subscribe(comments => {
    //   this.comments = comments;
    // });
    this.imageStoreService.comments$.subscribe(comments => {
      this.comments = comments;
    });

    this.imageStoreService.getComment(this.imageId).subscribe(comments => {
      this.comments = comments;
    });

    // this.imageStoreService.comments$.subscribe(comments => {
    //   this.comments = comments;
    // });

  }
}
