const { verifyJwt } = require("../config/jwt");
const User = require("../api/models/user");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if(!token) {
      return res.status(400).json('No estas autorizado');
    }

    const parsedToken = token.replace('Bearer ','');
    const {id} = verifyJwt(parsedToken);
    const user = await User.findById(id);

    user.password = null; //! Me traigo el user al req pero le borro la passwd para no leakearla
    req.user = user;
    next();

  } catch (error) {
    return res.status(400).json('Inicia Sesión');
  }
}

const isAdmin = async (req, res, next) => {
 
  if (req.user.rol === "Admin") {
    next();
} else {
    return res.status(400).json("No eres Admin");
}

}

module.exports = {isAuth}