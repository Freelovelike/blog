"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Alert, App, Button, Checkbox, Flex, Form, Input, message } from "antd";
import { useState } from "react";
import { RiAdminFill } from "react-icons/ri";
import { RiLockPasswordFill } from "react-icons/ri";
import { Login } from "../post/require";
import { log } from "console";
export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const login = () => {};
  const onFinish = async (values: any) => {
    const { name, password } = values;
    console.log(values);
    
    const res = await Login({
      name,
      password,
    });
    if (res) {
      messageApi.success("登陆成功")
      localStorage.setItem("blog_token",res.data.access_token)
      router.push("/home");
    } else {
      messageApi.error("账号或密码错误")
    }
  };
  return (
    <>{contextHolder}
<main className={styles.main}>
      <section className={styles.login_section}>
        <Flex className={styles.head}>
          <div className={styles.login_avatar}>
            <img
              src="/img/freelove.jpg"
              alt=""
              style={{ height: 60, width: 60 }}
            />
          </div>
          <div className={styles.login_name}>FreeLove</div>
        </Flex>
        <div className={styles.blog_name}>博客后台系统</div>
        <Form onFinish={onFinish}>
          <Form.Item
            name="name"
            className={styles.login_user}
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input allowClear prefix={<RiAdminFill />} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<RiLockPasswordFill />} />
          </Form.Item>

          <div className={styles.login_checkboxs}>
            <Checkbox>记住密码</Checkbox>
            <Checkbox>自动登录</Checkbox>
          </div>
          <Button
            type="primary"
            className={styles.login_submit}
            onClick={login}
            htmlType="submit"
          >
            登录
          </Button>
        </Form>
      </section>
      <footer className={styles.footer}>ICP编号:桂ICP备2023011409号</footer>
    </main>
    </>
    
  );
}
