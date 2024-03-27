import { Component, OnInit, ViewChild } from '@angular/core';
import { MedicService } from '../../services/medic.service';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { Medic } from '../../model/medic';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';

@Component({
  selector: 'app-medic',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.css'
})
export class MedicComponent implements OnInit{

  constructor(
    private medicService:MedicService,
    private _dialog:MatDialog,
    private _snackBar: MatSnackBar){
  }

  dataSource: MatTableDataSource<Medic>;
  displayedColumns: string[] = [
    'idMedic',
    'primaryName',
    'surname',
    'cmpMedic',
    'actions',
  ];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.medicService.findAll().subscribe((data)=> {
     this.createTable(data);
    });

    this.medicService.getMedicChange().subscribe((data)=>{
      this.createTable(data);
    })

    this.medicService.getMessageChange().subscribe((data)=>{
      this._snackBar.open(data, 'INFO', {duration:2000})
    })
  }

  createTable(data:Medic[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  openDialog(medic?:Medic){
    this._dialog.open(MedicDialogComponent, {
      width:'550px',
      data:medic,
      disableClose:false
    })
  }

  delete(id: number) {
    this.medicService.delete(id).
    pipe(switchMap(()=>this.medicService.findAll()))
    .subscribe((data)=>{
      //this.createTable(data);
      this.medicService.setMedicChange(data);
      this.medicService.setMessageChange('DELETED!')
    })
  }
}




