const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const paylad = { uid };

        jwt.sign(paylad, process.env.JWT_KEY, {

            expiresIn: '20H'
        }, (err, token) => {

            if (err) {

                reject('No se pudo generar el JWT');
            } else {

                resolve(token);
            }
        });
    });
}

module.exports = { generarJWT };