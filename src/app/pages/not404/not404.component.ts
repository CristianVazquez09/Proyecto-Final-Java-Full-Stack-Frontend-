import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not404',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not404.component.html',
  styleUrl: './not404.component.css'
})
export class Not404Component implements OnInit{

  

  username: string;

 
  ngOnInit(): void {
      const helper = new JwtHelperService();
      const token = sessionStorage.getItem(environment.TOKEN_NAME);
      const decodedToken = helper.decodeToken(token);
      this.username = decodedToken.sub;
  }

}
