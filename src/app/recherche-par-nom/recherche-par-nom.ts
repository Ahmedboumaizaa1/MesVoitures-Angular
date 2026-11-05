import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  message = '';

  constructor(
    private voitureService: VoitureService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerVoitures();
  }

  onSearchChange(filterText: string): void {
    this.searchTerm = filterText;
  }

  private chargerVoitures(): void {
    this.voitureService.listeVoitures().subscribe({
      next: voitures => {
        this.voitures = voitures;
        this.message = '';
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.message = 'Impossible de charger les voitures.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
