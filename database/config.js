const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        /* await mongoose.connect(process.env.DB_CNN, {

            // Con estas opciones activadas no consigue la conexión

            useUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }); */

        mongoose.connect(
            process.env.DB_CNN,
            async(err) => {
                if (err) throw err;
                console.log("Conectado a la BD")
            }
        )

        console.log('DB Online');
    } catch (error) {

        console.log(error);
        throw new Error('Error en la Base de Datos');
    }
}

module.exports = {

    dbConnection
}