process.env.NODE_ENV != "production" ? require('dotenv').config() : console.log("In Prod Mode!")

const express = require('express')
const router = express.Router()
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const mongoose = require('mongoose')
const videoSchema = require('../models/video')
const cors = require('cors')
const redis = require('redis')


const corsOptions = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-type, Accept,  X-Custom-Header',
    'Access-Control-Request-Methods': 'POST, GET, DELETE, UPDATE, PATCH, OPTIONS'
}


// Init gfs
let gfs;
const conn = mongoose.createConnection(process.env.DATABASE_CONNECTION_STRING, {
   useNewUrlParser: true,
  useUnifiedTopology: true 
})

const client = redis.createClient()
client.on('connect', () => console.log('Redis client connected'))


conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: process.env.DATABASE_CONNECTION_STRING,
    options: { useUnifiedTopology: true },
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



router.options('*', cors(corsOptions))

router.post('/create_video', cors(corsOptions), upload.single('file'), async (req, res) => {
    try {
      console.log(req.body)
      if (req.file === null || req.file === undefined){
        return res.status(400).json({ msg: 'No File Uploaded' })
      }


      console.log('req.file ', req.file)
        
      res.json({ msg: 'abcdefgh', videoFileName: req.file.filename })

    } catch (err) {
        throw err;

    }

});


// @route /create_video_pt_2
// @desc create main thing

router.post('/create_video_pt_2', cors(corsOptions), upload.single('file'), async (req, res) => {
  try {
    console.log(req.body)
    if (req.file === null || req.file === undefined){
      return res.status(400).json({ msg: 'No File Uploaded' })
    }


    console.log('req.file ', req.file)
      
    res.json({ msg: 'abcdefgh', thumbnailFileName: req.file.filename })

  } catch (err) {
    res.status(500)
      throw err;

  }

})

router.post('/create_video_pt_3', cors(corsOptions), async (req, res) => {
  try {

    var id = 1

    const newvideo = new videoSchema({
      title: req.body.title.toUpperCase(),
      description: req.body.description,
      fileName: req.body.videoFileName,
      originalName: req.body.title,
      thumbnailFileName: req.body.thumbnailFileName,
      id: id
  })
  await newvideo.save()
  let newId = id + 1

  id = id + 1
  console.log(id)

  console.log(newId)
 
  res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.json({ success: false })
  }
})


router.post('/getVideoInfo', async (req, res) => {
    try {
      
    } catch (err) {
      
    }
})

// @route GET /get_one/:filename
// @desc Display Video
router.get('/get_one/:objId', async (req, res) => {

  const videoDoc = await videoSchema.findOne({ _id: req.params.objId })

  if(videoDoc == null) {
    return res.json({ msg: "no video with that id...." })
  }

  client.get(`video-${req.params.objId}`, (err, obj) => {
    if (!obj) {
      gfs.files.findOne({ filename: videoDoc.fileName }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({
            err: 'No file exists'
          });
        }
    
        // Check if image
        if (file.contentType === 'video/x-matroska' || file.contentType === 'video/mkv' || file.contentType === 'video/mp4' || file.contentType === "video/wmv" || file.contentType === "video/avi" || file.contentType === "video/flw") {
          // Read output to browser
          const readstream = gfs.createReadStream(file.filename);
          client.set(`video-${req.params.objId}`, JSON.stringify(file))
          
        } else {
          res.status(404).json({
            err: 'Not an Video'
          });
        }
      });
    } else {
      const file = JSON.parse(obj)
      console.log(file)
      res.set('Content-Type', file.contentType)
      const readstream = gfs.createReadStream(file.filename)
      readstream.pipe(res);
    }
  })

  
});

router.post('/getVideoSearchResults', cors(corsOptions), async (req, res) => {
  var searchQuery = req.body.searched.toUpperCase()
  const searchResults = await videoSchema.find(
      { 
        title: {
          $regex: '.*' + searchQuery + '.*' 
        }
      },
      'title description fileName originalName thumbnailFileName _id'
    )

  if (req.body.searched == null) {

    res.status(204).json({ msg: "give me some search" })

  } else {
    
    if (searchQuery != "" || " ") {
        if (searchResults != null) {
            res.status(200).json({ success: true, videos: searchResults })
        } else {
            res.status(404).json({ success: false, msg: 'No videos with the name of rfvg' })
        }
    } else {
      res.status(204).json({ msg: "give me some search" })
    }
}
})


router.get('/get_one_thumbnail/:thumbnailFileName', (req, res) => {
  gfs.files.findOne({ filename: req.params.thumbnailFileName }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpg' || file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === "image/tiff") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
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
