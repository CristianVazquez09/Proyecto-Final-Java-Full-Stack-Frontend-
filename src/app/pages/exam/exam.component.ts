import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { NgFor } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Exam } from '../../model/exam';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [NgFor, MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent implements OnInit {
  dataSource: MatTableDataSource<Exam>;
  displayedColumns: string[] = [
    'idExam',
    'nameExam',
    'descriptionExam',
    'actions'
  ];

  //patients: Patient[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private examService: ExamService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.examService.findAll().subscribe((data) => {
      this.createTable(data);
    });

    this.examService.getExamChange().subscribe((data) => {
      this.createTable(data);
    });

    this.examService.getMessageChange().subscribe((data) => {
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }

  createTable(data:   Exam[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number) {
    this.examService
      .delete(id)
      .pipe(switchMap(() => this.examService.findAll()))
      .subscribe((data) => {
        this.examService.setExamChange(data);
        this.examService.setMessageChange('DELETED!');
      });
  }
}
