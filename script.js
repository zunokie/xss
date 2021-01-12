window.name = "Intigriti's XSS challenge";

const operators = ["+", "-", "/", "*", "="];
function calc(num1 = "", num2 = "", operator = ""){
  operator = decodeURIComponent(operator);
  var operation = `${num1}${operator}${num2}`;
  document.getElementById("operation").value = operation;
  if(operators.indexOf(operator) == -1){
    throw "Invalid operator.";
  }
  if(!(/^[0-9a-zA-Z-]+$/.test(num1)) || !(/^[0-9a-zA-Z]+$/.test(num2))){
    throw "No special characters."
  }
  if(operation.length > 20){
    throw "Operation too long.";
  }
  return eval(operation);
}

function init(){
  try{
    document.getElementById("result").value = calc(getQueryVariable("num1"), getQueryVariable("num2"), getQueryVariable("operator"));
  }
  catch(ex){
    console.log(ex);
  }
}

function getQueryVariable(variable) {
    window.searchQueryString = window.location.href.substr(window.location.href.indexOf("?") + 1, window.location.href.length);
    var vars = searchQueryString.split('&');
    var value;
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            value = decodeURIComponent(pair[1]);
        }
    }
    return value;
}

/*
 The code below is calculator UI and not part of the challenge
*/

window.onload = function(){
 init();
 var numberBtns = document.body.getElementsByClassName("number");
 for(var i = 0; i < numberBtns.length; i++){
   numberBtns[i].onclick = function(e){
     setNumber(e.target.innerText)
   };
 };
 var operatorBtns = document.body.getElementsByClassName("operator");
 for(var i = 0; i < operatorBtns.length; i++){
   operatorBtns[i].onclick = function(e){
     setOperator(e.target.innerText)
   };
 };

  var clearBtn = document.body.getElementsByClassName("clear")[0];
  clearBtn.onclick = function(){
    clear();
  }
}

function setNumber(number){
  var url = new URL(window.location);
  var num1 = getQueryVariable('num1') || 0;
  var num2 = getQueryVariable('num2') || 0;
  var operator = getQueryVariable('operator');
  if(operator == undefined || operator == ""){
    url.searchParams.set('num1', parseInt(num1 + number));
  }
  else if(operator != undefined){
    url.searchParams.set('num2', parseInt(num2 + number));
  }
  window.history.pushState({}, '', url);
  init();
}

function setOperator(operator){
  var url = new URL(window.location);
  if(getQueryVariable('num2') != undefined){ //operation with previous result
    url.searchParams.set('num1', calc(getQueryVariable("num1"), getQueryVariable("num2"), getQueryVariable("operator")));
    url.searchParams.delete('num2');
    url.searchParams.set('operator', operator);
  }
  else if(getQueryVariable('num1') != undefined){
    url.searchParams.set('operator', operator);
  }
  else{
    alert("You need to pick a number first.");
  }
  window.history.pushState({}, '', url);
  init();
}

function clear(){
    var url = new URL(window.location);
    url.searchParams.delete('num1');
    url.searchParams.delete('num2');
    url.searchParams.delete('operator');
    window.history.pushState({}, '', url);
    document.getElementById("result").value = "";
    init();
}