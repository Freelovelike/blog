import { arctileList } from "@/utils/require";
import styles from "./page.module.css";
import { AiOutlineLike } from "react-icons/ai";
import { CiRead } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";
import Link from "next/link";
export const Arcitle =async () => {
    const articles=await arctileList()

    
    
    const ArcitleList=()=>{
        return articles.map(({id,title,category,likes,views})=>{
            return <Link href={`article/${id}`}>
            <div key={id} className="w-full h-80 block  p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <img src="/image/dog.jpg" alt="Card Image" className="w-full h-3/5" />
            <h2 className="text-xl font-medium mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">描述</p>
            <footer className="text-xs h-1/6 ">
              <ul className="grid grid-cols-8 h-1/2">
                <li className="col-span-1">
                  <span className="text-gray-400">#</span>
                  标签
                </li>
                <li className="col-span-1">
                  <span className="text-gray-400">#</span>标签2
                </li>
              </ul>
              <div className="grid grid-cols-12 h-1/2">
                <span className="col-span-6 grid items-center">2024年2月18日</span>
                <div className="col-span-2 grid grid-cols-4 items-center">
                  <AiOutlineLike className="col-span-1" />
                  <span className="col-span-2">{likes}</span> 
                </div>
                <span className="col-span-2 grid grid-cols-4 items-center">
                  <CiRead className="col-span-1" />
                  <span className="col-span-2">{views}</span>
                </span>
                <span className="col-span-2 grid grid-cols-4 items-center">
                  <FaRegCommentDots className="col-span-1" />
                  <span className="col-span-2">99+</span>
                </span>
              </div>
            </footer>
          </div>
            </Link>
        })
    }
  return (
    <div className="grid grid-cols-2 gap-10">
      <ArcitleList/>
    </div>
  );
};
