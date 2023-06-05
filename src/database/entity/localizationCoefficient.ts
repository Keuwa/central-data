import CSVParsable from '../CSVParsable'
import { Entity } from '../entities'
import City from './city'

export class LocalizationCoefficient implements Entity {
  firebaseID: string = ''
  city?: City
  section?: string
  plot?: string
  coefficient?: number

  constructor(
    firebaseID: string = '',
    city?: City,
    section?: string,
    plot?: string,
    coefficient?: number
  ) {
    this.firebaseID = firebaseID
    this.city = city
    this.section = section
    this.plot = plot
    this.coefficient = coefficient
  }
}
