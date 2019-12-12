//-1: gray with force -1  
//0: blank with force 0
//1: green with force 1
//2: blue with force 2
//3: pink with force 3
let blockCollision = new Audio('collision.mp3');
let audioBool = true;
let username = localStorage.getItem("username") || 'anonymous';
let level = parseInt(localStorage.getItem("levelID")) || 1;
let highScore = localStorage.getItem("highscore") || 0;
let row = 5 * (level || 1);
let col = 4 * (level || 1);
let closeBottom = false;
let data;
let num;
let tab = new Array(col);
let movingBlockHeight = 20;
let movingBlockWidth = 180;
let topBallBounce = 50;
let bottomBallBounce = topBallBounce - movingBlockHeight;
let wonOrLostBoolean = false;
let wonBoolean = false;
let lostBoolean = false;
let bonus = 1;
let loopRandom = true;
let random = 0;
let topY; // block top verge Y
let bottomY; // next block bottom verge Y
let leftX; // block left verge X
let rightX; // next block right verge X
let score = 0;
let speed = 5 + 0.8 * (level - 1);
let spaces = 3; //spaces between blocks
let play;
let interval;
let ballX, ballY;
let stepX, stepY;
let posX, posY;
let blockWidth = window.innerWidth / col;
let blockHeight = window.innerHeight / 30;
let level1 = [-1, 0, 0, 1, 1, 1, 2, 2, 2, 3];
let level2 = [-1, -1, 0, 1, 1, 2, 2, 2, 3, 3];
let level3 = [-1, -1, 0, 1, 2, 2, 2, 3, 3, 3];

function newArray() {
    for (let i = 0; i < row; i++) {
        tab[i] = new Array(col);
        for (let k = 0; k < col; k++) {
            tab[i][k] = randProbability();
        }
    }
}

function randProbability() {
    let numbers = new Array(10);
    switch (level) {
        case 1:
            numbers = level1.slice();
            break;
        case 2:
            numbers = level2.slice();
            break;
        case 3:
            numbers = level3.slice();
            break;
    }
    let idx = Math.floor(Math.random() * numbers.length);
    return numbers[idx];
}

newArray();

function draw() {
    let canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        let c = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        c.clearRect(0, 0, window.innerWidth, window.innerHeight);
        c.strokeStyle = "rgb(10, 10, 10)";
        c.fillStyle = "rgba(10, 10, 10, .8)";
        roundRect(c, posX - (movingBlockWidth / 2), window.innerHeight - 50, movingBlockWidth, movingBlockHeight, 10, true);

        for (let y = 0; y < row; y++) {
            for (let x = 0; x < col; x++) {
                switch (tab[y][x]) {
                    case -1:
                        c.fillStyle = "rgb(122,122,122)";
                        break;
                    case 1:
                        c.fillStyle = "rgb(102, 197, 45)";
                        break;
                    case 2:
                        c.fillStyle = "rgb(102, 148, 207)";
                        break;
                    case 3:
                        c.fillStyle = "rgb(223, 51, 67)";
                        break;
                }
                if (tab[y][x] != 0) {
                    c.fillRect(x * blockWidth, y * blockHeight, blockWidth - spaces, blockHeight - spaces);
                }
                c.beginPath();
                c.arc(ballX, ballY, 10, 0, 2 * Math.PI);
                c.fillStyle = "#000000";
                c.fill();

                topY = y * blockHeight;
                bottomY = (y + 1) * blockHeight;
                leftX = x * blockWidth;
                rightX = (x + 1) * blockWidth;

                if (ballY <= bottomY && ballY > topY + 5 && ballX < rightX && ballX > leftX || ballY >= topY && ballY < bottomY - 5 && ballX < rightX && ballX > leftX) {
                    if (tab[y][x] != 0) {
                        stepY = -stepY;
                        // if (audioBool == true) blockCollision.play();
                        if (tab[y][x] != -1) {
                            tab[y][x] = tab[y][x] - 1;
                            score += (10 * bonus);
                            document.getElementById("score-p").innerHTML = score;
                            if (highScore > score) {
                                document.getElementById("highscore-p").innerHTML = "To high score: " + (highScore - score);
                            } else {
                                document.getElementById("highscore-p").innerHTML = "To high score: 0";
                            }
                        }
                    }
                }

                if (ballY < bottomY && ballY > topY && (ballX >= leftX && ballX < leftX + 5 || ballX > rightX - 5 && ballX <= rightX)) {
                    if (tab[y][x] != 0) {
                        stepX = -stepX;
                        // if (audioBool == true) blockCollision.play();
                        if (tab[y][x] != -1) {
                            tab[y][x] = tab[y][x] - 1;
                            score += (10 * bonus);
                            if (highScore > score) {
                                document.getElementById("highscore-p").innerHTML = "To high score: " + (highScore - score);
                            } else {
                                document.getElementById("highscore-p").innerHTML = "To high score: 0";
                            }
                        }
                    }
                }
            }
        }


        if (checkArray(tab) == true) {
            wonOrLostBoolean = true;
            loopRandom = false;
            wonBoolean = true;
            if (level != 3) {
                document.getElementById('pu-score-h1').innerHTML = "You won!";
                document.getElementById('pu-score-p').innerHTML = "Score: " + score;
            } else {
                document.getElementById('pu-score-h1').innerHTML = "You won the game!";
                document.getElementById('pu-score-p').innerHTML = "More levels coming soon! <br> Score: " + score;
            }
            setTimeout(function () {
                document.getElementById('on').click();
            }, 15);
        }

        ballX = ballX + stepX;
        ballY = ballY + stepY;
        if (ballY <= 0) {
            stepY = speed;
        } else if (ballY >= window.innerHeight) {
            if (closeBottom == false) {
                wonOrLostBoolean = true;
                loopRandom = false;
                lostBoolean = true;
                document.getElementById('pu-score-h1').innerHTML = "You lost";
                document.getElementById('pu-score-p').innerHTML = "Score: " + score;
                document.getElementById('on').click();
            } else {
                stepY = -speed;
            }
        }

        if (ballX <= 0) {
            stepX = speed;
        } else if (ballX >= window.innerWidth) {
            stepX = -speed;
        }

        if (ballY >= window.innerHeight - topBallBounce && ballY < window.innerHeight - bottomBallBounce && ballX >= posX - (movingBlockWidth / 2) && ballX <= posX + (movingBlockWidth / 2)) {
            stepY = -speed;
        }


    }
}

