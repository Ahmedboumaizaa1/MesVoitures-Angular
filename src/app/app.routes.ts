import { Routes } from '@angular/router';
import { Voitures } from './voitures/voitures';
import { AddVoiture } from './add-voiture/add-voiture'; 
import { UpdateVoiture } from './update-voiture/update-voiture';
import { RechercheParType } from './recherche-par-type/recherche-par-type';
import { RechercheParNom } from './recherche-par-nom/recherche-par-nom';
import { ListeTypes } from './liste-types/liste-types';
import { Login } from './login/login';
import { Forbidden } from './forbidden/forbidden';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {path: "voitures", component : Voitures},
  {path: "add-voiture", component : AddVoiture, canActivate: [adminGuard]},
  {path: "update-voiture/:id", component : UpdateVoiture, canActivate: [adminGuard]},
  {path: "rechercheParType", component: RechercheParType},
  {path: "rechercheParNom", component: RechercheParNom},
  {path: "listeTypes", component: ListeTypes, canActivate: [adminGuard]},
  {path: "login", component: Login},
  {path: "forbidden", component: Forbidden},
  {path: "", redirectTo: "voitures", pathMatch: "full"}
];
