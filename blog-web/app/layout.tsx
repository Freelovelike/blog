"use client";
import "./globals.css";
import Image from "next/image";
import { useRouter,usePathname } from 'next/navigation'
import { MouseEvent}from "react"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const pathName=usePathname()
  const handleClick = (href:string,e:MouseEvent<HTMLDivElement>) => {
    console.log("aaa");
    
    e.preventDefault()
    router.push(href)
  }
  
  
  return (
    <html lang="en">
      <body>
        <main id="main" className="h-full">
          <header className="flex justify-evenly items-center h-14 bg-white shadow sticky">
            <div className="rounded-full overflow-hidden">
              <Image src={"/image/dog.jpg"} width={50} height={50} alt="" />
            </div>
            <nav className="flex w-96 justify-evenly ">
              <div onClick={(e)=>handleClick("/",e) } className={`nav ${pathName=="/"?"navactive":""}`} >首页</div>
              <div onClick={(e)=>handleClick("label",e)} className={`nav ${pathName=="/label"?"navactive":""}`}>标签</div>
              <div onClick={(e)=>handleClick("category",e)} className={`nav ${pathName=="/category"?"navactive":""}`}>分类</div>
              <div onClick={(e)=>handleClick("about",e)} className={`nav ${pathName=="/about"?"navactive":""}`}>关于</div>
            </nav>
            <div
              id="search"
              className="w-1/4 border-spacing-1 border rounded-lg mr-20 flex"
            >
              <img src="/svg/search.svg" alt="" className="w-5 ml-2" />
              <div className="flex w-full justify-center text-gray-400">搜索文章</div>
            </div>
            <div className="w-10 flex justify-center">
              <img src="/svg/admin.svg" alt="博客后台系统" className="h-full w-6 hover:w-8" />
            </div>
          </header>
          <section className="flex justify-center mt-3">
            <div className=" w-2/3 min-h-20 border bg-white shadow mr-5 px-8 py-5">
              {children}
            </div>
            <div className="w-56 h-80 flex-col justify-center items-center bg-white shadow pt-5">
              <div className="flex justify-center rounded-full overflow-hidden m-auto ">
                <Image src={"/image/dog.jpg"} width={100} height={100} alt="" />
              </div>
              <div id="author" className="flex justify-center mt-3 mb-3">
                Freelove
              </div>
              <div className="flex flex-wrap justify-center text-center text-xs mt-5" >
                <div className="w-2/5 hover:bg-gray-200 flex justify-start items-center">
                  <img src="/svg/github.svg " className="w-10"/>
                  <div> Github</div>
                </div>
                <div className="w-2/5 hover:bg-gray-200 flex justify-start items-center">
                  <img src="/svg/qq.svg " className="w-5"/>
                  <div> Qq</div>
                </div>
                <div className="w-2/5 hover:bg-gray-200 flex justify-start items-center">
                  <img src="/svg/bilibili.svg " className="w-5"/>
                  <div> Email</div>
                </div>
                <div className="w-2/5 hover:bg-gray-200 flex justify-start items-center">
                  <img src="/svg/wechat.svg " className="w-5"/>
                  <div> Wechat</div>
                </div>
               
              </div>
            </div>
          </section>
          <footer className=" h-10 text-gray-400 mt-10 flex justify-center">
            ICP编号:桂ICP备2023011409号
          </footer>
        </main>
      </body>
    </html>
  );
}
