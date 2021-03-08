process.env.NODE_ENV != "production" ? require('dotenv').config() : console.log("In Prod Mode!")

const express = require('express')
const router = express.Router()
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOveride = require('method-override')
const mongoose = require('mongoose')
const videoSchema = require('../models/video')

// Init gridFsBucket
let gridFsBucket;

const conn = mongoose.createConnection(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })

conn.once('open', () => {
  // Init stream
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'yourBucketName'});
});

// Create storage engine
const storage = new GridFsStorage({
    url: process.env.DATABASE_CONNECTION_STRING,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            originalname: file.originalname,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });


router.get('/create_video', (req, res) => {
    res.render('newVideo')
})

router.post('/create_video', upload.single('file'), async (req, res) => {
    try {
        res.render('newVideoPt2', { video: req.file, fileName: req.file.filename})
    } catch (err) {
        throw err;
        
    }
    
});

// @route GET all files at /
// @desc Display All the files!

router.get('/', (req, res) => {
    gridFsBucket.files.find().toArray((err, files) => {
        // check if files are there
        if(!files || files.length === 0) {
            res.render('videos', { message: "No Videos Uploaded Yet!" })
        } 
        res.json(files) 
    })
})


// @route /create_video_pt_2
// @desc create main thing

router.post('/create_video_pt_2', upload.single('file'), async (req, res) => {
    try {
      
      console.log(req.file.filename)
      res.render('create_video_pt_3', { file: req.file, thumbnailFileName: req.file.filename })
    } catch(err) {
        throw err;
        
    }

})

router.post('/create_video_pt_3', async (req, res) => {
  try {
    const newvideo = new videoSchema({
      title: req.body.title_create_vid.toUpperCase(),
      description: req.body.description_create_vid,
      fileName: req.cookies.VideofileName,
      originalName: req.body.title_create_vid,
      thumbnailFileName: req.cookies.ThumbnailFileName
  })
  console.log(req.cookies.ThumbnailFileName)
  console.log(req.cookies.VideofileName)
  await newvideo.save()
  res.redirect('/')
  } catch (err) {
    
  }
})
// @route /video_creation_confirmation
//@desc give confirmation that video is created

router.get('/video_creation_confirmation', (req, res) => {

})


router.get('/watch_video/:filename',  async (req, res) => {
  try {
    let videoInfo =  await videoSchema.findOne({ fileName: req.params.filename })
    gridFsBucket.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (file || file.length !== 0) {
        production1 = process.env.NODE_ENV
        res.render('view_video', { file: file, video: videoInfo, production: production1 })
      } else {
        res.send("No Such Video Exists")
      }

    });
  } catch(err) {
    throw err
  }
})

// @route GET /image/:filename
// @desc Display Image
router.get('/get_one/:filename', (req, res) => {
  gridFsBucket.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpg' || file.contentType === 'video/mkv' || file.contentType === 'video/mp4' || file.contentType === "video/wmv" || file.contentType === "video/avi" || file.contentType === "video/flw") {
      // Read output to browser
      const readstream = gridFsBucket.createReadStream(file.filename);
      res.set('Content-Type', file.contentType)
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an Video'
      });
    }
  });
});


router.get('/get_one_thumbnail/:thumbnailFileName', (req, res) => {
  gridFsBucket.files.findOne({ filename: req.params.thumbnailFileName }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpg' || file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === "image/tiff") {
      // Read output to browser
      const readstream = gridFsBucket.createReadStream(file.filename);
      res.set('Content-Type', file.contentType)
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
})


module.exports = router

