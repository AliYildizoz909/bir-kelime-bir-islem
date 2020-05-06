/* eslint-disable no-throw-literal */
function generateNumbers() {
    var numbers = []
    for (let index = 1; index < 6; index++) {
        numbers.push(getRndNumber1Digit())
    }
    return numbers;
}
function getRndNumber2Digit() {
    return getRndNumber1Digit() * 10;
}
function getRndNumber1Digit() {
    return Math.floor(Math.random() * 9) + 1;
}
export function getNumbers() {
    var numbers = generateNumbers();
    numbers.push(getRndNumber2Digit())
    return numbers.sort((a, b) => a - b);
}
export function getTarget() {
    return Math.floor(Math.random() * 900) + 100;
}

const getAllSubsets =
    theArray => theArray.reduce(
        (subsets, value) => subsets.concat(
            subsets.map(set => [value, ...set])
        ),
        [[]]
    );
export function calc(numbers, target) {
    var optSum = []
    var optMul = []
    var optDiv = []
    var optSub = []

    var allOpt = []
    numbers.sort((a, b) => a.number - b.number)
    console.log(numbers)
    var numbersSubset = getAllSubsets(numbers)
    delete numbersSubset[0];
    console.log(numbersSubset)

    var numbersSum = subsetSum(numbersSubset)
    var numbersMul = subsetMul(numbersSubset)
    var numbersSub = subsetSub(numbersSum)
    var numbersDiv = subsetDiv(numbersMul)

    allOpt = [...numbersSum, ...numbersMul, ...numbersDiv]
    var subsets = [[...numbersSum], [...numbersMul], [...numbersDiv]]

    var subSubsets = getAllSubsets(subsets).filter(i => i.length === 2)
    for (let index = 0; index < subSubsets.length; index++) {
        const dualSubset = subSubsets[index]
        optSum = [...optSum, algSum(dualSubset[0], dualSubset[1])]
        optMul = [...optMul, algMul(dualSubset[0], dualSubset[1])]
        optDiv = [...optDiv, algDiv(dualSubset[0], dualSubset[1])]
        optSub = [...optSub, algSub(dualSubset[0], dualSubset[1])]
        allOpt = [...allOpt, ...algSum(dualSubset[0], dualSubset[1]), ...algMul(dualSubset[0], dualSubset[1]), ...algDiv(dualSubset[0], dualSubset[1])]
    }
    optSum = [...optSum, algSum(numbersMul, numbersSub, true), algSum(numbersDiv, numbersSub, true)]
    allOpt = [...allOpt, ...algSum(numbersMul, numbersSub, true), ...algSum(numbersDiv, numbersSub, true)]

    var optSubsetsSum = getAllSubsets(optSum).filter(i => i.length === 2)
    var optSubsetsMul = getAllSubsets(optMul).filter(i => i.length === 2)
    var optSubsetsDiv = getAllSubsets(optDiv).filter(i => i.length === 2)
    var optSubsetsSub = getAllSubsets(optSub).filter(i => i.length === 2)

    for (let index = 0; index < optSubsetsMul.length; index++) {
        const subsetsMul = optSubsetsMul[index]
        const subsetsDiv = optSubsetsDiv[index]
        const subsetsSub = optSubsetsSub[index]
        allOpt = [
            ...allOpt,
            ...algMul(subsetsMul[0], subsetsMul[1]),
            ...algDiv(subsetsDiv[0], subsetsDiv[1]),
            ...algSub(subsetsSub[0], subsetsSub[1])]
    }
    for (let index = 0; index < optSubsetsSum.length; index++) {
        const subsetsSum = optSubsetsSum[index]
        allOpt = [...allOpt, ...algSum(subsetsSum[0], subsetsSum[1]),]
    }
    console.log(allOpt)
    var opt = check(allOpt, target).sort((a, b) => b.skor - a.skor);
    return opt;
}
function check(array, target) {
    console.log("------------------check------------------")
    var newArray = []
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        var skor = Math.abs(target - element.res)
        if (skor < 10) {
            newArray.push({
                operation: element.operation,
                res: element.res,
                ids: element.ids,
                skor: 10 - skor
            })
        }
    }
    newArray = arrayUnique(newArray);
    console.log(newArray);
    return newArray;
}
function algSum(numbers1, numbers2, isSub = false) {
    var opt = []
    for (let index = 0; index < numbers1.length; index++) {
        const subset = numbers1[index];
        if (subset.ids.length === 6) {
            continue;
        }
        var match = []
        var condition = ""
        for (let index2 = 0; index2 < subset.ids.length; index2++) {
            if (index2 !== subset.ids.length - 1) {
                condition += "!i.ids.includes(" + subset.ids[index2] + ")" + "&&";
            } else {
                condition += "!i.ids.includes(" + subset.ids[index2] + ")";
            }
        }
        match = numbers2.filter(i => (i.ids.length + subset.ids.length) <= 6).filter(i => (eval(condition)));
        if (match.length !== 0) {
            for (let index2 = 0; index2 < match.length; index2++) {
                const subsetMatch = match[index2];
                opt.push({
                    operation: isSub ? "(" + subset.operation + subsetMatch.operation + ")" : "(" + subset.operation + ")+(" + subsetMatch.operation + ")",
                    res: subsetMatch.res + subset.res,
                    ids: [...subsetMatch.ids, ...subset.ids]
                })
            }
        }
    }
    return arrayUnique(opt);;
}
function algMul(numbers1, numbers2) {
    var opt = []
    for (let index = 0; index < numbers1.length; index++) {
        const subset = numbers1[index];
        if (subset.ids.length > 4) {
            continue;
        }
        var match = []
        var condition = ""
        for (let index2 = 0; index2 < subset.ids.length; index2++) {
            if (index2 !== subset.ids.length - 1) {
                condition += "!i.ids.includes(" + subset.ids[index2] + ")" + "&&";
            } else {
                condition += "!i.ids.includes(" + subset.ids[index2] + ")";
            }
        }
        match = numbers2.filter(i => (i.ids.length + subset.ids.length) <= 6).filter(i => (eval(condition)));
        if (match.length !== 0) {
            for (let index2 = 0; index2 < match.length; index2++) {
                const subsetMatch = match[index2];
                if (subsetMatch.res < 0 && subset.res < 0) continue;
                opt.push({
                    operation: "(" + subset.operation + ")*(" + subsetMatch.operation + ")",
                    res: subsetMatch.res * subset.res,
                    ids: [...subsetMatch.ids, ...subset.ids]
                })

            }
        }
    }
    return arrayUnique(opt);;
}
function algDiv(numbers1, numbers2) {
    var opt = []
    for (let index = 0; index < numbers1.length; index++) {
        const subset = numbers1[index];
        if (subset.ids.length > 4) {
            continue;
        }
        var match = []
        var condition = ""
        for (let index2 = 0; index2 < subset.ids.length; index2++) {
            if (index2 !== subset.ids.length - 1) {
                condition += "!i.ids.includes(" + subset.ids[index2] + ")" + "&&";
            } else {
                condition += "!i.ids.includes(" + subset.ids[index2] + ")";
            }
        }
        match = numbers2.filter(i => (i.ids.length + subset.ids.length) <= 6).filter(i => (eval(condition)));
        if (match.length !== 0) {
            for (let index2 = 0; index2 < match.length; index2++) {
                const subsetMatch = match[index2];
                const div = subsetMatch.res / subset.res
                const rDiv = subset.res / subsetMatch.res
                if (subsetMatch.res < 0 && subset.res < 0) continue;
                if ((Number.isInteger(div) || Number.isInteger(rDiv)) && rDiv !== div) {
                    if (subsetMatch.res > subset.res) {
                        opt.push({
                            operation: "(" + subsetMatch.operation + ")/(" + subset.operation + ")",
                            res: div,
                            ids: [...subsetMatch.ids, ...subset.ids]
                        })
                    } else {
                        opt.push({
                            operation: "(" + subset.operation + ")/(" + subsetMatch.operation + ")",
                            res: rDiv,
                            ids: [...subsetMatch.ids, ...subset.ids]
                        })
                    }
                }
            }
        }
    }
    return arrayUnique(opt);;
}
function algSub(numbers1, numbers2) {
    var opt = []
    for (let index = 0; index < numbers1.length; index++) {
        const subset = numbers1[index];
        var match = []
        var condition = ""
        for (let index2 = 0; index2 < subset.ids.length; index2++) {
            if (index2 !== subset.ids.length - 1) {
                condition += "!i.ids.includes(" + subset.ids[index2] + ")" + "&&";
            } else {
                condition += "!i.ids.includes(" + subset.ids[index2] + ")";
            }
        }
        match = numbers2.filter(i => (i.ids.length + subset.ids.length) <= 6).filter(i => (eval(condition)));
        if (match.length !== 0) {
            for (let index2 = 0; index2 < match.length; index2++) {
                const subsetMatch = match[index2];
                const res = subsetMatch.res - subset.res
                if (res === 0 && subsetMatch.res < 0 && subset.res < 0) continue;
                if (res > 0) {
                    opt.push({
                        operation: "(" + subsetMatch.operation + ")-(" + subset.operation + ")",
                        res: res,
                        ids: [...subsetMatch.ids, ...subset.ids]
                    })
                } else {
                    opt.push({
                        operation: "(" + subset.operation + ")-(" + subsetMatch.operation + ")",
                        res: subset.res - subsetMatch.res,
                        ids: [...subsetMatch.ids, ...subset.ids]
                    })
                }
            }
        }
    }
    return arrayUnique(opt);;
}
function subsetSub(numbers) {
    var numbersSub = [];
    for (let index = 0; index < numbers.length; index++) {
        const element = numbers[index];
        numbersSub.push({ operation: " - " + element.operation, res: -element.res, ids: element.ids })
    }
    return numbersSub;
}
function subsetDiv(numbersMul) {
    var numbersDiv = [];
    for (let index = 1; index < numbersMul.length; index++) {
        const mulSubset = numbersMul[index]
        var match = []
        var condition = ""
        for (let index2 = 0; index2 < mulSubset.ids.length; index2++) {
            if (index2 !== mulSubset.ids.length - 1) {
                condition += "!i.ids.includes(" + mulSubset.ids[index2] + ")" + "&&";
            } else {
                condition += "!i.ids.includes(" + mulSubset.ids[index2] + ")";
            }
        }
        match = numbersMul.filter(i => (i.ids.length + mulSubset.ids.length) <= 6).filter(i => (eval(condition)));
        if (match.length !== 0) {
            for (let index2 = 0; index2 < match.length; index2++) {
                const subsetMatch = match[index2];
                const div = subsetMatch.res / mulSubset.res
                const rDiv = mulSubset.res / subsetMatch.res

                if ((Number.isInteger(div) || Number.isInteger(rDiv)) && rDiv !== div) {
                    if (subsetMatch.res > mulSubset.res) {
                        numbersDiv.push({
                            operation: subsetMatch.operation + " / " + mulSubset.operation,
                            res: div,
                            ids: [...subsetMatch.ids, ...mulSubset.ids]
                        })
                    } else {
                        numbersDiv.push({
                            operation: mulSubset.operation + " / " + subsetMatch.operation,
                            res: rDiv,
                            ids: [...subsetMatch.ids, ...mulSubset.ids]
                        })
                    }
                }
            }
        }
    }
    numbersDiv = arrayUnique(numbersDiv);
    return numbersDiv;
}
function subsetSum(numbers) {
    var numbersSum = [];
    for (let index1 = 1; index1 < numbers.length; index1++) {
        const subset = numbers[index1];
        var sum = 0;
        var operation = "( "
        var ids = []
        if (subset.length > 1) {
            for (let index2 = 0; index2 < subset.length; index2++) {
                const element = subset[index2];
                sum += subset[index2].number
                ids.push(subset[index2].id)
                if (index2 !== subset.length - 1) {
                    operation += element.number + " + ";
                } else {
                    operation += element.number + " )"
                }
            }
        } else {
            operation = " " + subset[0].number + " ";
            sum = subset[0].number;
            ids.push(subset[0].id);

        }
        numbersSum.push({ operation: operation, res: sum, ids: ids })
    }
    numbersSum = arrayUnique(numbersSum);
    return numbersSum;
}
function subsetMul(numbers) {
    var numbersMul = [];
    for (let index1 = 1; index1 < numbers.length; index1++) {
        const subset = numbers[index1];
        var isOneContains = true;
        for (let index2 = 0; index2 < subset.length; index2++) {
            const element = subset[index2];
            if (element.number === 1) {
                isOneContains = false;
                break;
            }
        }
        if (isOneContains) {
            var mul = 1;
            var operation = "( "
            var ids = []
            if (subset.length > 1) {

                for (let index2 = 0; index2 < subset.length; index2++) {
                    const element = subset[index2];
                    mul *= subset[index2].number
                    ids.push(subset[index2].id)
                    if (index2 !== subset.length - 1) {
                        operation += element.number + " * ";
                    } else {
                        operation += element.number + " )"
                    }
                }
                // if (mul < 5000)
                numbersMul.push({ operation: operation, res: mul, ids: ids })
            }
            if (subset.length === 1) {
                ids.push(subset[0].id);
                numbersMul.push({ operation: " " + subset[0].number + " ", res: subset[0].number, ids: ids })

            }

        }
    }
    numbersMul = arrayUnique(numbersMul);
    return numbersMul;
}
function arrayUnique(array) {
    return array.filter((val, index, self) =>
        index === self.findIndex((t) => (
            t.operation === val.operation && t.res === val.res
        ))
    );
}