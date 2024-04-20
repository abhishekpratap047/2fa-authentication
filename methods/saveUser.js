const writeFile = require("../methods/writeFile");
const getUsers = require("../methods/getUsers");

module.exports = function(newUser, callback){
    getUsers(function(err, users){
        if(err){
            callback("something went wrong");
            return;
        }

        for(let i = 0 ; i<users.length ; i++){
            let user = users[i];
            if(user.username === newUser.username){
                callback("User already exists");
                return;
            }
        }

        users.push(newUser);
        writeFile("./userdata.txt", JSON.stringify(users),function(err){
            if(err){
                callback("error saving user");
            }
            else{
                callback(null, true);
            }
        })

    })
}