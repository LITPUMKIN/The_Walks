let express = require("express");
let app = express();
app.use(express.json({ limit: '10mb' }));

let port = process.env.PORT || 1000;
app.listen(port, () => {
    console.log("Server listening at port: " + port);
});

const { db_text, db_image } = require('./mongoDB');

app.use("/", express.static("public"));

// Handle POST request to save text data
app.post('/06_text', (req, res) => {
    console.log(req.body);
    let currentDate = new Date().toString();
    let obj = {
        date: currentDate,
        text: req.body.alteredText
    };
    
    db_text.push("OpenAIText", obj)
        .then(() => res.json({ task: 'success' }))
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Handle GET request to retrieve text data
app.get('/06_read', (req, res) => {
    db_text.get("OpenAIText")
        .then((OpenAIText) => {
            let text = { data: OpenAIText };
            res.json(text);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Handle POST request to save image data
app.post('/16_image', (req, res) => {
    const { dataURL, latitude, longitude } = req.body;

    // Calculate the size of the dataURL
    const base64StringLength = dataURL.length;
    const buffer = Buffer.from(dataURL.split(",")[1], 'base64');
    const fileSizeInBytes = buffer.byteLength;

    // Check if the file size is greater than 10MB
    if (fileSizeInBytes > 10 * 1024 * 1024) { // 10MB in bytes
        return res.status(400).json({ error: 'File size exceeds 10MB limit.' });
    }

    let obj = { dataURL, latitude, longitude };

    db_image.push("GeoPictures", obj)
        .then(() => res.status(200).send('Picture saved successfully.'))
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Handle GET request to retrieve image data
app.get('/16_show', (req, res) => {
    db_image.get("GeoPictures")
        .then((GeoPictures) => res.json(GeoPictures))
        .catch((error) => res.status(500).json({ error: error.message }));
});
