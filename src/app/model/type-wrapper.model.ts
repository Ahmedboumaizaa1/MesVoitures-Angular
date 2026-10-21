import { type } from './type.model';

export class TypeWrapper {
  _embedded!: { types: type[] };
}
