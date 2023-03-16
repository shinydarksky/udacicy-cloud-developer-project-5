import axios from "axios";
import { authConfig } from '../config'

function getUserInfo(token: string) {
    var options: any = {
        method: 'GET',
        url: `https://${authConfig.domain}/api/v2/users/`,
        params: { q: 'email:"jane@exampleco.com"', search_engine: 'v3' },
        headers: { authorization: `Bearer ${token}` }
    };
    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
}


export {
    getUserInfo
}