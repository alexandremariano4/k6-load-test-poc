import { accountOptions                             } from './options/options.js';
import { group, sleep                               } from 'k6';
import { createNewUser, enrollUser                  } from './scripts/script-accounts.js';
import { defaultHandleSummary                       } from './configuration/generalConfig.js';
import { deleteExcedentUsers, closeConnection       } from './database/dbConnection.js';
import { randomIntBetween                           } from './helpers/randomString.js';


export const options = accountOptions();
export const handleSummary = defaultHandleSummary('test-accounts.html');


export function setup() {

}


export default function userAccount(){
    let userId;
    
    group('Criar novo usuário - POST /accounts', ()=> {
        const response = createNewUser();
        userId = JSON.parse(response.body).id;  
    })

    sleep(2);

    group('Matricular novo usuário - POST /memberships', ()=> { 
        enrollUser({
            idUser: userId, 
            creditCard: randomIntBetween(1000, 9999),
            idPlan: 1
        })
    })

    sleep(1);
}


export function teardown() {
    deleteExcedentUsers();
    closeConnection();
}
