const express = require('express');
const router = express.Router()
const uuid = require('./uuid');
const path = require('path')
const db = require('../db/db.json');
const fs = require('fs');
const util = require('util')


//Copied from intstructor modular routing file, explainations to show understanding in comments.
const readFromFile = util.promisify(fs.readFile);
// using util framework to promise a file to read (ex. fs.readFile)

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
/**
 * writeToFile passes in two variables, the fs destination and the content being added to the file.
 * It then stringify's the content passed in, with a null replacer, and a '4' space, or white space
 * added for readablity.
 * I'll be honest, I have no idea what the ? is for, but an answer in my grade would be helpful! 
 */

const readAndappend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

/**
 * readAndappend takes in parameters of content and file, the content I'm passing in to my db file.
 * if there is no error, it creates an object, makes that object readable, and then pushes that content into the
 * writeToFile function, which again writes everything to the db file.
 */




router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/notes', (req,res) =>{
  res.sendFile(path.join(__dirname, '../public/notes.html'))
  
});

router.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))

});



router.post('/api/notes',(req, res) => {

  const { title, text } = req.body;

  if(req.body){
    const newNote = {
      title,
      text,
      id: uuid(),
    }
    const response = {
      status: 'test success',
      body: newNote,
    }
    readAndappend(newNote, './db/db.json');
    res.json(response);

  } else{
    res.json('Error posting')
  }
})

router.delete('/api/notes/:id', (req, res) => {
  const i = db.findIndex(notes => notes.id === req.params.id)
  console.log(i)
  //console.log(notes)
  db.splice(i, 1)
  console.log(db)

  res.send(`successfully deleted note id: ${req.params.id}`)
  fs.writeFile('./db/db.json', JSON.stringify(db, null, 4), (err) => {
    if (err) throw err;

    console.log('deleted.')

  })
});


module.exports = router
