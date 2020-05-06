import * as word from './word'
export function generateAlphabets() {
    var genAlp = []
    for (let index = 0; index < 8; index++) {
        genAlp.push(word.letters[Math.floor(Math.random() * 29)])
    }
    return { letters: genAlp, bonus: word.letters[Math.floor(Math.random() * 29)] };
}

export function calc(letters, words) {
    letters.forEach((element, i) => {
        letters[i] = element.toLowerCase()
    });
    console.log(letters)
    var trueWord = []
    var canWord = words.filter(w => (w.word.includes(letters[0]) || w.word.includes(letters[1]) || w.word.includes(letters[2]) ||
        w.word.includes(letters[3]) || w.word.includes(letters[4]) || w.word.includes(letters[5]) || w.word.includes(letters[6])
        || w.word.includes(letters[7]) || w.word.includes(letters[8]))).filter(w => w.word.length > 2)
    console.log(canWord)
    for (let index = 0; index < canWord.length; index++) {
        const element1 = canWord[index];
        var isWord = true;
        var currWord = element1.word.split("");
        for (let index2 = 0; index2 < currWord.length; index2++) {
            const element2 = currWord[index2];
            var letL = letters.filter(l => l === element2).length;
            var curL = currWord.filter(l => l === element2).length;
            if (!letters.includes(element2)) {
                isWord = false;
                break;
            }
            if (letL !== curL) {
                isWord = false;
                break;
            }
        }
        if (isWord) {
            trueWord.push(element1)
        }
    }
    console.log(trueWord)
    return check(trueWord, letters);
}
function check(words, [...letters]) {
    var bonus = letters[8]
    letters.splice(8, 1)
    var bonusCount = letters.filter(l => l === bonus).length;
    var checkWords = []
    for (let index = 0; index < words.length; index++) {
        const word = words[index].word;
        const wordLenght = word.length;
        var isUseBonus = false;
        if (word.includes(bonus)) {
            var wordBonusCount = word.split("").filter(l => l === bonus).length
            if (wordBonusCount !== bonusCount) {
                isUseBonus = true;
            }
        }
        checkWords.push({ skor: scoring(wordLenght), isUseBonus, word: word });
    }
    checkWords.sort((a, b) => b.skor - a.skor);
    return checkWords;
}
function scoring(length) {
    switch (length) {
        case 3:
            return 3;
        case 4:
            return 4;
        case 5:
            return 5;
        case 6:
            return 7;
        case 7:
            return 9;
        case 8:
            return 11;
        case 9:
            return 15;
        default:
            break;
    }
}