// 存储位置
let knightPosition = [1, 7];
let observers = [];

// 将knightPosition传入观察者
function emitChange() {
    observers.forEach(o => o && o(knightPosition));
}
export function observe(o) {
    // 添加观察者
    observers.push(o);

    emitChange();
    
    // 每当重渲染，先清理观察者
    return () => {
        observers = observers.filter(t => t !== o);
    };
}
export function canMoveKnight(toX, toY) {
    const [x, y] = knightPosition;
    const dx = toX - x;
    const dy = toY - y;
    return ((Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
        (Math.abs(dx) === 1 && Math.abs(dy) === 2));
}
export function moveKnight(toX, toY) {
    knightPosition = [toX, toY];
    emitChange();
}
