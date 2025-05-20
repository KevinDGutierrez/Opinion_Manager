import { response, request } from "express";
import { hash, verify } from "argon2";
import { generarJWT } from "../helpers/generate-jwt.js"
import User from "./user.model.js";

export const login = async (req , res) => {
    try {

        const { email, password, username } = req.body;
        
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;
        
        const user = await User.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }] 
        });
        
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        if (user.estado  === false){
            return res.status(404).json({
                msg: 'El usuario esta desactivado'
            })
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: '¡Inicio de Sesión exitoso!',
            userDetails: {
                username: user.username,
                token: token            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener usuario',
            error
        })
    }
}

export const register = async (req, res) => {
    
    try {
        const data = req.body;

        const encryptedPassword = await hash (data.password);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username.toLowerCase(),
            email: data.email.toLowerCase(),
            phone: data.phone,
            password: encryptedPassword,
            role: data.role,
        });

        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        
        console.log(error);

        return res.status(500).json({
            msg: "User registration failed",
            error
        });
    }

}

export const updateUser = async (req, res = response) => {

    try {

        const { id } = req.params;
        const { _id, password, email, actualpassword, ...data } = req.body;
        let { username } = req.body;

        if (username) {
            username = username.toLowerCase();
            data.username = username;
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            })
        }

        if(req.user.id !== id){
            return res.status(400).json({
                success: false,
                msg: 'Usted no es propietario de este perfil, no se puede actualizar este usuario'
            })
        }

        if (user.status === false) {
            return res.status(400).json({
                success: false,
                msg: 'Este usuario ha sido eliminado'
            });
        }

        if(password){
            if(!actualpassword){
                return res.status(400).json({
                    success: false,
                    msg: 'Debe proveer su contraseña actual'
                })
            }

            const verifypassword = await verify(user.password, actualpassword);

            if(!verifypassword){
                return res.status(400).json({
                    success: false,
                    msg: 'la Contraseña es incorrecta'
                })
            }
            data.password = await hash(password);
        }

        const userUpdate = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            userUpdate
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error
        })   
    }
}

export const createAdmin = async () => {
    try {
        
        const admin = await User.findOne({username: "Admin".toLowerCase()})
        
        if(!admin){
            const password = await hash("12345678");
            const newAdmin = new User({
                name: "Kevin",
                surname: "Gutierrez",
                username: "Admin".toLowerCase(),
                email: "kevin161@gmail.com",
                phone: "32111213",
                password: password,
                role: "ADMIN_ROLE",
            });
            await newAdmin.save();
            console.log("Administrador creado con éxito");
        }else{
            console.log("Administrador ya existe");
        }

    } catch (error) {
        console.error("No se pudo crear el admin: ", error)
    }
}

export const createAnonUser = async () => {
  try {
    const anon = await User.findOne({ username: "anónimo" });

    if (!anon) {
      const password = await hash("anonimo123"); // puedes usar una clave genérica
      const newAnon = new User({
        name: "Usuario",
        surname: "Anónimo",
        username: "anónimo",
        email: "anonimo@anonimo.com",
        phone: "00000000",
        password: password,
        role: "USER_ROLE",
      });
      await newAnon.save();
      console.log("Usuario anónimo creado con éxito");
    } else {
      console.log("El usuario anónimo ya existe");
    }
  } catch (error) {
    console.error("No se pudo crear el usuario anónimo: ", error);
  }
};
