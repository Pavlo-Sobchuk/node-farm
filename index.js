//REQUIRES
const fs = require("fs");
const http = require('http');
const url = require("url")

//-----------------HTTP--------------//


// REPLACE FUNCTION 
const replaceTemplate = (temp,product)=>{

    // REPLACING ALL PLACEHOLDER 

    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    // CHECKING FOR ORGANIC 
    if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}

// READING DATA FROM JSON 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
// MAKING IT IN JS OBJECT 
const dataObj = JSON.parse(data);

//SYNC READ HTML FILE FOR FIRST LOAD 
const temp404= fs.readFileSync(`${__dirname}/templates/404.html`, 'utf-8');
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');


// CREATING SERVER 
const server = http.createServer((req,res)=>{
    // CHECKING URL 
    
    const {query, pathname} = url.parse(req.url,true);
    
    // ROUTING
    if (pathname ==='/' || pathname ==='/overview'){

        res.writeHead(200,{'Content-type':'text/html'});
    
        // LOOPING THROW THE ARR 
        const cardsHTML = dataObj.map(el=>replaceTemplate(templateCard,el)).join(''); 

        // ADDING ALL OBJ FROM JSON TO HTML 
        const output = templateOverview.replace('{%PRODUCT_CARDS%}',cardsHTML);

        res.end(output);
    }
    else if(pathname ==='/product'){

    // CONTENT TYPE 
        res.writeHead(200,{'Content-type':'text/html'});

    //TAKING OBJ FROM JSON 
        const product = dataObj[query.id];
    
    // REPLACING CONTENT 
        const output = replaceTemplate(templateProduct,product);

        res.end(output);
        
    }
    else{
        res.end(temp404);
    }
});



// STARTING SERVER ON PORT 

server.listen(8080,()=>{
    console.log("server was started")
})