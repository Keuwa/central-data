// import { GridPrices } from './entity/gridPrices'
// import { LocalizationCoefficient } from './entity/localizationCoefficient'
// import { NeutralizationCoefficient } from './entity/neutralizationCoefficient'
// import { Rate } from './entity/rate'
// import { Sector } from './entity/sector'

import { Entities, Entity } from './entities'

const {
  LocalizationCoefficient,
  NeutralizationCoefficient,
  Rate,
  Sector,
  GridPrices,
} = Entities

export default class EntityFactory {
  static buildEntity = function (entityType: string, data?: Object): Entity {
    let entity
    switch (entityType) {
      case 'LocalizationCoefficient':
        entity = new LocalizationCoefficient()
        break
      case 'NeutralizationCoefficient':
        entity = new NeutralizationCoefficient()
        break
      // case 'Rate':
      //     entity = new Rate()
      //     break
      // case 'Sector':
      //     entity = new Sector()
      //     break
      // case 'GridPrices':
      //     entity = new GridPrices()
      //     break
      default:
        throw new Error('Class not defined')
    }
    if (null !== data) {
      Object.assign(entity, data)
    }
    return entity
  }
}
