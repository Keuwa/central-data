import CSVParsable from '../CSVParsable'
import { Entity } from '../entities'
import City from './city'

interface CollectivityRate {
  percent?: number;
  fixed?: number;
  fee?: number;
}
export class Rate extends CSVParsable implements Entity {
  firebaseID: string = ''
  year?: string
  tax?: string
  city?: string
  collectivities?: {
    [key: string]: CollectivityRate;
  }

  constructor(
    firebaseID: string = '',
    year: string,
    tax: string,
    city: string,
    collectivities?: {
      [key: string]: CollectivityRate;
    }
  ) {
    super()
    this.firebaseID = firebaseID
    this.year = year
    this.tax = tax
    this.city = city
    this.collectivities = collectivities
  }
}
