import { GridPrices } from '../../../database/entity/gridPrices'
import { firebaseAdmin } from '../../../firebase/firebaseAdmin'
import { converter } from '../../../database/firebaseConverter'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      let getResult = await new Promise(async (resolve) => {
        const { date, sector, category } = req.query

        let data = await getGridPrices(date, sector, category)
        resolve(data)
      })
      res.status(200).json(getResult)
      break
    case 'POST':
      let postResult = await new Promise(async (resolve) => {
        let data = await addGridPrices(req.body)
        resolve(data)
      })
      res.status(200).json(postResult)
      break
    case 'PUT':
      let updatedPost = await new Promise(async (resolve) => {
        let data = await updateGridPrices(req.body)
        resolve(data)
      })
      res.status(200).json(updatedPost)
      break
    case 'DELETE':
      let deletedPost = await new Promise(async (resolve) => {
        let data = await deleteGridPrices(req.body)
        resolve(data)
      })
      res.status(200).json(deletedPost)
      break
    default:
      res.status(401).json({ error: 'Method not allowed' })
      break
  }
}

export async function getGridPrices(
  date?: string | string[],
  sector?: string | string[],
  category?: string | string[]
): Promise<Array<GridPrices>> {
  let gridPrices: Array<GridPrices> = []
  try {
    const db = firebaseAdmin.firestore()
    let ref = db.collection('gridPrices')
    let query = ref.orderBy('date')
    if (sector) {
      if (typeof sector === 'string') {
        query = query.where('sector', '==', sector)
      } else {
        query = query.where('sector', 'in', sector)
      }
    }
    if (category) {
      if (typeof category === 'string') {
        query = query.where('category', '==', category)
      } else {
        query = query.where('category', 'in', category)
      }
    }
    if (date) {
      if (typeof date === 'string') {
        query = query.where('date', '==', decodeURI(date))
      } else {
        query = query.where(
          'date',
          'in',
          date.map((element) => decodeURI(element))
        )
      }
    }

    const snapshot = await query.get()

    snapshot.forEach((doc) => {
      let gridPrice: GridPrices = {
        firebaseID: doc.id,
        ...doc.data(),
        getHeader: function (): string[] {
          throw new Error('Function not implemented.')
        },
      }
      gridPrices.push(gridPrice)
    })
    return gridPrices
  } catch (e) {
    console.error(e)
    throw e
  }
}

export function addGridPrices(gridPrices: GridPrices) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection('gridPrices')
      .withConverter(converter())
      .add(gridPrices)
      .then((data) => {
        resolve({ id: data.id, ...gridPrices })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function updateGridPrices(gridPrices: GridPrices) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection('gridPrices')
      .doc(gridPrices.firebaseID)
      .withConverter(converter())
      .update(gridPrices)
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function deleteGridPrices(gridPrices: GridPrices) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection('gridPrices')
      .doc(gridPrices.firebaseID)
      .withConverter(converter())
      .delete()
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
