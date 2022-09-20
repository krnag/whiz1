const mathFns = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh', 'log', 'ln']
const prec = {"^": 4, "*": 3, "/": 3, "+": 2, "-": 2, "(": 1};
const solve = {
  '+': (x, y) => { return x + y },
  '-': (x, y) => { return x - y },
  '*': (x, y) => { return x * y },
  '/': (x, y) => { return x / y },
  '^': (x, y) => { return x ** y }
}
const applyFunc = {
  'sin':   inp => Math.sin(inp), 
  'cos':   inp => Math.cos(inp), 
  'tan':   inp => Math.tan(inp), 
  'asin':  inp => Math.asin(inp), 
  'acos':  inp => Math.acos(inp), 
  'atan':  inp => Math.atan(inp), 
  'sinh':  inp => Math.sinh(inp), 
  'cosh':  inp => Math.cosh(inp), 
  'tanh':  inp => Math.tanh(inp), 
  'asinh': inp => Math.asinh(inp), 
  'acosh': inp => Math.acosh(inp), 
  'atanh': inp => Math.atanh(inp), 
  'log':   inp => Math.log(inp), 
  // 'ln':    inp => Math.ln(inp)
}

function Token(type, value) {
  this.type = type;
  this.value = value;
}

function getType(ch) {
  if (/\d|\./.test(ch)) return 'd'
  else if (/\+|-|\*|\/|\^/.test(ch) ) return 'o'
  else if (ch === '(') return '('
  else if (ch === ')') return ')'
  else if (ch === 'x') return 'x'
  else if (/[a-z]/i.test(ch)) return 'c'
  // else if (ch === ',') return ','
}

export function lex(str) {
  let res = [], typeArr = [];

  str = str.replace(/\s+/g, '').split('');
  str.forEach(ch => typeArr.push(getType(ch)));

  const strLen = str.length;

  let buffer = '';
  let bufferType;
  let i = 0;

  do {
    if (typeArr[i] === 'c' || typeArr[i] === 'd') {
      bufferType = typeArr[i];
      while (bufferType === typeArr[i]) {
        buffer += str[i];
        i++;
      }
      if (bufferType === 'c') {
        const bufLen = buffer.length;
        if (bufLen > 1) {
          // Check for pi, functions 
          if (buffer === 'pi') res.push(new Token('d', Math.PI));
          else if (mathFns.indexOf(buffer) > -1) res.push(new Token('f', buffer));
          // If none, create multiple vars, separated by commas
          else {
            buffer.split('').map((c, idx) => {
              res.push(new Token('c', c));
              if (idx + 1 < bufLen) res.push(new Token('o', '*'));
            });
          }
        } else res.push(new Token(bufferType, buffer));
      } else if (bufferType === 'd') {
        res.push(new Token(bufferType, buffer));
        // handle implicit multiplication for digits
        if (['c', '(', 'x'].indexOf(typeArr[i]) > -1 ) {
          res.push(new Token('o', '*'))
        }
      }

      buffer = '';
      bufferType = ''
    }
    // TODO handle implicit multiplication for ')'? eg: (a+3)x
    // TODO handle implicit multiplication for char? eg: a(3+x)
    else {
      res.push(new Token(typeArr[i], str[i]));
      i++
    }
  } while (i < strLen);
  // console.log('lex res:', res);
  return res;
}

export function postfix (arr) {
  let q = [], stack = [];

  for (let i = 0; i < arr.length; i++) {
    const t = arr[i];
    switch (t.type) {
      case 'o':
        if (t.value !== '^') {
          while (stack.length && prec[stack[stack.length - 1].value] && prec[t.value] <= prec[stack[stack.length - 1].value])
            q.push(stack.pop());
        }
        stack.push(t)
        break;       
      case '(':
      case 'f': 
        stack.push(t);
        break;
      case ')':
        for (let top = stack.pop(); top.value !== '('; top = stack.pop()) {
          q.push(top);
        }
        if (stack.length > 0 && [stack.length - 1].type === 'f') q.push(stack.pop());
        break;
      case undefined:
        break;
      default:
        q.push(t);
        break;
    }
  }
  while (stack.length > 0) q.push(stack.pop());
  // console.log('postfix q:', q);
  return q;
};

export function interpret(q, params, page, x) {
  let stack = [], lhs, rhs;
  const qLength = q.length;
  for (let i = 0; i < qLength; i++) {
    switch (q[i].type) {
      case 'o':
        rhs = Number(stack.pop());
        lhs = Number(stack.pop());
        stack.push(solve[q[i].value](lhs, rhs));
        break;
      case 'f':
        stack.push(applyFunc[q[i].value](stack.pop()));
        break;
      case 'x':
        stack.push(x);
        break;
      case 'c':
        // console.log('params[q[i].value]', params[q[i].value].value);
        const v = q[i].value;
        stack.push(page.hasOwnProperty(v) ? page[v].value : params[v].value);
        break;
      default: 
        stack.push(q[i].value);
        break;
    }
  }
  // console.log(stack[0]);
  return stack[0]
}
