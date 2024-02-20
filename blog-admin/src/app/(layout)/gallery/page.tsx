"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Modal, Carousel, Image as AdtdImg } from "antd";
import { minIndex } from "@/src/utils/minIndex";
import styles from "./page.module.css";
import { UpLoadImg } from "./component/upload";
import { getGalleryList } from "@/src/post/require";

const Gallery = () => {
  const listhight = useRef([0, 0, 0, 0]);
  const [imgList, setImgList] = useState<Array<Array<any>>>([[], [], [], []]);
  useEffect(() => {
    const getGallery = async () => {
      const res = await getGalleryList();
      res.data.forEach((item: any, index: number) => {
        const height = item.height | 300;
        const width = item.width | 300;
        const min = minIndex(listhight.current);
        const bili = width / 300;
        imgList[min].push(
          <AdtdImg
            key={item.id}
            style={{ marginBottom: "30px" }}
            src={"http://" + item.url}
          />
        );

        listhight.current[minIndex(listhight.current)] += Math.ceil(
          height / bili
        );
      });
      setImgList([...imgList]);
    };
    getGallery();
  }, []);

  const res = imgList.map((item, index) => {
    console.log({ item });

    return <>{...item}</>;
  });

  return (
    <>
      <div className={styles.gallery_content}>
        <div className={styles.gallery_head}>
          <Row>
            <Col span={4}>
              <UpLoadImg imgList setImgList/>
            </Col>
            <Col>图库</Col>
            <Col>删除</Col>
          </Row>
        </div>
        <div className={styles.gallery_body}>
        <Row gutter={[16, 24]}>
          {...res.map((item, index) => {
            return <Col span={6} key={index}>{res[index]}</Col>;
          })}
        </Row>
        </div>
      </div>
    </>
  );
};

export default Gallery;
