import { ValueTransformer } from 'typeorm';

export class ColumnNumericTransformer implements ValueTransformer {
  private decimalPlaces?: number;

  constructor(decimalPlaces?: number) {
    this.decimalPlaces = decimalPlaces;
  }

  to(data: number): number {
    return data;
  }

  from(data: string): number {
    return parseFloat(data);
  }
}
