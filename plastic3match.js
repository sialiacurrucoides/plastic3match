const gameController = (() => {
    const plastic_freqs = [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7];
    let re_plastic = [0, 1, 3, 4]; //1,2,4,5 but the numbering starts at 0
    let nonre_plastic = [2, 5, 6]; //originally 2, 5, 6 that corresponds to 3, 6, 7
    const techScoreGoals = [70, 170, 300, 999, 9999];
    const timeLimit = 4 * 60 * 1000; // 4 minutes
    let newTechs = 0;
    let elemsMarked = [];
    let score = 0;
    let newTech;
    let whichTech;
    let t0;
    let record = 0;
    let nextGoal = techScoreGoals[0];
    let numTechs = 0;
    let congrat = 0;
    let diffScore = 0;
    let letEnd = 0;

    return {
        getPlastFreq: () => {
            return plastic_freqs;
        },
        getCongrat: () => {
            return congrat;
        },
        setCongrat: (con) => {
            congrat = con;
        },
        getEnd: () => {
            return letEnd;
        },
        setEnd: () => {
            letEnd = 1;
        },
        setMarked: (id) => {
            elemsMarked.push(id);
        },
        getDiffScore: () => {
            return diffScore;
        },
        checkNeighbours: () => {
            return (Math.abs(elemsMarked[0] - elemsMarked[1]) === 1 || Math.abs(elemsMarked[0] - elemsMarked[1]) === 10);
        },
        checkReciclable: (elem) => {
            return (re_plastic.find(el => el == elem) != -1);
        },
        unCheckElem: (pos) => {
            if (pos === 0) {
                elemsMarked.shift();
            } else {
                elemsMarked.pop();
            }
        },
        markedElems: () => {
            return elemsMarked;
        },
        emptyMarkedElems: () => {
            elemsMarked = [];
        },
        increaseScoreWBonus: (newscore) => {
            score = newscore;
        },
        updateScore: (patterns) => {
            let oldScore = score;
            if (patterns.length > 0) {
                for (let i = 0; i < patterns.length; i++) {
                    if (patterns[i].length === 3) {
                        score += 3;
                    } else if (patterns[i].length === 4) {
                        score += 5;
                    } else if (patterns[i].length >= 5) {
                        score += 2 * (patterns[i].length);
                    };
                    //még le kellene kezelni a T alakokat
                };
            };
            diffScore = score - oldScore;
            return score;
        },
        clearPatterns: (elemOrd, patterns) => {

            for (let i = 0; i < patterns.length; i++) {
                let pattern = patterns[i];
                for (let j = 0; j < pattern.length; j++) {
                    elemOrd[pattern[j]] = -1;
                };
            };
            for (let i = 0; i < patterns.length; i++) {
                let pattern = patterns[i];
                for (let j = 0; j < pattern.length; j++) {
                    let t = 1;
                    let currPosition = pattern[j];
                    //move up in the grid until one is not empty
                    while (elemOrd[currPosition - t * 10] == -1) {
                        t++;
                    };
                    //until we reach the top of the grid we use the upper elements and generate new ones insted of them
                    while (currPosition >= 0) {
                        if (currPosition - t * 10 >= 0) {
                            elemOrd[currPosition] = elemOrd[currPosition - t * 10];
                        } else {
                            elemOrd[currPosition] = Math.floor(Math.random() * 7);
                            // if a tech is created, replace 3 to 1 // 6 to 2 // 7 to 5
                            let newPiece = Math.floor(Math.random() * 7);
                            if (newPiece === 2 && !nonre_plastic.includes(2)) {
                                newPiece = 0;
                            } else if (newPiece === 5 && !nonre_plastic.includes(5)) {
                                newPiece = 1;
                            } else if (newPiece === 6 && !nonre_plastic.includes(6)) {
                                newPiece = 4;
                            };
                            elemOrd[currPosition] = newPiece;
                        }
                        currPosition -= 10;
                    };
                };
            };
            // if a -1 is left somewhere
            let weirBug = elemOrd.findIndex(el => el == -1);
            if (weirBug !== -1) {
                elemOrd[weirBug] = 0;
            };
            return elemOrd;
        },
        checkTechLimits: (score) => {

            if (score >= techScoreGoals[0] && newTechs === 0) {
                whichTech = 1;
                newTechs++;
            } else if (score >= techScoreGoals[1] && newTechs === 1) {
                whichTech = 2;
                newTechs++;
            } else if (score >= techScoreGoals[2] && newTechs === 2) {
                whichTech = 3;
                newTechs++;
            } else {
                whichTech = 0;
            };
            return whichTech;
        },
        rePlasticUpdate: (newTech) => {
            re_plastic.push(newTech);
        },
        getNonRePlastic: () => {
            return nonre_plastic;
        },
        getRePlastic: () => {
            return re_plastic;
        },
        updateNoneRePlastic: (plastic) => {
            const index = nonre_plastic.indexOf(plastic);
            if (index > -1) {
                nonre_plastic.splice(index, 1);
            };
        },
        updateNewTech: (newT) => {
            newTech = newT;
        },
        getNewTech: () => {
            return newTech;
        },
        getWhichTech: () => {
            return whichTech;
        },
        setT0: (tcurr) => {
            t0 = tcurr;
        },
        getT0: () => {
            return t0;
        },
        getTimeLimit: () => {
            return timeLimit;
        },
        getScore: () => {
            return score;
        },
        setRecord: (newRec) => {
            if (newRec > record) {
                record = newRec;
            }
        },
        getRecord: () => {
            return record;
        },
        resetGame: () => {
            re_plastic = [0, 1, 3, 4]; //1,2,4,5 but the numbering starts at 0
            nonre_plastic = [2, 5, 6]; //originally 2, 5, 6 that corresponds to 3, 6, 7
            newTechs = 0;
            elemsMarked = [];
            score = 0;
            letEnd = 0;
            newTech;
            whichTech;
            nextGoal = techScoreGoals[0];
            t0 = new Date();
            numTechs = 0;
            congrat = 0;
        },
        getNextGoal: () => {
            return nextGoal;
        },
        updateNextGoal: (goal) => {
            nextGoal = goal;
        },
        increaseTechNr: () => {
            numTechs++;
        },
        getNumTechs: () => {
            return numTechs;
        },
        getTechScoreGoals: () => {
            return techScoreGoals;
        }
    };

})();