function checkArray(inputArray) {
    let ifEmpty = true;
    loop1:
        for (let i = 0; i < row; i++) {
            for (let k = 0; k < col; k++) {
                if (tab[i][k] == 0 || tab[i][k] == -1) {
                    ifEmpty = true;
                } else {
                    ifEmpty = false;
                    break loop1;
                }
            }
        }
    return ifEmpty;
}

function playGame() {
    document.getElementById("level-p").innerHTML = "Level: " + level + "<br>Playing as: " + username;
    ballX = window.innerWidth / 2;
    ballY = window.innerHeight - 30;
    stepY = -speed;
    stepX = speed;
    interval = setInterval(setRandom, 5000);
    play = setInterval('draw()', 10);
}

function mousePos(event) {
    posX = 0;
    posY = 0;
    let e = event || window.event
    if (e.pageX || e.pageY) {
        posX = e.pageX;
        posY = e.pageY;
    } else if (e.clientX || e.clientY) {
        posX = e.clientX + document.body.scrollLeft;
        posY = e.clientY + document.body.scrollTop;
    }

    return {
        posX,
        posY
    }
}


document.onmousemove = function (e) {
    mousePos(e);
}

//function for rounded rectangle from https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        let defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (let side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

function setRandom() {
    if (loopRandom == true) {
        random = Math.floor(Math.random() * 4);
        switch (random) {
            case 0:
                closeBottom = false;
                bonus = 1;
                document.getElementById('stripe').style.display = 'none';
                movingBlockWidth = 180;
                break;
            case 1:
                closeBottom = false;
                bonus = 2;
                document.getElementById('stripe').style.display = 'none';
                movingBlockWidth = 180;
                movingBlockWidth /= 3;
                break;
            case 2:
                closeBottom = false;
                bonus = 1;
                document.getElementById('stripe').style.display = 'none';
                movingBlockWidth = 180;
                movingBlockWidth *= 3;
                break;
            case 3:
                closeBottom = true;
                bonus = 1;
                document.getElementById('stripe').style.display = 'block';
                movingBlockWidth = 180;
                break;
        }

    }
}

function play2() {
    ballX = window.innerWidth / 2;
    ballY = window.innerHeight - 30;
    stepY = -speed;
    stepX = speed;
    newArray();
    interval = setInterval(setRandom, 5000);
}

function hideLevels() {
    document.getElementById('2').style.display = 'none';
    document.getElementById('3').style.display = 'none';
}
// ************
//    AJAX
// ************


/*jslint browser: true*/
/*global $, jQuery, alert*/

$(function gameFunctions() {

    $('.soundOn').click(function () {
        $('.soundOn').hide(0);
        $('.soundOff').show(0);
        audioBool = false;
    });

    $('.soundOff').click(function () {
        $('.soundOff').hide(0);
        $('.soundOn').show(0);
        audioBool = true;
    });

    $('.off').click(function () {
        $('.off').hide(0);
        $('.on').show(0);
        loopRandom = true;
        setRandom();
        play = setInterval('draw()', 10);
        $('.shade').hide(200);
    });
})

async function getData() {
    const res = await $.ajax({
        url: "https://arkanoid.lauvrenn.now.sh/api/scores",
        type: "get"
    }).done(function (response, textStatus, jqXHR) {
        $.ajaxSetup({
            cache: false
        });
    }).fail(function (response) {
        console.log(response);
    });

    data = res;

    console.log('response from /api/scores ', res)
    return res
}

