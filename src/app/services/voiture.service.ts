import { Injectable } from '@angular/core';
import { Voiture } from '../model/voiture.model';
import { type } from '../model/type.model';
import { TypeWrapper } from '../model/type-wrapper.model';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class VoitureService {
  /*apiURL: string = 'http://localhost:8081/voitures/api';
  apiURLType : string = 'http://localhost:8081/voitures/api/type'*/
  voitures: Voiture[] = [];
  types: type[] = [
    { idtype: 1, nomtype: "Citadine" },
    { idtype: 2, nomtype: "Berline" },
    { idtype: 3, nomtype: "SUV" }
  ];
  //voitures: Voiture[];
  voiture!: Voiture;
  //types : type[];
  
  constructor(private http: HttpClient) {
    /*
    this.types = [
      { idtype: 1, nomtype: "Citadine" },
      { idtype: 2, nomtype: "Berline" },
      { idtype: 3, nomtype: "SUV" }
    ];  

    this.voitures = [
      {
        idVoiture: 1, nomVoiture: "Peugeot 208", prixVoiture: 18500.500, dateCreation: new Date("03/15/2022"),
          type : { idtype: 1, nomtype: "Citadine" }
      },
      {
        idVoiture: 2, nomVoiture: "Renault Clio", prixVoiture: 16900, dateCreation: new Date("06/10/2021"),
         type : { idtype: 2, nomtype: "Berline" }
      },
      {
        idVoiture: 3, nomVoiture: "Volkswagen Golf", prixVoiture: 27000.750, dateCreation: new Date("01/25/2023"),
          type : { idtype: 3, nomtype: "SUV" }
      }
    ]; */


  };


  listeVoitures(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(environment.apiURL);
  }

  rechercherParType(idType: number): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(`${environment.apiURL}/voituresByType/${idType}`);
  }

  rechercherParNom(nom: string): Observable<Voiture[]> {
    const encodedName = encodeURIComponent(nom);
    return this.http.get<Voiture[]>(`${environment.apiURL}/voituresByName/${encodedName}`);
  }

  ajouterVoiture(voiture: Voiture): Observable<Voiture> {
    return this.http.post<Voiture>(environment.apiURL, voiture, httpOptions);
  }

  supprimerVoiture(id: number | undefined): Observable<void> {
    if (id === undefined) {
      return throwError(() => new Error('Identifiant de voiture manquant.'));
    }
    return this.http.delete<void>(`${environment.apiURL}/${id}`, httpOptions);
  }

  consulterVoiture(id: number): Observable<Voiture> {
    const url = `${environment.apiURL}/${id}`;
    return this.http.get<Voiture>(url);
  }
  
  updatevoiture(voiture: Voiture): Observable<Voiture> {
    return this.http.put<Voiture>(environment.apiURL, voiture, httpOptions);
  }


  listerTypes(): Observable<TypeWrapper> {
    return this.http.get<TypeWrapper>(environment.apiURLType);
  }

  ajouterType(typeVoiture: type): Observable<type> {
    return this.http.post<type>(environment.apiURLType, typeVoiture, httpOptions);
  }

  modifierType(typeVoiture: type): Observable<type> {
    const id = typeVoiture.idType ?? typeVoiture.idtype;
    if (id === undefined) {
      return throwError(() => new Error('Identifiant de type manquant.'));
    }
    return this.http.put<type>(`${environment.apiURLType}/${id}`, typeVoiture, httpOptions);
  }

  consulterType(id : number): type[] {
    return this.types.filter(type => type.idtype == id);
  }

}
