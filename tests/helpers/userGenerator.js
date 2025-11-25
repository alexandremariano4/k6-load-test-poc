import faker from 'k6/x/faker';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { generateValidCPF } from './cpfGenerator.js';


export function userGenerator() {

    const firstName = faker.person.firstName();
    const uuid = uuidv4().substring(0,8);

    const user = {
        name: firstName,
        email: `${firstName}${uuid}@hotmail.com`,
        cpf: generateValidCPF()
    }
    return user;
}