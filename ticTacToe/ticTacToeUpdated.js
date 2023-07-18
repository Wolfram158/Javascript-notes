const prompt = require("prompt-sync")();

const signMap = {'X' : 'O', 'O' : 'X'}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class BoardConfiguration {
    constructor(x, y) {
        this.board = Array(Number(y));
        for (let i = 0; i < y; i++) {
            this.board[i] = Array(Number(x)).fill('.');
        }
        this.lastMove = 0;
        this.x = x;
        this.y = y;
    }

    printBoard() {
        let string = '';
        for (let i = 0; i < this.x; i++) {
            string += '    ' + (i + 1);
        }
        console.log(string);
        console.log('    ' + '_    '.repeat(this.x));
        for (let i = 0; i < this.y; i++) {
            string = ''
            string += (i + 1) + ' |';
            for (let j = 0; j < this.x; j++) {
                string += ' ' + this.board[i][j] + '   ';
            }
            console.log(string + '\n');
        }
    }

    getConfigurationType() {
        let emptyCount = 0;
        for (let i = 0; i < this.y; i++) {
            let counter = 1;
            for (let j = 1; j < this.x; j++) {
                if (this.board[i][j] === this.board[i][j - 1] && this.board[i][j] !== '.') {
                    counter++;
                    if (counter === 5) {
                        return this.board[i][j];
                    }
                } else {
                    counter = 1;
                }
                if (this.board[i][j] === '.') {
                    emptyCount++;
                }
            }
        }
        for (let j = 0; j < this.x; j++) {
            let counter = 1;
            for (let i = 1; i < this.y; i++) {
                if (this.board[i][j] === this.board[i - 1][j]  && this.board[i][j] !== '.') {
                    counter++;
                    if (counter === 5) {
                        return this.board[i][j];
                    }
                } else {
                    counter = 1;
                }
                if (this.board[i][j] === '.') {
                    emptyCount++;
                }
            }
        }
        for (let i = 0; i <= this.y - 5; i++) {
            for (let j = 0; j <= this.x - 5; j++) {
                let counter = 1;
                let limit = (this.x - j < this.y - i) ? this.x - j : this.y - i;
                for (let k = 1; k < limit; k++) {
                    if (this.board[i + k][j + k] === this.board[i + k - 1][j + k - 1] &&
                        this.board[i + k][j + k] !== '.') {
                        counter++;
                        if (counter === 5) {
                            return this.board[i + k][j + k];
                        }
                    } else {
                        counter = 1;
                    }
                }
            }
        }
        return emptyCount === 0 ? -1 : 0;
    }
}

class HumanPlayer {
    constructor(string, signOfMove) {
        let inputMoves = string.length !== 0 ? string.match(/\d+/g) : [];
        let moves = [];
        for (let i = 0; i < inputMoves.length; i += 2) {
            moves.push([inputMoves[i], inputMoves[i + 1]]);
        }
        this.moves = moves;
        this.position = 0;
        this.signOfMove = signOfMove;
    }

    makeMove(board) {
        if (this.position < this.moves.length &&
            board.board[this.moves[this.position][1] - 1][this.moves[this.position][0] - 1] === '.') {
            board.board[this.moves[this.position][1] - 1][this.moves[this.position][0] - 1] = this.signOfMove;
            board.lastMove = [this.moves[this.position][0] - 1, this.moves[this.position][1] - 1];
            this.position++;
        } else if (this.position < this.moves.length) {
            console.log('Chosen cell is not empty')
            this.position++;
            this.makeMove(board);
        } else {
            let input = prompt('Input move: ').match(/\d+/g);
            this.moves.push([input[0], input[1]]);
            this.makeMove(board);
        }
    }
}

class ComputerPlayer {
    constructor(signOfMove) {
        this.signOfMove = signOfMove;
    }

