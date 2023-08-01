// X - black, O - white

const prompt = require("prompt-sync")();

const signMap = {'X' : 'O', 'O' : 'X'};

class Board {
    constructor() {
        this.board = Array(8);
        for (let i = 0; i < 8; i++) {
            this.board[i] = Array(8).fill('.');
        }
        this.board[3][3] = 'X';
        this.board[4][4] = 'X';
        this.board[3][4] = 'O';
        this.board[4][3] = 'O';
    }

    printBoard() {
        let string = '';
        for (let i = 0; i < 8; i++) {
            string += '    ' + (i + 1);
        }
        console.log(string);
        console.log('    ' + '_    '.repeat(8));
        for (let i = 0; i < 8; i++) {
            string = ''
            string += (i + 1) + ' |';
            for (let j = 0; j < 8; j++) {
                string += ' ' + this.board[i][j] + '   ';
            }
            console.log(string + '\n');
        }
    }
}

class HumanPlayer {
    constructor(name, sign) {
        this.name = name;
        this.sign = sign;
    }

    getSign() {
        return this.sign;
    }

    getNameOfPlayer() {
        return this.name;
    }

    checkCell(i, j, board) {
        let counter = 0;
        let i1 = i - 1, j1 = j;
        while (i1 > 0 && board.board[i1][j1] === signMap[this.sign]) {
            counter++;
            i1--;
        }
        if (counter > 0 && board.board[i1][j1] === '.') {
            return true;
        }
        counter = 0;
        i1 = i + 1, j1 = j;
        while (i1 < 7 && board.board[i1][j1] === signMap[this.sign]) {
            counter++;
            i1++;
        }
        if (counter > 0 && board.board[i1][j1] === '.') {
            return true;
        }
        counter = 0;
        i1 = i, j1 = j + 1;
        while (j1 < 7 && board.board[i1][j1] === signMap[this.sign]) {
            counter++;
            j1++;
        }
        if (counter > 0 && board.board[i1][j1] === '.') {
            return true;
        }
        counter = 0;
        i1 = i, j1 = j - 1;
        while (j1 > 0 && board.board[i1][j1] === signMap[this.sign]) {
            counter++;
            j1--;
        }
        if (counter > 0 && board.board[i1][j1] === '.') {
            return true;
        }
        counter = 0;
        i1 = i + 1, j1 = j + 1;
        while (i1 < 7 && j1 < 7 && board.board[i1][j1] === signMap[this.sign]) {
            counter++;
            i1++;
            j1++;
        }
        if (counter > 0 && board.board[i1][j1] === '.') {
            return true;
        }
        counter = 0;
        i1 = i - 1, j1 = j - 1;
        while (i1 > 0 && j1 > 0 && board.board[i1][j1] === signMap[this.sign]) {
            counter++;
            i1--;
            j1--;
        }
        if (counter > 0 && board.board[i1][j1] === '.') {
            return true;
        }
        counter = 0;
        i1 = i + 1, j1 = j - 1;
        while (i1 < 7 && j1 > 0 && board.board[i1][j1] === signMap[this.sign]) {
            counter++;
            i1++;
            j1--;
        }
        if (counter > 0 && board.board[i1][j1] === '.') {
            return true;
        }
        counter = 0;
        i1 = i - 1, j1 = j + 1;
        while (i1 > 0 && j1 < 7 && board.board[i1][j1] === signMap[this.sign]) {
            counter++;
            i1--;
            j1++;
        }
        if (counter > 0 && board.board[i1][j1] === '.') {
            return true;
        }
        return false;
    }

