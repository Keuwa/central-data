import CSVParsable from '../CSVParsable'
import { Entity } from '../entities'
import City from './city'

export class Sector  extends CSVParsable implements Entity {
    firebaseID: string = ''
    city?: City
    section?: string
    sector?: string
    
    constructor(firebaseID: string = '', city: City, section: string, sector: string) {
        super()
        this.firebaseID = firebaseID
        this.city = city
        this.section = section
        this.sector = sector
    }
}