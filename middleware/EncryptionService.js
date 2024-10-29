// const crypto = require('crypto');

// class EncryptionService {
//     constructor() {
//         this.algorithm = 'aes-256-cbc'; 
//         this.key = crypto.randomBytes(32); 
//     }
//     encrypt(text) {
//         const iv = crypto.randomBytes(16);
//         const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv);
//         let encrypted = cipher.update(text, 'utf8', 'hex');
//         encrypted += cipher.final('hex');
//         return { iv: iv.toString('hex'), encryptedData: encrypted };
//     }

//     decrypt(encryptedData, iv) {
//         const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), Buffer.from(iv, 'hex'));
//         let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//         decrypted += decipher.final('utf8');
//         return decrypted;
//     }
// }

// module.exports = EncryptionService;


// const CryptoJS = require('crypto-js');

// class EncryptionService {
//     constructor() {
//         this.key = CryptoJS.enc.Utf8.parse('pradeepsahanitestingvalue001@@@#');
//     }

//     encrypt(text) {
//         if (typeof text !== 'string') {
//             throw new Error('Input must be a string');
//         }

//         const iv = CryptoJS.lib.WordArray.random(128 / 8);
//         const encrypted = CryptoJS.AES.encrypt(text, this.key, {
//             iv: iv,
//             mode: CryptoJS.mode.CBC,
//             padding: CryptoJS.pad.Pkcs7
//         });

//         return {
//             iv: iv.toString(CryptoJS.enc.Hex),
//             encryptedData: encrypted.toString()
//         };
//     }

//     decrypt(encryptedData, iv) {
//         if (typeof encryptedData !== 'string' || typeof iv !== 'string') {
//             throw new Error('Encrypted data and IV must be strings');
//         }

//         const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {
//             iv: CryptoJS.enc.Hex.parse(iv),
//             mode: CryptoJS.mode.CBC,
//             padding: CryptoJS.pad.Pkcs7
//         });

//         const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        
//         // Handle potential empty result (decryption failure)
//         if (!decryptedText) {
//             throw new Error('Decryption failed, possibly due to incorrect key or IV');
//         }

//         return decryptedText; // Return the decrypted string
//     }
// }

// module.exports = EncryptionService;


const CryptoJS = require('crypto-js');

class EncryptionService {
    constructor() {
        this.key = CryptoJS.enc.Utf8.parse('pradeepsahanitestingvalue001@@@#');
    }

    encrypt(text) {
        if (typeof text !== 'string') {
            console.log(text)
            throw new Error(`Input must be a string. Received: ${typeof text}`);
           
        }

        const iv = CryptoJS.lib.WordArray.random(128 / 8);
        const encrypted = CryptoJS.AES.encrypt(text, this.key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        // Concatenate IV and encrypted data with a separator
        return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.toString()}`;
    }

    decrypt(encryptedString) {
        const [ivHex, encryptedData] = encryptedString.split(':');

        if (!ivHex || !encryptedData) {
            throw new Error('Invalid encrypted string format');
        }

        const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {
            iv: CryptoJS.enc.Hex.parse(ivHex),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
       
        if (!decryptedText) {
            throw new Error('Decryption failed, possibly due to incorrect key or IV');
        }

        return decryptedText; 
    }
}

module.exports = EncryptionService;

