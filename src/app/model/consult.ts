import { ConsultDetails } from "./consultDetails";
import { Medic } from "./medic";
import { Patient } from "./patient";
import { Specialty } from "./specialty";

export class Consult {
    
    idConsult:number;
    patient:Patient;
    medic:Medic;
    speciality:Specialty;
    numConsult:string;
    consultDate:string;
    details:ConsultDetails[]
}