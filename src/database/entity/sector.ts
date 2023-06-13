import CSVParsable from '../CSVParsable'
import { Entity } from '../entities'
import City from './city'

export class Sector extends CSVParsable implements Entity {
  firebaseID: string = ''
  city?: City
  section?: string
  sector?: string

  constructor(data?: Partial<Sector>) {
    super()
    Object.assign(this, data)
  }

  // constructor(
  //   firebaseID: string = '',
  //   city: City,
  //   section: string,
  //   sector: string
  // ) {
  //   this.firebaseID = firebaseID
  //   this.city = city
  //   this.section = section
  //   this.sector = sector
  // }
}
