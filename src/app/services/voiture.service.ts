import { Injectable } from '@angular/core';
import { Voiture } from '../model/voiture.model';
import { type } from '../model/type.model';
import { TypeWrapper } from '../model/type-wrapper.model';
import { Observable, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

type TypeApiResponse = type[] | {
  _embedded?: { types?: type[] };
  value?: type[];
  Count?: number;
};

type VoitureApiResponse = Voiture[] | { value?: Voiture[] };

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
    return this.http.get<VoitureApiResponse>(environment.apiURL).pipe(
      map(response => this.normaliserVoitures(response))
    );
  }

  rechercherParType(idType: number): Observable<Voiture[]> {
    return this.listeVoitures().pipe(
      map(voitures => voitures.filter(voiture =>
        (voiture.type?.idType ?? voiture.type?.idtype) === idType
      ))
    );
  }

  rechercherParNom(nom: string): Observable<Voiture[]> {
    const encodedName = encodeURIComponent(nom);
    return this.http.get<VoitureApiResponse>(`${environment.apiURL}/voituresByName/${encodedName}`).pipe(
      map(response => this.normaliserVoitures(response))
    );
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
    return this.http.get<TypeApiResponse>(environment.apiURLType).pipe(
      map(response => {
        const types = Array.isArray(response)
          ? response
          : response._embedded?.types ?? response.value;
        if (!Array.isArray(types)) {
          throw new Error('Format de réponse des types invalide.');
        }
        return { _embedded: { types } };
      })
    );
  }

  private normaliserVoitures(response: VoitureApiResponse): Voiture[] {
    if (Array.isArray(response)) {
      return response;
    }
    if (Array.isArray(response.value)) {
      return response.value;
    }
    throw new Error('Format de réponse des voitures invalide.');
  }

  ajouterType(typeVoiture: type): Observable<type> {
    const typePayload = {
      nomType: (typeVoiture.nomType ?? typeVoiture.nomtype)?.trim()
    };
    return this.http.post<type>(environment.apiURLType, typePayload, httpOptions);
  }

  modifierType(typeVoiture: type): Observable<type> {
    const id = typeVoiture.idType ?? typeVoiture.idtype;
    if (id === undefined) {
      return throwError(() => new Error('Identifiant de type manquant.'));
    }
    const typePayload = {
      idType: id,
      nomType: (typeVoiture.nomType ?? typeVoiture.nomtype)?.trim()
    };
    return this.http.put<type>(`${environment.apiURLType}/${id}`, typePayload, httpOptions);
  }

  consulterType(id : number): type[] {
    return this.types.filter(type => type.idtype == id);
  }

}
