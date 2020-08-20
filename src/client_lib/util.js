let o = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

export function b64encode(number) {
    let b = '';
    let zero;
    let base;

    if (typeof number == 'bigint') {
        base = 64n;
        zero = 0n;
    } else {
        zero = 0;
        base = 64;
    }

    if (number == zero) {
        b += o[0];
    }

    while (number != zero) {
        b += o[number % base];

        if (typeof number == 'bigint') number = number / base;
        else number = Math.floor(number / base);
    }

    return b.split('').reverse().join('');
}

let o_ = {
    '0': 0n,
    '1': 1n,
    '2': 2n,
    '3': 3n,
    '4': 4n,
    '5': 5n,
    '6': 6n,
    '7': 7n,
    '8': 8n,
    '9': 9n,
    a: 10n,
    b: 11n,
    c: 12n,
    d: 13n,
    e: 14n,
    f: 15n,
    g: 16n,
    h: 17n,
    i: 18n,
    j: 19n,
    k: 20n,
    l: 21n,
    m: 22n,
    n: 23n,
    o: 24n,
    p: 25n,
    q: 26n,
    r: 27n,
    s: 28n,
    t: 29n,
    u: 30n,
    v: 31n,
    w: 32n,
    x: 33n,
    y: 34n,
    z: 35n,
    A: 36n,
    B: 37n,
    C: 38n,
    D: 39n,
    E: 40n,
    F: 41n,
    G: 42n,
    H: 43n,
    I: 44n,
    J: 45n,
    K: 46n,
    L: 47n,
    M: 48n,
    N: 49n,
    O: 50n,
    P: 51n,
    Q: 52n,
    R: 53n,
    S: 54n,
    T: 55n,
    U: 56n,
    V: 57n,
    W: 58n,
    X: 59n,
    Y: 60n,
    Z: 61n,
    '-': 62n,
    _: 63n,
};

export function b64decode(number) {
    let n = 0n;
    let c = 0n;

    number = number.split('');

    while (number.length > 0) {
        let key = number.pop();

        if (!o_[key]) {
            return null;
        }

        n += o_[key] * 64n ** c;

        c++;
    }

    return n;
}

export async function serviceReachable() {
    return new Promise((resolve, _) => {
        fetch('http://127.0.0.1:5000/util/status')
            .then(data => data.json())
            .then(json => json.online)
            .then(online => (online ? resolve(true) : resolve(false)))
            .catch(() => resolve(false));
    });
}
