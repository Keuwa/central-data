import { Sector } from '../../../database/entity/sector'
import { firebaseAdmin } from '../../../firebase/firebaseAdmin'
import { converter } from '../../../database/firebaseConverter'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch(req.method) {
    case 'GET':
        let getResult = await new Promise(async resolve => {
            let data = await getSectors()
            resolve(data)
        })
        res.status(200).json(getResult)
        break
    case 'POST':
        let postResult = await new Promise(async resolve => {
            let data = await addSector(req.body)
            resolve(data)
        })
        res.status(200).json(postResult)
        break
    case 'PUT':
        let updatedPost = await new Promise(async resolve => {
            let data = await updateSectors(req.body)
            resolve(data)
        })
        res.status(200).json(updatedPost)
        break  
    case 'DELETE':
        let deletedPost = await new Promise(async resolve => {
            let data = await deleteSectors(req.body)
            resolve(data)
        })
        res.status(200).json(deletedPost)
        break  
    default:
        res.status(401).json({error: 'Method not allowed'})
        break
    }
}


export async function getSectors(): Promise<Array<Sector>> {
    let sectors: Array<Sector> = []
    try {
        const db = firebaseAdmin.firestore()
        const snapshot = await db.collection('sectors').get()
        snapshot.forEach(doc => {
            let sector: Sector = {
                firebaseID: doc.id,
                ...doc.data()
            }
            sectors.push(sector)
        })
        return sectors
    } catch(e) {
        console.error(e)
        throw e
    }
}

export function addSector(sector: Sector){
    return new Promise((resolve, reject) => {
        firebaseAdmin.firestore()
            .collection('sectors')
            .withConverter(converter())
            .add(sector)
            .then((data) => {
                resolve({id: data.id, ...sector})
            })
            .catch(error => {
                reject(error)
            })
    })
  
}

export  function updateSectors(sector: Sector){
    return new Promise((resolve, reject) => {
        firebaseAdmin.firestore()
            .collection('sectors')
            .doc(sector.firebaseID)
            .withConverter(converter())
            .update(sector)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })

}

export  function deleteSectors(sector: Sector){
    return new Promise((resolve, reject) => {
        firebaseAdmin.firestore()
            .collection('sectors')
            .doc(sector.firebaseID)
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