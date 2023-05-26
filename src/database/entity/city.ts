import CSVParsable from '../CSVParsable'

export default class City extends CSVParsable {
    inseeID?: string
    name?: string
    postcode?: string
    department?: string
    interco?: string
}