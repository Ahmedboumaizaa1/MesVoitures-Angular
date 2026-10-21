import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VoitureService } from '../services/voiture.service';
import { Voiture } from '../model/voiture.model';
import { type } from '../model/type.model';

@Component({
  selector: 'app-update-voiture',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-voiture.html',
})
export class UpdateVoiture implements OnInit {
  voiture?: Voiture;
  dateCreation = '';
  message = '';
  currentVoiture = new Voiture();
  types! : type[];
  updatetypeid! :number;


  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private voitureService: VoitureService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.voitureService.listerTypes().subscribe({
      next: types => {
        this.types = types._embedded.types;
        if (this.currentVoiture.idVoiture !== undefined) {
          this.updatetypeid = this.currentVoiture.type?.idtype ?? this.currentVoiture.type?.idType!;
        }
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.message = 'Impossible de charger les types.';
        this.changeDetectorRef.markForCheck();
      }
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id)) {
      this.message = 'Identifiant de voiture invalide.';
      return;
    }

    this.voitureService.consulterVoiture(id).subscribe({
      next: voiture => {
        this.currentVoiture = voiture;
        this.updatetypeid = voiture.type?.idtype ?? voiture.type?.idType!;
        const date = voiture.dateCreation;
        if (date) {
          const parsedDate = date instanceof Date ? date : new Date(String(date));
          if (!Number.isNaN(parsedDate.getTime())) {
            this.dateCreation = parsedDate.toISOString().slice(0, 10);
          }
        }
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.message = 'Voiture introuvable.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  updateVoiture(): void {
    this.currentVoiture.type = this.types.find(
      type => type.idtype === this.updatetypeid || type.idType === this.updatetypeid
    );
    if (this.dateCreation) {
      this.currentVoiture.dateCreation = new Date(`${this.dateCreation}T00:00:00`);
    }

    this.voitureService.updatevoiture(this.currentVoiture).subscribe({
      next: () => {
        this.router.navigate(['/voitures']);
      },
      error: () => {
        this.message = 'La modification de la voiture a échoué.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
