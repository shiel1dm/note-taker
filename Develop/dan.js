const express = require('express');
const path = require('path');


const app = express();

app.get('/notes', (req,res) =>{
  res.sendFile(path.join(__dirname, '/public/notes.html'))
  
})

app.get('/db/db.json', (req, res) => {

})

app.use(express.static(path.join('public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`))