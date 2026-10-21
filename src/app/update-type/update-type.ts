import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type } from '../model/type.model';

@Component({
  selector: 'app-update-type',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-type.html',
})
export class UpdateType implements OnChanges {
  @Input() typeVoiture: type = {};
  @Input() ajout = true;
  @Output() typeUpdated = new EventEmitter<type>();

  nomType = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeVoiture']) {
      this.nomType = this.typeVoiture.nomType ?? this.typeVoiture.nomtype ?? '';
    }
  }

  saveType(): void {
    this.typeVoiture.nomtype = this.nomType.trim();
    this.typeUpdated.emit(this.typeVoiture);
  }
}
