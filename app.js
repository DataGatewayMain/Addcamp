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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



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
    },
    Categories:{
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

// get data by id
app.get('/data/:id',async (req,res)=>{
  try {
    const data = await Data.findById(req.params.id)
    console.log(data,'id');
    return res.json(data)
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
  
// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path; 
  res.send({ filePath });
});

// Data submission endpoint
app.post('/submit', (req, res) => {
  const { summarizedContent,campaignId,campaignName,uniqueId,whitepaperHeading,imagedomain,Categories} = req.body;
  const newData = new Data({ summarizedContent,campaignId,campaignName,uniqueId,whitepaperHeading,filePath,imagedomain,Categories});
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

// update data by id
app.put('/data/:id',async (req,res)=>{
  try {
    const id = req.params.id;
    const newData = req.body; // Updated data
    const updatedData = await Data.findByIdAndUpdate(id, newData, { new: true });
    if (!updatedData) {
        return res.status(404).json({ message: 'Data not found' });
    }
    res.json(updatedData);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


  // get data by campaign name
app.get('/data/campaign/:campaignName', async (req, res) => {
  try {
      const campaignName = req.params.campaignName;
      const data = await Data.find({campaignName: campaignName });
      console.log("The Data Is:",data);
      res.json(data);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// get data by category name
app.get('/data/:Categories',async (req,res)=>{
  try {
    const Categories = req.params.Categories;
    const data = await Data.find({ Categories: Categories });
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

// Start server
const PORT = process.env.PORT || 3000; // Use port from environment variable or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// MongoDB connection
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1); // Exit the process if unable to connect to the database
    }
}

connectToDatabase();




