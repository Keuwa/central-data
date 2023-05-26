import Rate from '../../../database/entity/rate'
import { firebaseAdmin } from '../../../firebase/firebaseAdmin'
import { converter } from '../../../database/firebaseConverter'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch(req.method) {
    case 'GET':
        let getResult = await new Promise(async resolve => {
            let data = await getRates()
            resolve(data)
        })
        res.status(200).json(getResult)
        break
    case 'POST':
        let postResult = await new Promise(async resolve => {
            let data = await addRate(req.body)
            resolve(data)
        })
        res.status(200).json(postResult)
        break
    case 'PUT':
        let updatedPost = await new Promise(async resolve => {
            let data = await updateRates(req.body)
            resolve(data)
        })
        res.status(200).json(updatedPost)
        break  
    case 'DELETE':
        let deletedPost = await new Promise(async resolve => {
            let data = await deleteRates(req.body)
            resolve(data)
        })
        res.status(200).json(deletedPost)
        break  
    default:
        res.status(401).json({error: 'Method not allowed'})
        break
    }
}


export async function getRates(): Promise<Array<Rate>> {
    let rates: Array<Rate> = []
    try {
        const db = firebaseAdmin.firestore()
        const snapshot = await db.collection('rates').get()
        snapshot.forEach(doc => {
            let rate: Rate = {
                firebaseID: doc.id,
                ...doc.data()
            }
            rates.push(rate)
        })
        return rates
    } catch(e) {
        console.error(e)
        throw e
    }
}

export function addRate(rate: Rate){
    return new Promise((resolve, reject) => {
        firebaseAdmin.firestore()
            .collection('rates')
            .withConverter(converter())
            .add(rate)
            .then((data) => {
                resolve({id: data.id, ...rate})
            })
            .catch(error => {
                reject(error)
            })
    })
  
}

export  function updateRates(rate: Rate){
    return new Promise((resolve, reject) => {
        firebaseAdmin.firestore()
            .collection('rates')
            .doc(rate.firebaseID)
            .withConverter(converter())
            .update(rate)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })

}

export  function deleteRates(rate: Rate){
    return new Promise((resolve, reject) => {
        firebaseAdmin.firestore()
            .collection('rates')
            .doc(rate.firebaseID)
            .withConverter(converter())
            .delete()
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}