export class SearchAddressService {

    searchAddressFromCEPAsync = async (cep) => {
        return await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch(error => {
                console.log(error);
                return error;
            }) 
    }
}