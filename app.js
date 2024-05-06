const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require("dotenv/config")
const cors = require('cors');

const app = express();

// middleaware
app.use(express.json())
app.use(cors())



// Define schema and model
const dataSchema = new mongoose.Schema({
    summarizedContent:{
        type:String,
    },
    campaignId:{
        type:Number,
    },
    campaignName:{
        type:String,
    },
    uniqueId:{
        type:String,
    },
    whitepaperHeading: {
        type: String,
    },
    filePath:{
        type:String,
    },
    imagedomain:{
        type:String,
    }
});

const Data = mongoose.model('Data', dataSchema);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// by default get
app.get("/", (req,res)=>{
    res.send("Welcome To Web!!")
})

// getdata
app.get('/data', async (req, res) => {
    try {
      const data = await Data.find();
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});
  

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  res.send(req.file);
});



// Data submission endpoint
app.post('/submit', (req, res) => {
  const { summarizedContent,campaignId,campaignName,uniqueId,whitepaperHeading,filePath,imagedomain} = req.body;
  const newData = new Data({ summarizedContent,campaignId,campaignName,uniqueId,whitepaperHeading,filePath,imagedomain});
  newData.save()
    .then(data => res.json(data))
    .catch(err => res.status(400).json({ error: err.message }));
});


// Delete data by ID
app.delete('/data/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const deletedData = await Data.findByIdAndDelete(id);
      if (!deletedData) {
        return res.status(404).json({ message: 'Data not found' });
      }
      res.json({ message: 'Data deleted successfully', deletedData });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// server start
app.listen(process.env.PORT);


// connection
async function main() {
    const res = await mongoose.connect(process.env.DB,{useNewUrlParser: true,
        useUnifiedTopology: true})
        const data = res.default
        console.log(data.STATES['1']);
}
main()