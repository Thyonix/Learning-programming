// ==UserScript==
// @name         CoverCopier
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  复制影片封面图片到剪贴板
// @description:en  Copy the movie cover image to the clipboard
// @icon64       https://s21.ax1x.com/2024/10/20/pAa1hOP.png
// @author       Maktub
// @license      MIT
// @tag          18+
// @tag          utilities
// @run-at       document-idle
// @match        https://jable.tv/videos/*
// @match        https://missav.com/*
// @match        https://njav.tv/zh/*/v/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @connect      self
// @connect      assets-cdn.jable.tv
// @connect      fivetiu.com
// @connect      cdn.avfever.net
// @updateURL    https://
// @downloadURL  https://
// ==/UserScript==

(function () {
    'use strict';

    // 引入Vue3
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = "https://cdn.jsdelivr.net/npm/vue@3.5.12/dist/vue.global.min.js";
    document.documentElement.appendChild(script);

    // 引入elementPlus样式
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.href = "https://unpkg.com/element-plus/dist/index.css";
    document.documentElement.appendChild(link);

    // 引入elementPlus组件
    let elscript = document.createElement('script');
    elscript.setAttribute('type', 'text/javascript');
    elscript.src = "https://unpkg.com/element-plus";
    document.documentElement.appendChild(elscript);

    window.onload = () => {
        var div = document.createElement('div')
        div.id = 'app'
        document.body.append(div)
        const App = {
            data() {
                return {
                    message: "Hello Element Plus",
                };
            },
        };
        const app = Vue.createApp(App);
        app.use(ElementPlus);
        app.mount("#app");
    }

    // 状态
    const status = {
        success: 'success',
        error: 'error'
    };

    //to miss
    const currentURL = window.location.pathname;
    const videoName = currentURL.split('/')[2];
    GM_registerMenuCommand('ToMiss',function(){
        window.open('https://missav.com/cn/search/' + videoName);
    },{
        id:'tomiss',
        accessKey: 'M',
        autoClose: true,
        title: '打开此影片的Miss搜索页'
    })

    // 按钮
    const button = document.createElement('button');
    button.innerHTML = 'Copy Cover';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.zIndex = '999999';
    button.style.padding = '10px';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 将按钮添加到页面中
    document.body.appendChild(button);

    const elemntStyle = GM_getResourceText('element.css');
    const style = document.createElement('style');
    style.textContent = elemntStyle;
    document.head.appendChild(style);

    // 按钮点击事件
    button.addEventListener('click', () => {
        // 查找页面中的 video 标签
        const correntURL = window.location.hostname;
        const domain = correntURL.split('.')[0];
        switch (domain) {
            case 'jable':
                requestSend(document.querySelector('div video').getAttribute('poster'));
                break;
            case 'missav':
                requestSend(document.querySelector('div.plyr__video-wrapper video').getAttribute('data-poster'));
                break;
            case 'njav':
                requestSend(document.querySelector('div[data-poster]').getAttribute('data-poster'));
        }
    });

    // 发送跨域请求
    function requestSend(imgURL) {
        if (imgURL === null) {
            notification('属性已更改，等待更新！')
            return;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: imgURL,
            responseType: 'blob', // 请求返回 Blob 数据
            onload: function (response) {
                if (response.status === 200) {
                    const blob = response.response;
                    const mimeType = blob.type; // 获取 Blob 的 MIME 类型
                    if (mimeType === 'image/jpeg') {
                        convertImageToPng(blob);  // 将 jpeg 转换为 png
                    } else {
                        copyImageToClipboard(blob, mimeType);  // 将其他类型的图片复制到剪贴板
                    }
                } else {
                    notification('无法获取图片资源!');
                }
            },
            onerror: function () {
                notification('请求图片发生错误，查看网络连接！')
            }
        });
    }

    // 将图片 Blob 复制到剪贴板的函数
    function copyImageToClipboard(blob, mimeType) {
        const item = new ClipboardItem({ [mimeType]: blob });
        navigator.clipboard.write([item]).then(function () {
            notification(status.success,'封面已复制到剪贴板!')
        }, function (err) {
            notification('复制封面时发生错误!')
        });
    }

    // 将 JPEG 转换为 PNG 后复制到剪贴板
    function convertImageToPng(blob) {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.src = url;

        img.onload = function () {
            // 创建 Canvas 元素
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            // 在 Canvas 上绘制图像
            ctx.drawImage(img, 0, 0);
            // 将 Canvas 转换为 PNG Blob
            canvas.toBlob(function (pngBlob) {
                copyImageToClipboard(pngBlob, 'image/png');  // 将 PNG 复制到剪贴板
            }, 'image/png');
            // 释放 Object URL
            URL.revokeObjectURL(url);
        };
    }

    // 通知函数
    function notification(info,message) {
        ElementPlus.ElNotification({
            title: 'CoverCopier通知:',
            message: message,
            type: info,
          });
    }

    // 添加自定义样式
    GM_addStyle(`
        button {
            background: #f56c6c
        }
        button:hover {
            background-color: #e74c3c;
        }
    `);
})();