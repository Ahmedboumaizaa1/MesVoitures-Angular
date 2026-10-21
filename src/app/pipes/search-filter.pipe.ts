import { Pipe, PipeTransform } from '@angular/core';
import { Voiture } from '../model/voiture.model';

@Pipe({
  name: 'searchFilter',
  standalone: true,
})
export class SearchFilterPipe implements PipeTransform {
  transform(voitures: Voiture[] | null | undefined, filterText: string): Voiture[] {
    const normalizedFilter = filterText.trim().toLocaleLowerCase();

    if (!voitures) {
      return [];
    }

    if (!normalizedFilter) {
      return voitures;
    }

    return voitures.filter(voiture =>
      (voiture.nomVoiture ?? '').toLocaleLowerCase().includes(normalizedFilter),
    );
  }
}
