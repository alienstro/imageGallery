import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentObject, ImageObject } from '../interfaces/interfaces';
import { BehaviorSubject, filter, forkJoin, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageStoreService {



  private _images = new BehaviorSubject<ImageObject[]>([]);
  private _comments = new BehaviorSubject<CommentObject[]>([]);

  constructor(private http: HttpClient) {
    forkJoin({
      images: this.getImages(),
      // comments: this.getComments()
    }).subscribe(({ images }) => {
      this._images.next(images);
      // this._comments.next(comments);
    });
  }

  images$ = this._images.asObservable();
  comments$ = this._comments.asObservable();

  imagesLoaded$ = this._images.asObservable().pipe(filter(files => files.length >= 0));

  getImages() {
    const url = "http://localhost/APPDEVSOLOPROJECT/photogallery/server/fetchImages";
    return this.http.get<ImageObject[]>(url)
  }

  getImage(imageId: number) {
    const url = "http://localhost/APPDEVSOLOPROJECT/photogallery/server/fetchImageById";
    const params = new HttpParams().set('imageId', imageId.toString());
    return this.http.get<ImageObject[]>(url, { params }).pipe(
      tap(image => {
        this._images.next(image);
      })
    )
  }

  getComments() {
    const url = "http://localhost/APPDEVSOLOPROJECT/photogallery/server/fetchComments";
    return this.http.get<CommentObject[]>(url)
  }

  getComment(imageId: number) {
    const url = "http://localhost/APPDEVSOLOPROJECT/photogallery/server/fetchCommentById";
    const params = new HttpParams().set('imageId', imageId.toString());
    return this.http.get<CommentObject[]>(url, { params }).pipe(
      tap(comment => {
        this._comments.next(comment);
      })
    )
  }

  setImageState(newImagesState: ImageObject[]) {
    this._images.next(newImagesState);
  }

  setCommentState(newCommentsState: CommentObject[]) {
    this._comments.next(newCommentsState);
  }

  getImageState() {
    return this._images.getValue();
  }

  getCommentState() {
    return this._comments.getValue();
  }

  addImage(newImage: ImageObject) {
    const currentState = this._images.value;

    console.log(currentState);

    const newState = [...currentState, newImage];

    console.log(newState);

    console.log("this is the new file: ", newImage)

    this.setImageState(newState);
    // this._images.next(newState);
  }

  addComment(newComment: CommentObject, id: number) {
    // const imageToComment = this._images.value.find(image => image.image_id === id);

    // const currentImages = [...this._images.value];
    // const index = currentImages.findIndex(image => image.image_id === id);
    // currentImages[index] = {...imageToComment, }

    console.log('this._comments.value:', this._comments.value);

    const currentState = Array.isArray(this._comments.value) ? this._comments.value : [];
    const newState = [...currentState, newComment];

    this.setCommentState(newState);
  }

  deleteImage(id: number) {
    const currentState = this._images.value;

    const newState = currentState.filter(image => image.image_id !== id);

    this.setImageState(newState);
}

}