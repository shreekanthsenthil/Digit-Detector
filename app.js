const express = require('express')
const multer = require('multer')
const upload = multer({dest: __dirname + '/uploads/images'});
const base64ToImage = require('base64-to-image');
const  { spawn } = require('child_process')
const PythonShell = require('python-shell')

const app = express()
const PORT = 3000

app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.use(express.static('public'));
app.set('views', 'views')
app.set('view engine', 'ejs')

app.post('/',upload.single('photo'), (req, res) => {
    if(req.body) {
        var base64Str = req.body.photo;
        var path = './uploads/images/';
        var optionalObj = {'fileName': 'imageFileName', 'type':'png'};
        base64ToImage(base64Str,path,optionalObj); 

        var imagePath = '..\\uploads\\images\\imageFileName'

        var dataToSend;
        // spawn new child process to call the python script
        const python = spawn('python', ['./ml_deploy/predict_tf.py',imagePath]);
        // collect data from script
        python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString()
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
        console.log(dataToSend)
        res.send('Upload Success')
        });
    }
    else throw 'error';
})

app.get('/', (req, res) => {
    const pyStepup = spawn('python', ['./ml_deploy/setup_tf.py'])
    var dataToSend
    pyStepup.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    pyStepup.on('close',(code) => {
        console.log(dataToSend)
        console.log('END SETUP')
    })
    res.render('index',{data: ''})
})

app.listen(PORT)