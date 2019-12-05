const express = require("express")
let db = require("./data/db")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    console.log(req.ip)
    res.json({ message: 'welcome to the api' })
})

app.get("/api/users", (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ error: "Sum Ting Wong Can't Get" })
        })
})

app.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    db.findById(id)
      
    .then(user => {
        if (!user) {
          res.status(404).json({ message: "doesn't exist" });
        } else {
          res.status(200).json(user);
        }
      })

    .catch(err => {
        console.log("error on GET /api/users/:id", err);
        res.status(500).json({ errorMessage: "Can't be found" });
      });
  });
  

app.post("/api/users", (req, res) => {
    const newUser = req.body
    
    if (!req.body.name || !req.body.bio) {
        return res.status(400).json({ error: "need name and bio" })
    }

    db.insert(newUser)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log("error on POST /api/users", err);
      res.status(500).json({
        error: "There was an error while saving the user to the database"
      });
    });
});

app.delete("/api/users/:id", (req, res) => {
    const user = db.find(row => row.id === req.params.id)

    if (user) {
        db = db.filter(row => row.id != req.params.id)
        res.json(user)
    } else {
        res.status(404).json({ error: "user not found" })
    }
})

const port = 8080
const host = "127.0.0.1"

app.listen(port, host, () => {
    console.log(`Server is running at ${host}:${port}`)
})