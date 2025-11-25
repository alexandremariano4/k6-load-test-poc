import { userGenerator  } from '../helpers/userGenerator.js';
import   http             from 'k6/http';
import { check, sleep   } from 'k6';


export function createNewUser(){
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
        })
    
        return response;
}


export function enrollUser({
    idUser,
    creditCard,
    idPlan})
    {
        const payload = JSON.stringify( {
            "account_id": idUser,
            "credit_card": creditCard,
            "plan_id": idPlan
        })

        const response = http.post('http://localhost:3333/memberships',payload,{
            headers:{
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json, text/plain, */*',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY0MDI5NTAyLCJleHAiOjE3NjQ2MzQzMDJ9.yrsvHgV_NqoOWiR2IwpA9T5OcAN9Il9pTQEUZ1TaxiM'
            },
        })

        check(response, {
            'status is 201': (r) => r.status === 201,
            'account_id is corret': (r) => JSON.parse(r.body).account_id === idUser,
            'plan_id is corret': (r) => JSON.parse(r.body).plan_id === idPlan,
            'credit_card is corret': (r) => JSON.parse(r.body).credit_card === creditCard,
        })
    }