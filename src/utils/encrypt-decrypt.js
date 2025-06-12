import bcrypt from 'bcrypt';
const { hash, compare } = bcrypt;


export class Crypto {
    async encrypt (data) {
        return hash(data,7)
    }
    async decrypt (data,hashedData) {
        return compare(data,hashedData)
    }
}
