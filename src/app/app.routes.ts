import { Routes } from '@angular/router';
import { Voitures } from './voitures/voitures';
import { AddVoiture } from './add-voiture/add-voiture'; 
import { UpdateVoiture } from './update-voiture/update-voiture';
import { RechercheParType } from './recherche-par-type/recherche-par-type';
import { RechercheParNom } from './recherche-par-nom/recherche-par-nom';
import { ListeTypes } from './liste-types/liste-types';

export const routes: Routes = [
  {path: "voitures", component : Voitures},
  {path: "add-voiture", component : AddVoiture},
  {path: "update-voiture/:id", component : UpdateVoiture},
  {path: "rechercheParType", component: RechercheParType},
  {path: "rechercheParNom", component: RechercheParNom},
  {path: "listeTypes", component: ListeTypes},
  {path: "", redirectTo: "voitures", pathMatch: "full"}
];
