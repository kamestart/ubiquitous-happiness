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
const compresion = require('compression')
const Session = require('../models/session')
const jwt = require('jsonwebtoken')
const user = require('../models/user')

router.use(compresion({ filter: shouldCompress }))


function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compresion.filter(req, res)
}

const verifyJWT = async (req, res, next) => {
  try {
      const token = await req.headers['x-access-token']
      const sid = req.body.sid
      const session = await Session.findOne({ id: sid })
      if (!token) {
          return res.json({ msg: 'pls authenticate'})
      }

      jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
          if(err) {
              console.log(err)
              return res.json({ msg: 'u failed to authenticate :(', auth: false })
          }   
              
          if(session.uid !== decoded.id) {
              req.userId = decoded.id;
              next()
          } else {
              res.json({ msg: "Yo! Why Are You Trying To Send a fake / expired token / session id????" })
          }

      })
  } catch(err) {
      throw err;
  }
}


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

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS
})
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

router.post('/create_video_pt_3', cors(corsOptions), verifyJWT, async (req, res) => {
  try {
    var usera = await user.findOne({ id: req.userId })
    var id = 1

    const newvideo = new videoSchema({
      title: req.body.title.toUpperCase(),
      description: req.body.description,
      fileName: req.body.videoFileName,
      originalName: req.body.title,
      thumbnailFileName: req.body.thumbnailFileName,
      id: id,
      creator: usera.id
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


router.post('/getVideoInfo', cors(corsOptions), async (req, res) => {
    try {
      const video = await videoSchema.findOne({ _id: req.body.objId }, 'likes dislikes title description originalName creator')
      const user3 = await user.findOne({ id: parseInt(video.creator)}, 'username reputation')

      const body =  { video2: video, user2: user3 }
      res.json(body)

    } catch (err) {
      
    }
})

// @route GET /get_one/:filename
// @desc Display Video
router.get('/get_one/:objId',cors(corsOptions), async (req, res) => {

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
          res.set('Content-Type', file.contentType)
          res.set('Content-Encoding', 'gzip')
          res.set('Vary', 'Accept-Encoding')
          const readstream = gfs.createReadStream(file.filename);
          client.set(`video-${req.params.objId}`, JSON.stringify(file))
          readstream.pipe(res)
          
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
