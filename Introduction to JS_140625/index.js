//var s1 = "abhishek";
//console.log(s1);

//var s1 = "aryan";
//console.log(s1);

// let

//let s2 = "hunny";
//console.log(s2);

//console.log(s2);

//s2 = "Aman";
//console.log(s2);    

//let s3 = "Pratyush";  
//console.log(s3);

//s3 = "harsh";
//console.log(s3);


//functions

function sumOfTwo(a,b){
        let ans = a+b;

        return ans;
    }

let sumOfTwoBy = sumOfTwo(2,3);
console.log(sumOfTwoBy);

function sum(a,b){
    console.log(a+b);
    
}

sum(2,3);

var name = () =>{
        console.log("sumit")
    }
    
console.log(name);

console.log(name()); 
    
name();


//closure function

function a(){
    var x=7;
    var y=6;
    function b(){
        var y=8;
        console.log(y);
    }
    y=10;
    b(); 
}
a();

function x(){
    var a=7;
    function y(){
        console.log(a);
    }
    a=100;
    return y;
}
    
var z=x();
console.log(z); 
z(); 
    
function z(){
    var b =900;
    function x(){
        var a = 7;
        function y(){
            console.log(a,b);
        }
        y(); 
    }
    x();   
}
z();  

//settimeout

//setTimeout(()=>{
//    console.log("i'll print after 2 secs");
//},2000);

//SETINTERVAL 

//setInterval(()=>{
//    console.log("i'll print after 2 secs");
//},2000)


//for loop


for(var i=0; i<10; i++){

    console.log(i); 
    
}


for(var i=0; i<10; i++){
    setTimeout(function(){
        console.log(i);
    }, 2000);
}



//event listeners
