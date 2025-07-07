
// require('dotenv').config({path: './env'})



import connectDB from "./db/index.js";

import dotenv from "dotenv"

import app from "./app.js"

dotenv.config({
    path: './.env'
})

connectDB().then(()=>{

   const running_Port = process.env.PORT || 8000

    app.on('error', (error) => {
    console.log("Error: ", error);
    throw error;
});

    app.listen(running_Port,()=>{

        console.log(`Server is running on port : ${running_Port}`)
    })
})

.catch((error)=>{

    console.log("MONGO DB connection failed : ",error);
})



/*

const app=express();

;(
    async()=>{
        try {

        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        app.on(error,()=>{

            console.log("Error: ",error)
            throw error
        })

        app.listen( process.env.PORT,()=>{

            console.log(`App is listening on port ${process.env.PORT}`)
        })
            
        } 
        catch (error) {
            
            console.log("Error: ",error);
            throw error 
        }


})()


*/