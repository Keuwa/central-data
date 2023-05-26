import { NeutralisationCoefficient } from '../../../database/entity/neutralizationCoefficient'
import { firebaseAdmin } from '../../../firebase/firebaseAdmin'
import { converter } from '../../../database/firebaseConverter'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch(req.method) {
    case 'GET':
        let getResult = await new Promise(async resolve => {
            let data = await getNeutralisationCoefficients()
            resolve(data)
        })
        res.status(200).json(getResult)
        break
    case 'POST':
        let postResult = await new Promise(async resolve => {
            let data = await addNeutralisationCoefficient(req.body)
            resolve(data)
        })
        res.status(200).json(postResult)
        break
    case 'PUT':
        let updatedPost = await new Promise(async resolve => {
            let data = await updateNeutralisationCoefficients(req.body)
            resolve(data)
        })
        res.status(200).json(updatedPost)
        break  
    case 'DELETE':
        let deletedPost = await new Promise(async resolve => {
            let data = await deleteNeutralisationCoefficients(req.body)
            resolve(data)
        })
        res.status(200).json(deletedPost)
        break  
    default:
        res.status(401).json({error: 'Method not allowed'})
        break
    }
}


export async function getNeutralisationCoefficients(): Promise<Array<NeutralisationCoefficient>> {
    let neutralisationCoefficients: Array<NeutralisationCoefficient> = []
    try {
        const db = firebaseAdmin.firestore()
        const snapshot = await db.collection('neutralisationCoefficients').get()
        snapshot.forEach(doc => {
            let neutralisationCoefficient: NeutralisationCoefficient = {
                firebaseID: doc.id,
                ...doc.data()
            }
            neutralisationCoefficients.push(neutralisationCoefficient)
        })
        return neutralisationCoefficients
    } catch(e) {
        console.error(e)
        throw e
    }
}

export function addNeutralisationCoefficient(neutralisationCoefficient: NeutralisationCoefficient){
    return new Promise((resolve, reject) => {
        firebaseAdmin.firestore()
            .collection('neutralisationCoefficients')
            .withConverter(converter())
            .add(neutralisationCoefficient)
            .then((data) => {
                resolve({id: data.id, ...neutralisationCoefficient})
            })
            .catch(error => {
                reject(error)
            })
    })
  
}

export  function updateNeutralisationCoefficients(neutralisationCoefficient: NeutralisationCoefficient){
    return new Promise((resolve, reject) => {
        firebaseAdmin.firestore()
            .collection('neutralisationCoefficients')
            .doc(neutralisationCoefficient.firebaseID)
            .withConverter(converter())
            .update(neutralisationCoefficient)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })

}

export  function deleteNeutralisationCoefficients(neutralisationCoefficient: NeutralisationCoefficient){
    return new Promise((resolve, reject) => {
        firebaseAdmin.firestore()
            .collection('neutralisationCoefficients')
            .doc(neutralisationCoefficient.firebaseID)
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