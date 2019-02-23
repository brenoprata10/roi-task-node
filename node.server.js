const express = require('express');
const app = express();
const axios = require('axios');

var API_URL = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

var authentitation = {
    access_token: 'AAAAAAAAAAAAAAAAAAAAAHEV9gAAAAAAoZuO8qlPYsCl%2FB%2B8uXM8e4gCrWQ%3DE4Cp2s9aROPXELP3Obz77yx0WIFxGZrVJhbidhiowWhiQNGWic'
};

app.listen(process.env.PORT || 5000, function () {
    console.log('Started!')
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/tweets', function (req, res) {

    console.log(`Starting request for search tweets...`);

    filterTweets(req.query)
        .then(resolve => {

            res.send(resolve);
        })
        .catch(reject => {

            console.log(errorMessage(reject));
            res.status(reject.status).send(errorMessage(reject));
        });

});

function filterTweets(filterSearch) {

    return new Promise((resolve, reject) => {

        axios({
            method: 'GET',
            url: urlWithFilter(filterSearch),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authentitation.access_token}`
            }
        }).then(function (response) {

            resolve(response.data);
        })
            .catch(function (error) {

               reject(error.response);
            });
    });
}

function urlWithFilter(filterSearch) {

    let url = `${API_URL}`;

    Object.keys(filterSearch).forEach((key, index) => {

        if (index === 0) {

            url = url.concat(`?${key}=${filterSearch[key]}`);
        } else {

            url = url.concat(`&${key}=${filterSearch[key]}`);
        }
    });

    return url;
}

function errorMessage(error) {

    switch(error.status) {

        case 404:
            return {errorMessage: 'Twitter account not found!'};
        case 500:
            return {errorMessage: 'Error when !'};
    }
}