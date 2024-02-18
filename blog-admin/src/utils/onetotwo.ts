export const oneToTwo: <T>(arr: Array<T>) => Array<Array<T>> = (array) => {
  let len = array.length;
  let n = 4; //假设每行显示4个
  let lineNum = len % 4 === 0 ? len / 4 : Math.floor(len / 4 + 1);
  let res = [];
  for (let i = 0; i < lineNum; i++) {
    // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
    let temp = array.slice(i * n, i * n + n);
    res.push(temp);
  }
  return res;
};
