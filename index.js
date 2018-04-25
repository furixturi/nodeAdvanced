const crypto = require('crypto');
const express = require('express');
const app = express();
const Worker = require("webworker-threads").Worker;

app.get('/', (req, res) => {
    const worker = new Worker(function(){
        this.onmessage = function(){
            let counter = 0;
            while (counter < 1e9) {
                counter++;
            }
            postMessage(counter); //trickers the worker.onmessage outside
        }
    });

    worker.onmessage = function(message){
        res.send(message.data + '');
    };

    worker.postMessage(); // triggers the this.onmessage in worker
});

app.get('/fast', (req, res) => {
    res.send('This was fast!');
})
app.listen(3000);

// Use apache benchmark:
// ab -c 4 -n 8 localhost:3000/