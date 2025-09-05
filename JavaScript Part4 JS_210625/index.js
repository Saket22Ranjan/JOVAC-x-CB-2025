//Reduce

// const arr =[5,1,2,7,4]

// let ans = 0;

// for(let i= 0;i<arr.length;i++){
//     ans+=arr[i];
// }
// console.log(ans);


//REDUCE SYNTAX
// let arr = [4,6,2,3,1]

// const output = arr.reduce(function(acc,curr){
//     acc = acc+curr;
//     return acc;
// },0)

// console.log(output);

// Direct Loging using loop
// let arr = [5, 4, 3, 8, 12, 72];

// let max = arr[0];
// for (leti= 1;i<arr.length; i++) {
//   if (arr[i]>max) {
//     max=arr[i];
//   }
// }
// console.log(max); 

// Using Reduce
let arr = [5, 4, 3, 8, 12, 72];
let max = arr.reduce((acc, curr) => curr > acc ? curr : acc);
console.log(max); 

// const arr=[1,2,3,4,5,6];
// let max= arr.reduce(function (acc,cur){
//     return curr> acc? curr : acc;
// });
// console.log(max);

////////////////////////////////////////////////////////////////////////////////////////////////////

// Object

const users = [
    {

firstName: "Saket",
lastName: "Ranjan",
age: 25
    },
{
firstName: "Sumit",
lastName: "Singh",
age: 19
},
{
firstName: "Suraj",
lastName: "Nagaich",
age: 19
}
]

// console.log(users.firstName);

const output = users.map(user=> user.firstName+ " "+ user.lastName);
console.log(output);
console.log(output[0]);


// Lets get avg age of users; using reduce

const output2 = users.reduce(function(acc,curr){
    acc =acc+curr.age
    return acc
},0)

console.log(output2);

const outputFilter = users.filter (user=>user.age<20);


// console.log(outputFilter);

// const finalResult =outputFilter.map((namee)=> namee.firstName);