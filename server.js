const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require("./db/db.json");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) =>
    fs.readFile("./db/db.json", "utf8", (error, notes) => {
        if (error) {
        console.error(error)
        }
    const storedNotes = JSON.parse(notes);
    res.json(storedNotes)
    })
);

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    createNote(newNote)
    res.json(newNote)
});

const createNote = (body) => {
    const newNote = body;
    fs.readFile("./db/db.json", "utf8", (error, storednotes) => {
        if (error) {
            console.error(error)
        } else {
            const storedNotes = JSON.parse(storednotes);

            storedNotes.push(newNote);

            storedNotes.forEach(note => {
                note.id = uuidv4();
            });

            fs.writeFile(
                "./db/db.json", 
                JSON.stringify(storedNotes), (err) => 
                    err ? console.log(err) : console.log("Note has been added"))
        }
    })

    return newNote
}

app.delete('/api/notes/:id', (req, res) => {
    deleteid(req.params.id);

    res.json(db)
})

const deleteid = (id) => {

    fs.readFile("./db/db.json", "utf8", (error, storednotes) => {
        if (error) {
            console.error(error)
        } else {
            const storedNotes = JSON.parse(storednotes);

            for (let i = 0; i<storedNotes.length; i++){
                if (storedNotes[i].id == id){
                    storedNotes.splice(i, 1)
                }
            }

            fs.writeFile(
                "./db/db.json", 
                JSON.stringify(storedNotes), (err) => 
                    err ? console.log(err) : console.log("Note has been deleted"))
        }
    })
}

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);