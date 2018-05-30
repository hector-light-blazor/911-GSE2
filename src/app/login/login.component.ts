import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private  username:string="";
  private  password:any="";
  constructor(private _appService: AppServiceService) { }

  ngOnInit() {
  }


  checkLogin(){
    
    let object = {username: this.username, pass: btoa(this.password)};

    this._appService.POST_METHOD("users/checkLogin/", object).subscribe((response:any) => {
      console.log(response)
      //let body = JSON.parse(response._body);
        if(response.answer){
          
                    this._appService.loginPanel = false;
        
          
          console.log(this.username);
          if(this.username == "medcare"){
            this._appService.controlMap(5);
          }else if(this.username == "hems"){
            var self = this;
            setTimeout(function() {
              self._appService.controlMap(6);
            }, 200);
            
          }else if(this.username == "dps"){
            var self = this;
            setTimeout(function() {
              self._appService.controlMap(7);
            }, 200);
          }


          

           
        }
    });
  }

}
