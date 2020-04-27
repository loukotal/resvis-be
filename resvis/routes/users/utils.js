// Maybe better to move this to User model?

const crypto = require("crypto")

async function hashPassword(password) {
    const salt = crypto.randomBytes(64).toString("base64")
    const iterations = 10000
    return new Promise((accept, reject) => { 
        crypto.pbkdf2(password, salt, iterations, 256, "sha256", (err, hash) => {
            if (err) {
                reject(err);
            } else {
                accept({
                    salt,
                    hash: hash.toString("hex"),
                    iterations: iterations
                })    
            }
        })
    })
}


async function checkPassword(savedHash, savedSalt, savedIterations, passwordToCheck) {
    return new Promise((accept, reject) => {
        crypto.pbkdf2(passwordToCheck, savedSalt, savedIterations, 256, "sha256", (err, hash) => {
            if (err) {
                reject(err)
            } else {
                accept(hash.toString("hex") == savedHash)
            }
        }) 

    })
    
}

module.exports = {
    hashPassword: hashPassword,
    checkPassword: checkPassword
}