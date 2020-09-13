import {ILocation} from '../models/app_user_model';
import {InvocationRequest} from 'aws-sdk/clients/lambda';
import {lambda} from '../config/lamba_config';

export const getLocation = async (inputIPAddress: string): Promise<ILocation> => {

    console.log('inputIPAddress', inputIPAddress);

    let ipAddress;
    let payload;
    if (inputIPAddress.split(',').length > 1) {
        ipAddress = inputIPAddress.split(', ')[0];
        ipAddress = ipAddress.substring(1, ipAddress.length);
    } else {
        ipAddress = inputIPAddress;
    }

    ipAddress = inputIPAddress.replace("\"", '').replace("\"", '');
    payload = JSON.stringify({ ipAddress: ipAddress});

    const params: InvocationRequest = {
        FunctionName: 'IP_geolocation',
        Payload: payload
    };

    console.log('Payload = ', params.Payload);
    try {
        console.log(`Getting location with parameters ${params.Payload}`);
        const response = await lambda.invoke(params).promise();
        const payload: any = JSON.parse(response.Payload.toString());
        const location: ILocation = {country: payload.country, region: payload.region, city: payload.city, ipAddress: payload.ipAddress};
        console.log(`Location = ${JSON.stringify(location)}`);
        return location;
    } catch (e) {
        console.log(`An error has occurred while getting location by ip with params ${JSON.stringify(params)}`);
        console.log(e.toString());
        return null;
    }
};
