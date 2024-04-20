const express = require('express')
const app = express();
const port = 3000;
const session = require('express-session');
const readFile = require('./methods/readFile');
const writeFile = require("./methods/writeFile");
const checkAuth = require("./methods/checkAuth");
const getUsers = require("./methods/getUsers");
const saveUser = require("./methods/saveUser");
const getProducts = require("./methods/getProducts");
const sendEmail = require('./methods/sendEmail');


app.use(session({
  secret: 'hellothere',
  resave: false,
  saveUninitialized: true,
}))

app.use(express.static(__dirname+"/"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")

app.get('/',function(req,res){
    res.render("home")
});


// LOGIN ROUTE

app.route("/login")
.get(function(req,res){
    res.render("login",{error:""})
})
.post(function(req,res){
    const {username, password} = req.body;
    getUsers(function(err,users){
        if(err){
            res.render("login",{error:"user not found"});
            return;
        }
        for(let i = 0 ; i<users.length ; i++){
            let user = users[i];
            if(user.username === username &&
                user.password === password){
                req.session.is_logged_in = true;
                if(user.isActive===true){
                    req.session.isActive=true;
                }
                req.session.user=user;
                res.redirect("/home");
                return;
            }
        }
        res.render("login",{error:"incorrect username or password"});
        return;
    })
})

//SIGNUP ROUTE

app.route("/signup")
.get(function(req,res){
    res.render("signup",{error:""})
})
.post(function(req,res){

    const {name, username, password, email, phone} = req.body;
    if(!name||!username||!password||!phone||!email){
        res.render("signup",{error:"Please enter all the required data"})
        return;
    }

    getUsers(function(err, users){
        if(err){
            res.render("signup", {error : "failed to read from DB"});
            return;  
        }


        let user = {
            name,
            username,
            password,
            phone,
            email,
            token : Date.now(),
            isActive: false
        };

        saveUser(user, function(err){
            if(err){
                res.render("signup", {error: err});
            }
            else{
                req.session.is_logged_in = true;
                req.session.user = user;
                sendEmail(user.email, user.token, function(err, data){
                    console.log(err, data);
                })
                res.redirect("/home")
            }
    
        })
    })

})

app.get('/home', checkAuth, function(req,res){

    let {page_no = 1} = req.query;
    page_no = Number(page_no)+1;
    getProducts(page_no, function(products){
        //Page no. will be assigned to the "Load next button" in landing page.
        res.render("landingPage",{products, page_no });
    })
    
    
})

app.get('/logout', function(req,res){
    req.session.destroy();
    res.redirect("/home");
})

//VERIFY USER
app.get("/verifyuser/:token", function(req,res){

    const {token} = req.params;
    console.log(parseInt(token));
    getUsers(function(err,users){
        if(err){
            res.render("verifyuser",{error:"we are secure"});
            console.log("error getUsers()")
            return;
        }
        for(let i = 0 ; i<users.length ; i++){
            let user = users[i];
            console.log(users[i].token)
            if(user.token === parseInt(token))
            {
                console.log("token verified")
                req.session.is_logged_in = true;
                req.session.isActive = true;
                users[i].isActive = true;

                writeFile("./userdata.txt", JSON.stringify(users), function(err){
                    if(err){
                        console.log("error saving userdata")
                    }
                    else{
                        console.log("user saving successful");
                    }
                })

                res.redirect("/home");
                return;
            }
            console.log("end of loop")
        }
        res.render("verifyuser",{error:"we are secure as hell"});
        return;
    })

})

//START SERVER

app.listen(port, ()=>{
    console.log("Server started on localhost/"+port);
});