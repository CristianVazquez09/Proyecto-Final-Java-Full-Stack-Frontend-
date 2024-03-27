import { Component, OnInit, ViewChild } from '@angular/core';
import { VitalSignsService } from '../../services/vital-signs.service';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { VitalSign } from '../../model/vitalSign';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vital-signs',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './vital-signs.component.html',
  styleUrl: './vital-signs.component.css'
})
export class VitalSignsComponent implements OnInit{

  dataSource: MatTableDataSource<VitalSign>;

  displayedColumns: string[] = [
    'idVitalSign',
    'patient',
    'dateVitalSign',
    'temperature',
    'heartbeat',
    'respiratoryRate',
    'actions'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number = 0;

  constructor(
    private vitalSignService: VitalSignsService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute){}


  ngOnInit(): void {

    this.vitalSignService.listPageable(0, 3).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });

    this.vitalSignService.getVitalSignChange().subscribe((data) => {
      this.createTable(data);
    });

    this.vitalSignService.getMessageChange().subscribe((data) => {
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }

  createTable(data: VitalSign[]){    
    this.dataSource = new MatTableDataSource(data);   
    this.dataSource.sort = this.sort;
  }

  applyFilter(e: any) {
    
    this.dataSource.filter = e.target.value.trim();

  }

  delete(id: number) {
    this.vitalSignService
      .delete(id)
      .pipe(switchMap(() => this.vitalSignService.findAll()))
      .subscribe((data) => {
        this.vitalSignService.setVitalSignChange(data);
        this.vitalSignService.setMessageChange('DELETED!');
      });
  }

  showMore(e: any){
    this.vitalSignService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

}
