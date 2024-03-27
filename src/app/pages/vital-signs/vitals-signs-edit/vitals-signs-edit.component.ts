import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import {FormBuilder,FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
import { Observable, map, switchMap, switchScan } from 'rxjs';
import { Patient } from '../../../model/patient';
import { AsyncPipe } from '@angular/common';
import { PatientService } from '../../../services/patient.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VitalSign } from '../../../model/vitalSign';
import moment from 'moment';
import { VitalSignsService } from '../../../services/vital-signs.service';

@Component({
  selector: 'app-vitals-signs-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './vitals-signs-edit.component.html',
  styleUrl: './vitals-signs-edit.component.css',
})
export class VitalsSignsEditComponent implements OnInit {

  formGroup: FormGroup;
  patientControl: FormControl = new FormControl();

  patientFiltered$: Observable<Patient[]>;
  
  patients: Patient[];

  id: number;
  isEdit: boolean;

  constructor(
    private patientService: PatientService,
    private vitalSignService: VitalSignsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      idVitalSign: new FormControl(0),
      patient: this.patientControl,
      vitalSignDate: new FormControl(new Date()),
      temperature: new FormControl(''),
      heartbeat: new FormControl(''),
      respiratoryRate: new FormControl(''),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });

    this.patientFiltered$ = this.patientControl.valueChanges.pipe(
      map((val) => this.filterExams(val))
    );

    this.patientService.findAll().subscribe((data) => {
      this.patients = data;
    });
  }

  initForm() {
    if (this.isEdit) {
      this.vitalSignService.findById(this.id).subscribe((data) => {
        this.formGroup = new FormGroup({
          idVitalSign: new FormControl(data.idVitalSign),
          patient: new FormControl(data.patient),
          vitalSignDate: new FormControl(data.dateVitalSign),
          temperature: new FormControl(data.temperature),
          heartbeat: new FormControl(data.heartbeat),
          respiratoryRate: new FormControl(data.respiratoryRate),
        });
      });
    }
  }

  filterExams(val: any) {
    if (val?.idPatient > 0) {
      return this.patients.filter(
        (el) =>
          el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) ||
          el.lastName.toLowerCase().includes(val.lastName.toLowerCase())
      );
    } else {
      return this.patients.filter(
        (el) =>
          el.firstName.toLowerCase().includes(val?.toLowerCase()) ||
          el.lastName.toLowerCase().includes(val?.toLowerCase())
      );
    }
  }

  showPatient(val: any) {
    return val ? `${val.firstName}` : val;
  }

  operate() {
    const vitalSign: VitalSign = new VitalSign();
    vitalSign.idVitalSign = this.formGroup['idVitalSign'];
    vitalSign.patient = this.formGroup.value['patient'];
    vitalSign.dateVitalSign = moment(this.formGroup.value['vitalSignDate']).format('YYYY-MM-DDTHH:mm:ss');
    vitalSign.temperature = this.formGroup.value['temperature'];
    vitalSign.heartbeat = this.formGroup.value['heartbeat'];
    vitalSign.respiratoryRate = this.formGroup.value['respiratoryRate'];


    if(this.isEdit){
      this.vitalSignService.update(this.id,vitalSign).subscribe(()=>{
        this.vitalSignService.findAll().subscribe(data => {
          this.vitalSignService.setVitalSignChange(data);
          this.vitalSignService.setMessageChange("UPDATE!")
        } )
      });

    } else {
      this.vitalSignService
      .save(vitalSign)
      .pipe(switchMap(() => this.vitalSignService.findAll()))
      .subscribe((data) => {
        console.log(data);
        this.vitalSignService.setVitalSignChange(data);
        this.vitalSignService.setMessageChange('CREATED!');
      });
    }
    this.router.navigate(['/pages/vitalSigns']);
    
  }

  visible(){
    return this.id > 0; 
  }
}
