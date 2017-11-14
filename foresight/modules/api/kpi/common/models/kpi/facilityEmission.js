
module.exports=function(FacilityEmission){
    FacilityEmission.afterRemote('',function(ctx,x,next){

    })
    //clearData接口:(重置该用户的计算器)
    // FacilityEmission.clearData=function(organizationId,cb){
    //     console.log("Enter Facility clearData Function...");
    //     FacilityEmission.deleteAll({"where":{"organizationId":organizationId}},function(err,result){
    //         if(err){
    //             console.log(err);
    //             throw err;
    //         }
    //         console.log("clearData:",result);
    //         cb(null,"clearSuccess");
    //     })
    // }

    // FacilityEmission.remoteMethod(
    //     'clearData',{
    //         accepts:{
    //             arg:"organizationId",
    //             type:"string"
    //         },
    //         returns:{
    //             arg:'result',
    //             type:'string'
    //         },
    //         description:["clear the facilities emission Data belongs to organization"]
    //     }
    // )
   
}
