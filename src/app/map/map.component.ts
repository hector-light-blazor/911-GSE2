import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as esriLoader from 'esri-loader';

import { AppServiceService } from '../app-service.service';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'esri-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('map') mapObj: ElementRef;
  map:any = null;
  point: any;
  pointClass:any;
  circleClass:any;
  symbolClass:any;
  symbolLineOne:any;
  symbolLineTwo:any;

  graphicClass:any;

  secondLayerDynamic:any;

  mcallenLayerMedCare:any;
  missionLayerMedCare:any;
  emsTransferCallsLayer:any;
  dpsTransferCallsLayer:any;
  infotmp: any;

  pointCalls:any;
  emsCalls = [];
  emsArr = [];
  lawArr = [];
  fireArr = [];

  protected searchStr: string;


  closeTableBool:boolean = false;

  isAlive:boolean=true;
  constructor( private _appService: AppServiceService) { 
    //this.dataService = completerService.remote("https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/search/autoComplete/?auto=", "address", "address") //completerService.local(this.searchData, 'value', 'value');
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //this.showLoading();
    //First get right size of the map div...

    //Zoom geometry..
    this._appService.geometry.pipe(takeWhile(() => this.isAlive)).subscribe(value => {
        
            this.zoomAndDraMap(value);
  
  
       })

    // this._appService.geometry.takeWhile(() => this.isAlive).subscribe(value => {
        
    //        this.zoomAndDraMap(value);


    // });

    //control map...
    this._appService.contrlMap.pipe(takeWhile(() => this.isAlive)).subscribe(value => {
        console.log(value);
        if(value == 1){  //clear maps...
          this.map.graphics.clear();
        }
        else if(value == 2){ //display Layer law...
          let arr = this.secondLayerDynamic.visibleLayers;
          let upArr = [];
          let check = document.getElementById('checkLAW');
          
          if((<HTMLInputElement>check).checked)
          {
            arr.push(2);
            this.secondLayerDynamic.setVisibleLayers(arr);
          }else{
            for(var i = 0; i< arr.length; i++){
               if(arr[i] != 2){
                 upArr.push(arr[i]);
               }
            }
            this.secondLayerDynamic.setVisibleLayers(upArr);
          }
          
          
        }
        else if(value == 3){ //display Layer EMS...
          let arr = this.secondLayerDynamic.visibleLayers;
          let upArr = [];
          let check = document.getElementById('checkEMS');
          
          if((<HTMLInputElement>check).checked)
          {
            arr.push(0);
            this.secondLayerDynamic.setVisibleLayers(arr);
          }else{
            for(var i = 0; i< arr.length; i++){
               if(arr[i] != 0){
                 upArr.push(arr[i]);
               }
            }
            this.secondLayerDynamic.setVisibleLayers(upArr);
          }
          
          
        }
        else if(value == 4){ //display Layer FIRE...
          let arr = this.secondLayerDynamic.visibleLayers;
          let upArr = [];
          let check = document.getElementById('checkFIRE');
          
          if((<HTMLInputElement>check).checked)
          {
            arr.push(1);
            this.secondLayerDynamic.setVisibleLayers(arr);
          }else{
            for(var i = 0; i< arr.length; i++){
               if(arr[i] != 1){
                 upArr.push(arr[i]);
               }
            }
            this.secondLayerDynamic.setVisibleLayers(upArr);
          }
          
          
        }
        else if(value == 5) //Load Special Layers for medcare..
        {
          this.loadSpecialLayers();
        }
        else if(value == 6){
          console.log("I RAN HEMSLAYERS");
          this.loadSpecialHEMSLayers();
        }else if(value == 7){
          this.loadSpecialDPSLayers();
        }

    });
    

    this.calculateMapDiv();
    this.createMap();
   
  }


  ngOnChanges() {
      
    
  }

  //Table Close for ems
  closeTable(event){
    if(event.close){
      this.closeTableBool = false;
    }
  }
  openTable(){
    this.closeTableBool = true;
  }

  onSelectedSearch(event){
    
    if(this.pointClass && event){
        
        
        this.point = JSON.parse(event.originalObject.geometry);
        this.pointClass.setX(this.point.coordinates[0]);
        this.pointClass.setY(this.point.coordinates[1]);
        this.zoomAndDraMap(this.pointClass) 
       
    }
    
  }

  zoomAndDraMap(geometry:any){

        if(geometry.type == "point")
        {
           let circle = this.circleClass(geometry, {"radius": 180});
           this.map.centerAt(geometry, 15);
           this.map.setExtent(circle.getExtent());

           let symbol = this.symbolClass('assets/icon.png', 51, 51);
           this.map.graphics.clear();
           this.map.graphics.add(this.graphicClass(geometry, symbol));
        }else{
          
          this.map.setExtent(geometry.getExtent());

          this.map.graphics.clear();
          this.map.graphics.add(this.graphicClass(geometry, this.symbolLineOne));
          let self = this;
          setTimeout(function(){
              self.map.graphics.clear();
              self.map.graphics.add(self.graphicClass(geometry, self.symbolLineTwo));
              setTimeout(function(){
              self.map.graphics.clear();
              self.map.graphics.add(self.graphicClass(geometry, self.symbolLineOne));
              }, 1100);
          }, 1200);

          

          setTimeout(function(){
              self.map.graphics.clear();
              self.map.graphics.add(self.graphicClass(geometry, self.symbolLineTwo));
          }, 1500);
        }
       
  }




  onEnterSearch(){
    
    this._appService.swicthLeftPanel = true;
    this._appService.passAddressData([]);
    this._appService.GET_METHOD("search/geocoder/?address=" + this.searchStr, "GEOCODE").subscribe((response:any) => {
      // console.log(response);
       this._appService.passAddressData(response.match);
       this._appService.passStreetsData(response.ranges);
    })

  }

   createMap(){
   
      if(!this.map){
         esriLoader.dojoRequire(['esri/map',"esri/InfoTemplate", "esri/tasks/QueryTask", "esri/tasks/query","esri/layers/GraphicsLayer", "esri/layers/ArcGISDynamicMapServiceLayer", 
            "esri/geometry/Point", "esri/geometry/Circle", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol", 
            "esri/graphic"], (Map,InfoTemplate, QueryTask, Query, GraphicsLayer, ArcGISDynamicMapServiceLayer, Point, Circle, PictureMarkerSymbol,SimpleLineSymbol,  Graphic) => {
    // create map with the given options at a DOM node w/ id 'mapNode'
          this.graphicClass = Graphic;
          this.pointCalls  = Point;
          this.pointClass  = new Point;
          this.circleClass = Circle;
          this.symbolClass = PictureMarkerSymbol;
          
          this.infotmp = new InfoTemplate("Attributes", "${*}");

          this.symbolLineOne = new SimpleLineSymbol({
              "type": "esriSLS",
              "style": "esriSLSSolid",
              "color": [33, 150, 243],
              "width": 2
            });
            
          this.symbolLineTwo = new SimpleLineSymbol({
            "type": "esriSLS",
              "style": "esriSLSSolid",
              "color": [211, 47, 47],
              "width": 8
          });

          //Setup map...
          this.map = new Map(this.mapObj.nativeElement, {
            zoom: 4,
            slider: false,
            showAttribution: false
          });

          //setup layers..
          this.map.addLayer(new ArcGISDynamicMapServiceLayer("https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/MapFlex/MapServer"));
          
          this.secondLayerDynamic = new ArcGISDynamicMapServiceLayer("https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/RESPONDERS_POLYGON_DYNAMIC/MapServer/");

          this.secondLayerDynamic.setVisibleLayers([]);
          this.map.addLayer(this.secondLayerDynamic);
          
          //Generate EMS LAYERS FOR MEDCARE...

          this.mcallenLayerMedCare = new ArcGISDynamicMapServiceLayer("https://gis.lrgvdc911.org/arcgis/rest/services/ems/BOUNDARIES_MCALLEN_MEDCARE/MapServer");
          this.missionLayerMedCare = new ArcGISDynamicMapServiceLayer("https://gis.lrgvdc911.org/arcgis/rest/services/ems/BOUNDARIES_MISSION_MEDCARE/MapServer");
          this.emsTransferCallsLayer = new GraphicsLayer();
          this.dpsTransferCallsLayer = new GraphicsLayer();

          //setup query task and process query to dowload some data...
          let queryPara = new Query();
          queryPara.returnGeometry = true;
          queryPara.outFields = ["servicenumber", "dispname"];
          queryPara.where     = "1=1";
          queryPara.outSpatialReference = this.map.spatialReference;

          let queryTaskEms = new QueryTask("https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/RESPONDERS_POLYGON_DYNAMIC/MapServer/0");
          let queryTaskFire = new QueryTask("https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/RESPONDERS_POLYGON_DYNAMIC/MapServer/1");
          let queryTaskLaw = new QueryTask("https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/RESPONDERS_POLYGON_DYNAMIC/MapServer/2")

          //Lets start downloading data...
          let self = this;
          

          queryTaskFire.execute(queryPara, function(evt){
              self.fireArr = evt.features;
          });

          queryTaskEms.execute(queryPara, function(evt){
            self.emsArr = evt.features;
          });

          queryTaskLaw.execute(queryPara, function(evt){
               self.lawArr = evt.features;
          });


          // //boostrap event listener for mouse move on map...
          this.map.on("mouse-move", function(evt){
              
              let emsFound = false;
              let fireFound = false;
              let lawFound = false;
              
              setTimeout(function(){
                for(var i = 0; i < self.emsArr.length; i++){
                  if(self.emsArr[i].geometry.contains(evt.mapPoint)){
                      var medical = document.getElementById("medical");
                      if(medical)
                      {
                        medical.innerHTML = self.emsArr[i].attributes.dispname;
                        document.getElementById("medicalphone").innerHTML = self.emsArr[i].attributes.servicenumber;
                        break;
                      }

                      
                  }
              }
            }, 700);
            
            setTimeout(function(){
                for(var i = 0; i < self.fireArr.length; i++){
                  if(self.fireArr[i].geometry.contains(evt.mapPoint)){
                     
                    var fire = document.getElementById("fire");
                    if(fire) {
                      fire.innerHTML = self.fireArr[i].attributes.dispname;
                      document.getElementById("firephone").innerHTML = self.fireArr[i].attributes.servicenumber;
                      break;
                  }
                }
              }
            }, 400);
            
            setTimeout(function(){
                for(var i = 0; i < self.lawArr.length; i++){
                  if(self.lawArr[i].geometry.contains(evt.mapPoint)){

                    var law = document.getElementById("law");
                    if(law) {
                      law.innerHTML = self.lawArr[i].attributes.dispname;
                      document.getElementById("lawphone").innerHTML = self.lawArr[i].attributes.servicenumber;
                      break;
                    }
                  }
              }
              }, 500);
              


          });



        });
      }

  }

  mapResize(event){
     
    if(this.map){
      this.calculateMapDiv();
    }
      
  }

  calculateMapDiv(){
    let obj = document.getElementById("menuPanel");
    let bod = document.getElementsByTagName("BODY")[0];
    this.mapObj.nativeElement.style.width = ((bod.clientWidth - obj.clientWidth) - 2) + "px";
    if(this.map){
      this.map.reposition();
    }
  }

  loadSpecialLayers(){
    this.map.addLayer(this.mcallenLayerMedCare);
    this.map.addLayer(this.missionLayerMedCare);
    this.map.addLayer(this.emsTransferCallsLayer);

    this.getEMSTransfer("transferCallsMedcare/");
    this.getEMSTransferLoop("transferCallsMedcare/");
  }

  loadSpecialHEMSLayers(){
    this.map.addLayer(this.emsTransferCallsLayer);
    this.getEMSTransfer("transferCallsHEMS/");
    this.getEMSTransferLoop("transferCallsHEMS/");
  }

  loadSpecialDPSLayers(){

    this.map.addLayer(this.dpsTransferCallsLayer);
    this.getDPSTransfer('transferCallsDPS/')
    this.getDPSTransferLoop('transferCallsDPS/');
  }

  getDPSTransfer(name:string):void{
    let symbol = this.symbolClass('assets/ems_icon.png', 30, 20);

    this._appService.GET_METHOD("alispill/" + name, "MAIN").subscribe((response:any) => {
          
        if(response.hasOwnProperty('data')){


          //this.emsTransferCallsLayer.clear();
          if(this.emsCalls.length == 0){
            this.emsCalls = response.data;
             let size = response.data.length;
             
             //Sort array
             response.data.sort(function(a,b){
              let c:any = new Date(a.tmestmp);
              let d:any = new Date(b.tmestmp);
              return d - c;
              });

            for(var i = 0; i < size; i++){
              if(response.data[i].lng || response.data[i].lat)
              {
                
                response.data[i].point = new this.pointCalls(parseFloat(response.data[i].lng), parseFloat(response.data[i].lat));
                this.dpsTransferCallsLayer.add(this.graphicClass(response.data[i].point, symbol, response.data[i], this.infotmp));
              }
              response.data[i].ani = response.data[i].ani.replace("-", "").replace("-", "");
              
            }
          }
          else if( response.data.length > 0){
            this.emsCalls = response.data;
            let size = response.data.length;

            //Sort array by date

            response.data.sort(function(a,b){
              let c:any = new Date(a.tmestmp);
              let d:any = new Date(b.tmestmp);
              return d - c;
              });

            for(var i = 0; i < size; i++){
              if(response.data[i].lng || response.data[i].lat)
              {
                response.data[i].point = new this.pointCalls(parseFloat(response.data[i].lng), parseFloat(response.data[i].lat));
                this.dpsTransferCallsLayer.add(this.graphicClass(response.data[i].point, symbol, response.data[i], this.infotmp));
              }
              response.data[i].ani = response.data[i].ani.replace("-", "").replace("-", "");
              
            }
          }
        }
          
        });
  }

  getDPSTransferLoop(name:string){
    let symbol = this.symbolClass('assets/ems_icon.png', 30, 20);
    let self = this
    setInterval(function(){
        
        self._appService.GET_METHOD("alispill/" + name, "MAIN").subscribe((response:any) => {
          
          if(response.hasOwnProperty('data')){
              if(response.data.length > 0){
            self.emsCalls = response.data;
            self.dpsTransferCallsLayer.clear();

            let size = response.data.length;
            //Lets sort by date...
            response.data.sort(function(a,b){
              let c:any = new Date(a.tmestmp);
              let d:any = new Date(b.tmestmp);
              return d - c;
              });

              for(var i = 0; i < size; i++){
                if(response.data[i].lng || response.data[i].lat)
                {
                  response.data[i].point = new self.pointCalls(parseFloat(response.data[i].lng), parseFloat(response.data[i].lat));
                  self.dpsTransferCallsLayer.add(self.graphicClass(response.data[i].point, symbol, response.data[i], self.infotmp));
                }
                response.data[i].ani = response.data[i].ani.replace("-", "").replace("-", "");
                
              }
            }
          }

          
          
        });
    }, 8000);
  }

  getEMSTransfer(name:string):void{
    let symbol = this.symbolClass('assets/ems_icon.png', 30, 20);

    this._appService.GET_METHOD("alispill/" + name, "MAIN").subscribe((response:any) => {
          
        if(response.hasOwnProperty('data')){


          //this.emsTransferCallsLayer.clear();
          if(this.emsCalls.length == 0){
            this.emsCalls = response.data;
             let size = response.data.length;
             
             //Sort array
             response.data.sort(function(a,b){
              let c:any = new Date(a.tmestmp);
              let d:any = new Date(b.tmestmp);
              return d - c;
              });

            for(var i = 0; i < size; i++){
              if(response.data[i].lng || response.data[i].lat)
              {
                
                response.data[i].point = new this.pointCalls(parseFloat(response.data[i].lng), parseFloat(response.data[i].lat));
                this.emsTransferCallsLayer.add(this.graphicClass(response.data[i].point, symbol, response.data[i], this.infotmp));
              }
              response.data[i].ani = response.data[i].ani.replace("-", "").replace("-", "");
              
            }
          }
          else if( response.data.length > 0){
            this.emsCalls = response.data;
            let size = response.data.length;

            //Sort array by date

            response.data.sort(function(a,b){
              let c:any = new Date(a.tmestmp);
              let d:any = new Date(b.tmestmp);
              return d - c;
              });

            for(var i = 0; i < size; i++){
              if(response.data[i].lng || response.data[i].lat)
              {
                response.data[i].point = new this.pointCalls(parseFloat(response.data[i].lng), parseFloat(response.data[i].lat));
                this.emsTransferCallsLayer.add(this.graphicClass(response.data[i].point, symbol, response.data[i], this.infotmp));
              }
              response.data[i].ani = response.data[i].ani.replace("-", "").replace("-", "");
              
            }
          }
        }
          
        });
  }
  getEMSTransferLoop(name:string):void{
    let symbol = this.symbolClass('assets/ems_icon.png', 30, 20);
    let self = this
    setInterval(function(){
        
        self._appService.GET_METHOD("alispill/" + name, "MAIN").subscribe((response:any) => {
          
          if(response.hasOwnProperty('data')){
              if(response.data.length > 0){
            self.emsCalls = response.data;
            self.emsTransferCallsLayer.clear();

            let size = response.data.length;
            //Lets sort by date...
            response.data.sort(function(a,b){
              let c:any = new Date(a.tmestmp);
              let d:any = new Date(b.tmestmp);
              return d - c;
              });

              for(var i = 0; i < size; i++){
                if(response.data[i].lng || response.data[i].lat)
                {
                  response.data[i].point = new self.pointCalls(parseFloat(response.data[i].lng), parseFloat(response.data[i].lat));
                  self.emsTransferCallsLayer.add(self.graphicClass(response.data[i].point, symbol, response.data[i], self.infotmp));
                }
                response.data[i].ani = response.data[i].ani.replace("-", "").replace("-", "");
                
              }
            }
          }

          
          
        });
    }, 8000);
    


  }

  zoomTo(event){
     if(event){
       if(event.point){
           let circle = this.circleClass(event.point, {"radius": 180});
           this.map.centerAt(event.point);
           this.map.setExtent(circle.getExtent());
       }
     }
    
  }

}
