import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css']
})
export class LeftPanelComponent implements OnInit {

  constructor(private _appService:AppServiceService) { }

  ngOnInit() {
  }


  changeLayer(number:number){
    
    this._appService.controlMap(number)
  }

}
