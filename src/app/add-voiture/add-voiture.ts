import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Voiture } from '../model/voiture.model';
import { OnInit } from '@angular/core';
import { VoitureService } from '../services/voiture.service';
import { type } from '../model/type.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-voiture',
  imports: [FormsModule],
  templateUrl: './add-voiture.html'
})
export class AddVoiture  implements OnInit{

  newVoiture =  new Voiture();
  message!   : string;
  newtype = new type();
  types: type[] = [];

  constructor(
    private voitureService: VoitureService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.voitureService.listerTypes().subscribe({
      next: types => {
        this.types = types._embedded.types;
        if (this.types.length > 0) {
          this.newtype = { ...this.types[0] };
        }
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.message = 'Impossible de charger les types.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  ajouterVoiture() {
    this.newVoiture.type = this.types.find(
      type => (type.idType ?? type.idtype) === this.newtype.idType
    ) ?? this.newtype;
    this.voitureService.ajouterVoiture(this.newVoiture).subscribe(
      voiture => {
        console.log(voiture);
    this.router.navigate(['/voitures']);
  })
}
}