    makeMove(board) {
        let x, y;
        if (board.lastMove === 0) {
            x = getRandomInt(0, board.x - 1);
            y = getRandomInt(0, board.y - 1);
        } else {
            let lastX = board.lastMove[0];
            let lastY = board.lastMove[1];

            let signOfMove = this.signOfMove;
            let isDangerous = function(signOfMove) {
                for (let i = 0; i < board.y; i++) {
                    let counter = 1;
                    for (let j = 1; j < board.x; j++) {
                        if (board.board[i][j - 1] === signMap[signOfMove] &&
                            board.board[i][j] === board.board[i][j - 1] &&
                            board.board[i][j] !== '.') {
                            counter++;
                            if (j + 1 < board.x && board.board[i][j + 1] === '.' && counter === 4) {
                                return [true, 1, j + 1, i];
                            }
                        } else {
                            counter = 1;
                        }
                    }
                }
                for (let j = 0; j < board.x; j++) {
                    let counter = 1;
                    for (let i = 1; i < board.y; i++) {
                        if (board.board[i - 1][j] === signMap[signOfMove] &&
                            board.board[i][j] === board.board[i - 1][j] &&
                            board.board[i][j] !== '.') {
                            counter++;
                            if (i + 1 < board.y && board.board[i + 1][j] === '.' && counter === 4) {
                                return [true, 2, j, i + 1];
                            }
                        } else {
                            counter = 1;
                        }
                    }
                }
                for (let i = 0; i <= board.y - 5; i++) {
                    for (let j = 0; j <= board.x - 5; j++) {
                        let counter = 1;
                        let limit = (board.x - j < board.y - i) ? board.x - j : board.y - i;
                        for (let k = 1; k < limit; k++) {
                            if (board.board[i + k - 1][j + k - 1] === signMap[signOfMove] &&
                                board.board[i + k][j + k] === board.board[i + k - 1][j + k - 1] &&
                                board.board[i + k][j + k] !== '.') {
                                counter++;
                                if (i + k + 1 < board.y && j + k + 1 < board.x && board.board[i + k + 1][j + k + 1] === '.' && counter === 4) {
                                    return [true, 3, j + k + 1, i + k + 1];
                                }
                            } else {
                                counter = 1;
                            }
                        }
                    }
                }
                return [false];
            }

            let called = isDangerous(signOfMove);

            if (called[0]) {
                x = called[2];
                y = called[3];
            } else {
                let case1 = function () {
                    if (board.board[lastY][lastX + 1] === '.') {
                        return [true, lastX + 1, lastY];
                    }
                    return [false];
                }

                let case2 = function () {
                    if (board.board[lastY][lastX - 1] === '.') {
                        return [true, lastX - 1, lastY];
                    }
                    return [false];
                }

                let case3 = function () {
                    if (lastY > 0 && board.board[lastY - 1][lastX - 1] === '.') {
                        return [true, lastX - 1, lastY - 1];
                    }
                    return [false];
                }

                let case4 = function () {
                    if (lastY + 1 < board.y && board.board[lastY + 1][lastX - 1] === '.') {
                        return [true, lastX - 1, lastY + 1];
                    }
                    return [false];
                }

                let case5 = function () {
                    if (lastY > 0 && board.board[lastY - 1][lastX + 1] === '.') {
                        return [true, lastX + 1, lastY - 1];
                    }
                    return [false];
                }

                let case6 = function () {
                    if (lastY + 1 < board.y && board.board[lastY + 1][lastX] === '.') {
                        return [true, lastX, lastY + 1];
                    }
                    return [false];
                }

                let case7 = function () {
                    if (lastY + 1 < board.y && board.board[lastY + 1][lastX - 1] === '.') {
                        return [true, lastX - 1, lastY + 1];
                    }
                    return [false];
                }

                let case8 = function () {
                    if (lastY > 0 && board.board[lastY - 1][lastX] === '.') {
                        return [true, lastX, lastY - 1];
                    }
                    return [false];
                }

                let cases = [case1(), case2(), case3(), case4(), case5(), case6(), case7(), case8()];
                shuffle(cases);

                let signal2 = true;
                for (let f of cases) {
                    if (f[0]) {
                        x = f[1];
                        y = f[2];
                        signal2 = false;
                        break;
                    }
                }

                if (signal2) {
                    while (true) {
                        x = getRandomInt(0, board.x - 1);
                        y = getRandomInt(0, board.y - 1);
                        if (board.board[y][x] === '.') {
                            break;
                        }
                    }
                }
            }
        }
        board.board[y][x] = this.signOfMove;
        board.lastMove = [x, y];
    }
}

class GameServer {
    constructor(typeOfGame) {
        this.board = new BoardConfiguration(...prompt('Input size of board (x and y respectively): ').match(/\d+/g));
        switch (typeOfGame) {
            case 1:
                this.player1 = new HumanPlayer(prompt('Player 1 is inserting desired moves: '), 'X');
                this.player2 = new HumanPlayer(prompt('Player 2 is inserting desired moves: '), 'O');
                break;
            case 2:
                this.player1 = new HumanPlayer(prompt('Player 1 is inserting desired moves: '), 'X');
                console.log('Player 2 is a ComputerPlayer');
                this.player2 = new ComputerPlayer('O');
                break;
            case 3:
                console.log('Player 1 is a ComputerPlayer');
                this.player1 = new ComputerPlayer('X');
                this.player2 = new HumanPlayer(prompt('Player 2 is inserting desired moves: '), 'O');
                break;
            case 4:
                console.log('Player 1 is a ComputerPlayer');
                this.player1 = new ComputerPlayer('X');
                console.log('Player 2 is a ComputerPlayer');
                this.player2 = new ComputerPlayer('O');
        }
    }

    play() {
        let configuration;
        let player = 1;
        let choose = [undefined, this.player1, this.player2];
        while (true) {
            choose[player].makeMove(this.board);
            console.log(('Move of player {}: (' + (this.board.lastMove[0] + 1) +
                ', ' + (this.board.lastMove[1] + 1) +')').replace('{}', String(player)));
            console.log('Board after move of player {}:'.replace('{}', String(player)))
            this.board.printBoard();
            configuration = this.board.getConfigurationType();
            if (configuration === -1) {
                console.log('None of the players won');
                return 0;
            } else if (configuration === choose[player].signOfMove) {
                console.log('Player {} has won'.replace('{}', String(player)));
                return player;
            }
            player = 1 + player % 2;
        }
    }
}

class Tournament {
    constructor(countOfGames, typeOfGame) {
        this.countOfGames = countOfGames;
        this.typeOfGame = typeOfGame;
        this.statistics = [0, 0, 0];
    }
    
    start() {
        for (let i = 0; i < this.countOfGames; i++) {
            let server = new GameServer(this.typeOfGame);
            this.statistics[server.play()]++;
        }
        console.log('\nTotal number of games: ' + this.countOfGames);
        console.log('Number of games weren\'t won by somebody: ' + this.statistics[0]);
        console.log('Number of games won by player 1: ' + this.statistics[1]);
        console.log('Number of games won by player 2: ' + this.statistics[2]);
    }
}

const tournament = new Tournament(10, 4);
tournament.start()