const UIController = (() => {
    const tips = [
        "7 stands for 'other types' of plastic",
        "Metalized films usually cannot be recycled even if the plastic type is PP.",
        "You can use reusable bags for buying fruits and vegetables.",
        "Buying from the local market is more eco-friendly."
    ];
    const nrElements = 100;
    const nrPlastic = 7;
    const DOMstrings = {
        playField: 'playField',
        currScore: 'curr-score',
        pElem: '.plastic',
        over: '.popGameOver',
        finalScore: '.finalScore',
        time: 'time-since-start',
        record: 'record',
        reset: '.again-btn',
        nextGoal: 'next-goal',
        congrat: '.congrat',
        turtle: 'basicTurtle',
        smileTurtle: 'smilingTurtle',
        soundToggle: 'muteTurtle',
    };
    let pauseTimer = false;
    let soundAllowed = true;
    let togglePause = () => {
        pauseTimer = !pauseTimer;
    };
    let elemOrd = [];
    let changed = [];
    let nonRePlastic = [];
    let shuffle = (a) => {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    };
    let calcNrEachPlastic = () => {
        let elemNrArray = [];
        plast_freqs.forEach((curr) => {
            let elemNr = Math.floor(curr * nrElements);
            elemNrArray.push(elemNr);
        });
        let sumElem = elemNrArray.reduce((prev, cur) => prev + cur);
        if (sumElem < nrElements) {
            for (let i = 0; i < (nrElements - sumElem); i++) {
                let myrand = Math.floor(Math.random() * nrPlastic);
                elemNrArray[myrand]++;
            }
        }
        return elemNrArray;
    };
    let orderOfPlastic = (howMany) => {
        let fieldElems = [];
        for (let i = 0; i < howMany.length; i++) {
            for (let j = 0; j < howMany[i]; j++) {
                fieldElems.push(i);
            }
        }
        fieldElems = shuffle(fieldElems);
        return fieldElems;
    };
    let displayRecord = (score) => {
        document.getElementById(DOMstrings.record).innerHTML = score;
    };
    let countNonrePlastic = (elemOrd) => {
        counter = 0;
        for (let i = 0; i < elemOrd.length; i++) {
            if (elemOrd[i] === 2 || elemOrd[i] === 5 || elemOrd[i] === 6) {
                counter += 1;
            };
        };
        return counter;
    };

    let calcChanged = (patterns) => {
        changed = [];
        for (let i = 0; i < patterns.length; i++) {
            for (let x = 0; x < patterns[i].length; x++) {
                let elem = patterns[i][x];
                while (elem > 0) {
                    changed.push(elem);
                    elem = elem - 10;
                }
            }
        }
    }


    let patternCheck = (gameCtr) => {
        nonRePlastic = gameCtr.getNonRePlastic();
        let re_plastic = gameCtr.getRePlastic();
        let selectedArr = [];
        let selectedTiles = [];
        let counter = 0;
        const minPatt = 2; //corresponds to 3 alike
        //check horizontal patterns
        for (let i = 1; i < elemOrd.length; i++) {
            if (elemOrd[i] === elemOrd[i - 1] && Math.floor((i - 1) / 10) === Math.floor(i / 10)) {
                counter++;
                if (counter >= minPatt) {
                    selectedTiles = [];
                    for (let j = 0; j <= counter; j++) {
                        selectedTiles.push(i - j);
                    };
                    if ((i === elemOrd.length - 1) || i % 10 === 9 || elemOrd[i + 1] !== elemOrd[i] || Math.floor((i) / 10) === Math.floor((i + 1) / 10)) {
                        //check if it is recyclable plastic
                        if (re_plastic.includes(parseInt(elemOrd[selectedTiles[0]]))) {
                            selectedArr.push(selectedTiles);
                        };
                    };
                };
            } else {
                counter = 0;
            };
        };
        //check vertical patterns
        selectedTiles = [];
        for (let i = 0; i < elemOrd.length; i++) {
            counter = 0;
            if (elemOrd[i] === elemOrd[i + 10] && (i + 10) % 10 === i % 10) {
                counter++;
                let t = i + 10;
                while (elemOrd[t] === elemOrd[t + 10] && (i % 10) === (t + 10) % 10) {
                    t = t + 10;
                    counter++;
                };
                if (counter >= minPatt) {
                    selectedTiles = [];
                    for (let j = 0; j <= counter; j++) {
                        selectedTiles.push(i + j * 10);
                    };
                    //if there was not pushed as a part of a longer array
                    let lastArr;
                    selectedArr.length > 0 ? lastArr = selectedArr[selectedArr.length - 1] : lastArr = [];
                    let shouldPush;
                    if (lastArr.length > 0) {
                        lastArr = [lastArr[lastArr.length - 1], lastArr[lastArr.length - 2], lastArr[lastArr.length - 3]];
                        shouldPush = !(lastArr.sort().join(',') === selectedTiles.sort().join(','));
                    } else {
                        shouldPush = true;
                    };
                    if (shouldPush) {
                        if (re_plastic.includes(parseInt(elemOrd[selectedTiles[0]]))) {
                            selectedArr.push(selectedTiles);
                        };
                    };
                };
            };
        };
        calcChanged(selectedArr);
        return selectedArr;
    };
    let getElemOrd = () => {
        return elemOrd;
    };
    let updateElemOrd = (newOrd) => {
        elemOrd = newOrd;
    };

    let fillField = (changed) => {
        let dePatterns = changed;
        let field = document.getElementById(DOMstrings.playField);
        // we calculate how many plastic element will be presented from each of the 7 types of plastic.
        let howMany = calcNrEachPlastic();
        //define the assignment of each 100 element place
        if (elemOrd.length === 0) {
            elemOrd = orderOfPlastic(howMany);
        };
        //create HTML code for the playfield based on the fieldElements
        let fieldHtml = () => {

            let fieldCode = '';
            let nonrePlastic = nonRePlastic;
            let developedTechs = [2, 5, 6].filter(item => !nonrePlastic.includes(item));
            for (let i = 0; i < elemOrd.length; i++) {
                let isDone = '';
                if ((i + 1) % 10 === 1) {
                    fieldCode = fieldCode + '<div class="row p-row-1 justify-content-center">';
                };
                if (elemOrd[i] === -1) {
                    elemOrd[i] = 0;
                };
                if (developedTechs.includes(elemOrd[i])) isDone = 'done';
                //console.log(developedTechs.includes(elemOrd[i]));
                if (dePatterns.includes(i)) {
                    fieldCode = fieldCode + '<div class="col-1 plasticTile  newTile plastic-' + i + ' " draggable="true"><img src="./imgs/icon_' + (elemOrd[i] + 1) + isDone + '.png" id=plastic-' + i + ' alt="plastic-1"></div>';
                } else {
                    fieldCode = fieldCode + '<div class="col-1 plasticTile plastic-' + i + ' " draggable="true"><img src="./imgs/icon_' + (elemOrd[i] + 1) + isDone + '.png" id=plastic-' + i + ' alt="plastic-1"></div>';
                }
                if ((i + 1) % 10 === 0) {
                    fieldCode = fieldCode + '</div>';
                };
            };
            return fieldCode;
        };
        field.innerHTML = fieldHtml();
    };
    let inactivate = (unreList) => {
        unreList.forEach((item, index) => {
            let tech = unreList[index] + 1;
            document.querySelector('.tech-' + tech).classList.remove('activated');
            document.querySelector('.tech-' + tech).classList.add('inactive');
        })
    };
    let updateNextGoal = (goal) => {
        document.getElementById(DOMstrings.nextGoal).innerHTML = goal;
    };
    let gameOver = (gameCtr, plasticCounter) => {
        let overElems = new Promise((resolve, reject) => {
            let congrat = gameCtr.getCongrat();
            let congratPanel = document.querySelector(DOMstrings.congrat);
            let final;
            let gameOver = document.querySelector(DOMstrings.over);
            let playAgain;

            if (congrat === 1 && plasticCounter <= 10) {
                playAgain = document.querySelectorAll(DOMstrings.reset)[0];
                final = document.querySelectorAll(DOMstrings.finalScore)[0];
            } else {
                playAgain = document.querySelectorAll(DOMstrings.reset)[1];
                final = document.querySelectorAll(DOMstrings.finalScore)[1];
            };

            document.getElementById("create-3").classList.remove("hidden");
            document.getElementById("create-6").classList.remove("hidden");
            document.getElementById("create-7").classList.remove("hidden");
            let timer = document.getElementById(DOMstrings.time);
            let time = timer.innerText;
            let bonus = parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
            let newscore = bonus + gameCtr.getScore();
            gameCtr.increaseScoreWBonus(newscore);

            if (newscore > gameCtr.getRecord()) {
                gameCtr.setRecord(gameCtr.getScore());
            };
            displayRecord(gameCtr.getRecord());

            timer.classList.add("hidden");

            console.log("Game over");
            final.innerHTML = newscore;


            playAgain.addEventListener('click', () => {
                gameCtr.resetGame();
                elemOrd = [];
                timer.classList.remove("hidden");
                timer.innerHTML = '--';
                document.getElementById(DOMstrings.currScore).innerHTML = 0;
                document.getElementById(DOMstrings.nextGoal).innerHTML = gameCtr.getNextGoal();
                inactivate(gameCtr.getNonRePlastic());
                fillField([]);
                elemOrd = getElemOrd();
                let patterns = patternCheck(gameCtr);
                if (patterns.length > 0) {
                    gameCtr.clearPatterns(elemOrd, patterns);
                    updateElemOrd(elemOrd);
                    fillField(changed);
                };
                gameOver.classList.add("hidden");
                congratPanel.classList.add("hidden");
            });
            resolve(congrat);
        });
        overElems.then((congrat) => {
            if (congrat == 1 && plasticCounter <= 10) {
                document.querySelector(".didYouKnow").innerHTML = tips[Math.floor(Math.random() * tips.length)];
                document.querySelectorAll(DOMstrings.finalScore)[0].innerHTML = gameCtr.getScore();
                document.querySelector(DOMstrings.congrat).classList.remove("hidden");
            } else {
                document.querySelectorAll(DOMstrings.finalScore)[1].innerHTML = gameCtr.getScore();
                document.querySelector(DOMstrings.over).classList.remove("hidden");
            };
        });

    };

    return {
        fillField: (changed) => {
            return fillField(changed);
        },
        getChanged: () => {
            return changed;
        },
        patternCheck: (gameCtr) => {
            return patternCheck(gameCtr);
        },
        getDOMstrings: () => {
            return DOMstrings;
        },
        getElemOrd: () => {
            return elemOrd;
        },
        updateElemOrd: (arr) => {
            elemOrd = arr;
        },
        updateScoreDisp: (score) => {
            document.getElementById(DOMstrings.currScore).textContent = score;
        },
        getSoundAllowed: () => {
            return soundAllowed;
        },
        toggleSoundAllowed: () => {
            soundAllowed = !soundAllowed;
            document.querySelector('.volume-up').classList.toggle("hidden");
            document.querySelector('.volume-mute').classList.toggle("hidden");
        },
        changeTurtle: () => {
            let audio = new Audio;
            audio.src = "./sounds/wowTurtle3.wav";
            audio.loop = false;
            document.getElementById(DOMstrings.turtle).classList.add("hidden");
            document.getElementById(DOMstrings.smileTurtle).classList.remove("hidden");
            if (soundAllowed) audio.play();
            setTimeout(() => {
                document.getElementById(DOMstrings.turtle).classList.remove("hidden");
                document.getElementById(DOMstrings.smileTurtle).classList.add("hidden");
            }, 1000);
        },
        chooseNewTech: (nonre, gameCtr, whichTech) => {
            let newTech;
            document.querySelector('.popUpTech').classList.remove('hidden');

            let techButtons = document.querySelectorAll('.tech-btn');
            let choosingTech = (item) => {
                togglePause();
                item.addEventListener('click', (ev) => {
                    let myval = ev.target.id;
                    myval = myval.split('-')[1];
                    newTech = parseInt(myval) - 1;

                    let tech = new Promise((resolve, reject) => {

                        if (nonre.includes(newTech)) {
                            document.querySelector('.popUpTech').classList.add('hidden');

                            gameCtr.updateNoneRePlastic(newTech);
                            gameCtr.rePlasticUpdate(newTech);

                            if (whichTech === undefined) {
                                whichTech = gameCtr.getWhichTech(); //somehow it loses the real value that is good before entering
                            };
                            let actual = newTech + 1;
                            document.querySelector('.tech-' + actual).classList.remove('inactive');
                            document.querySelector('.tech-' + actual).classList.add('activated');
                            document.querySelector('#create-' + actual).classList.add('hidden');

                            gameCtr.updateNewTech(newTech);
                            gameCtr.increaseTechNr();
                            let goals = gameCtr.getTechScoreGoals();
                            updateNextGoal(goals[gameCtr.getNumTechs()]);
                            togglePause();
                            if (gameCtr.getNumTechs() === 3) {
                                gameCtr.setCongrat(1);
                                //gameOver(gameCtr);
                            };
                            resolve();
                        } else {
                            //this.chooseNewTech;
                        };
                    });
                    tech.then(() => {
                        //console.log('newLevel newTech',newTech);
                    });
                });
            };
            techButtons.forEach(choosingTech);

        },
        removePopUpTech: () => {
            document.querySelector('.popUpTech').classList.add('hidden');
        },
        highlightDisappearing: (patterns, callback) => {
            for (let i = 0; i < patterns.length; i++) {
                let pattern = patterns[i];

                for (let j = 0; j < pattern.length; j++) {
                    let inx = pattern[j];
                    document.querySelector('#plastic-' + inx).classList.add('alert-success');
                };
            };
            const myProm = new Promise((resolve, reject) => {
                setTimeout(resolve, 400);
            });
            myProm.then(callback);
            myProm.catch(() => { console.log('something is wrong') });
        },
        showTime: (gameCtr) => {
            let TimeSince;
            let limit = gameCtr.getTimeLimit();
            let limitMin = limit / 60000;
            let interval = setInterval(() => {
                t0 = gameCtr.getT0();
                t1 = new Date();
                if (pauseTimer) {
                    t0.setSeconds(t0.getSeconds() + 1); //if the game pauses the time limit should be extended
                    gameCtr.setT0(t0);
                };
                diff = t1 - t0;
                if (Math.floor(59 - (diff % 60000) / 1000) < 9) {
                    //TimeSince = Math.floor(diff/60000) + ":0" + Math.floor((diff%60000)/1000); - before the pause option
                    TimeSince = (limitMin - 1 - Math.floor(diff / 60000)) + ":0" + (59 - Math.floor((diff % 60000) / 1000));
                } else {
                    TimeSince = (limitMin - 1 - Math.floor(diff / 60000)) + ":" + (59 - Math.floor((diff % 60000) / 1000));
                }
                if (diff <= limit && countNonrePlastic(elemOrd) > 10) {
                    document.getElementById(DOMstrings.time).innerHTML = TimeSince;
                } else {
                    if (gameCtr.getEnd() === 0) {
                        gameOver(gameCtr, countNonrePlastic(elemOrd));
                    };
                    gameCtr.setEnd();
                    //clearInterval(interval);
                };

            }, 1000);
        },
        updateNextGoal: (goal) => {
            return updateNextGoal(goal);
        }
    };

})();

