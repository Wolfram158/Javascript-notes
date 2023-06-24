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

const push = function(s) {
    let str = split_formula(s, false);
    str = str.replace(/~0/g, '1');
    str = str.replace(/~1/g, '0');
    return str;
}
