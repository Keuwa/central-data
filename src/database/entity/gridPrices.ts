import CSVParsable from '../CSVParsable'
import { Entity } from '../entities'
import City from './city'

export class GridPrices extends CSVParsable implements Entity {
    firebaseID: string = ''
    category?: string
    pricesBySector?: Array<number>

    
    constructor(firebaseID: string = '', category: string, pricesBySector: Array<number>) {
        super()
        this.firebaseID = firebaseID
        this.category = category
        this.pricesBySector = pricesBySector
    }
}