const appController = ((gameCtr, UICtr) => {
    plast_freqs = gameCtr.getPlastFreq();
    let audio = new Audio;
    //audio.src = "./success2.wav";
    audio.loop = false;
    let fillField = () => {
        gameCtr.setT0(new Date());
        UICtr.fillField([]);
        UICtr.updateNextGoal(gameCtr.getNextGoal());
        UICtr.showTime(gameCtr, UICtr);
        let elemOrd = UICtr.getElemOrd();
        let patterns = UICtr.patternCheck(gameCtr);
        while (patterns.length > 0) {

            elemOrd = gameCtr.clearPatterns(elemOrd, patterns);
            patterns = UICtr.patternCheck(gameCtr);
        };
        UICtr.updateElemOrd(elemOrd);
        UICtr.fillField([]);
    };
    let setupEventListeners = () => {
        const DOM = UICtr.getDOMstrings();
        document.getElementById(DOM.playField).parentNode.addEventListener("click", evalClick);
        document.getElementById(DOM.playField).parentNode.addEventListener("drop", drop);
        document.getElementById(DOM.playField).parentNode.addEventListener("dragstart", drag);
        document.getElementById(DOM.playField).parentNode.addEventListener("dragover", allowDrop);
        //document.getElementById(DOM.playField).parentNode.addEventListener("mousedown", onMouseDown);
        document.getElementById(DOM.soundToggle).parentNode.addEventListener("click", UICtr.toggleSoundAllowed);
    };


    //with  drag events -> but that creates unwanted features
    let allowDrop = (ev) => {
        ev.preventDefault();
    };

    let drag = (ev) => {
        if (gameCtr.markedElems().length > 0) gameCtr.unCheckElem([0]);
        let firstPlastic = ev.target.id.split('-')[1];
        gameCtr.setMarked(firstPlastic);
    };

    let drop = (ev) => {
        ev.preventDefault();
        let targetPlastic = ev.target.id.split('-')[1];
        let markedPrev = gameCtr.markedElems();

        if (Math.abs(Number(markedPrev[0]) - Number(targetPlastic)) === 1 || Math.abs(Number(markedPrev[0]) - Number(targetPlastic)) === 10) {
            gameCtr.setMarked(targetPlastic);
            markedPrev = gameCtr.markedElems();
            changeEffect(markedPrev[0], markedPrev[1]);
        } else {
            gameCtr.emptyMarkedElems();
        };
    };

    let changeEffect = (prevElem, elemId) => {
        //switch the two elements
        elemOrd = UICtr.getElemOrd();
        let c = elemOrd[parseInt(prevElem)];
        elemOrd[parseInt(prevElem)] = elemOrd[parseInt(elemId)];
        elemOrd[elemId] = c;
        UICtr.updateElemOrd(elemOrd);
        UICtr.fillField([]);
        gameCtr.emptyMarkedElems();
        let mixed = true; //check even the updated field for patterns, until all is random again
        let patterns;
        const afterHighlight = () => {
            let score = gameCtr.updateScore(patterns);
            if (gameCtr.getDiffScore() >= 9) {
                UICtr.changeTurtle();
            };

            UICtr.updateScoreDisp(score);
            //let whichTech = gameCtr.checkTechLimits();

            let whichTech = gameCtr.checkTechLimits(score);
            if (whichTech !== 0) {
                let nonre = gameCtr.getNonRePlastic();
                UICtr.chooseNewTech(nonre, gameCtr, whichTech);
            };
            patterns = UICtr.patternCheck(gameCtr);
            let newElemOrd = gameCtr.clearPatterns(elemOrd, patterns);
            UICtr.updateElemOrd(newElemOrd);
            UICtr.fillField(UICtr.getChanged());
            newPatterns = UICtr.patternCheck(gameCtr);
            mixed = (newPatterns.length > 0);
            if (mixed) {
                UICtr.highlightDisappearing(newPatterns, afterHighlight);
            }
        };
        elemOrd = UICtr.getElemOrd();
        patterns = UICtr.patternCheck(gameCtr);
        let newPatterns;
        UICtr.highlightDisappearing(patterns, afterHighlight);
    };


    let evalClick = function (ev) {
        let myElem = '#' + ev.target.id;
        // mark as clicked
        const elemId = myElem.split('-')[1];
        if (myElem !== '#') {
            document.querySelector(myElem).classList.toggle("highlighted");
        }


        let markedElems = gameCtr.markedElems();
        console.log(markedElems);
        //check if the same element is clicked twice
        if (markedElems.includes(elemId)) {
            gameCtr.unCheckElem([markedElems.length - 1]);
            //document.querySelector(myElem).classList.toggle("highlighted");
            console.log(gameCtr.markedElems());
        } else {
            // update which one is marked
            gameCtr.setMarked(elemId);
        }

        //if there is another that is marked as a func of adjacency
        if (markedElems.length > 1) {
            let notTooFar = gameCtr.checkNeighbours();
            // if the second element is not adjacent to the previously marked, we unmark the previous element
            const prevElem = markedElems[0];
            if (!notTooFar) {
                gameCtr.unCheckElem(0);
                let arg = myElem.split('-')[0] + '-' + prevElem;
                document.querySelector(arg).classList.toggle("highlighted");
            } else {
                changeEffect(prevElem, elemId);
            };
        };
        //search pattern, update points, remove pattern, refill table
    };
    return {
        init: () => {
            fillField();
            setupEventListeners();
        }
    };
})(gameController, UIController);

