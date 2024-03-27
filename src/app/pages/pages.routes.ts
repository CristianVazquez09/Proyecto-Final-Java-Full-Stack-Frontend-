import { Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { MedicComponent } from './medic/medic.component';
import { PatientEditComponent } from './patient/patient-edit/patient-edit.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { SpecialtyEditComponent } from './specialty/specialty-edit/specialty-edit.component';
import { ExamComponent } from './exam/exam.component';
import { ExamEditComponent } from './exam/exam-edit/exam-edit.component';
import { ConsultWizardComponent } from './consult-wizard/consult-wizard.component';
import { SearchComponent } from './search/search.component';
import { ReportComponent } from './report/report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { certGuard } from '../guard/cert.guard';
import { Not403Component } from './not403/not403.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { VitalSignsComponent } from './vital-signs/vital-signs.component';
import { VitalsSignsEditComponent } from './vital-signs/vitals-signs-edit/vitals-signs-edit.component';

export const pageRoutes: Routes = [
  {path: 'dashboard', component:DashboardComponent, canActivate: [certGuard]},

  { path: 'patient', component: PatientComponent, children: [
    { path: 'new', component: PatientEditComponent},
    { path: 'edit/:id', component: PatientEditComponent},

    ] , canActivate: [certGuard]},

    { path: 'vitalSigns', component: VitalSignsComponent, children: [
      { path: 'new', component: VitalsSignsEditComponent},
      { path: 'edit/:id', component: VitalsSignsEditComponent},
      ] , canActivate: [certGuard]},

  {path:'specialty', component: SpecialtyComponent, children: [
    {path: 'new', component: SpecialtyEditComponent},
    {path: 'edit/:id', component: SpecialtyEditComponent}
  ], canActivate: [certGuard]},

  {path:'exam', component: ExamComponent, children:[
    { path: 'new', component: ExamEditComponent},
    { path: 'edit/:id', component: ExamEditComponent},
  ], canActivate: [certGuard]},

  {path:'consult-wizard', component:ConsultWizardComponent, canActivate: [certGuard]},
  {path: 'search', component:SearchComponent, canActivate: [certGuard]},
  {path: 'report', component: ReportComponent, canActivate: [certGuard]},
  { path: 'medic', component: MedicComponent, canActivate: [certGuard]},
  {path: 'not-403', component: Not403Component},
  {path: 'myAccount', component: MyAccountComponent}
];
