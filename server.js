const express = require('express')
const multer = require('multer')
const upload = multer({dest: __dirname + '/uploads/images'});
const base64ToImage = require('base64-to-image');
const  { spawn } = require('child_process')
const fs = require('fs')
var moduleLoaded = 1
var pred

const app = express()

let port = process.env.PORT;
if(port == null || port =="") {
  port = 3000;
}

app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.use(express.static('public'));
app.set('views', 'views')
app.set('view engine', 'ejs')

app.post('/upload',upload.single('photo'), (req, res) => {
    if(req.body) {
        var base64Str = req.body.photo;
        var path = './uploads/';
        //var optionalObj = {'fileName': 'imageToProcess', 'type':'png'};
        //base64ToImage(base64Str,path,optionalObj); 

        var imagePath = '..\\uploads\\images\\imageToProcess'

        var result;
        // spawn new child process to call the python script
        const python = spawn('python', ['./ml_deploy/predict_tf.py',base64Str]);
        // collect data from script
        python.stdout.on('data', function (data) {
        result = data.toString()
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
        let conf = result.slice(0,6)
        pred = result[8]
        res.json({confidence: conf, predicted: pred})
        });
    }
    else throw 'error';
})

/*app.post('/validate', (req, res) => {
    counts = fs.readFileSync("./uploads/count.json")
    counts = JSON.parse(counts)
    var path;
    if(req.body.validate == 'yes') {
        counts['correct'] += 1
        count = counts['correct']
        path = './uploads/images/correct/image_' + count + '_real_' + pred + '.png'
    }
    else {
        counts['incorrect'] += 1
        count = counts['incorrect']
        path = './uploads/images/incorrect/image_' + count + '_real_' + req.body.correct + '_pred_' + pred + '.png'
    }
    fs.rename('./uploads/imageToProcess.png', path, err => {
        if(err) {throw err}
    })
    fs.writeFile('./uploads/count.json', JSON.stringify(counts), err => {
        if (err) {throw err}
    })
    res.redirect('/')
})*/

app.post('/validate', (req, res) => {
    res.redirect('/')
})

app.get('/', (req, res) => {
    if (moduleLoaded == 1) {
        res.render('index')
    } else {
        console.log("FAIL")
        res.render('404')
    }
})


app.get('*', (req, res) => {
    res.render('404')
})

app.listen(port, function() {
    const pySetup = spawn('python', ['./ml_deploy/setup_tf.py'])
    var dataToSend
    pySetup.stdout.on('data', function (data) {
        dataToSend = data.toString();
    });
    pySetup.on('close',(code) => {
        if(dataToSend[0] == 1){
            console.log("DONE")
            moduleLoaded = 1
        } else {
            console.log("FAIL")
            moduleLoaded = 0
        }
    })
})
