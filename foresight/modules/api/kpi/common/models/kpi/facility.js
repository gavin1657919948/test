var efData=require('../../config/ef-data.json');
module.exports=function(Facility){
    //创建
    Facility.beforeRemote("create",function(ctx,x,next){
            console.log("Entered Facility BeforeRemote create Method()....");
            console.log("ctx.args.data",ctx.args.data);
            
            var facilityId=ctx.result.facilityId;
            var pattern=ctx.args.data['calculatePattern'];
            var power=ctx.args.data['power'];
            var ash=ctx.args.data['ash'];
            var sul=ctx.args.data['sul'];
            var cost=ctx.args.data['cost'];

            Facility.find({"where":{facilityId:facilityId}}, function(err, emission) {
                if(emission.length>0){
                    next(new Error('facilityId already exsists!'));
                }
                if(isNaN(power))
                next(new Error('power must be number!'));
    
                if(pattern=="year"){//by year 数据输入源格式如：{'ash':10},{'sul':20},{'cost':30}
                    if(!isNaN(ash)&&!isNaN(sul)&&!isNaN(cost)){
                        ctx.args.data['ash']='['+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+']';
                        ctx.args.data['sul']='['+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+']';
                        ctx.args.data['cost']='['+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+']';
                    }else{
                        next(new Error('ash,sul,cost must be number!'));
                    }
                  
                }else if(pattern=="season")//by season 数据输入源格式如：{'ash':'[1,2,3,4]'},{'sul':'[2,3,4,5]'},{'cost':'[3,4,5,6]'}
                {
                    ash=ash.replace(/"/g,'').replace('[','').replace(']','').split(',');
                    sul=sul.replace(/"/g,'').replace('[','').replace(']','').split(',');
                    cost=cost.replace(/"/g,'').replace('[','').replace(']','').split(','); 
                    if(!isNaN(ash[0])&&!isNaN(sul[0])&&!isNaN(cost[0])&&!isNaN(ash[1])&&!isNaN(sul[1])&&!isNaN(cost[1])&&!isNaN(ash[2])&&!isNaN(sul[2])&&!isNaN(cost[2])&&!isNaN(ash[3])&&!isNaN(sul[3])&&!isNaN(cost[3])){
                    ctx.args.data['ash']='['+ash[0]+','+ash[0]+','+ash[0]+','+ash[0]+','+ash[1]+','+ash[1]+','+ash[1]+','+ash[1]+','+ash[2]+','+ash[2]+','+ash[2]+','+ash[2]+','+ash[3]+','+ash[3]+','+ash[3]+','+ash[3]+']';
                    ctx.args.data['sul']='['+sul[0]+','+sul[0]+','+sul[0]+','+sul[0]+','+sul[1]+','+sul[1]+','+sul[1]+','+sul[1]+','+sul[2]+','+sul[2]+','+sul[2]+','+sul[2]+','+sul[3]+','+sul[3]+','+sul[3]+','+sul[3]+']';
                    ctx.args.data['cost']='['+cost[0]+','+cost[0]+','+cost[0]+','+cost[0]+','+cost[1]+','+cost[1]+','+cost[1]+','+cost[1]+','+cost[2]+','+cost[2]+','+cost[2]+','+cost[2]+','+cost[3]+','+cost[3]+','+cost[3]+','+cost[3]+']';
                    }else{
                        next(new Error('ash,sul,cost must be number!'));
                    }
                    console.log("ash:"+ash);
                    console.log("sul:"+sul);
                    console.log("cost:"+cost);
                }else if(pattern=="month")//by month 数据输入源格式如：{'ash':'[1,2,3,4,5,6,7,8,9,10,11,12]'}
                {
                    ash=ash.replace(/"/g,'').replace('[','').replace(']','').split(',');
                    sul=sul.replace(/"/g,'').replace('[','').replace(']','').split(',');
                    cost=cost.replace(/"/g,'').replace('[','').replace(']','').split(','); 
                    for(var i=0;i<12;i++){
                        if(isNaN(ash[i])&&isNaN(sul[i])&&isNaN(cost[i])){
                            next(new Error('ash,sul,cost must be number!'));
                        }
                    }
                }else{
                    next(new Error('calculatePattern only can be "year or season or month"'));
                }
                next();
            })
        }
    )
 

    Facility.afterRemote('create',function(ctx,y,next){
        var organizationId=ctx.result.organizationId;
        var facilityId=ctx.result.facilityId;
        var fuelName=ctx.result.fuelName;
        var facilityType=ctx.result.facilityType;
        var power=ctx.result.power;
        var ash=ctx.result.ash;
        var sul=ctx.result.sul;
        var cost=ctx.result.cost;
        var arr_ash=ash.replace(/"/g,'').replace('[','').replace(']','').split(',');
        var arr_sul=sul.replace(/"/g,'').replace('[','').replace(']','').split(',');
        var arr_cost=cost.replace(/"/g,'').replace('[','').replace(']','').split(',');
        var status=getStatus(fuelName,power);
        console.log("helperColumn:",status+fuelName+facilityType);
           try{
                  var ef_nox=efData[status+fuelName+facilityType]['nox'];
                  var ef_co=efData[status+fuelName+facilityType]['co'];
                  var ef_sox=efData[status+fuelName+facilityType]['sox'];
                  var ef_pm2_5=efData[status+fuelName+facilityType]['pm2_5'];
                  var ef_pm10=efData[status+fuelName+facilityType]['pm10'];
                  var ef_filterabletpm=efData[status+fuelName+facilityType]['filterabletpm'];
                  var ef_condensiblepm=efData[status+fuelName+facilityType]['condensiblepm'];
                }catch(err){
                   next(new Error('error:cannot find the EF value! Save Failed!'));
                }
                console.log("EF==>ef_nox:"+ef_nox+";ef_co:"+ef_co+";ef_sox:"+ef_sox+";ef_pm2_5:"+ef_pm2_5+";ef_pm10:"+ef_pm10+";ef_filterabletpm:"+ef_filterabletpm+";ef_condensiblepm:"+ef_condensiblepm);
                    for(var k=0;k<12;k++){
                        if(fuelName=="一号燃料油"||fuelName=="二号燃料油"||fuelName=="四号燃料油"){
                           arr_cost[k]= arr_cost[k]*(1000/859);
                        }else if(fuelName=="五号燃料油"||fuelName=="六号燃料油"||fuelName=="七号燃料油"){
                            arr_cost[k]=arr_cost[k]*(1000/945.6);
                        }
                    }
                    var emission_NOx=0;
                    var emission_CO=0;
                    var emission_SOx=0;
                    var emission_PM2_5=0;
                    var emission_PM10=0;
                    var emission_FTPM=0;
                    var emission_CPM=0;
                    var emission_TPM=0;
                    for(var m=0;m<12;m++){
                        emission_NOx=emission_NOx+arr_cost[m]*ef_nox;
                        emission_CO+=arr_cost[m]*ef_co;
                        if(fuelName!="天然气"){
                            emission_SOx+=arr_cost[m]*ef_sox*arr_sul[m];
                        }else{
                            emission_SOx+=arr_cost[m]*ef_sox;
                        }
                        if(fuelName!="烟煤"&&fuelName!="次烟煤"&&fuelName!="无烟煤"&&fuelName!="褐煤"&&facilityType!="固态排渣对冲式煤粉锅炉-两至三个独立燃烧器"&&facilityType!="固态排渣切向燃烧式煤粉锅炉"&&facilityType!="固态排渣墙式煤粉锅炉"&&facilityType!="液态排渣墙式煤粉锅炉"&&facilityType!="旋风式锅炉"&&facilityType!="煤粉锅炉"){
                            emission_PM2_5+=arr_cost[m]*ef_pm2_5;
                            emission_PM10+=arr_cost[m]*ef_pm10;
                        }else{
                            emission_PM2_5+=arr_cost[m]*ef_pm2_5*arr_ash[m];
                            emission_PM10+=arr_cost[m]*ef_pm10*arr_ash[m];
                        }
                        if(fuelName!="无烟煤"&&fuelName!="褐煤"&&fuelName!="七号燃料油"&&fuelName!="六号燃料油"&&facilityType!="固态排渣对冲式煤粉锅炉-两至三个独立燃烧器"&&facilityType!="固态排渣切向燃烧式煤粉锅炉"&&facilityType!="固态排渣墙式煤粉锅炉"&&facilityType!="液态排渣墙式煤粉锅炉"&&facilityType!="旋风式锅炉"&&facilityType!="煤粉锅炉"){
                            emission_FTPM+=arr_cost[m]*ef_filterabletpm;
                        }else if((fuelName=="六号燃料油"||fuelName=="七号燃料油")&&ef_filterabletpm!=0){
                            emission_FTPM+=arr_cost[m]*(ef_filterabletpm*arr_sul[m]+3.22);
                        }else{
                            emission_FTPM+=arr_cost[m]*ef_filterabletpm*arr_ash[m];
                        }
                        if(fuelName=="无烟煤"){
                            emission_CPM+=arr_cost[m]*ef_condensiblepm*arr_ash[m];
                        }else{
                            emission_CPM+=arr_cost[m]*ef_condensiblepm;
                        }
                    }
                    emission_TPM=emission_FTPM+emission_CPM;
         console.log("total:"+"NOx="+emission_NOx+";SOx="+emission_SOx+";CO="+emission_CO+";TPM="+emission_TPM+";emission_FTPM:"+emission_FTPM+";emission_CPM:"+emission_CPM+";arr_cost[0]"+arr_cost[0]);         
        var FacilityEmission=Facility.app.models.FacilityEmission;
        FacilityEmission.create(
        [{ "facilityId": facilityId, "nox": emission_NOx,"sox":emission_SOx,"co":emission_CO,"tpm":emission_TPM,"pm2_5":emission_PM2_5,"pm10":emission_PM10,"ftpm":emission_FTPM,"cpm":emission_CPM,"organizationId":organizationId}]
        , function (err, emission) {
            console.log("emission:",emission);
            if (err) {
            next(new Error('createFacility Error'));
            }               
        })
        console.log("ctx.result:",ctx.result);
        next();
    })
    //更新
    Facility.beforeRemote('update',function(ctx,a,next){
        console.log("Entered Facility BeforeRemote update Method()....");
        console.log("ctx.args.data",ctx.args.data);
        
        var pattern=ctx.args.data['calculatePattern'];
        var power=ctx.args.data['power'];
        var ash=ctx.args.data['ash'];
        var sul=ctx.args.data['sul'];
        var cost=ctx.args.data['cost'];
        if(isNaN(power))
            next(new Error('power must be number!'));
        if(pattern=="year"){//by year 数据输入源格式如：{'ash':10},{'sul':20},{'cost':30}
            if(!isNaN(ash)&&!isNaN(sul)&&!isNaN(cost)){
                ctx.args.data['ash']='['+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+','+ash+']';
                ctx.args.data['sul']='['+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+','+sul+']';
                ctx.args.data['cost']='['+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+','+cost+']';
            }else{
                next(new Error('ash,sul,cost must be number!'));
            }
          
        }else if(pattern=="season")//by season 数据输入源格式如：{'ash':'[1,2,3,4]'},{'sul':'[2,3,4,5]'},{'cost':'[3,4,5,6]'}
        {
            ash=ash.replace(/"/g,'').replace('[','').replace(']','').split(',');
            sul=sul.replace(/"/g,'').replace('[','').replace(']','').split(',');
            cost=cost.replace(/"/g,'').replace('[','').replace(']','').split(','); 
            if(!isNaN(ash[0])&&!isNaN(sul[0])&&!isNaN(cost[0])&&!isNaN(ash[1])&&!isNaN(sul[1])&&!isNaN(cost[1])&&!isNaN(ash[2])&&!isNaN(sul[2])&&!isNaN(cost[2])&&!isNaN(ash[3])&&!isNaN(sul[3])&&!isNaN(cost[3])){
            ctx.args.data['ash']='['+ash[0]+','+ash[0]+','+ash[0]+','+ash[0]+','+ash[1]+','+ash[1]+','+ash[1]+','+ash[1]+','+ash[2]+','+ash[2]+','+ash[2]+','+ash[2]+','+ash[3]+','+ash[3]+','+ash[3]+','+ash[3]+']';
            ctx.args.data['sul']='['+sul[0]+','+sul[0]+','+sul[0]+','+sul[0]+','+sul[1]+','+sul[1]+','+sul[1]+','+sul[1]+','+sul[2]+','+sul[2]+','+sul[2]+','+sul[2]+','+sul[3]+','+sul[3]+','+sul[3]+','+sul[3]+']';
            ctx.args.data['cost']='['+cost[0]+','+cost[0]+','+cost[0]+','+cost[0]+','+cost[1]+','+cost[1]+','+cost[1]+','+cost[1]+','+cost[2]+','+cost[2]+','+cost[2]+','+cost[2]+','+cost[3]+','+cost[3]+','+cost[3]+','+cost[3]+']';
            }else{
                next(new Error('ash,sul,cost must be number!'));
            }
            console.log("ash:"+ash);
            console.log("sul:"+sul);
            console.log("cost:"+cost);
        }else if(pattern=="month")//by month 数据输入源格式如：{'ash':'[1,2,3,4,5,6,7,8,9,10,11,12]'}
        {
            ash=ash.replace(/"/g,'').replace('[','').replace(']','').split(',');
            sul=sul.replace(/"/g,'').replace('[','').replace(']','').split(',');
            cost=cost.replace(/"/g,'').replace('[','').replace(']','').split(','); 
            for(var i=0;i<12;i++){
                if(isNaN(ash[i])&&isNaN(sul[i])&&isNaN(cost[i])){
                    next(new Error('ash,sul,cost must be number!'));
                }
            }
        }else{
            next(new Error('calculatePattern only can be "year,season or month"'));
        }
        next();
    })
    Facility.afterRemote('update',function(ctx,y,next){
        console.log("Entered Facility AfterRemote update Method()...");
        console.log("ctx.result:",ctx.result);
        var organizationId=ctx.result.organizationId;
        var facilityId=ctx.result.facilityId;
        var fuelName=ctx.result.fuelName;
        var facilityType=ctx.result.facilityType;
        var power=ctx.result.power;
        var ash=ctx.result.ash;
        var sul=ctx.result.sul;
        var cost=ctx.result.cost;
        var arr_ash=ash.replace(/"/g,'').replace('[','').replace(']','').split(',');
        var arr_sul=sul.replace(/"/g,'').replace('[','').replace(']','').split(',');
        var arr_cost=cost.replace(/"/g,'').replace('[','').replace(']','').split(',');
        var status=getStatus(fuelName,power);
        console.log("helperColumn:",status+fuelName+facilityType);
           try{
                  var ef_nox=efData[status+fuelName+facilityType]['nox'];
                  var ef_co=efData[status+fuelName+facilityType]['co'];
                  var ef_sox=efData[status+fuelName+facilityType]['sox'];
                  var ef_pm2_5=efData[status+fuelName+facilityType]['pm2_5'];
                  var ef_pm10=efData[status+fuelName+facilityType]['pm10'];
                  var ef_filterabletpm=efData[status+fuelName+facilityType]['filterabletpm'];
                  var ef_condensiblepm=efData[status+fuelName+facilityType]['condensiblepm'];
                }catch(err){
                   next(new Error('error:cannot find the EF value! update Failed!'));
                }
                console.log("EF==>ef_nox:"+ef_nox+";ef_co:"+ef_co+";ef_sox:"+ef_sox+";ef_pm2_5:"+ef_pm2_5+";ef_pm10:"+ef_pm10+";ef_filterabletpm:"+ef_filterabletpm+";ef_condensiblepm:"+ef_condensiblepm);
                    for(var k=0;k<12;k++){
                        if(fuelName=="一号燃料油"||fuelName=="二号燃料油"||fuelName=="四号燃料油"){
                           arr_cost[k]= arr_cost[k]*(1000/859);
                        }else if(fuelName=="五号燃料油"||fuelName=="六号燃料油"||fuelName=="七号燃料油"){
                            arr_cost[k]=arr_cost[k]*(1000/945.6);
                        }
                    }
                    var emission_NOx=0;
                    var emission_CO=0;
                    var emission_SOx=0;
                    var emission_PM2_5=0;
                    var emission_PM10=0;
                    var emission_FTPM=0;
                    var emission_CPM=0;
                    var emission_TPM=0;
                    for(var m=0;m<12;m++){
                        emission_NOx=emission_NOx+arr_cost[m]*ef_nox;
                        emission_CO+=arr_cost[m]*ef_co;
                        if(fuelName!="天然气"){
                            emission_SOx+=arr_cost[m]*ef_sox*arr_sul[m];
                        }else{
                            emission_SOx+=arr_cost[m]*ef_sox;
                        }
                        if(fuelName!="烟煤"&&fuelName!="次烟煤"&&fuelName!="无烟煤"&&fuelName!="褐煤"&&facilityType!="固态排渣对冲式煤粉锅炉-两至三个独立燃烧器"&&facilityType!="固态排渣切向燃烧式煤粉锅炉"&&facilityType!="固态排渣墙式煤粉锅炉"&&facilityType!="液态排渣墙式煤粉锅炉"&&facilityType!="旋风式锅炉"&&facilityType!="煤粉锅炉"){
                            emission_PM2_5+=arr_cost[m]*ef_pm2_5;
                            emission_PM10+=arr_cost[m]*ef_pm10;
                        }else{
                            emission_PM2_5+=arr_cost[m]*ef_pm2_5*arr_ash[m];
                            emission_PM10+=arr_cost[m]*ef_pm10*arr_ash[m];
                        }
                        if(fuelName!="无烟煤"&&fuelName!="褐煤"&&fuelName!="七号燃料油"&&fuelName!="六号燃料油"&&facilityType!="固态排渣对冲式煤粉锅炉-两至三个独立燃烧器"&&facilityType!="固态排渣切向燃烧式煤粉锅炉"&&facilityType!="固态排渣墙式煤粉锅炉"&&facilityType!="液态排渣墙式煤粉锅炉"&&facilityType!="旋风式锅炉"&&facilityType!="煤粉锅炉"){
                            emission_FTPM+=arr_cost[m]*ef_filterabletpm;
                        }else if((fuelName=="六号燃料油"||fuelName=="七号燃料油")&&ef_filterabletpm!=0){
                            emission_FTPM+=arr_cost[m]*(ef_filterabletpm*arr_sul[m]+3.22);
                        }else{
                            emission_FTPM+=arr_cost[m]*ef_filterabletpm*arr_ash[m];
                        }
                        if(fuelName=="无烟煤"){
                            emission_CPM+=arr_cost[m]*ef_condensiblepm*arr_ash[m];
                        }else{
                            emission_CPM+=arr_cost[m]*ef_condensiblepm;
                        }
                    }
                    emission_TPM=emission_FTPM+emission_CPM;
         console.log("total:"+"NOx="+emission_NOx+";SOx="+emission_SOx+";CO="+emission_CO+";TPM="+emission_TPM+";emission_FTPM:"+emission_FTPM+";emission_CPM:"+emission_CPM+";arr_cost[0]"+arr_cost[0]);         
        var FacilityEmission=Facility.app.models.FacilityEmission;
        FacilityEmission.update(
                                { "facilityId": facilityId,"organizationId":organizationId},{ "nox": emission_NOx,"sox":emission_SOx,"co":emission_CO,"tpm":emission_TPM,"pm2_5":emission_PM2_5,"pm10":emission_PM10,"ftpm":emission_FTPM,"cpm":emission_CPM}
                              , function (err, result) {
                                if (err) {
                                    next(new Error('update emission Failed!'));
                                }
                                
                            })                          
        console.log("ctx.result:",ctx.result);
        next();
    })

   //查询状态编号  
   function getStatus(fuelName,power){
        if(fuelName=="烟煤"||fuelName=="次烟煤"||fuelName=="无烟煤"||fuelName=="褐煤"){
            if(power>=73){
                return 2;
            }else{
                return 1;
            }
        }else if(fuelName=="天然气"){
            if(power>=73){
                return 2;
            }
            else if(power<=29){
                return 3
            }
            return 4;
        }else{
            if(power<=29)
            return 3;
            return 4;
        }
    }
}