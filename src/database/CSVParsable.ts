export default abstract class CSVParsable {
    getHeader() {
        let headers = Object.getOwnPropertyNames(this)
        console.log(headers)
        let index = headers.findIndex( header => {
            return header === 'firebaseID'
        })
        console.log(index)



        headers.splice(index, 1)

        return headers
    }

}