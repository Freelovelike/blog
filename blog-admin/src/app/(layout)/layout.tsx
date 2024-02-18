"use client"
import { Flex, Image } from "antd";
import styles from "./layout.module.css";
import { FaHome } from "react-icons/fa";
import { RiArticleFill } from "react-icons/ri";
import { TbWriting } from "react-icons/tb";
import { FaMessage } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { CiSettings } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
  
}) {
  const pathName=usePathname()
  return (
    <section className={styles.section}>
      <aside className={styles.aside}>
        <div className={styles.aside_image}>
          <Image src="/img/freelove.jpg" />
        </div>
        <Flex vertical className={styles.aside_content}>
          <Link href="/home" className={styles.aside_link+` ${pathName=="/home"?styles.aside_link_active:""}`}>
            <FaHome size={30} />
          </Link>
          <Link href="/article" className={styles.aside_link+` ${pathName=="/article"?styles.aside_link_active:""}`}>
            <RiArticleFill size={30} />
          </Link>
          <Link href="/writing" className={styles.aside_link+` ${pathName=="/writing"?styles.aside_link_active:""}`}>
            <TbWriting size={30} />
          </Link>
          <Link href="/message" className={styles.aside_link+` ${pathName=="/message"?styles.aside_link_active:""}`}>
            <FaMessage size={30} />
          </Link>
          <Link href="/gallery" className={styles.aside_link+` ${pathName=="/gallery"?styles.aside_link_active:""}`}>
            <GrGallery size={30} />
          </Link>
        </Flex>
        <Flex vertical className={styles.aside_footer}>
          <CiSettings size={30} />
          <CiLogout size={30} />
        </Flex>
      </aside>
      <Flex className={styles.main}>
        <div className={styles.main_content}>
        {children}
        </div>
        
      </Flex>
    </section>
  );
}
