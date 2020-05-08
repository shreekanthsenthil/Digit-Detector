const express = require('express')
const multer = require('multer')
const upload = multer({dest: __dirname + '/uploads/images'});
const base64ToImage = require('base64-to-image');

const app = express()
const PORT = 3000

app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.use(express.static('public'));
app.set('views', 'views')
app.set('view engine', 'ejs')

app.post('/upload',upload.single('photo'), (req, res) => {
    console.log('upload')
    if(req.body) {
        console.log(req.body.photo)
        res.json(req.body.photo)
        var base64Str = req.body.photo;
        var path =__dirname + '/uploads/images/';
        var optionalObj = {'fileName': 'imageFileName', 'type':'png'};
        base64ToImage(base64Str,path,optionalObj); 
    }
    else throw 'error';
})

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(PORT)