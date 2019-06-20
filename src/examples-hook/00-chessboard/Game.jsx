// 初始化坐标
let knightPosition = [1, 7];
let observers = [];

// 触发重渲染
function emitChange() {
    // 初始化象棋坐标以及每次更新象棋坐标：emitChange都会调用两次
    console.log('emitChange'); 
    observers.forEach(o => o && o(knightPosition));
}
// 每当重渲染，先清理之前的观察者，再添加新的观察者
export function observe(o) {
    observers.push(o);

    // 触发重渲染
    emitChange();
    
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
// 接收新坐标-更改坐标-触发重渲染
export function moveKnight(toX, toY) {
    knightPosition = [toX, toY];
    emitChange();
}
