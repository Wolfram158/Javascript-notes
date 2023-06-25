const reverse = {'&' : '|', '|' : '&', '~' : ''};
const operations = new Set(['&', '|', '~']);

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

    simplify() {
        if (this.l.signature === "const") {
            if (this.l.value == '0') {
                return new Const('0');
            }
            return this.r.simplify();
        } else if (this.r.signature === "const") {
            if (this.r.value == '0') {
                return new Const('0');
            }
            return this.l.simplify();
        } else if (this.l.simplify().signature !== "const" && this.r.simplify().signature !== "const") {
            return new And(this.l.simplify(), this.r.simplify());
        } else {
            return (new And(this.l.simplify(), this.r.simplify())).simplify();
        }
    }

    push() {
        return new And(this.l.push(), this.r.push());
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

    simplify() {
        if (this.l.signature === "const") {
            if (this.l.value == '1') {
                return new Const('1');
            }
            return this.r.simplify();
        } else if (this.r.signature === "const") {
            if (this.r.value == '1') {
                return new Const('1');
            }
            return this.l.simplify();
        } else if (this.l.simplify().signature !== "const" && this.r.simplify().signature !== "const") {
            return new Or(this.l.simplify(), this.r.simplify());
        } else {
            return (new Or(this.l.simplify(), this.r.simplify())).simplify();
        }
    }

    push() {
        return new Or(this.l.push(), this.r.push());
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

    simplify() {
        if (this.l.signature === "const") {
            if (this.l.value === '0') {
                return new Const('1');
            } else {
                return new Const('0');
            }
        } else if (this.l.simplify().signature !== "const") {
            return new Negate(this.l.simplify());
        } else {
            return (new Negate(this.l.simplify())).simplify();
        }
    }

    push() {
        if (this.l.signature === "and") {
            return new Or((new Negate(this.l.l)).push(), (new Negate(this.l.r)).push()).push();
        } else if (this.l.signature === "or") {
            return new And((new Negate(this.l.l)).push(), (new Negate(this.l.r)).push()).push();
        } else if (this.l.signature === "const") {
            if (this.l.value === '0') {
                return new Const('1');
            }
            return new Const('0');
        } else if (this.l.signature === "var") {
            return new Negate(this.l.push());
        } else if (this.l.signature === "negate") {
            return this.l.l.push();
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

    simplify() {
        return this;
    }

    push() {
        return this;
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

    simplify() {
        return this;
    }

    push() {
        return this;
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
    return parse(s).push().toMiniString();
}

const simplify = function(s) {
    return parse(s).simplify().toMiniString();
}

const pushAndSimplify = function(s) {
    return parse(s).push().simplify().toMiniString();
}

console.log("Test 1" + ": " + push("~(a|b)"));
console.log("Test 2" + ": " + push("~(a&b)"));
console.log("Test 3" + ": " + push("~(a&b|c|(d|~(f&~g)&y|e))"));
console.log("Test 4" + ": " + push("a&b|~(c&d|~f|~(h|~x)|u&~v|w)&~p|t"));
console.log("Test 5" + ": " + push("a&b|(c|(r|a&~(f|~g&b&n&u|~t|y)))|~a"));
console.log("Test 6" + ": " + push("~a&~(b|~(c|~h&(~f|~(k|~(b&~c)))))"));
console.log("Test 7" + ": " + push("~(~(~(~a|b|c&d)&e|r)|~t&f|o)"));
console.log("Test 8" + ": " + push("~0|b&(~a|1&~(0|b&c|i&~0&1))|~1"));
console.log("Test 9" + ": " + pushAndSimplify("~0|b&(~a|1&~(0|b&c|i&~0&1))|~1"));
console.log("Test 10" + ": " + simplify("~0|b&(~a|1&~(0|b&c|i&~0&1))|~1"));
console.log("Test 11" + ": " + push("~(~a|~(b&c)&~i)"));
console.log("Test 12" + ": " + push("~1&a|~(b|~(a&b|~(u|v&~y)|t&~0|(~(a&~(b|c|0)&1))))"))
console.log("Test 13" + ": " + pushAndSimplify("~1&a|~(b|~(a&b|~(u|v&~y)|t&~1|(~(a&~(b|c|0)&1))))"))
console.log("Test 14" + ": " + simplify("~1&a|~(b|~(a&b|~(u|v&~y)|t&~1|(~(a&~(b|c|0)&1))))"))
