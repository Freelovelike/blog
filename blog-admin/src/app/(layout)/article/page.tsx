'use client'

import { use, useContext, useEffect, useState } from "react";

import styles from "./layout.module.css";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button, Col, Flex, Form, Input, Row, Space, Table, TableProps, Tag } from "antd";
import { getArticleList } from "@/src/post/require";
import { log } from "console";

export interface DataType{
    key:number
    id:string
    img:string
    title:string
    category:string
    label:string[]
}
const columns: TableProps<DataType>['columns'] = [
    {
      title: '缩略图',
      dataIndex: 'img',
      key: 'img',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '标签',
      key: 'label',
      dataIndex: 'label',
      render: (_, { label }) => (
        <>
          {label&&label.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
            <Button type="primary" shape="circle" icon={<CiEdit />} />
            <Button type="primary" danger shape="circle" icon={<RiDeleteBin6Line />} />
        </Space>
      ),
    },
  ];
 const  ActicleList= ()=> {
  
  const [acticleList,setActicleList]=useState<DataType[]>()
 const list= use(getArticleList())
  console.log(list);
 
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <Form className={styles.form}>
          <Row className={styles.form_row} gutter={16}>
            <Col span={8}>
              <Form.Item>
                <Row className={styles.form_row}>
                  <Col span={4}>
                    <div>文章标题</div>
                  </Col>
                  <Col span={20}>
                    <Input placeholder="文章标题" />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Row className={styles.form_row}>
                  <Col span={4}>
                    <div>文章分类</div>
                  </Col>
                  <Col span={20}>
                    <Input placeholder="文章分类" />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Row className={styles.form_row}>
                  <Col span={4}>
                    <div>文章标签</div>
                  </Col>
                  <Col span={20}>
                    <Input placeholder="文章标签" />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles.form_row} gutter={16}>
            <Col span={8}>
              <Form.Item>
                <Row className={styles.form_row}>
                  <Col span={4}>
                    <div>发布时间</div>
                  </Col>
                  <Col span={20}>
                    <Input placeholder="发布时间" />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        
      </div>
      <div className={styles.article_list}>
            <div className={styles.article_list_head}>
                <Row className={styles.article_list_head_row}>
                    <Col span={2}  className={styles.article_list_head_col}>
                        全部文章
                    </Col>
                    <Col span={2} className={styles.article_list_head_col}>
                        草稿箱
                    </Col>
                </Row>
            </div>
            <div className={styles.article_list_content}>
                <Table rowKey={record => record.id} columns={columns} dataSource={list.data.map((item: { labes: never[]; })=>{
                  item.labes=[]
                  return item
                })}/>
            </div>
        </div>
    </div>
  );
}



  
export default ActicleList
