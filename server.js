const express = require('express');
const path = require('path');

app = express()



app.use(express.static(path.join('public')));
app.use('/', require('./routes/router.js'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
