let input = document.getElementById('user_input');
let submitbtn = document.getElementById('submit_btn');
let example = document.getElementById('example');

//p5.js preload section
function preload() {
    exampleSound = loadSound('./sound/baby_section.WAV');
}

function setup() {
    noCanvas();
    example.addEventListener('click', function () {
        if (exampleSound.isLoaded()) {
            exampleSound.play();
        } else {
            console.log("Sound not loaded yet");
        }
    });
}


// let startText = document.getElementById('start_text');
// let alteredText = document.getElementById('end_text');
let alteredAIText = '';
let ttsAIText = '';
let AIText = [];
let OpenAIText = [];
let originalText = "Do you really find wandering in the supermarket stress-relieving? What is your favorite section in the supermarket? For me, it’s the frozen food section.";

API_KEY = "";

submitbtn.addEventListener('click', function () {
    alterTextBasedOnKeywords();
    input.value = '';
});

function alterTextBasedOnKeywords() {
    const inputValue = input.value;
    console.log("myInput", inputValue);

    if (!inputValue || inputValue.length <= 0) {
        return;
    }

    const url = "https://api.openai.com/v1/chat/completions";

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
    };

    //Extract keywords from input text
    const extractKeywordsOptions = Object.assign({}, options, {
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You will be provided with a block of text, and your task is to extract a list of keywords from it."
                },
                {
                    role: "user",
                    content: inputValue
                }
            ],
            temperature: 0.7,
            max_tokens: 200,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        })
    });

    fetch(url, extractKeywordsOptions)
        .then((response) => response.json())
        .then((keywordData) => {
            console.log("keywordResponse", keywordData);

            if (keywordData.choices && keywordData.choices[0]) {
                const keywords = keywordData.choices[0].message.content;

                //Extract keywords
                const alterTextOptions = Object.assign({}, options, {
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: "You will be provided with a block of text and a list of keywords. Your task is to alter the text based on the provided keywords, focusing only on changing the first-person sentences completely in the block of text to incorporate the keywords."
                            },
                            {
                                role: "user",
                                content: `Original Text: ${originalText}\nKeywords: ${keywords}`
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 200,
                        top_p: 1.0,
                        frequency_penalty: 0.0,
                        presence_penalty: 0.0,
                    })
                });

                return fetch(url, alterTextOptions);
            } else {
                throw new Error("Failed to extract keywords");
            }
        })
        .then((alterTextResponse) => alterTextResponse.json())
        .then((alterTextData) => {
            console.log("alterTextResponse", alterTextData);

            if (alterTextData.choices && alterTextData.choices[0]) {
                alteredAIText = "thank you for your submittion!"
                // alteredAIText += `<br/>Original Text: ${originalText}<br/>Altered Text: ${alterTextData.choices[0].message.content}`;
                ttsAIText = alterTextData.choices[0].message.content;
                AIText.push(ttsAIText);
                // alteredText.innerHTML = alteredAIText;
                console.log(ttsAIText);
                console.log(AIText);
                console.log(AIText.length);

                // Send the altered text to the server
                let data = { 'alteredText': ttsAIText };
                let jsonData = JSON.stringify(data);

                fetch('/06_text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: jsonData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                throw new Error("Failed to alter text based on keywords");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// AI_TTS
document.getElementById('select_tts').addEventListener('click', function () {
    fetch('/06_read')
        .then(response => response.json())
        .then(data => {
            OpenAIText = data.data;
            console.log(OpenAIText);
        })
        .catch(error => console.error('Error fetching OpenAIText:', error));
});

document.getElementById('tts_btn').addEventListener('click', function () {
    const randomText = selectRandomText();
    convertTextToSpeech(randomText);
});

function convertTextToSpeech(text) {
    const ttsOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "tts-1",
            input: text,
            voice: "nova"
        })
    };

    fetch("https://api.openai.com/v1/audio/speech", ttsOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob(); // Handle binary data
        })
        .then(blob => {
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function selectRandomText() {
    if (OpenAIText.length >= 0) {
        const randomIndex = Math.floor(Math.random() * AIText.length);
        return OpenAIText[randomIndex].text;
    }
    else {
        return null;
    }
}