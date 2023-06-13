import { firebaseAdmin } from '../../../firebase/firebaseAdmin'
import { converter } from '../../../database/firebaseConverter'

import type { NextApiRequest, NextApiResponse } from 'next'
import { Rate } from '../../../database/entity/rate'
// import Cors from "cors";
import NextCors from 'nextjs-cors'

// const cors = Cors({
//   methods: ["GET", "POST", "UPDATE", "DELETE", "HEAD", "OPTION"],
//   origin: ["http://127.0.0.1:3001/"],
// });

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      let getResult = await new Promise(async (resolve) => {
        const { year, city } = req.query
        let data = await getRates(city, year)
        resolve(data)
      })
      res.status(200).json(getResult)
      break
    case 'POST':
      let postResult = await new Promise(async (resolve) => {
        let data = await addRate(req.body)
        resolve(data)
      })
      res.status(200).json(postResult)
      break
    case 'PUT':
      let updatedPost = await new Promise(async (resolve) => {
        let data = await updateRates(req.body)
        resolve(data)
      })
      res.status(200).json(updatedPost)
      break
    case 'DELETE':
      let deletedPost = await new Promise(async (resolve) => {
        let data = await deleteRates(req.body)
        resolve(data)
      })
      res.status(200).json(deletedPost)
      break
    default:
      res.status(401).json({ error: 'Method not allowed' })
      break
  }
}

export async function getRates(
  cityInseeCode?: string | string[],
  year?: string | string[]
): Promise<Array<Rate>> {
  let rates: Array<Rate> = []
  try {
    const db = firebaseAdmin.firestore()
    let ref = db.collection('Rates')
    let query = ref.orderBy('year')
    if (cityInseeCode) {
      if (typeof cityInseeCode === 'string') {
        query = ref.where('city', '==', cityInseeCode)
      } else {
        query = ref.where('city', 'in', cityInseeCode)
      }
      if (year) {
        if (typeof year === 'string') {
          query = query.where('year', '==', year)
        } else {
          query = query.where('year', 'in', year)
        }
      }
    } else if (year) {
      if (typeof year === 'string') {
        query = query.where('year', '==', year)
      } else {
        query = query.where('year', 'in', year)
      }
    }

    const snapshot = await query.get()

    snapshot.forEach((doc) => {
      let rate: Rate = {
        firebaseID: doc.id,
        ...doc.data(),
        getHeader: function (): string[] {
          throw new Error('Function not implemented.')
        },
      }
      rates.push(rate)
    })
    return rates
  } catch (e) {
    console.error(e)
    throw e
  }
}

export function addRate(rate: Rate) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection('Rates')
      .withConverter(converter())
      .add(rate)
      .then((data) => {
        resolve({ id: data.id, ...rate })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function updateRates(rate: Rate) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection('Rates')
      .doc(rate.firebaseID)
      .withConverter(converter())
      .update(rate)
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function deleteRates(rate: Rate) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection('Rates')
      .doc(rate.firebaseID)
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
