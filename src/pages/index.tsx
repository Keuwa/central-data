import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { MouseEventHandler, useState } from 'react'
import { LocalizationCoefficient } from '../database/entity/localizationCoefficient'
import { NeutralizationCoefficient } from '../database/entity/neutralizationCoefficient'
import { Rate } from '../database/entity/rate'
import { Sector } from '../database/entity/sector'

const inter = Inter({ subsets: ['latin'] })

class EntityType {
  class: string = 'localizationCoefficient'
  route: string = 'localizationCoefficients'
  name: string = 'Coefficient de localisation'
}

interface IFormInfo {
  entityType: string;
  date: string;
  file?: File;
}

export default function Home() {
  const entityTypes: Array<EntityType> = [
    {
      class: 'LocalizationCoefficient',
      route: 'localizationCoefficients',
      name: 'Coefficient de localisation',
    },
    {
      class: 'NeutralizationCoefficient',
      route: 'neutralizationCoefficients',
      name: 'Coefficient de neutralisation',
    },
    {
      class: 'Rate',
      route: 'rates',
      name: 'Taux',
    },
    {
      class: 'Sector',
      route: 'sectors',
      name: 'Secteur',
    },
    {
      class: 'GridPrices',
      route: 'gridPrices',
      name: 'Grille tarifaire',
    },
  ]

  const [formInfo, setFormInfo] = useState<IFormInfo>({
    entityType: 'LocalizationCoefficient',
    date: '',
    file: undefined,
  })

  const handleSubmit = () => {
    //todo: check file type
    if (null === formInfo.file) {
      alert('Fichier non téléchargé')
      return
    }
    const file = formInfo.file
    const body = new FormData()

    body.append('file', file as Blob)
    body.append('date', formInfo.date)
    body.append('entityType', formInfo.entityType)
    // const route = entityTypes.find(
    //   (entity) => formInfo.entityType === entity.class
    // )?.route
    // if (undefined === route) {
    //   throw new Error('undefined route')
    // }

    var myHeaders = new Headers()
    myHeaders.append(
      'Authorization',
      `Bearer: ${process.env.NEXT_PUBLIC_CENTRAL_API_KEY ?? ''}`
    )

    fetch('/api/import', {
      method: 'POST',
      body,
      headers: myHeaders,
    })
      .then((response) => {
        console.warn(response)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const generateHeader = () => {
    // let entity
    // switch (formInfo.entityType) {
    //   case 'LocalizationCoefficient':
    //     entity = new LocalizationCoefficient()
    //     break
    //   case 'NeutralizationCoefficient':
    //     entity = new NeutralizationCoefficient()
    //     break
    //   case 'Rate':
    //     entity = new Rate()
    //     break
    //   case 'Sector':
    //     entity = new Sector()
    //     break
    //   default:
    //     throw new Error('Class not defined')
    // }
    // return entity.getHeader()
  }

  return (
    <>
      <Head>
        <title>Central data</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <form>
          <select
            value={formInfo.entityType}
            onChange={(e) =>
              setFormInfo({ ...formInfo, entityType: e.target.value })
            }
          >
            {entityTypes.map((value, key) => {
              return (
                <option key={key} value={value.class}>
                  {value.name}
                </option>
              )
            })}
          </select>
          <input
            onChange={(e) => setFormInfo({ ...formInfo, date: e.target.value })}
            value={formInfo.date}
            type="date"
          />
          <input
            onChange={(e) =>
              setFormInfo({
                ...formInfo,
                file: e.target.files && e.target.files[0],
              })
            }
            type="file"
          />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            Envoyer
          </button>
        </form>
        <div>
          <h3>Csv header </h3>
          {/* {generateHeader().map((value, key) => {
            return <span key={key}>{value}; </span>
          })} */}
        </div>
      </main>
    </>
  )
}
