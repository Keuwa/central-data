import fs from 'fs'
import csvParser from 'csv-parser'
import { firebaseAdmin } from '../../firebase/firebaseAdmin'
import { converter } from '../../database/firebaseConverter'

import type { NextApiRequest, NextApiResponse } from 'next'
import EntityFactory from '../../database/EntityFactory'
import { rejects } from 'assert'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch(req.method) {
    case 'POST':
        let postResult = await new Promise(async resolve => {
            let uploadData = {
                file: req.body.file,
                date: req.body.date,
                entityType: req.body.entityType,
            }
            resolve(req.body)
            let data = await upload(uploadData)
            resolve(data)
        })
        res.status(200).json(postResult)
        break
    default:
        res.status(401).json({error: 'Method not allowed'})
        break
    }
}


export function upload(uploadData: { file: any; date?: any; entityType?: string }){

    if(undefined === uploadData.entityType){
        throw( new Error('Entity type not set'))
    }
    

    let entity = EntityFactory.buildEntity(uploadData.entityType)

    
    let jsonData = new Array<typeof entity>()

    fs.createReadStream(uploadData.file)
        .pipe(csvParser())
        .on('data', (data) => {
            if(undefined === uploadData.entityType){
                throw( new Error('Entity type not set'))
            }
            entity = EntityFactory.buildEntity(uploadData.entityType, data)
            jsonData.push(entity)
        })
        .on('end', () => {
            return new Promise((resolve, reject) => {
                resolve(jsonData)
            })
        }) 

    // return new Promise((resolve, reject) => {
    //     firebaseAdmin.firestore()
    //         .collection('sectors')
    //         .withConverter(converter())
    //         .add(sector)
    //         .then((data) => {
    //             resolve({id: data.id, ...sector})
    //         })
    //         .catch(error => {
    //             reject(error)
    //         })
    // })
  
}
