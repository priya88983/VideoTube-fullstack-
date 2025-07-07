

// const asyncHandler = ()=>{}
// const asyncHandler= (fnxn)=>()=>{}
// const asyncHandler=(fnxn)=> async()=>{}


    //^ try catch 

    // const asyncHandler = (fnxn)=> async(req,res,next)=>{

    //     try {

    //         await fnxn(req,res,next)
            
    //     } catch (error) {
            
    //         res.status(error.code || 500 ).json({

    //
    //             success :false,
    //             message :error.message

    //         })

    //     }
    // }


    //* promise  

    const asyncHandler = (requestHandler)=>{

    return  (req,res,next)=>{

            Promise.resolve( requestHandler(req,res,next ) )
            .catch( (err)=>next(err))
    }
    
    
    }



    

    export {asyncHandler};