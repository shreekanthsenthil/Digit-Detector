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

app.post('/upload',upload.single('photo'), (req, res) => {
    if(req.body) {
        var base64Str = req.body.photo;
        var path = './uploads/';
        var optionalObj = {'fileName': 'imageToProcess', 'type':'png'};
        base64ToImage(base64Str,path,optionalObj); 

        var imagePath = '..\\uploads\\images\\imageToProcess'

        var result;
        // spawn new child process to call the python script
        const python = spawn('python', ['./ml_deploy/predict_tf.py',imagePath]);
        // collect data from script
        python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        result = data.toString()
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
        let conf = result.slice(0,6)
        let pred = result[8]
        console.log(conf, pred)
        res.json({confidence: conf, predicted: pred})
        });
    }
    else throw 'error';
})

app.get('/', (req, res) => {
    res.render('index',{data: ''})
})

app.listen(PORT, function() {
    const pySetup = spawn('python', ['./ml_deploy/setup_tf.py'])
    var dataToSend
    pySetup.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    pySetup.on('close',(code) => {
        console.log(dataToSend)
        console.log('END SETUP')
    })
})