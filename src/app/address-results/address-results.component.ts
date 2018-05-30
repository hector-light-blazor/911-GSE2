import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import {RemoveSpacesPipe} from "../remove-spaces.pipe";
import * as esriLoader from 'esri-loader';
import {takeWhile} from 'rxjs/operators';
@Component({
  selector: 'address-results',
  templateUrl: './address-results.component.html',
  styleUrls: ['./address-results.component.css']
})
export class AddressResultsComponent implements OnInit {

  isAlive: boolean = true;
  addressData = [];
  streetsData = [];

  addressLength:number = 0;
  streetsLength:number = 0;

  polyline:any=null;
  point:any = null;

  holdSelectedAddress:any;
  constructor(private _appService: AppServiceService) 
  { }

  ngOnInit() {
    this.addressData = [];
    this._appService.addressData.pipe(takeWhile(() => this.isAlive)).subscribe(value => {
        if(value){
          this.addressLength = value.length;
          var obj = this.groupBy(value, "msagcommunity");
          this.addressData = obj;
        }
        
      }); 

    this._appService.streetsData.pipe(takeWhile(() => this.isAlive)).subscribe(value => {
        if(value){
          this.streetsLength = value.length;
          var obj = this.groupBy(value, "msagcommunityleft");
          this.streetsData = obj;
        }
        
    }); 

    //lets load the geometry polyline....
    this.loadPolyline()



  }

  transformGeometry(objct:any){
    if(this.holdSelectedAddress) this.holdSelectedAddress.selected = false;
    
    objct.selected = true;

    this.holdSelectedAddress = objct;
    let geom = JSON.parse(objct.geometry); 
    if(geom.type == "Point"){
       let pnt  = this.point({"x": geom.coordinates[0], "y": geom.coordinates[1], "spatialReference": {"wkid": 4326 } });
       this._appService.passGeometryToMap(pnt);
    } else{
       let poly = this.polyline(geom.coordinates);
       this._appService.passGeometryToMap(poly);
    }
   
  }

  closeResultsPanel(){
    if(this.holdSelectedAddress) this.holdSelectedAddress.selected = false;

    this.addressData = this.streetsData =  [];

    this.addressLength = this.streetsLength = 0;

    this._appService.swicthLeftPanel = false;

    this._appService.controlMap(1);
  }

  loadPolyline(){
      esriLoader.dojoRequire(["esri/geometry/Point", "esri/geometry/Polyline"], (point, Polyline) => {
          this.polyline = Polyline;
          this.point    = point;
       });
  }

  groupBy(collection, property) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
        {
            collection[i].selected = false;
            result[index].data.push(collection[i]);
            
        }     
        else {
            values.push(val);
            collection[i].selected = false;
            result.push({"name": val,"data" : [collection[i]]});
        }
    }
    return result;
  }
}
