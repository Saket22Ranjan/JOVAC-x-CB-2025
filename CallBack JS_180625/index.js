// // const { useCallback } = require("react");

// // function serveWater(callback){
// //     console.log("Serving water to the group");
// //     setTimeout(Callback,1000);
// // }

// // function servesoup(callback){
// //     console.log('serving soup to the group');
// //     setTimeout(callback,1000);
// // }

// // function serveStarters(callback){
// //     console.log("serving starter to the group");
// //     setTimeout(callback,1000);
// // }

// // function serveDrinks(callback){
// //     console.log("serving drinks to the group");
// //     setTimeout(callback,1000);
// // }

// // function servedinner(callback){
// //     console.log("serving dinner to the group");
// //     setTimeout(callback,1000);
// // }

// // function paybill(){
// //     console.log("paying the bill & out of the hotel");
// // }

// // serveWater(()=>{
// //     servesoup(()=>{
// //         serveStarters(()=>{
// //             serveDrinks(()=>{
// //                 servedinner(()=>{
// //                     paybill();
// //                 })
// //             })
// //         })
// //     })
// // })

// // micro vs macro
// // console.log("Program Start");

// // setTimeout (()=>{
// // console.log("I am SetTimeout");
// // },5000);

// // fetch("https://dummyjson.com/products"). then(function productDet(){
// // console.log("DATA : SOMETHING");

// // });

// // // console. log("Program End");

// // // Higher Order Function

// // /

// // MAP

// const arr =[5,1,4,6];


// function double(x){
// return x*2
// }

// function triple(x){
// return x*3

// }

// const output = arr.map(double);

// console.log(output);

// const output1 = arr.map(triple);

// console.log(output1);

// function double(x){
// return x*2

// }

// Array. prototype. calculate = function (logic){
//     let output = []
//     for (let i =0; i<this. length; i++){
//         output.push(logic(this[i]));
//     }
//     return output;
// }

// const arr1 = [1,2,3,4]
// const arr2 = [4,3,2,1]
// const output1 = arr1.calculate(double);
// console.log(output1);

// const output2 = arr2.calculate(double);
// console.log(output2);


// // // filter


// // const arr =[2,,3,4,5,6,7,8]

// // function isOdd(x){
// //     return x%2
// // }

// // const output = arr.filter(isOdd);

// // console.log(output);