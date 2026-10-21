import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Voiture } from '../model/voiture.model';
import { VoitureService } from '../services/voiture.service';
import { SearchFilterPipe } from '../pipes/search-filter.pipe';

@Component({
  selector: 'app-recherche-par-nom',
  standalone: true,
  imports: [FormsModule, CommonModule, SearchFilterPipe],
  templateUrl: './recherche-par-nom.html',
})
export class RechercheParNom implements OnInit {
  nomVoiture = '';
  searchTerm = '';
  voitures: Voiture[] = [];
  allVoitures: Voiture[] = [];
  message = '';

  constructor(private voitureService: VoitureService) {}

  ngOnInit(): void {
    this.chargerVoitures();
  }

  rechercherVoitures(): void {
    const nom = this.nomVoiture.trim();

    if (!nom) {
      this.chargerVoitures();
      return;
    }

    this.voitureService.rechercherParNom(nom).subscribe({
      next: voitures => {
        this.voitures = voitures;
        this.searchTerm = nom;
        this.message = '';
      },
      error: () => {
        this.message = 'La recherche par nom a échoué.';
      },
    });
  }

  onKeyUp(filterText: string): void {
    this.searchTerm = filterText;
    const normalizedFilter = filterText.trim().toLocaleLowerCase();
    this.voitures = this.allVoitures.filter(voiture =>
      (voiture.nomVoiture ?? '').toLocaleLowerCase().includes(normalizedFilter),
    );
  }

  private chargerVoitures(): void {
    this.voitureService.listeVoitures().subscribe({
      next: voitures => {
        this.allVoitures = voitures;
        this.voitures = voitures;
        this.message = '';
      },
      error: () => {
        this.message = 'Impossible de charger les voitures.';
      },
    });
  }
}
