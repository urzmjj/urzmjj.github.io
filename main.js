function dateColor(){
    let date = document.getElementById("date").value;
    let dl = date.split("-");
    let r = Math.floor(((dl[0]%10)*31 + (dl[1]%12)*19 + (dl[2]%31)*11)*1)%256;
    let g = Math.floor(((dl[0]%10)*37 + (dl[1]%12)*23 + (dl[2]%31)*13)*3)%256;
    let b = Math.floor(((dl[0]%10)*41 + (dl[1]%12)*29 + (dl[2]%31)*17)*7)%256;
    document.getElementById("colorPanel").style.backgroundColor = "rgb("+r.toString()+","+g.toString()+","+b.toString()+")";
}

function randrange(a, b, c){
    if (parseInt(a)>=parseInt(b)) {
        throw new RangeError();
    }
    if (parseInt(c)<=0) {
        throw new RangeError();
    }
    return Math.floor(Math.random()*(parseInt(b)-parseInt(a))/parseInt(c))*parseInt(c)+parseInt(a);
}

function randint(a,b){
    return randrange(a,b+1,1)
}
let numberToGuess = 0
let guessString = ""
let maxLength = 6
function generateGuessNumber(){
    numberToGuess = randint(0,Math.pow(10,maxLength)-1)
    guessString = `I'm thinking of a number between 0 and ${Math.pow(10,maxLength)-1}. Bet you can't guess it in 15 guesses.`;
    document.getElementById("guessPanel").innerText = guessString;
}
function guessNumber(){
    let guess = parseInt(document.getElementById("guessNumber").value);
    if (guess >= Math.pow(10,maxLength) || guess < 0 || !guess && guess!=0) return;
    let higherOrLower = "";
    let orderOfMagnitude = 0;
    let greenNumbers = 0;
    let yellowNumbers = 0;
    if(guess == numberToGuess){
        higherOrLower = "=";
        orderOfMagnitude = 0;
        greenNumbers = maxLength;
        yellowNumbers = 0;
    }else{
        if(guess > numberToGuess){
            higherOrLower = "<";
        }else{
            higherOrLower = ">";
        }
        let q = guess.toString().padStart(maxLength,"0");
        let r = numberToGuess.toString().padStart(maxLength,"0");
        for(let i = 0; i < maxLength; i++){
            if(q.charAt(i) == r.charAt(i)){
                greenNumbers += 1;
                q = q.slice(0, i) + "-" + q.slice(i + 1);
                r = r.slice(0, i) + "-" + r.slice(i + 1);
            }
        }
        for(let i = 0; i < maxLength; i++){
            if(q.charAt(i) == "-") continue;
            let t = r.indexOf(q.charAt(i));
            if(t != -1){
                yellowNumbers += 1;
                q = q.slice(0, i) + "-" + q.slice(i + 1);
                r = r.slice(0, t) + "-" + r.slice(t + 1);
            }
        }
        orderOfMagnitude = Math.ceil(Math.log10(Math.abs(guess-numberToGuess)))+1;
    }
    guessString = `${guess.toString().padStart(maxLength,"0")}: ${higherOrLower}${orderOfMagnitude}${greenNumbers}${yellowNumbers}\n${guessString}`;
    document.getElementById("guessPanel").innerText = guessString;
}