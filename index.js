const express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

const keys = require('./config/keys');

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(session({ secret: keys.cookieKey }));



const matrix = new Array(6);
for (i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(7);
}
let activePlayer = 'Yellow';

app.get('/', (req, res) => {
    res.send('START THE GAME BY SENDING REQUEST "/START"');
})


app.get('/START', (req, res) => {
    req.session.activePlayer = 'Yellow';
    for (i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(7);
    }
    res.send('READY');
    return;
})

app.get('/:column', (req, res) => {
    if(isNaN(req.params.column)) {
        res.send('Invalid');
        return;
    }
    const currentPlayer = req.session.activePlayer;
    if (!currentPlayer) {
        res.send('PLEAE START THE GAME BY SENDING REQUEST "/START"');
    } else {
        let col = req.params.column;
        if (col > 6) {
            res.send('Invalid');
            return;
        }
        let row = 5;
        let isInserted = false;
        while (row >= 0) {
            if (!matrix[row][col]) {
                matrix[row][col] = currentPlayer;
                isInserted = true;
                break;
            }
            row--;
        }
        if (!isInserted) {
            res.send('Invalid');
            return;
        } else {
            let result = checkForWinner(matrix, row, col, currentPlayer);
            if (result) {
                res.send(currentPlayer + ' wins');
                return;
            }
        }

        req.session.activePlayer = currentPlayer == 'Yellow' ? 'Red' : 'Yellow';

        res.send('Valid');
    }
})

function checkForWinner(mat, r, c, player) {
    return checkRowMatch(mat, r, c, player)
        || checkColMatch(mat, r, c, player)
        || checkDiagonalLTR(mat, r, c, player)
        || checkDiagonalRTL(mat, r, c, player)
}

function checkRowMatch(mat, r, c, player) {
    let left = c;
    let count = 0;
    while (left >= 0) {
        if (mat[r][left] == player) {
            count++;
        } else {
            break;
        }
        left--;
    }
    left = c+1;
    while (left <= 6) {
        if (mat[r][left] == player) {
            count++;
        } else {
            break;
        }
        left++;
    }
    return count >= 4;
}
function checkColMatch(mat, r, c, player) {
    let up = r;
    let count = 0;
    while (up >= 0) {
        if (mat[up][c] == player) {
            count++;
        } else {
            break;
        }
        up--;
    }
    up = r + 1;
    while (up <= 5) {
        if (mat[up][c] == player) {
            count++;
        } else {
            break;
        }
        up++;
    }
    return count >= 4;
}
function checkDiagonalLTR(mat, r, c, player) {
    let up = r;
    let left = c;
    let count = 0;
    while (up >= 0 && left >= 0) {
        if (mat[up][c] == player) {
            count++;
        } else {
            break;
        }
        up--;
        left--;
    }
    up = r + 1;
    left = c + 1;
    while (up <= 5 && left <= 6) {
        if (mat[up][c] == player) {
            count++;
        } else {
            break;
        }
        up++;
        left++;
    }
    return count >= 4;
}

function checkDiagonalRTL(mat, r, c, player) {
    let up = r;
    let left = c;
    let count = 0;
    while (up >= 0 && left <= 6) {
        if (mat[up][c] == player) {
            count++;
        } else {
            break;
        }
        up--;
        left++;
    }
    up = r + 1;
    left = c - 1;
    while (up <= 5 && left >= 0) {
        if (mat[up][c] == player) {
            count++;
        } else {
            break;
        }
        up++;
        left--;
    }
    return count >= 4;
}



app.listen(port, () => {
    console.log(`app listening at:${port}`)
})