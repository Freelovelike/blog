"use client";
import { Button, Modal, Upload, UploadFile } from "antd";
import { log } from "console";
import { useState } from "react";
import * as qiniu from "qiniu-js";
import { getUploadToken, uploadUrl } from "@/src/post/require";
import { createObjectURL } from "qiniu-js/esm/utils";
import { nanoid } from "nanoid";
export const UpLoadImg = ({imgList, setImgList}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [percent, setPercent] = useState(0);
  const handlePreview = async (file: UploadFile) => {};
  const handleChange = () => {};
  const customRequest = async ({ file }) => {
    const fileUrl = createObjectURL(file);
    const img = new Image();
    img.src = fileUrl;
    const token = await (await getUploadToken()).data;
    const name=nanoid()
    const observable = qiniu.upload(file, name, token);
    const observer = {
      async next({ total }) {


        setPercent(total.percent);
        if (total.percent == 100) {
          console.log("test");

          const res = await uploadUrl({
            url: "cdn.freelike.cn/" + name,
            height: img.height,
            width: img.width,
          });
          setImgList
          console.log({ res });
        }
      },
      error() {},
      complete() {},
    };
    const subscription = observable.subscribe(observer);

  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {};
  return (
    <>
      <Button onClick={showModal}>上传图片</Button>

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          customRequest={customRequest}
          defaultFileList={[]}
        >
          <Button />
        </Upload>
      </Modal>
    </>
  );
};
