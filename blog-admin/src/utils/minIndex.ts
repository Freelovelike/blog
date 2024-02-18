export const minIndex=(arr:number[]):number=>{
    const min = Math.min(...arr);
    
    let minIndex = arr.findIndex((item, index) => {       
        return item == min;
      });
     
      
    return minIndex 
}
