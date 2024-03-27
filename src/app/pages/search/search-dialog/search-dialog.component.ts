import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consult } from '../../../model/consult';
import { ConsultService } from '../../../services/consult.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [MaterialModule, DatePipe],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.css'
})
export class SearchDialogComponent implements OnInit {

  consult:Consult;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Consult,
    private consultService: ConsultService
  ){}

  ngOnInit(): void {
      this.consult= {... this.data};

  }
}
