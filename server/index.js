const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const port = 5000;

const { User } = require("./model/User");
const { auth } = require("./middleware/auth");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
const config = require("./config/key");
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify:true
})
.then(()=> console.log("MongoDB Connected.."))
.catch(err=>console.log("MongoDB connection fail"));

app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.get("/api/hello", (req, res) => {
    res.send("안녕하세요");
})

app.post("/api/join", (req, res) => {
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        });
    });
});

app.post("/api/login", (req, res) => {
    User.findOne({email : req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message : "사용자를 찾을 수 없습니다."
            });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) { 
                return res.json({
                    loginSuccess: false,
                    message : "비밀번호가 틀렸습니다."
                });
            }
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                res.cookie("access_token", user.token)
                .status(200)
                .json({
                    loginSuccess : true,
                    userId: user._id
                });
            });

        });
    });
});

app.get("/api/auth", auth, (req, res) => {
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name
    });
});

app.get("/api/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id : req.user._id}, {token: "" }, (err, user) => {
        if(err) return res.json({ success : false, err : err});
        return res.status(200).send({
            success : true
        })
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))