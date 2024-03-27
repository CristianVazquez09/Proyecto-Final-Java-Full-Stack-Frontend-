import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { LoginService } from '../../services/login.service';
import { Menu } from '../../model/menu';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialModule,NgIf,RouterLink,RouterOutlet, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  menus: Menu[];

  constructor(
    private menuService: MenuService,
    private loginService: LoginService
  ){}

  ngOnInit(): void {
      this.menuService.getMenuChange().subscribe(data => this.menus = data);
  }

  logout(){
    this.loginService.logout();
  }

}
