let o = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

export function b64encode(number) {
    let b = '';
    let zero;
    let base;

    if (typeof number == 'bigint') {
        base = BigInt(64);
        zero = BigInt(0);
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
    '0': BigInt(0),
    '1': BigInt(1),
    '2': BigInt(2),
    '3': BigInt(3),
    '4': BigInt(4),
    '5': BigInt(5),
    '6': BigInt(6),
    '7': BigInt(7),
    '8': BigInt(8),
    '9': BigInt(9),
    a: BigInt(10),
    b: BigInt(11),
    c: BigInt(12),
    d: BigInt(13),
    e: BigInt(14),
    f: BigInt(15),
    g: BigInt(16),
    h: BigInt(17),
    i: BigInt(18),
    j: BigInt(19),
    k: BigInt(20),
    l: BigInt(21),
    m: BigInt(22),
    n: BigInt(23),
    o: BigInt(24),
    p: BigInt(25),
    q: BigInt(26),
    r: BigInt(27),
    s: BigInt(28),
    t: BigInt(29),
    u: BigInt(30),
    v: BigInt(31),
    w: BigInt(32),
    x: BigInt(33),
    y: BigInt(34),
    z: BigInt(35),
    A: BigInt(36),
    B: BigInt(37),
    C: BigInt(38),
    D: BigInt(39),
    E: BigInt(40),
    F: BigInt(41),
    G: BigInt(42),
    H: BigInt(43),
    I: BigInt(44),
    J: BigInt(45),
    K: BigInt(46),
    L: BigInt(47),
    M: BigInt(48),
    N: BigInt(49),
    O: BigInt(50),
    P: BigInt(51),
    Q: BigInt(52),
    R: BigInt(53),
    S: BigInt(54),
    T: BigInt(55),
    U: BigInt(56),
    V: BigInt(57),
    W: BigInt(58),
    X: BigInt(59),
    Y: BigInt(60),
    Z: BigInt(61),
    '-': BigInt(62),
    _: BigInt(63),
};

export function b64decode(number) {
    let n = BigInt(0);
    let c = BigInt(0);

    number = number.split('');

    while (number.length > 0) {
        let key = number.pop();

        if (!o_[key]) {
            return null;
        }

        n += o_[key] * BigInt(0) ** c;

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
