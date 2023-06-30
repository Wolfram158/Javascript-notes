const reverse = {'&' : '|', '|' : '&', '~' : ''};
const operations = new Set(['&', '|', '~']);

const split_formula = function(s, wantToReverse) {
    let tokens = [];
    let i = 0;
    let string, left, right;
    while (i < s.length) {
        if (97 <= s.charCodeAt(i) && s.charCodeAt(i) <= 122 || s.charAt(i) === '0' || s.charAt(i) === '1') {
            tokens.push(s.charAt(i));
            i++;
        } else if (s.charAt(i) === '~') {
            if (s.charAt(i+1) === '(') {
                left = 1;
                right = 0;
                i += 2;
                string = '~(';
                while (left !== right) {
                    string += s.charAt(i);
                    if (s.charAt(i) === '(') {
                        left++;
                    } else if (s.charAt(i) === ')') {
                        right++;
                    }
                    i++;
                }
                tokens.push(string);
            } else {
                tokens.push('~' + s.charAt(i + 1));
                i += 2;
            }
        } else if (s.charAt(i) === '&' || s.charAt(i) === '|') {
            tokens.push(s.charAt(i));
            i++;
        } else if (s.charAt(i) === '(') {
            left = 1;
            right = 0;
            i++;
            string = '(';
            while (left !== right) {
                string += s.charAt(i);
                if (s.charAt(i) === '(') {
                    left++;
                } else if (s.charAt(i) === ')') {
                    right++;
                }
                i++;
            }
            tokens.push(string);
        }
    }
    if (wantToReverse) {
        if (tokens.includes('&') && tokens.includes('|')) {
            let h = [];
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i] === '&') {
                    h[h.length - 1] = h[h.length - 1] + '&';
                } else {
                    let signal = true;
                    if (i > 0) {
                        if (tokens[i-1] === '&') {
                            h[h.length - 1] = h[h.length - 1] + tokens[i];
                            signal = false;
                        }
                    }
                    if (signal) {
                        h.push(tokens[i]);
                    }
                }
            }
            for (let i = 0; i < h.length; i++) {
                if ((97 <= h[i].charCodeAt(0) && h[i].charCodeAt(0) <= 122 || h[i].charAt(0) === '0' || h[i].charAt(0) === '1') && h[i].length > 1) {
                    h[i] = '(' + h[i] + ')';
                }
                if (h[i].length > 2) {
                    if ((97 <= h[i].charCodeAt(1) && h[i].charCodeAt(1) <= 122 || h[i].charAt(1) === '0' || h[i].charAt(1) === '1') && h[i].charAt(0) === '~') {
                        h[i] = '(' + h[i] + ')';
                    }
                    if (h[i].charAt(0) === '(' && h[i].charAt(h[i].length - 1) !== ')') {
                        h[i] = '(' + h[i] + ')';
                    }
                    if (h[i].charAt(0) === '~' && h[i].charAt(1) === '(') {
                        h[i] = '(' + h[i] + ')';
                    }
                }
            }
            tokens = h;
        }
    }
    if (wantToReverse) {
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].charAt(0) === '~') {
                if (97 <= tokens[i].charCodeAt(1) && tokens[i].charCodeAt(1) <= 122 || tokens[i].charAt(1) === '0' || tokens[i].charAt(1) === '1') {
                    tokens[i] = tokens[i].charAt(1);
                } else {
                    tokens[i] = '(' + split_formula(tokens[i].substring(2, tokens[i].length - 1), false) + ')'
                }
            } else if (tokens[i].charAt(0) === '(') {
                tokens[i] = '(' + split_formula(tokens[i].substring(1, tokens[i].length - 1), true) + ')';
            } else if (97 <= tokens[i].charCodeAt(0) && tokens[i].charCodeAt(0) <= 122 || tokens[i] === '0' || tokens[i] === '1') {
                tokens[i] = '~' + tokens[i];
            } else if (operations.has(tokens[i])) {
                tokens[i] = reverse[tokens[i]];
            }
        }
    } else {
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].charAt(0) === '~') {
                if (97 <= tokens[i].charCodeAt(1) && tokens[i].charCodeAt(1) <= 122 || tokens[i].charAt(1) === '0' || tokens[i].charAt(1) === '1') {
                } else {
                    tokens[i] = '(' + split_formula(tokens[i].substring(2, tokens[i].length - 1), true) + ')';
                }
            } else if (tokens[i].charAt(0) === '(') {
                tokens[i] = '(' + split_formula(tokens[i].substring(1, tokens[i].length - 1), false) + ')';
            }
        }
    }
    return tokens.join('');
}

class And {
    constructor(l, r) {
        this.l = l;
        this.r = r;
        this.priority = 2;
        this.signature = "and";
        this.AndEval = function(x, y) {
            return (x === true && y === true);
        }
    }

    evaluate(args) {
        return this.AndEval(this.l.evaluate(args), this.r.evaluate(args));
    }

