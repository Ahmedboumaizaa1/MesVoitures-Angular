import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Voiture } from '../model/voiture.model';
import { CommonModule } from '@angular/common';
import { VoitureService } from '../services/voiture.service';
import { RouterModule, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TypeWrapper } from '../model/type-wrapper.model';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-voitures',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './voitures.html'
})
export class Voitures implements OnInit {

  private voituresListe: Voiture[] = [];
  message = '';

  get voitures(): Voiture[] {
    return this.voituresListe;
  }

  set voitures(voitures: Voiture[]) {
    this.voituresListe = voitures;
    this.changeDetectorRef.markForCheck();
  }

  constructor(
    private voitureService: VoitureService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.chargerVoitures();
  }

  chargerVoitures() {
    this.voitureService.listeVoitures().subscribe({
      next: voitures => {
        this.voitures = voitures;
        this.message = '';
      },
      error: () => {
        this.message = 'Impossible de charger les voitures.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  supprimerVoiture(v: Voiture) {
  let conf = confirm("Etes-vous sûr ?");
  if (conf)
  this.voitureService.supprimerVoiture(v.idVoiture).subscribe(() => {
    console.log("Voiture supprimée");
    this.chargerVoitures();
    this.router.navigate(['/voitures']);
  });
  }

  listerVoitures(): Voiture[] {
    return this.voitures;
  }

  AjouterVoiture(voiture: Voiture): void {
    this.voitures = [...this.voitures, voiture];
  }

  listerTypes(): Observable<TypeWrapper> {
    return this.voitureService.listerTypes();
  }
}