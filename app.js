const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const model = require('./model');
app.use(bodyParser.urlencoded({ extended: false }));

// Set EJS as the template engine
app.set('view engine', 'ejs');

const mean_values = {
    age: 35.0,
    height: 170.0,
    weight: 70.0,
    bmi: 21
};

const std_values = {
    age: 10.0,
    height: 10.0,
    weight: 15.0,
    bmi: 7
};

// Function to calculate Z-score
function calculateZScore(value, mean, std) {
    return (value - mean) / std;
}

// Function to convert input values to Z-scores
function convertToZScores(inputValues) {
    return {
        age: calculateZScore(inputValues.age, mean_values.age, std_values.age),
        height: calculateZScore(inputValues.height, mean_values.height, std_values.height),
        weight: calculateZScore(inputValues.weight, mean_values.weight, std_values.weight),
        bmi: calculateZScore(inputValues.bmi, mean_values.bmi, std_values.bmi),

    };
}

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like images)
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the EJS file
app.get('/', (req, res) => {
    res.render('form');
});

app.post('/', (req, res) => {

    const { age, height, weight, bmi } = req.body;

    const inputValues = {
        age: parseFloat(age),    // Convert the input to a float
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(bmi)
    };

    const defaultSize = 'S'; // Set the default size to "S"

    const zScoredValues = convertToZScores(inputValues);

    const modelInput = [zScoredValues.weight, zScoredValues.age, zScoredValues.height, zScoredValues.bmi];



    const prediction = model(modelInput);
    console.log(prediction);
    const index = prediction.indexOf(1)+1;
    console.log(index);

// Store the index as the value of the prediction variable
    const predictionValue = index;

    console.log(predictionValue);
    let size;
    switch(predictionValue) {
        case 1:
            size = 'S';
            break;
        case 2:
            size = 'M';
            break;
        case 3:
            size = 'L';
            break;
        case 4:
            size = 'XL';
            break;
        case 5:
            size = 'L';
            break;
        case 6:
            size = 'XL';
            break;
        default:
            size = 'Unknown'; // In case the prediction doesn't match any case
    }
    console.log(size);

    res.render('sizes', { size: size });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
