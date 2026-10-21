import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Voiture } from '../model/voiture.model';
import { type } from '../model/type.model';
import { VoitureService } from '../services/voiture.service';

@Component({
  selector: 'app-recherche-par-type',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recherche-par-type.html',
})
export class RechercheParType implements OnInit {
  voitures: Voiture[] = [];
  types: type[] = [];
  idType: number | null = null;
  message = '';

  constructor(private voitureService: VoitureService) {}

  ngOnInit(): void {
    this.voitureService.listerTypes().subscribe({
      next: response => {
        this.types = response._embedded.types;
      },
      error: () => {
        this.message = 'Impossible de charger les types.';
      },
    });

    this.chargerVoitures();
  }

  onChange(): void {
    this.chargerVoitures();
  }

  private chargerVoitures(): void {
    const request = this.idType === null
      ? this.voitureService.listeVoitures()
      : this.voitureService.rechercherParType(this.idType);

    request.subscribe({
      next: voitures => {
        this.voitures = voitures;
        this.message = '';
      },
      error: () => {
        this.message = 'Impossible de charger les voitures.';
      },
    });
  }
}
