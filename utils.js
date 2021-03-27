const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
require('dotenv').config();

mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB @ 27017');
});
  
let UserSchema = new Schema({
    username: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true}
});
  
let User = mongoose.model("User", UserSchema);

const validatePassword = (password, salt, userHash) => {
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return userHash === hash;
}

const createNewUser = (userData) => {
    let username = userData.username;
    let firstName = userData.firstName;
    let lastName = userData.lastName;
    let password = userData.password;
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    
    let newUser = new User({
        username: username,
        firstName: firstName,
        lastName: lastName,
        salt: salt,
        hash: hash
    });

    newUser.save(function(err, data){
       if (err){
        console.error(err);
       }
    });
}

const loginUser = (username, password, res) => {
    User.findOne({ username: username }, function(err, user){
        if(err){
            console.error(err);
        }
        if(user === null){
            res.status(400).json({
                message: "User does not exist",
                login: false
            });
        }
        else{
            const validateUser = validatePassword(password, user.salt, user.hash);
            if(validateUser){
                res.status(201).json({
                    message: "User logged in",
                    login: true
                });
            }
            else{
                res.status(400).json({
                    message: "Wrong password",
                    login: false
                });
            }
        }
    });
}

const updatePassword = async (username, password, newPassword, res) => {
    User.findOne({ username: username }, function(err, user){
        if(err){
            console.error(err);
        }
        if(user === null){
            res.status(400).json({
                "message": "User does not exist"
            })
        }
        else{
            const validateUser = validatePassword(password, user.salt, user.hash);
            if(validateUser){
                let salt = crypto.randomBytes(16).toString('hex');
                let hash = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512').toString('hex');
                user.salt = salt;
                user.hash = hash;
                user.save(function(err, data){
                    if(err){
                        console.error(err);
                        res.status(400).json({
                            "message": "An error occured"
                        });
                    } else {
                        res.status(201).json({
                            "message": "Password updated"
                        });
                    }
                });
            }
            else{
                res.status(400).json({
                    "message": "User cannot be validated"
                });
            }
        }
    });
}

const checkIfUsernameExists = async (username) => {
    let records = await User.find({
        username: username
    });
    if (records.length === 0){
        return true;
    }
    else{
        return false;
    }
}

const getUser = async () => {
    let records = await User.find();
    let userRecords = [];
    records.forEach(element => {
        userRecords.push(element.toObject());
    });
    return userRecords;
}

const deleteAllRecords = async () => {
    await User.remove();
}

exports.createNewUser = createNewUser;
exports.getAllUsers = getUser;
exports.checkIfUsernameExists = checkIfUsernameExists;
exports.deleteRecords = deleteAllRecords;
exports.loginUser = loginUser;
exports.updatePassword = updatePassword;