import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VitalSign } from '../model/vitalSign';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class VitalSignsService  extends GenericService<VitalSign>{

  private vitalSignChange: Subject<VitalSign[]> = new Subject<VitalSign[]>();

  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http:HttpClient){
    super(http,`${environment.HOST}/vitalSigns`)
  }

  listPageable(p: number, s: number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  setVitalSignChange(data: VitalSign[]) {
    this.vitalSignChange.next(data);
  }

  getVitalSignChange() {
    return this.vitalSignChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
