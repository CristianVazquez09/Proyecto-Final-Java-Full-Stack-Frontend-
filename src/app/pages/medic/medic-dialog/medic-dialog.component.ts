import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medic } from '../../../model/medic';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { MedicService } from '../../../services/medic.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-medic-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule, NgIf],
  templateUrl: './medic-dialog.component.html',
  styleUrl: './medic-dialog.component.css'
})
export class MedicDialogComponent implements OnInit{

  medic: Medic;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Medic,
    private _dialogRef: DialogRef,
    private medicService:MedicService
  ){

  }

  ngOnInit(): void {
    this.medic = {... this.data}
      //this.medic = this.data;
      /*this.medic = new Medic();
      this.medic.idMedic = this.data.idMedic;
      this.medic.primaryName = this.data.primaryName;
      this.medic.surname = this.data.surname;
      this.medic.photo = this.data.photo;*/
      
  }

  operate (){
    if(this.medic!=null && this.medic.idMedic >0){
      // update
      this.medicService.update(this.medic.idMedic, this.medic).
      pipe(switchMap(()=> this.medicService.findAll()))
      .subscribe((data)=> {
          this.medicService.setMedicChange(data);
          this.medicService.setMessageChange('UPDATE!')
      })
    } else {
      // insert 
      this.medicService.save(this.medic).
      pipe(switchMap(()=> this.medicService.findAll()))
      .subscribe((data)=> {
        this.medicService.setMedicChange(data);
          this.medicService.setMessageChange('CREATED!') 
      })

    }

    this.close();
  }

  close(){
    this._dialogRef.close();
  }

}