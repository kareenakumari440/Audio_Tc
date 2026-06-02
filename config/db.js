
const mongoDB = require("mongoose")


const  connectDB = async ()=>{
   
    try {
          await  mongoDB.connect(process.env.Atlas_URL);
          console.log("mongodb connected")
    } catch (error) {
        console.log(process.env.Atlas_URL)
       console.log(error) 
        process.exit(1)
    }
}
module.exports = connectDB ;