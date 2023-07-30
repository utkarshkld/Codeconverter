const express = require("express")
const app = express()
const bodyP = require("body-parser")
const compiler=require("compilex")
const options = {stats : true}
compiler.init(options)
app.use(bodyP.json())
app.use("/codemirror-5.65.13",express.static("codemirror-5.65.13"))
app.get("/",function(req,res){
    compiler.flush(function(){
        console.log("deleted")
    })
    res.sendFile("index3.html")
})
app.post("/compile",function(req,res){
        var code = req.body.code
        var input=req.body.input
        var lang=req.body.lang  
        try{
            
            if(lang=="Cpp"){
                if(!input){
                          
                var envData = { OS : "windows" , cmd : "g++",options:{timeout:10000}}; // (uses g++ command to compile )
    
                // var envData = { OS : "linux" , cmd : "gcc" }; // ( uses gcc command to compile )
                compiler.compileCPP(envData , code , function (data) {
                     res.send(data);   
                     
                     compiler.flush(function(){
                        console.log("deleted")
                    }) 
                });   
                }
                else{
                        //if windows  
                    var envData = { OS : "windows" , cmd : "g++",options:{timeout:10000}}; // (uses g++ command to compile )
                    //else
                    // var envData = { OS : "linux" , cmd : "gcc" }; // ( uses gcc command to compile )
                    compiler.compileCPPWithInput(envData , code , input , function (data) {
                        res.send(data);
                        compiler.flush(function(){
                            console.log("deleted")
                        })
                    });
                }
            }
            else if(lang=="Java"){
                if(!input){
                        //if windows  
                        var envData = { OS : "windows"}; 
                        //else
                        // console.log("File Path:", code);
                        // var envData = { OS : "linux" }; // (Support for Linux in Next version)
                        compiler.compileJava( envData , code , function(data){
                            res.send(data);
                            compiler.flush(function(){
                                console.log("deleted")
                            })
                        });    
                }
                else{
                        //if windows  
                        var envData = { OS : "windows"}; 
                        //else
                        
                        // console.log("File Path:", code);// var envData = { OS : "linux" }; // (Support for Linux in Next version)
                        compiler.compileJavaWithInput( envData , code , input ,  function(data){
                            res.send(data);
                            compiler.flush(function(){
                                console.log("deleted")
                            })
                        });
                }
            }
            else if(lang=="Python"){
                if(!input){
                    var envData = { OS : "windows"}; 
                    //else
                    var envData = { OS : "linux" }; 
                    compiler.compilePython( envData , code , function(data){
                        res.send(data);
                        compiler.flush(function(){
                            console.log("deleted")
                        })
                    }); 
                }
                else{
                    //if windows  
                    var envData = { OS : "windows"}; 
                    //else
                    var envData = { OS : "linux" }; 
                    compiler.compilePythonWithInput( envData , code , input ,  function(data){
                        res.send(data);  
                        compiler.flush(function(){
                            console.log("deleted")
                        })      
                    });
                }
            }

        }
        catch(e){
            console.log("error")
        }
        
})
app.post("/convert",function(req,res){
    var code =req.body.code
    var lang = req.body.lang
    const{ Configuration , OpenAIApi} = require("openai");
    // require("dotenv").config();
    const prompt2 = `Re-write the code in ${lang} : ${code} and it should be executable. pls dont write any unexecutable lines Please take care of indentetion and brackets of respective langugae, return the generated code after checking and fixing the error`
    // console.log(prompt2)
    const configuration = new Configuration({
        apiKey: "Your Api Key",
    });
    const openai = new OpenAIApi(configuration);
    async function runCompletion() {
        const completion = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:prompt2,
            max_tokens:1000
            
        });
        console.log(completion.data.choices[0].text);
        res.json({ output: completion.data.choices[0].text });

    }
    runCompletion();

})
app.post("/comment",function(req,res){
    var code =req.body.code
    
    const{ Configuration , OpenAIApi} = require("openai");
    // require("dotenv").config();
    const prompt2 = `Add small comments between some places in the code and return it in executabel form: ${code}`
    
    const configuration = new Configuration({
        apiKey: "Your Key",
    });
    const openai = new OpenAIApi(configuration);
    async function runCompletion() {
        const completion = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:prompt2,
            max_tokens:500
            
        });
        console.log(completion.data.choices[0].text);
        res.json({ output: completion.data.choices[0].text });

    }
    runCompletion();

})

app.listen(8000)