async function updateData() {
    if (!data) await getData()
    let objIndex = data.findIndex((obj) => obj.username == username)
    if (objIndex === -1) {
        const newUser = {
            username: username,
            score: score,
            level: level
        }
        data.push(newUser)
    } else {
        if (score > data[objIndex].score) {
            data[objIndex].score = score
        }
        if (level > data[objIndex].level) {
            data[objIndex].level = level
        }
    }

    const res = await $.ajax({
        url: "https://arkanoid.lauvrenn.now.sh/api/scores",
        type: "post",
        data: data
    }).done(function (response, textStatus, jqXHR) {
        $.ajaxSetup({
            cache: false
        });
    }).fail(function (response) {
        console.log(response);
    });

    console.log('update ok? ', res)
}

async function findUser(username) {
    data = await getData();
    let results;
    results = $.map(data, function (entry) {
        let match = username ? entry.username.indexOf(username) !== -1 : false;
        return match ? entry : null;
    });
    return results[0];
}

async function setLocalHighestScore() {
    const userData = await findUser(localStorage.getItem("username"))
    if (userData) {
        highScore = userData.score
    } else {
        highScore = 0
    }
    localStorage.setItem("highscore", highScore)
}

$(function serverFunctions() {
    "use strict";

    $('.levels-play').click(async function (e) {
        localStorage.setItem("username", document.getElementById('username').value);

        username = localStorage.getItem("username");

        $('.container-username').hide(200);
        $('.a-levels').show();
        const userData = await findUser(username);

        if (userData) {
            console.log('u', userData)
            switch (userData.level) {
                case 1:
                    document.getElementById('a-2').removeAttribute("href");
                    document.getElementById('a-3').removeAttribute("href");
                    document.getElementById('lock2').style.display = 'block';
                    document.getElementById('2').style.display = 'none';
                    document.getElementById('lock3').style.display = 'block';
                    document.getElementById('3').style.display = 'none';
                    break;
                case 2:
                    document.getElementById('a-2').href = "main.html";
                    document.getElementById('lock2').style.display = 'none';
                    document.getElementById('2').style.display = 'block';
                    break;
                case 3:
                    document.getElementById('a-2').href = "main.html";
                    document.getElementById('lock2').style.display = 'none';
                    document.getElementById('2').style.display = 'block';
                    document.getElementById('a-3').href = "main.html";
                    document.getElementById('lock3').style.display = 'none';
                    document.getElementById('3').style.display = 'block';
                    break;
            }
        } else {
            console.log('s')
            document.getElementById('a-2').removeAttribute("href");
            document.getElementById('a-3').removeAttribute("href");
            document.getElementById('lock2').style.display = 'block';
            document.getElementById('2').style.display = 'none';
            document.getElementById('lock3').style.display = 'block';
            document.getElementById('3').style.display = 'none';
        }

        await setLocalHighestScore();
    });

    $('.on').click(async function () {
        $('.on').hide(0);
        $('.off').show(0);
        clearInterval(interval);
        clearInterval(play)
        loopRandom = false;
        $('.shade').show(200);
        if (wonOrLostBoolean == true) {
            $('.center-in').hide(0);
            $('.pop-up').show(0);

            await updateData()
        }
        if (wonBoolean == true) {
            if (level != 3) {
                $('.restart1').hide(0);
                $('.nextLevel').show(0);
            } else {
                $('.restart1').show(0);
                $('.nextLevel').hide(0);
            }
        }

        if (lostBoolean == true) {
            $('.restart1').show(0);
            $('.nextLevel').hide(0);
        }
    });


    $('.restart, .restart1').click(async function () {
        $('.off').hide(0);
        $('.on').show(0);
        if (level == 3 && wonBoolean == true) {
            level = 1;
        }
        random = 0;
        await setLocalHighestScore();
        score = 0;
        document.getElementById("score-p").innerHTML = score;
        document.getElementById("level-p").innerHTML = "Level: " + level + "<br>Playing as: " + username;
        wonBoolean = false;
        lostBoolean = false;
        loopRandom = true;
        wonOrLostBoolean = false;
        bonus = 1;
        closeBottom = false;
        document.getElementById('stripe').style.display = 'none';
        movingBlockWidth = 180;
        $('.center-in').show(0);
        $('.pop-up').hide(0);
        clearInterval(play);
        play2();
        play = setInterval('draw()', 10);
        $('.shade').hide(200);

    });

    $('.nextLevel').click(async function () {
        level += 1;
        $('.off').hide(0);
        $('.on').show(0);
        random = 0;
        await setLocalHighestScore();
        score = 0;
        document.getElementById("score-p").innerHTML = score;
        document.getElementById("level-p").innerHTML = "Level: " + level + "<br>Playing as: " + username;
        wonBoolean = false;
        lostBoolean = false;
        loopRandom = true;
        wonOrLostBoolean = false;
        bonus = 1;
        closeBottom = false;
        document.getElementById('stripe').style.display = 'none';
        movingBlockWidth = 180;
        $('.center-in').show(0);
        $('.pop-up').hide(0);
        clearInterval(play);
        play2();
        play = setInterval('draw()', 10);
        $('.shade').hide(200);
    });

    $('.level-p').click(function (e) {
        localStorage.setItem("levelID", e.target.id);
    });


});