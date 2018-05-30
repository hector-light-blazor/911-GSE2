import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AddressResultsComponent } from './address-results/address-results.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { TableDataComponent } from './table-data/table-data.component';
import { RemoveSpacesPipe } from './remove-spaces.pipe';
import { HttpModule } from '@angular/http';
import { DataTablePipe } from './data-table.pipe';


@NgModule({
  declarations: [
    AppComponent,
    AddressResultsComponent,
    LeftPanelComponent,
    LoginComponent,
    MapComponent,
    TableDataComponent,
    RemoveSpacesPipe,
    DataTablePipe
  ],
  imports: [
    BrowserModule, HttpModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
