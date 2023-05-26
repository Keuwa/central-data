import CSVParsable from '../CSVParsable'
import { Entity } from '../entities'
import City from './city'

export class Rate extends CSVParsable implements Entity {
    firebaseID: string = ''
    year?: string
    tax?: string
    city?: City
    organisme?: string
    percent?: number
    fixed?: number
    fee?: number

    constructor(
        firebaseID: string = '',
        year: string,
        tax: string,
        city: City,
        organisme: string,
        percent: number,
        fixed: number,
        fee: number
    ) {
        super()
        this.firebaseID = firebaseID
        this.year = year
        this.tax = tax
        this.city = city
        this.organisme = organisme
        this.percent = percent
        this.fixed = fixed
        this.fee = fee
    }
}