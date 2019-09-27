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
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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
    NgbPaginationModule,
    MatProgressSpinnerModule,
    DragDropModule,
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
