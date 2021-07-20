"use strict";

const defaultWeight = 1;
const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

let islanderData = {};
let seesawSequence = [];

let seesawListLeft = [];
let seesawListRight = [];
let seesawListTop = [];

const islanderList = document.querySelectorAll("#islanders_container .islanders");
const seesaw = document.querySelector(".seesaw");
const islanders_left = document.querySelector(".islanders_left");
const islanders_right = document.querySelector(".islanders_right");
const islanders_top = document.querySelector(".islanders_top");

document.querySelector(".step1").addEventListener("click", func_step1);
document.querySelector(".step2").addEventListener("click", func_step2);
document.querySelector(".step3").addEventListener("click", func_step3);

init()


// Create data
function createIslanderData(parmNumber, parmWeight) {

    // Create Islanders
    for (let i = 0; i < labels.length; i++) {
        islanderData[labels[i]] = {};
        islanderData[labels[i]].weight = defaultWeight;
        islanderData[labels[i]].isSuspect = true;
    }

    // Select random islander
    let randomNr = Math.floor(Math.random() * labels.length);

    // ---- TESTING ----
    if (parmNumber !== undefined) {
        randomNr = parmNumber;
    }

    let selectedLabel = labels[randomNr];
    islanderList[randomNr].style.backgroundColor = `red`;
    islanderData[selectedLabel].weight = Math.random() < 0.5 ? (defaultWeight * 1.5) : (defaultWeight * 0.5);

    // ---- TEMPORARY ----
    if (parmNumber !== undefined) {
        islanderData[selectedLabel].weight = parmWeight;
    }
}

// move around islanders
function rearrangeIslanders() {

    islanders_left.innerHTML = "";
    islanders_right.innerHTML = "";
    islanders_top.innerHTML = "";

    // add islanders to scene
    let islanderDataList = Object.keys(islanderData);

    let temporaryseesawListTop = []
    for (let i = 0; i < islanderDataList.length; i++) {

        if (seesawListLeft.includes(islanderDataList[i])) {
            islanders_left.appendChild(newIslander(islanderDataList[i]));

        } else if (seesawListRight.includes(islanderDataList[i])) {
            islanders_right.appendChild(newIslander(islanderDataList[i]));

        } else {
            islanders_top.appendChild(newIslander(islanderDataList[i]));
            temporaryseesawListTop.push(islanderDataList[i]);
        }
    }
    seesawListTop = temporaryseesawListTop;

    // rotate seesaw
    seesaw.setAttribute("data-weight", getseesawState());
}

// step 1 
function func_step1() {
    // console.log("step 1")

    seesawListLeft = [labels[0], labels[1], labels[2], labels[3]];
    seesawListRight = [labels[4], labels[5], labels[6], labels[7]];

    rearrangeIslanders();
    calculate_step(0);

    // console.log("after step 1:", seesawSequence)
}

// step 2 
function func_step2() {
    // console.log("step 2");

    // even
    if (seesawSequence[0] === "even") {
        seesawListLeft = [labels[0], labels[1]];
        seesawListRight = [labels[8], labels[9]];
    }

    // left/right
    if (seesawSequence[0] === "left" || seesawSequence[0] === "right") {
        seesawListLeft = [labels[0], labels[1], labels[2], labels[4]];
        seesawListRight = [labels[3], labels[8], labels[9], labels[10]];
    }

    rearrangeIslanders();
    calculate_step(1);

    // console.log("after step 2:", seesawSequence)
}

// step 3 
function func_step3() {
    // console.log("step 3");

    // even
    if (seesawSequence[0] === "even") {
        // even - even
        if (seesawSequence[1] === "even") {
            seesawListLeft = [labels[0]];
            seesawListRight = [labels[10]];
        }
        // even - left/right
        if (seesawSequence[1] === "left" || seesawSequence[1] === "right") {
            seesawListLeft = [labels[0]];
            seesawListRight = [labels[8]];
        }
    }

    // left
    if (seesawSequence[0] === "left") {
        // left - left
        if (seesawSequence[1] === "left") {
            seesawListLeft = [labels[0]];
            seesawListRight = [labels[1]];
        }
        // left - right
        if (seesawSequence[1] === "right") {
            seesawListLeft = [labels[3]];
            seesawListRight = [labels[11]];
        }
        // left - even
        if (seesawSequence[1] === "even") {
            seesawListLeft = [labels[5]];
            seesawListRight = [labels[6]];
        }
    }

    // right
    if (seesawSequence[0] === "right") {
        // right - right
        if (seesawSequence[1] === "right") {
            seesawListLeft = [labels[0]];
            seesawListRight = [labels[1]];
        }
        // right - left
        if (seesawSequence[1] === "left") {
            seesawListLeft = [labels[3]];
            seesawListRight = [labels[11]];
        }
        // right - even
        if (seesawSequence[1] === "even") {
            seesawListLeft = [labels[5]];
            seesawListRight = [labels[6]];
        }
    }

    rearrangeIslanders();
    calculate_step(2);

    // console.log("after step 3:", seesawSequence)
}


