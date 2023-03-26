function add() {
    console.log(50 + 20);
}

function sub() {
    console.log(50 - 20);
}

function divide() {
    console.log(50 / 10);
}

module.exports = {
    module1: add,
    module2: sub,
    divideFunction: divide
};
