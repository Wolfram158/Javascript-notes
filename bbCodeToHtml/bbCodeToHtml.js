class Combination {
    constructor(args) {
        this.data = args;
    }

    toHTML() {
        return this.data.map(unit => unit.toHTML()).join('');
    }
}

class Text {
    constructor(string) {
        this.string = string;
    }

    toHTML() {
        return this.string;
    }
}

function Node(beginTag, endTag) {
    let node = function(inside) {
        this.toHTML = function() {
            return beginTag + inside + endTag;
        }
    }
    return node;
}

const Strong = Node('<strong>', '</strong>');
const Emphasis = Node('<em>', '</em>');
const Strikeout = Node('<s>', '</s>');
const Underline = Node('<u>', '</u>');
const Code = Node('<pre>', '</pre>');

const testTag = function(s, i, tag) {
    return s.substring(i, i + tag.length) === tag;
}

const tags = {'[b]' : '[/b]', '[i]' : '[/i]', '[u]' : '[/u]', '[s]' : '[/s]', '[code]' : '[/code]'}
const tagsList = ['[b]', '[i]', '[u]', '[s]', '[code]']

const parse = function(s) {
    let i = 0;
    let data = [];
    let curS = '';
    while (i < s.length) {
        let signal = true;
        for (const tag of tagsList) {
            if (testTag(s, i, tag)) {
                signal = false;
                let j = i + tag.length;
                let k = j;
                let left = 1;
                let right = 0;
                let flag = true;
                while (k < s.length && flag) {
                    if (testTag(s, k, tags[tag])) {
                        right++;
                    }
                    if (testTag(s, k, tag)) {
                        left++;
                    }
                    if (left === right) {
                        flag = false;
                    }
                    k++;
                }
                if (!flag) {
                    data.push(new Text(curS));
                    curS = '';
                    switch (tag) {
                        case '[b]':
                            data.push(new Strong(parse(s.substring(j, k - 1))));
                            break;
                        case '[i]':
                            data.push(new Emphasis(parse(s.substring(j, k - 1))));
                            break;
                        case '[u]':
                            data.push(new Underline(parse(s.substring(j, k - 1))));
                            break;
                        case '[s]':
                            data.push(new Strikeout(parse(s.substring(j, k - 1))));
                            break;
                        case '[code]':
                            data.push(new Code(parse(s.substring(j, k - 1))));
                    }
                    i = k + tag.length;
                } else {
                    curS += s.charAt(i);
                    i++;
                }
            }
        }
        if (signal) {
            curS += s.charAt(i);
            i++;
        }
    }

    if (curS !== '') {
        data.push(new Text(curS));
    }

    return (new Combination(data)).toHTML();
}

const test1 = 'The [i]text[/i] is [b][i]Operation [s]not[b][/s] binary[/i][/b] [s]because[/s] [b]'
const test2 = '[s][i][s][i][b]F is a [s][/s]function iff [i]c[/i][/b][/i][/s] but people say that [i]it is not[/i] however [s][b][i]YES[/i][/b][/s][/i][/s]'
const test3 = '[code][i]We use tag [b][s] when want [/s] to get strong [/i] and [/code]'
const test4 = 'Using namespace [i][/i] instead of [code]std[/code] is better than [b][b][/b]'
const test5 = '[i]Iff [s] but not [/s] why not [/i] testing [code][/code]'

console.log(parse(test1))
console.log(parse(test2))
console.log(parse(test3))
console.log(parse(test4))
console.log(parse(test5))
