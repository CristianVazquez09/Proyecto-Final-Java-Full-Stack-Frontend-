import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ExamService } from '../../../services/exam.service';
import { Exam } from '../../../model/exam';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-exam-edit',
  standalone: true,
  imports: [ ReactiveFormsModule, MaterialModule, RouterLink, NgIf],
  templateUrl: './exam-edit.component.html',
  styleUrl: './exam-edit.component.css'
})
export class ExamEditComponent implements OnInit{

  form:FormGroup;
  id:number;
  isEdit:boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ){}

  ngOnInit() {
    this.form= new FormGroup({
      idExam: new FormControl(0),
      nameExam: new FormControl("", [Validators.required, Validators.minLength(3),Validators.maxLength(70)]),
      descriptionExam: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
    });

    this.route.params.subscribe(data => {
        this.id= data['id'];
        this.isEdit=data['id'] !=null;
        this.initForm();
    });
  }

  initForm(){
    if(this.isEdit){
      this.examService.findById(this.id).subscribe(data =>{
        this.form= new FormGroup({
          idExam: new FormControl(data.idExam),
          nameExam: new FormControl(data.nameExam, [Validators.required, Validators.minLength(3),Validators.maxLength(70)]),
          descriptionExam: new FormControl(data.descriptionExam, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
       
      });
      });
    } 

  }

  operate (){
    const exam:Exam= new Exam();
    exam.idExam=this.form.value['idExam'];
    exam.nameExam= this.form.value['nameExam'];
    exam.descriptionExam= this.form.value['descriptionExam'];
  
    
    if(this.isEdit){
      //update 
      this.examService.update(this.id,exam).subscribe(()=>{
        this.examService.findAll().subscribe(data => {
          this.examService.setExamChange(data);
          this.examService.setMessageChange("UPDATE!")
        } )
      });
    } else {
      this.examService.save(exam)
      .pipe(switchMap(()=> this.examService.findAll()))
      .subscribe(data => {
          this.examService.setExamChange(data);
          this.examService.setMessageChange("CREATED!")
      });
    }

    this.router.navigate(['/pages/exam']);

  }

  get f (){
    return this.form.controls;
  }
}
