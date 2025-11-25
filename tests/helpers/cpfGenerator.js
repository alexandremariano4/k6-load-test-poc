export function generateValidCPF() {
    let cpf = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    let sum = cpf.reduce((acc, digit, index) => acc + digit * (10 - index), 0);
    let firstVerifier = 11 - (sum % 11);
    firstVerifier = firstVerifier > 9 ? 0 : firstVerifier;
    cpf.push(firstVerifier);
    sum = cpf.reduce((acc, digit, index) => acc + digit * (11 - index), 0);
    let secondVerifier = 11 - (sum % 11);
    secondVerifier = secondVerifier > 9 ? 0 : secondVerifier;
    cpf.push(secondVerifier);
    return cpf.join('');
}
