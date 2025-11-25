import { accountOptions } from './options/options.js';
import { group } from 'k6';
import createNewUser from './scripts/script-accounts.js';
import { defaultHandleSummary } from './configuration/generalConfig.js';
import { deleteExcedentUsers, closeConnection } from './database/dbConnection.js';

export const options = accountOptions();
export const handleSummary = defaultHandleSummary('test-accounts.html');


export function setup() {

}


export default function testsExecutioner(){
    group('Criar novo usuário - POST /accounts', ()=> {
        createNewUser()
    })
}


export function teardown() {
    deleteExcedentUsers();
    closeConnection();
}