// Init
function init() {
    createIslanderData()
    // func_step1()
    // func_step2()
    // func_step3()
}

// ------- METHODS --------

// calculate steps
function calculate_step(parm) {

    // update sequence
    seesawSequence[parm] = getseesawState();

    // add non-suspects
    if (getseesawState() == "left" || getseesawState() == "right") {
        removeSuspects(seesawListTop);
    } else {
        removeSuspects([...seesawListLeft, ...seesawListRight]);
    }

    // add extra non-suspects 
    if (seesawSequence[0] === "left") {
        if (seesawSequence[1] === "left") {
            removeSuspects([labels[3], labels[4]]);
            if (seesawSequence[2] === "left") {
                removeSuspects(labels[1]);
            } else if (seesawSequence[2] === "right") {
                removeSuspects(labels[0]);
            }
        } else if (seesawSequence[1] === "right") {
            removeSuspects([labels[0], labels[1], labels[2]]);
        } else if (seesawSequence[1] === "even") {
            if (seesawSequence[2] === "left") {
                removeSuspects([labels[5]]);
            } else if (seesawSequence[2] === "right") {
                removeSuspects([labels[6]]);
            }
        }
    } else if (seesawSequence[0] === "right") {
        if (seesawSequence[1] === "left") {
            removeSuspects([labels[0], labels[1], labels[2]]);
        } else if (seesawSequence[1] === "right") {
            removeSuspects([labels[3], labels[4]]);
            if (seesawSequence[2] === "left") {
                removeSuspects(labels[0]);
            } else if (seesawSequence[2] === "right") {
                removeSuspects(labels[1]);
            }
        } else if (seesawSequence[1] === "even") {
            if (seesawSequence[2] === "left") {
                removeSuspects([labels[6]]);
            } else if (seesawSequence[2] === "right") {
                removeSuspects([labels[5]]);
            }
        }
    }
}

// weight function (will return heaviest or even)
function getseesawState() {

    let weightLeft = 0;
    let weightRight = 0;

    for (let i = 0; i < seesawListLeft.length; i++) {
        weightLeft += islanderData[seesawListLeft[i]].weight;
    }
    for (let i = 0; i < seesawListRight.length; i++) {
        weightRight += islanderData[seesawListRight[i]].weight;
    }

    if (weightLeft > weightRight) {
        return "left"
    } else if (weightLeft < weightRight) {
        return "right"
    } else {
        return "even";
    }
}

// removes array of suspects
function removeSuspects(parm) {
    for (let i = 0; i < parm.length; i++) {
        islanderData[parm[i]].isSuspect = false;
    }
    addOpacity(parm);
}

// add opacity to non-suspects
function addOpacity(parm) {

    const allIslanders = document.querySelectorAll("#seesaw_container .islanders");
    for (let i = 0; i < allIslanders.length; i++) {
        if (parm.includes(allIslanders[i].children[0].innerHTML)) {
            setTimeout(() => {
                allIslanders[i].style.opacity = 0.2;
                // allIslanders[i].children[0].style.opacity = 0;
            }, 500);
        }
    }
}

// returns suspect array
function getSuspectList() {
    let suspectList = [];
    for (let i = 0; i < Object.keys(islanderData).length; i++) {
        if (islanderData[Object.keys(islanderData)[i]].isSuspect) {
            suspectList.push(Object.keys(islanderData)[i])
        }
    }
    return suspectList;
}

// returns div element
function newIslander(label) {

    let newText = document.createElement("div");
    newText.classList.add("label");
    newText.innerHTML = label;
    // getSuspectList().includes(label) ? null : newText.style.opacity = 0;

    let newDiv = document.createElement("div");
    newDiv.classList.add("islanders");
    getSuspectList().includes(label) ? null : newDiv.style.opacity = 0.2;

    newDiv.appendChild(newText);

    return newDiv;
}