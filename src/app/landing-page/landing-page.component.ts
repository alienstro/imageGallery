import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddImageComponent } from '../add-image/add-image.component';
import { ImageStoreService } from '../services/image-store.service';
import { ImageObject } from '../interfaces/interfaces';
import { OpenImageComponent } from '../open-image/open-image.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {

  images: ImageObject[] = [];

  constructor(public dialog: MatDialog, private imageStoreService: ImageStoreService, private router: Router, private userService: UserService) {

  }

  uploadImageDialog() {
    this.dialog.open(AddImageComponent, {width: '30rem', height: '40rem', data:{}});
  }

  checkImages() {
    console.log(this.images);
  }

  getImageUrl(image_path: string): string {
    return `http://localhost/AppDevSoloProject/photoGallery/server/modules/backend_uploadedImages/${image_path}`;
  }

  openImage(image: any) {
    this.dialog.open(OpenImageComponent,{width: '70rem', height: '50rem', data: { image }})
  }

  logout() {
    this.router.navigate(['/login']);
    this.userService.logout();
  }

  ngOnInit(): void {
    
    // this.imageStoreService.imagesLoaded$.subscribe(() => {
    //   this.imageStoreService.images$.subscribe(files => {
    //     this.images = files;
    //   });
    // })

    this.imageStoreService.images$.subscribe(files => {
      this.images = files;
    });

    if(this.imageStoreService.getImageState().length === 0) {
      this.imageStoreService.getImages().subscribe(files => {
        this.images = files;
      });
    } else {
      this.images = this.imageStoreService.getImageState();
    }
    
  }
}
