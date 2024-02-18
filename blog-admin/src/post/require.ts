"use client";

import axios, { AxiosRequestConfig } from "axios";
import { error, log } from "console";
import { getToken } from "../utils/auth";
import { config } from "process";
const request = axios.create({
  baseURL: "http://127.0.0.1:3001",
  timeout: 10000,
});
request.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    return config;
  },
  (error) => {
    console.log(error, "request_axios_err");
  }
);
request.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.log(error, "response_axios_err");
  }
);
export interface AxiosResponse<T = any> {
  // 后端接口数据
  data: T;
  // http状态码
  status: number;
  // 来自服务器响应的 HTTP 状态信息
  statusText: string;
  // 响应头
  headers: any;
  // 请求配置信息
  config: AxiosRequestConfig;
  // 请求
  request?: any;
}

type LoginType = ({
  name,
  password,
}: {
  name: string;
  password: string;
}) => Promise<
  AxiosResponse<{
    access_token: string;
  }>
>;
export const Login: LoginType = async ({ name, password }) => {
  const data = await request({
    url: "/user/login",
    method: "post",
    data: {
      name,
      password,
    },
  });

  return data;
};
export const getArticleList = async () => {
  const res = await request("article/list");

  return res;
};

export const getUploadToken = async () => {
  return await request({
    url: "/gallery",
  });
};
export const uploadUrl = async ({
  url,
  height,
  width,
}: {
  url: string;
  height: number;
  width: number;
}) => {
  return await request({
    url: "/gallery/upload",
    method: "post",
    data: {
      url,
      height,
      width,
    },
  });
};
export const getGalleryList = async () => {
  return await request("/gallery/list");
};

export const publishArticle = async (article: { title: string; content: string; PresenterId: string; category: string; description: string; }) => {
  const { title, content, PresenterId, category, description } = article;
  return await request("/article/create", {
    method: "post",
    data: {
      title,
      content,
      PresenterId,
      category,
      description,
    },
  });
};
