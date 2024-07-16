import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  uploadImages(file: File, userId: number, request: string): Observable<any> {
    const uploadData = new FormData();
    const url = `${API_URL}${request}`;


    uploadData.append('userFile', file, file.name);

    uploadData.append('userId', userId.toString());

    return this.http.post(url, uploadData, {
      observe: 'events'
    });
  }

  updateImage(file: File, userId: number, imageId: number, request: string): Observable<any> {
    const uploadData = new FormData();
    const url = `${API_URL}${request}`;

    uploadData.append('userFile', file, file.name);

    uploadData.append('userId', userId.toString());

    uploadData.append('imageId', imageId.toString());

    return this.http.post(url, uploadData, {
      observe: 'events'
    });
  }

  deleteImage(imageId: number, request: string): Observable<any> {
    const url = `${API_URL}${request}`;
    const data = {
      imageId: imageId,
    }

    return this.http.post(url, data, {
      observe: 'events'
    });
  }


  addComment(comment: string, imageId: number, userId: number, request: string): Observable<any> {

    console.log(comment)
    const url = `${API_URL}${request}`;
    const data = {
      imageId: imageId,
      comment: comment,
      userId: userId,
    }
    return this.http.post(url, data, {
      observe: 'events',
    });
  }

  login(email: string, password: string, request: string): Observable<any> {
    const url = `${API_URL}${request}`;
    const data = {
      email: email,
      password: password,
    }
    return this.http.post(url, data, {
      observe: 'events',
    });
  }

  signup(email: string, password: string, firstname: string, lastname: string, request: string): Observable<any> {
    const url = `${API_URL}${request}`;
    const data = {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
    }
    return this.http.post(url, data, {
      observe: 'events',
    });
  }
}