    toString() {
        return "(" + this.l + "&" + this.r + ")";
    }

    toMiniString() {
        if (this.l.priority === 1 && this.r.priority === 1) {
            return "(" + this.l.toMiniString() + ")" + "&" + "(" + this.r.toMiniString() + ")";
        } else if (this.l.priority === 1) {
            return "(" + this.l.toMiniString() + ")" + "&" + this.r.toMiniString();
        } else if (this.r.priority === 1) {
            return this.l.toMiniString() + "&" + "(" + this.r.toMiniString() + ")";
        } else {
            return this.l.toMiniString() + "&" + this.r.toMiniString();
        }
    }
}

class Or {
    constructor(l, r) {
        this.l = l;
        this.r = r;
        this.priority = 1;
        this.signature = "or";
        this.OrEval = function(x, y) {
            return (x === true || y === true);
        }
    }

    evaluate(args) {
        return this.OrEval(this.l.evaluate(args), this.r.evaluate(args));
    }

    toString() {
        return "(" + this.l + "|" + this.r + ")";
    }

    toMiniString() {
        return this.l.toMiniString() + "|" + this.r.toMiniString();
    }
}

class Negate {
    constructor(l) {
        this.l = l;
        this.priority = 3;
        this.signature = "negate";
        this.NegateEval = function(x) {
            return x !== true;
        }
    }

    evaluate(args) {
        return this.l.NegateEval(args);
    }

    toString() {
        return "~(" + this.l + ")";
    }

    toMiniString() {
        if (this.l.priority > 0) {
            return "~" + this.l.toString();
        } else {
            return "~" + this.l.toMiniString();
        }
    }
}

class Variable {
    constructor(name) {
        this.name = name;
        this.priority = 0;
        this.signature = "var";
        this.VariableEval = function(value) {
            return value === 1;
        }
    }

    evaluate(args) {
        return this.VariableEval(args[this.name.charCodeAt(0) - 97]);
    }

    toString() {
        return this.name;
    }

    toMiniString() {
        return this.name;
    }
}

class Const {
    constructor(value) {
        this.value = value;
        this.priority = 0;
        this.signature = "const";
        this.ConstEval = function(x) {
            return this.value == 1;
        }
    }

    evaluate(args) {
        return this.ConstEval(args);
    }

    toString() {
        return this.value + "";
    }

    toMiniString() {
        return this.value + "";
    }
}

class Nope {
    constructor(that) {
        this.signature = that;
    }
}

const parse = function(s) {
    let a = [];
    let i = 0;
    while (i < s.length) {
        if (97 <= s.charCodeAt(i) && s.charCodeAt(i) <= 122) {
            a.push(new Variable("" + s.charAt(i)));
        } else if (operations.has(s.charAt(i))) {
            a.push(new Nope(s.charAt(i)));
        } else if (s.charAt(i) === '0' || s.charAt(i) === '1') {
            a.push(new Const(s.charAt(i)));
        }
        if (s.charAt(i) === '(') {
            let z = '';
            i++;
            let left = 1;
            let right = 0;
            while (left !== right) {
                if (s.charAt(i) === '(') {
                    left++;
                } else if (s.charAt(i) === ')') {
                    right++;
                }
                if (left !== right || s.charAt(i) !== ')') {
                    z += s.charAt(i);
                }
                if (left !== right) {
                    i++;
                }
            }
            a.push(parse(z));
        }
        i++;
    }

    i = 0;
    let b = [];

    while (i < a.length) {
        if (a[i].signature === '~') {
            b.push(new Negate(a[i + 1]));
            i += 2;
        } else {
            b.push(a[i]);
            i++;
        }
    }

    i = 0;
    let c = [];

    while (i < b.length) {
        if (b[i].signature === '&') {
            c[c.length - 1] = new And(c[c.length - 1], b[i+1]);
            i += 2;
        } else {
            c.push(b[i]);
            i++;
        }
    }

    i = 0;
    let d = c[0];

    while (i < c.length) {
        if (c[i].signature === '|') {
            d = new Or(d, c[i+1]);
            i += 2;
        } else {
            i++;
        }
    }

    return d;
}

const push = function(s) {
    let str = split_formula(s, false);
    str = str.replace(/~0/g, '1');
    str = str.replace(/~1/g, '0');
    str = parse(str);
    return str.toMiniString();
}

console.log(push("~(a|b)"));
console.log(push("~(a&b)"));
console.log(push("~(a&b|c|(d|~(f&~g)&y|e))"));
console.log(push("a&b|~(c&d|~f|~(h|~x)|u&~v|w)&~p|t"));
console.log(push("a&b|(c|(r|a&~(f|~g&b&n&u|~t|y)))|~a"));
console.log(push("~a&~(b|~(c|~h&(~f|~(k|~(b&~c)))))"));
console.log(push("~(~(~(~a|b|c&d)&e|r)|~t&f|o)"));
console.log(push("~0|b&(~a|1&~(0|b&c|i&~0&1))|~1"));
