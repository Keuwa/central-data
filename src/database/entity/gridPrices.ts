import CSVParsable from '../CSVParsable'
import { Entity } from '../entities'

export class GridPrices extends CSVParsable implements Entity {
  firebaseID: string = ''
  category?: string
  sector?: string
  year?: number
  price?: number

  constructor(data?: Partial<GridPrices>) {
    super()
    Object.assign(this, data)
  }

  // constructor(
  //   firebaseID: string = '',
  //   category: string,
  //   sector: string,
  //   date: Date,
  //   price: number
  // ) {
  //   super()
  //   this.firebaseID = firebaseID
  //   this.category = category
  //   this.date = date
  //   this.sector = sector
  //   this.price = price
  // }
}
