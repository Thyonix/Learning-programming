// ==UserScript==
// @name         TestScript
// @namespace    URL
// @version      0.1
// @description  A brief summary to describe the script
// @author       Your name
// @grant        GM_addStyle
// @grant        GM_addElement
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
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
        let text = `<div id="app" style="position: absolute;top: 50vh;left: 50vw;background: #fb7d7d;width: 100px;height: 100px;">
                   <el-button>{{ message }}</el-button>
            </div>`

        var el = document.createElement('div')
        el.innerHTML = text;
        document.body.append(el)
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
})();