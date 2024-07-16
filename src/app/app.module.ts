import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddImageComponent } from './add-image/add-image.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OpenImageComponent } from './open-image/open-image.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from './login/dialog/dialog.component';
import { ImageEditorModule } from '@syncfusion/ej2-angular-image-editor';
import { ImageEditorDialogComponent } from './image-editor-dialog/image-editor-dialog.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AddImageComponent,
    OpenImageComponent,
    LoginComponent,
    DialogComponent,
    ImageEditorDialogComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ImageEditorModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
