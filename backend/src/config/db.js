const mongoose = require('mongoose');

const connectDB = async () => {
try {
      await mongoose.connect(process.env.DB_URL);
      console.log('Corriendo...');
} catch (error) {
      console.log('No funcionaaa😔');
}
}


//Si es una funcion con llaves, si no sin ellas
module.exports = {connectDB};