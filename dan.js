const express = require('express');
const path = require('path');
const uuid = require('./bonus/uuid');
const fs = require('fs');
const util = require('util')
//

//Test code

//Copied from intstructor modular routing file, explainations to show understanding in notes.
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

const readAndAppend = (content, file) => {
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
 * readAndAppend takes in parameters of content and file, the content I'm passing in to my db file.
 * if there is no error, it creates an object, makes that object readable, and then pushes that content into the
 * writeToFile function, which again writes everything to the db file.
 */


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req,res) =>{
  res.sendFile(path.join(__dirname, '/public/notes.html'))
  
});

app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))

});



app.post('/api/notes',(req, res) => {
  
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
    readAndAppend(newNote, './db/db.json');
    res.json(response);

  } else{
    res.json('Error posting')
  }
})

app.use(express.static(path.join('public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
