"use client"
import { articleInfo } from '@/utils/require';
import parse from 'html-react-parser';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
const ArticlePage= ({params:{articleid}}:{params:{articleid:string}})=>{
console.log("bbb");
   const [article,setArticle]=useState<{
      content:string
   }>({content:""})
   useEffect(()=>{
      console.log("aa");
      const aa=async ()=>{
        const  article= await articleInfo(articleid.toString())
        setArticle(article)
      }
      aa()
   },[])
   
   
   return <div>{
         parse(article.content || "")
      }</div>
}

export default ArticlePage