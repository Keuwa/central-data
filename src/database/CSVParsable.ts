export default abstract class CSVParsable {
  getHeader() {
    let headers = Object.getOwnPropertyNames(this)
    let index = headers.findIndex((header) => {
      return header === 'firebaseID'
    })

    headers.splice(index, 1)

    return headers
  }
}
