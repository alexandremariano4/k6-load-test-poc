import   http             from 'k6/http';
import { check, sleep   } from 'k6';
import { htmlReport     } from './report/htmlReport.js';
import { textSummary    } from './report/textSummary.js'
import { userGenerator  } from './helpers/userGenerator.js';
import { loadOptions    } from './options/loadOptions.js';
import { 
    deleteUser,
    closeConnection,
    deleteExcedentUsers } from './database/dbConnection.js'


export const options = loadOptions();

export function setup(){

}


export default function createNewUser(){

    const user = userGenerator();

    const payload = JSON.stringify( {
        "name": user.name,
        "email": user.email,
        "cpf": user.cpf
    })

    const response = http.post('http://localhost:3333/accounts',payload,{
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json, text/plain, */*',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY0MDI5NTAyLCJleHAiOjE3NjQ2MzQzMDJ9.yrsvHgV_NqoOWiR2IwpA9T5OcAN9Il9pTQEUZ1TaxiM'
        },
    })

    check(response, {
        'status is 201': (r) => r.status === 201,
        'body contains the correct name': (r) => JSON.parse(r.body).name === JSON.parse(payload).name,
        'body contains the correct email': (r) => JSON.parse(r.body).email === JSON.parse(payload).email,
        'body contains the correct cpf': (r) => JSON.parse(r.body).cpf === JSON.parse(payload).cpf,
    });    

}

export function teardown(){
    deleteExcedentUsers()
    closeConnection();
}

export function handleSummary(data) {
    return {
        'result.html': htmlReport(data),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    }   
}