const BASE_URL = 'http://skylinkdev.us-east-2.elasticbeanstalk.com/api/';

export const ENDPIONTS = {
    USER: 'User',
    ROLE: 'Role',
    UNIT: 'Unit',
    PALLET: 'Pallet',
    WAREHOUSELOT: "WarehouseLot",
    LOCATION: "Location"
}

export function APIURL(endpoint) {

    let url = BASE_URL + endpoint + '/';
    return url;
}