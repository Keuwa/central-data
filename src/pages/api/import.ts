import fs from 'fs'
import csvParser from 'csv-parser'
import { firebaseAdmin } from '../../firebase/firebaseAdmin'
import { converter } from '../../database/firebaseConverter'

import type { NextApiRequest, NextApiResponse } from 'next'
import EntityFactory from '../../database/EntityFactory'
import { rejects } from 'assert'
import formidable from 'formidable'
import { isStringLiteral } from 'typescript'
import { Entity } from '../../database/entities'

export const config = {
  api: {
    bodyParser: false,
  },
}

const postFile = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    console.log(fields)
    console.log(files)
    return res.status(201).send('')
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      //   postFile(req, res)
      const form = new formidable.IncomingForm()
      form.parse(
        req,
        async function (
          err: any,
          fields: formidable.Fields,
          files: formidable.Files
        ) {
          // console.log(fields)
          let file
          if (Array.isArray(files.file)) {
            file = files.file[0]
          } else {
            file = files.file
          }

          let datas = await upload({
            file: file,
            date: fields.date,
            entityType: Array.isArray(fields.entityType)
              ? fields.entityType[0]
              : fields.entityType,
          })

          console.log(datas)
          return res.status(201).send('ok')
        }
      )
      //   let postResult = await new Promise(async (resolve) => {
      //     let uploadData = {
      //       file: req.body.file,
      //       date: req.body.date,
      //       entityType: req.body.entityType,
      //     }
      //     // resolve(req.body)
      //     let data = await upload(uploadData)
      //     resolve(data)
      //   })
      //   res.status(200).json(postResult)
      break
    default:
      res.status(401).json({ error: 'Method not allowed' })
      break
  }
}

export function upload(uploadData: {
  file: formidable.File;
  date?: string | string[];
  entityType?: string;
}): Promise<Entity[]> {
  if (undefined === uploadData.entityType) {
    throw new Error('Entity type not set')
  }

  return new Promise((resolve, reject) => {
    let entities = new Array<Entity>()
    fs.createReadStream(uploadData.file.filepath)
      .pipe(csvParser({ separator: ';' }))
      .on('data', (data) => {
        // console.log(data)
        if (undefined === uploadData.entityType) {
          throw new Error('Entity type not set')
        }
        // console.log(uploadData.entityType)
        let entity: Entity
        entity = EntityFactory.buildEntity(uploadData.entityType, data)
        entities.push(entity)
      })
      .on('end', () => {
        let promises: Promise<Entity>[] = []

        entities.forEach((entity) => {
          promises.push(
            firebaseAdmin
              .firestore()
              .collection(uploadData.entityType || '')
              .withConverter(converter())
              .add(JSON.parse(JSON.stringify(entity)))
          )
        })

        resolve(Promise.all(promises))
      })
  })
}
