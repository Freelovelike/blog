const baseUrl="http://127.0.0.1:3001"
export const arctileList = async () => {
  const res = await fetch(baseUrl+"/article/list",{ next: { revalidate: 5 } });
  const data = res.json();
  return data;
};
export const articleInfo=async (id: string)=>{
const url=baseUrl+"/article/info?id="+id


    const res= await(await fetch(url)).json()

    
    

    
    return res
}