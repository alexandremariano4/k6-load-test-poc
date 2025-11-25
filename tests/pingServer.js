import http from 'k6/http';
import { check, sleep } from 'k6';
import { defaultHandleSummary } from './configuration/generalConfig.js';

export const handleSummary = defaultHandleSummary('test-ping.html');


export default function (){

    const response = http.get('http://localhost:3000/')

    check(response, {
        'status is 200': (r) => r.status === 200,
        'body contains text': (r) => r.body.includes('Smart Bit'),
    });
  
    
    sleep(1);
}

