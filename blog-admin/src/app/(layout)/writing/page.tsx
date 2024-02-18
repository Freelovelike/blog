"use client";
import { IDomEditor, IToolbarConfig, IEditorConfig } from "@wangeditor/editor";
import styles from "./writing.module.css"
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import "@wangeditor/editor/dist/css/style.css";
import { Button, Col, Flex, Input, Row } from "antd";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { publishArticle } from "@/src/post/require";

export default function Writing() {
  const [editor, setEditor] = useState<IDomEditor | null>(null); 
  const [wordCount,setWordCount]=useState<number>(0)
  const [rows,setRows]=useState<number>(0)
  const [numberOfMainwords,setNumberOfMainwords]=useState<number>(0)
  const title=useRef<string>("")
    
  // 编辑器内容
  const [html, setHtml] = useState("<p>hello</p>");

  // 模拟 ajax 请求，异步设置 html


  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    
  }; // TS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const onWriting=async ()=>{
    const res=await publishArticle({
      title:title.current,
      content:html,
      description:"还没有",
      category:"前端",
      PresenterId:"1"
    })
    console.log({res});
    
  }
  const changeTitle=(e:ChangeEvent<HTMLInputElement>)=>{

    title.current=e.target.value
  }
  return (
    <div className={styles.main}>
      <Row className={styles.writing_head}>
        <Col span={20}>
          <Input placeholder="输入文章标题..." allowClear  onChange={changeTitle}/>
        </Col>
        <Col>
          <Button type="primary" ghost>草稿箱</Button>
        </Col>
        <Col>
          <Button type="primary" onClick={onWriting}>发布</Button>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
            <Toolbar
              editor={editor}
              defaultConfig={toolbarConfig}
              mode="default"
              style={{ borderBottom: "1px solid #ccc",
             }}
            />
            <Editor
              defaultConfig={editorConfig}
              value={html}
              onCreated={setEditor}
              onChange={(editor) => setHtml(editor.getHtml())}
              mode="default"
              style={{ height: "700px", overflowY: "hidden" }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div style={{ marginTop: "15px" }}>{html}</div>
        </Col>
      </Row>
      <Row className={styles.editor_footer}>
        <Col offset={1} span={2}>
        字符数：{wordCount}
        </Col>
        <Col span={2}>
        行数：{rows}
        </Col>
        <Col span={2}>
        正文字数：{numberOfMainwords}
        </Col>
      </Row>
    </div>
  );
}
