import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from '@angular/http';

 import { Subject, Observable, Subscription } from 'rxjs'; ///Subject';
 import {map} from "rxjs/operators";
// import {Observable, Subscription} from 'rxjs/Rx';



@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  mainURL = "https://gis.lrgvdc911.org/php/911/index.php/";

  geocodeURL = "https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/";

  swicthLeftPanel:boolean = false;
  loginPanel:boolean = true;

  public addressData = new Subject<any[]>();
  
  public streetsData = new Subject<any[]>();

  public geometry  = new Subject<any>();

  public contrlMap = new Subject<number>();

  public contrLeftPanel = new Subject<any>();

  constructor(private _http: Http) { }

  passAddressData(val:any){
    this.addressData.next(val);
  }

  passStreetsData(val:any){
     this.streetsData.next(val);
  }

  passGeometryToMap(val:any){
    this.geometry.next(val);
  }
  
  controlMap(num:number){
    if(num == 5){
      let _self = this;
      setTimeout(function() {
        _self.contrlMap.next(num);
      }, 500);
    }else{
      this.contrlMap.next(num);
    }
    
  }

  controlLeftPanel(object:any){
      this.contrLeftPanel.next(object);
  }

  GET_ESRI(site){
    //this._http.get().
    return this._http.get(site).pipe(map((response: Response) => response.json()));
  }

  GET_METHOD(site, selection){
    if(selection == "GEOCODE"){
      return this._http.get(this.geocodeURL + site).pipe(map((response: Response)=> response.json()));
    }else{
      return this._http.get(this.mainURL + site).pipe(map((response: Response)=> response.json()));
    }
    
  }

  POST_METHOD(site, data){
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option
     return this._http.post(this.mainURL + site, {data: data}, options) // ...using post request
            .pipe(map((res:Response) => res.json())) // ...and calling .json() on the response to return data
           //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  emitPanelChanges(){
    
  }
}
