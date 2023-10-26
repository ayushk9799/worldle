import express from 'express';
import fs from 'fs/promises'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';


const app=express();
app.use(compression())
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname+'/public'))
const countries=[];
let countriesDetails;
let countryMap=new Map();
try{
  countriesDetails=  await fs.readFile('countries.json','utf8');
countriesDetails=JSON.parse(countriesDetails);
countriesDetails.forEach((country)=>
{
    countryMap.set(country.name,country)
})

}
catch(error)
{
    console.log(error)
}
try{

   const files= await fs.readdir('countries')
   files.forEach((file)=>
   {
    countries.push(file)
   })

   

}
catch(error)
{
    console.log(error)
}
app.get('/data/details',(req,res)=>
{
    console.log("hello");
    console.log("data etails")
    res.json({countries:countriesDetails})
})
app.get('/data/countries', async(req,res)=>
{
   console.log('data countries')
    try{
        let country=countries[Math.floor(Math.random()*countries.length)];
        console.log(country)
        let countryLatAndLong=countryMap.get(country.slice(0,country.indexOf(".svg")));
        console.log(countryLatAndLong)
        const data=await fs.readFile(`countries/${country}`,'utf8')
       
        res.json({data:data,country:countryLatAndLong})

    }
    catch(error)
    {
        console.log(error)
        res.send("error")
    }
})
app.listen(3000,()=>
{
    console.log("server owrking on 3000")
})