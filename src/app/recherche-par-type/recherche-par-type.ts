import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  toutesLesVoitures: Voiture[] = [];
  types: type[] = [];
  idType: number | null = null;
  messageTypes = '';
  messageVoitures = '';

  constructor(
    private voitureService: VoitureService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.voitureService.listerTypes().subscribe({
      next: response => {
        this.types = response._embedded.types;
        this.messageTypes = '';
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.messageTypes = 'Impossible de charger les types.';
        this.changeDetectorRef.markForCheck();
      },
    });

    this.chargerVoitures();
  }

  onChange(idType: number | null): void {
    this.idType = idType;
    this.filtrerVoitures();
  }

  private chargerVoitures(): void {
    this.voitureService.listeVoitures().subscribe({
      next: voitures => {
        this.toutesLesVoitures = voitures;
        this.filtrerVoitures();
        this.messageVoitures = '';
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.messageVoitures = 'Impossible de charger les voitures.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  private filtrerVoitures(): void {
    this.voitures = this.idType === null
      ? this.toutesLesVoitures
      : this.toutesLesVoitures.filter(voiture =>
          Number(voiture.type?.idType ?? voiture.type?.idtype) === this.idType
        );
  }
}
