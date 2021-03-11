export function deepCloneFnc(target){
    // 先检测 被克隆的 目标是不是 对象
    if(typeof target ==='object' && target !==null ){
        // 先创建容器   判断 这个对象到底是数组还是 对象类型
        const result = Array.isArray(target) ? [] : {}
         for(let key in target){
            //  判断 属性是否是 对象本身的属性  无法拷贝原型链上的属性
            if(target.hasOwnProperty(key)){
                // 拷贝
                result[key] = deepCloneFnc(target[key])
            }
         }  
         return result 
    }else{
        //如果不属于对象类型 直接 return
        return target
    }

}
/* obj={
    a:1,
    b:[1,2,3,4],
    c:{xx:aa}
}   */ 