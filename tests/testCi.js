import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport     } from './report/htmlReport.js';
import { textSummary    } from './report/textSummary.js'


export default function (){

    const response = http.get('https://k6.io/')

    check(response, {
        'status is 200': (r) => r.status === 200,
        'body contains text': (r) => r.body.includes('Load testing'),
    }); 
}

export function handleSummary(data) {
  return {
    'logs/test-ci.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}