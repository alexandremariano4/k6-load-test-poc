import http from 'k6/http';
import { check, sleep } from 'k6';
import { defaultHandleSummary } from './configuration/generalConfig.js';
import { options } from 'k6/http';
import { accountOptions } from './options/options.js';

export const handleSummary = defaultHandleSummary('test-ci.html');

export const options = accountOptions();


export default function (){

    const response = http.get('https://k6.io/')

    check(response, {
        'status is 200': (r) => r.status === 200,
        'body contains text': (r) => r.body.includes('Load testing'),
    }); 
}
