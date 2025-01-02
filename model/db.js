const mongoose = require('mongoose');
// 
//mongodb://localhost:27017/Database_stayserene
mongoose.connect('mongodb+srv://dbstayserene:PEzCnDYeJNUlCSc7@cluster0.iijz2.mongodb.net/Database_stayserene')
    .catch((err) => {
        console.log("Loi ket noi CSDL");
        console.log(err);
    });
module.exports = { mongoose }