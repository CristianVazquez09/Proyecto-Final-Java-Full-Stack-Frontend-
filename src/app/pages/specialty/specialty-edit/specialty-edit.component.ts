import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../material/material.module';
import { Specialty } from '../../../model/specialty';
import { SpecialtyService } from '../../../services/specialty.service';

@Component({
  standalone: true,
  selector: 'app-specialty-edit',
  templateUrl: './specialty-edit.component.html',
  styleUrls: ['./specialty-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, RouterLink]
})
export class SpecialtyEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specialtyService: SpecialtyService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idSpecialty': new FormControl(0),
      'name': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'description': new FormControl('', [Validators.required, Validators.minLength(3)])      
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.specialtyService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idSpecialty': new FormControl(data.idSpeciality),
          'name': new FormControl(data.nameSpeciality, [Validators.required, Validators.minLength(3)]),
          'description': new FormControl(data.descriptionSpeciality, [Validators.required, Validators.minLength(3)])          
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }

    const specialty = new Specialty();
    specialty.idSpeciality = this.form.value['idSpecialty'];
    specialty.nameSpeciality = this.form.value['name'];
    specialty.descriptionSpeciality = this.form.value['description'];
    

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN
      this.specialtyService.update(specialty.idSpeciality, specialty).subscribe(() => {
        this.specialtyService.findAll().subscribe(data => {
          this.specialtyService.setSpecialtyChange(data);
          this.specialtyService.setMessageChange('UPDATED!')
        });
      });
    } else {      
      //INSERT
      //PRACTICA IDEAL
      this.specialtyService.save(specialty).pipe(switchMap(()=>{        
        return this.specialtyService.findAll();
      }))
      .subscribe(data => {
        this.specialtyService.setSpecialtyChange(data);
        this.specialtyService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/specialty']);
  }

}