    canMakeMove(board) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board.board[i][j] === this.sign) {
                    if (this.checkCell(i, j, board)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    makeMove(board) {
        let signum = this.sign;

        const isValidMove = function(x1, y1, x2, y2) {
            if (x1 === x2) {
                if (y1 < y2) {
                    for (let i = y1 + 1; i < y2; i++) {
                        if (board.board[i][x1] !== signMap[signum]) {
                            return false;
                        }
                    }
                } else {
                    for (let i = y1 - 1; i > y2; i--) {
                        if (board.board[i][x1] !== signMap[signum]) {
                            return false;
                        }
                    }
                }
            } else if (y1 === y2) {
                if (x1 < x2) {
                    for (let i = x1 + 1; i < x2; i++) {
                        if (board.board[y1][i] !== signMap[signum]) {
                            return false;
                        }
                    }
                } else {
                    for (let i = x1 - 1; i > x2; i--) {
                        if (board.board[y1][i] !== signMap[signum]) {
                            return false;
                        }
                    }
                }
            } else {
                if (x1 < x2 && y1 < y2) {
                    for (let i = y1 + 1, j = x1 + 1; i < y2, j < x2; i++, j++) {
                        if (board.board[i][j] !== signMap[signum]) {
                            return false;
                        }
                    }
                } else if (x1 > x2 && y1 < y2) {
                    for (let i = y1 + 1, j = x1 - 1; i < y2, j > x2; i++, j--) {
                        if (board.board[i][j] !== signMap[signum]) {
                            return false;
                        }
                    }
                } else if (x1 < x2 && y1 > y2) {
                    for (let i = y1 - 1, j = x1 + 1; i > y2, j < x2; i--, j++) {
                        if (board.board[i][j] !== signMap[signum]) {
                            return false;
                        }
                    }
                }  else if (x1 > x2 && y1 > y2) {
                    for (let i = y1 - 1, j = x1 - 1; i > y2, j > x2; i--, j--) {
                        if (board.board[i][j] !== signMap[signum]) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        let signal = true;

        while (signal) {
            let input = prompt('Input move: ').match(/\d+/g);
            let x1 = Number(input[0]) - 1;
            let y1 = Number(input[1]) - 1;
            let x2 = Number(input[2]) - 1;
            let y2 = Number(input[3]) - 1;
            if (((y1 !== y2 && Math.abs(y1 - y2) === Math.abs(x1 - x2)) ||
                    (y1 === y2 && x1 !== x2) || (x1 === x2 && y1 !== y2)) &&
                x1 <= 7 && x1 >= 0 && y1 <= 7 && y1 >= 0 && x2 <= 7 && x2 >= 0 && y2 <= 7 && y2 >= 0 &&
                isValidMove(x1, y1, x2, y2) && board.board[y1][x1] === this.sign &&
                board.board[y2][x2] === '.') {
                signal = false;
                if (x1 === x2) {
                    if (y1 < y2) {
                        for (let i = y1 + 1; i <= y1; i++) {
                            board.board[i][x1] = this.sign;
                        }
                    } else {
                        for (let i = y1 - 1; i >= y2; i--) {
                            board.board[i][x1] = this.sign;
                        }
                    }
                } else if (y1 === y2) {
                    if (x1 < x2) {
                        for (let i = x1 + 1; i <= x2; i++) {
                            board.board[y1][i] = this.sign;
                        }
                    } else {
                        for (let i = x1 - 1; i >= x2; i--) {
                            board.board[y1][i] = this.sign;
                        }
                    }
                } else {
                    if (x1 < x2 && y1 < y2) {
                        for (let i = y1 + 1, j = x1 + 1; i <= y2, j <= x2; i++, j++) {
                            board.board[i][j] = this.sign;
                        }
                    } else if (x1 > x2 && y1 < y2) {
                        for (let i = y1 + 1, j = x1 - 1; i <= y2, j >= x2; i++, j--) {
                            board.board[i][j] = this.sign;
                        }
                    } else if (x1 < x2 && y1 > y2) {
                        for (let i = y1 - 1, j = x1 + 1; i >= y2, j <= x2; i--, j++) {
                            board.board[i][j] = this.sign;
                        }
                    }  else if (x1 > x2 && y1 > y2) {
                        for (let i = y1 - 1, j = x1 - 1; i >= y2, j >= x2; i--, j--) {
                            board.board[i][j] = this.sign;
                        }
                    }
                }
            } else {
                console.log("Incorrect move. Try again.")
            }
        }
    }
}

class GameSever {
    constructor(board, players) {
        this.board = board;
        this.board.printBoard();
        this.players = players;
        this.whoseTurn = 0;
        this.endFactor = 0;
    }

    play() {
        if (this.players[this.whoseTurn].canMakeMove(this.board)) {
            console.log(`Player ${this.players[this.whoseTurn].name} is moving.`);
            this.players[this.whoseTurn].makeMove(this.board);
            this.board.printBoard();
            this.endFactor = 0;
            this.whoseTurn = (this.whoseTurn + 1) % this.players.length;
            this.play();
        } else if (this.endFactor === 0) {
            this.endFactor++;
            console.log(`Player ${this.players[this.whoseTurn].name} can't make move.`)
            this.whoseTurn = (this.whoseTurn + 1) % this.players.length;
            this.play();
        }
        let countX = 0;
        let countO = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board.board[i][j] === 'X') {
                    countX++;
                } else if (this.board.board[i][j] === 'O') {
                    countO++;
                }
            }
        }
        if (countX === countO) {
            console.log("No one has won.")
        } else if (countX > countO) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].getSign() === 'X') {
                    console.log(`Player ${this.players[i].getNameOfPlayer()} has won.`);
                }
            }
        } else {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].getSign() === 'O') {
                    console.log(`Player ${this.players[i].getNameOfPlayer()} has won.`);
                }
            }
        }
    }
}

const player1 = new HumanPlayer("Peter", "X")
const player2 = new HumanPlayer("Michael", "O")
const board = new Board()
const place = new GameSever(board, [player1, player2])
place.play()
