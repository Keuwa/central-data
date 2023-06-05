import { LocalizationCoefficient } from '../../../database/entity/localizationCoefficient'
import { firebaseAdmin } from '../../../firebase/firebaseAdmin'
import { converter } from '../../../database/firebaseConverter'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      let getResult = await new Promise(async (resolve) => {
        let data = await getLocalizationCoefficients()
        resolve(data)
      })
      res.status(200).json(getResult)
      break
    case 'POST':
      let postResult = await new Promise(async (resolve) => {
        let data = await addLocalizationCoefficient(req.body)
        resolve(data)
      })
      res.status(200).json(postResult)
      break
    case 'PUT':
      let updatedPost = await new Promise(async (resolve) => {
        let data = await updateLocalizationCoefficients(req.body)
        resolve(data)
      })
      res.status(200).json(updatedPost)
      break
    case 'DELETE':
      let deletedPost = await new Promise(async (resolve) => {
        let data = await deleteLocalizationCoefficients(req.body)
        resolve(data)
      })
      res.status(200).json(deletedPost)
      break
    default:
      res.status(401).json({ error: 'Method not allowed' })
      break
  }
}

export async function getLocalizationCoefficients(): Promise<
  Array<LocalizationCoefficient>
> {
  let localizationCoefficients: Array<LocalizationCoefficient> = []
  try {
    const db = firebaseAdmin.firestore()
    const snapshot = await db.collection('localizationCoefficients').get()
    snapshot.forEach((doc) => {
      let localizationCoefficient: LocalizationCoefficient = {
        firebaseID: doc.id,
        ...doc.data(),
      }
      localizationCoefficients.push(localizationCoefficient)
    })
    return localizationCoefficients
  } catch (e) {
    console.error(e)
    throw e
  }
}

export function addLocalizationCoefficient(
  localizationCoefficient: LocalizationCoefficient
) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection('localizationCoefficients')
      .withConverter(converter())
      .add(localizationCoefficient)
      .then((data) => {
        resolve({ id: data.id, ...localizationCoefficient })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function updateLocalizationCoefficients(
  localizationCoefficient: LocalizationCoefficient
) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection('localizationCoefficients')
      .doc(localizationCoefficient.firebaseID)
      .withConverter(converter())
      .update(localizationCoefficient)
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function deleteLocalizationCoefficients(
  localizationCoefficient: LocalizationCoefficient
) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection('localizationCoefficients')
      .doc(localizationCoefficient.firebaseID)
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
