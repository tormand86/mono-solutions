import Axios from 'axios'

let endpointUrl = "https://restcountries.eu/rest/v2/"

export default {
	getCountries(criteria, search) {
		return Axios.get(endpointUrl + criteria + "/" + search)
	}
}