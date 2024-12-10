function isTriangle(a,b,c){
   let x=[a,b,c].sort((y,z)=>y-z);

   if (x[0]<=0) {
    return false;
   } else if(x[2]>=x[1]+x[0]) {
    return false;
   } else {
    return true;
   }
}

console.log(isTriangle(1,2,2));
console.log(isTriangle(1,2,3));