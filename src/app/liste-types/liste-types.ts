import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { type } from '../model/type.model';
import { VoitureService } from '../services/voiture.service';
import { UpdateType } from '../update-type/update-type';

@Component({
  selector: 'app-liste-types',
  standalone: true,
  imports: [CommonModule, UpdateType],
  templateUrl: './liste-types.html',
})
export class ListeTypes implements OnInit {
  types: type[] = [];
  updatedType: type = { nomtype: '' };
  ajout = true;
  message = '';

  constructor(private voitureService: VoitureService) {}

  ngOnInit(): void {
    this.chargerTypes();
  }

  chargerTypes(): void {
    this.voitureService.listerTypes().subscribe({
      next: response => {
        this.types = response._embedded.types;
        this.message = '';
      },
      error: () => {
        this.message = 'Impossible de charger les types.';
      },
    });
  }

  updateType(typeVoiture: type): void {
    this.updatedType = { ...typeVoiture };
    this.ajout = false;
  }

  nouveauType(): void {
    this.updatedType = { nomtype: '' };
    this.ajout = true;
  }

  typeUpdated(typeVoiture: type): void {
    const request = this.ajout
      ? this.voitureService.ajouterType(typeVoiture)
      : this.voitureService.modifierType(typeVoiture);

    request.subscribe({
      next: () => {
        this.chargerTypes();
        this.nouveauType();
      },
      error: () => {
        this.message = this.ajout
          ? 'La création du type a échoué.'
          : 'La modification du type a échoué.';
      },
    });
  }
}
