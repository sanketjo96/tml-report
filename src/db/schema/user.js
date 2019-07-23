const mangoose = require('mongoose');
const Schema = mangoose.Schema;
const jwt = require('jsonwebtoken');
const key = process.env.key;

const userSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }
});

userSchema.statics.getJWT = (payload) => {
    return jwt.sign(payload, key)
};

userSchema.statics.findByEmail = async (email, password) => {
   let user;
    try {
        user = User.findOne({email});
        if(!user) {
            throw new Error('unable to login');
        }
   }
   catch(e) {
    console.log(e);
   }

   return user;
}

const User =  mangoose.model('User', userSchema);
module.exports = User;