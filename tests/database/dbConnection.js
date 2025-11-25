import sql from 'k6/x/sql';
import driver from 'k6/x/sql/driver/postgres';
import { check } from 'k6';

const db = sql.open(driver, 'postgres://admin:123@localhost:5432/smartbit?sslmode=disable');

export function deleteUser(email) {
    const result = db.exec('DELETE FROM accounts WHERE email = $1;', email);
    
    check(result, {
        'delete user successfully': (r) => r.rowsAffected() > 0,
    });
    return result;
}



export function deleteExcedentUsers() {
    const result = db.exec('DELETE FROM accounts WHERE id > 10;');
    
    check(result, {
        'delete new users successfully': (r) => r.rowsAffected() > 0,
    });
    
    return result;
}



export function closeConnection() {
    db.close();
}
