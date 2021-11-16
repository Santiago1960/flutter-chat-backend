const { response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Este correo ya está registrado'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT (JSON web token)
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {

        console.log(error);
        return res.status(500).json({

            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {

            return res.status(404).json({

                ok: false,
                msg: 'Email no existe'
            });
        }

        // Validar el password
        const validaPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validaPassword) {

            return res.status(400).json({

                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generamos JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    } catch (error) {

        console.log(error);

        return res.status(500).json({

            ok: false,
            msg: 'Hable on el administrador'
        });
    }
}

const renewToken = async(req, resp = response) => {

    const uid = req.uid;

    // Generamos JWT
    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    resp.json({
        ok: true,
        usuario,
        token
    });
}

module.exports = {

    crearUsuario,
    login,
    renewToken
}