const win1 = document.querySelector("#introWin1");
const win2 = document.querySelector("#introWin2");
const win3 = document.querySelector("#introWin3");
const win4 = document.querySelector("#introWin4");
const dispGoal = document.querySelector("#dispGoal");
const timer = 700;

const tileAnimation = () => {
    //let timer = 700;
    let animationOn = 0;
    const animation = new Promise((resolve, reject) => {
        if (animationOn === 0) {
            setTimeout(() => {
                step1.classList.add("hidden");
                step2.classList.remove("hidden");
                for (i = 1; i <= 3; i++) {
                    step2.children[i].classList.add("highlighted");
                };
                animationOn = 1;
                resolve();
            }, timer);
        } else {
            reject();
        };
    });
    animation.then(() => {
        setTimeout(() => {
            step2.classList.add("hidden");
            step3.classList.remove("hidden");
        }, timer);
    }).then(() => {
        setTimeout(() => {
            step3.classList.add("hidden");
            step1.classList.remove("hidden");
            animationOn = 0;
        }, timer * 2);
    });
};

document.getElementById("intro1").addEventListener("click", () => {
    win1.classList.add("hidden");
    win2.classList.remove("hidden");
    tileAnimation();
    setInterval(tileAnimation, timer * 4);
});
document.getElementById("intro2").addEventListener("click", () => {
    win2.classList.add("hidden");
    win3.classList.remove("hidden");
    dispGoal.classList.add("focusAttention");
    document.querySelector("#dispTechs").classList.add("focusAttention");
});
document.getElementById("intro3").addEventListener("click", () => {
    win3.classList.add("hidden");
    win4.classList.remove("hidden");
    dispGoal.classList.remove("focusAttention");
    document.querySelector("#dispTechs").classList.remove("focusAttention");
    document.querySelector("#dispTime").classList.add("focusAttention");
});
document.getElementById("intro4").addEventListener("click", () => {
    win4.classList.add("hidden");
    document.querySelector("#dispTime").classList.remove("focusAttention");
    appController.init();
});

const step1 = document.querySelector('.step-1');
const step2 = document.querySelector('.step-2');
const step3 = document.querySelector('.step-3');
const arrow = document.querySelectorAll('.arrow');



// document.getElementById('introWin2').onmouseover = () => {
//     let timer = 700;
//     const animation = new Promise( (resolve, reject) => {
//         if (animationOn === 0){
//             setTimeout(() => {
//                 step1.classList.add("hidden");
//                 step2.classList.remove("hidden");
//                 for (i = 1; i <=3; i++){
//                     step2.children[i].classList.add("highlighted");
//                 };
//                 animationOn = 1;
//                 resolve();
//                 },timer);
//         }else {
//             reject();
//         };
//     });
//     animation.then(() => {
//             setTimeout(() => {
//                 step2.classList.add("hidden");
//                 step3.classList.remove("hidden");
//             }, timer);
//         }).then( () => {
//             setTimeout ( () => {
//                 step3.classList.add("hidden");
//                 step1.classList.remove("hidden");
//                 animationOn = 0;
//             },timer*3);
//         });
//     };

