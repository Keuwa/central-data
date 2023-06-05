import CSVParsable from '../CSVParsable'
import { Entity } from '../entities'

export enum coeficientType {
  TF = 'TF',
  CFE = 'CFE',
}

export class NeutralizationCoefficient implements Entity {
  firebaseID: string = ''
  type?: coeficientType
  cityCoefficient?: number
  departmentCoefficient?: number
  cityUnionCoefficient?: number
  epciCoefficient?: number
  specialTaxesCoefficient?: number
  teomCoefficient?: number
  gemapiTaxesCoefficient?: number
  startDate?: Date
  endDate?: Date

  constructor(
    firebaseID: string = '',
    type?: coeficientType,
    cityCoefficient?: number,
    departmentCoefficient?: number,
    cityUnionCoefficient?: number,
    epciCoefficient?: number,
    specialTaxesCoefficient?: number,
    teomCoefficient?: number,
    gemapiTaxesCoefficient?: number,
    startDate?: Date,
    endDate?: Date
  ) {
    super()
    this.firebaseID = firebaseID
    this.type = type
    this.cityCoefficient = cityCoefficient
    this.departmentCoefficient = departmentCoefficient
    this.cityUnionCoefficient = cityUnionCoefficient
    this.epciCoefficient = epciCoefficient
    this.specialTaxesCoefficient = specialTaxesCoefficient
    this.teomCoefficient = teomCoefficient
    this.gemapiTaxesCoefficient = gemapiTaxesCoefficient
    this.startDate = startDate
    this.endDate = endDate
  }
}
