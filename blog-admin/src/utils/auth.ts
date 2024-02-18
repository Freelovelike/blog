export const getToken=()=>{
    if(window){
        return localStorage.getItem("blog_token");
    }
    
}