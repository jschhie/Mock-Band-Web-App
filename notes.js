/* 
NOTES

JS EVENT LISTENERS: 
    - addEventListener(event, function): attaches event handler to an element
    - both event and func/handler required 
    - can add many, diff events to same element

Example:
    element.addEventListener("click", myfunc1);
    element.addEventListener("mouseover", otherfunc2);
---------------
- To pass parameter values: use "anonymous function"
Example:
    let arg1 = 5;
    let arg2 = 6;

    let element = document.getElementById("myBtn");

    element.addEventListener("click", function() {
        myFuncName(arg1, arg2); 
    });

    function myFuncName(a, b) { 
        // a = arg1 = 5, b == arg2 = 6
        document.getElementById("myParagraph").innerHTML = a * b;
    }
================
HTML DOM:
    - standard object model and programming interface for HTML
    - tree-like rep of web page loaded into browser
    - main object = document object, which has other objects, and so on
    - created by browser, a way for it to organize HTML info
*/