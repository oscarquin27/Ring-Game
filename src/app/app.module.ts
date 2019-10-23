import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UtilsService } from './utils/utils.service';
import {HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbPopoverModule,
    NgbTabsetModule,
    NgbModalModule,
    NgbPaginationModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    DragDropModule,
    MatMenuModule,
    MatRadioModule,
    LoggerModule.forRoot({
      level:
        NgxLoggerLevel.INFO ||
        NgxLoggerLevel.DEBUG
    }),
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [UtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
