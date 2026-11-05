import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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

  constructor(
    private voitureService: VoitureService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerTypes();
  }

  chargerTypes(): void {
    this.voitureService.listerTypes().subscribe({
      next: response => {
        this.types = response._embedded.types;
        this.message = '';
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.message = 'Impossible de charger les types.';
        this.changeDetectorRef.markForCheck();
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
      error: (error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.message = 'Le navigateur bloque la requête : configurez CORS pour autoriser POST depuis http://localhost:4200. Le backend doit aussi exposer POST /voitures/api/type.';
        } else if (error.status === 405) {
          this.message = 'Le backend ne permet pas cette opération (HTTP 405). Ajoutez la route POST /voitures/api/type dans le backend.';
        } else {
          this.message = this.ajout
            ? `La création du type a échoué (HTTP ${error.status}).`
            : `La modification du type a échoué (HTTP ${error.status}).`;
        }
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
