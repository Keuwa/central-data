import { GridPrices } from '../../../database/entity/gridPrices'
import { firebaseAdmin } from '../../../firebase/firebaseAdmin'
import { converter } from '../../../database/firebaseConverter'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
    case 'GET':
        let getResult = await new Promise(async (resolve) => {
            let data = await getGridPrices()
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

export async function getGridPrices(): Promise<Array<GridPrices>> {
    let gridPrices: Array<GridPrices> = []
    try {
        const db = firebaseAdmin.firestore()
        const snapshot = await db.collection('gridPrices').get()
        snapshot.forEach((doc) => {
            let gridPrice: GridPrices = {
                firebaseID: doc.id,
                ...doc.data(),
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
