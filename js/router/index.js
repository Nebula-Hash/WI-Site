// === 路由模块 ===

// 初始化模块
import { initHome } from '../modules/home/home.js';
import { loadDetailData } from '../modules/details.js';
import { loadMoreData } from '../modules/more.js';


// HTML页面路由表
const routes = {
    "/home": "./pages/home.html",
    "/detail": "./pages/details.html",
    "/more": "./pages/more.html",
};

// 页面初始化函数表
const pageInits = {
    "/home": () => {
        initHome();
    },
    "/detail": params => {
        loadDetailData(params);
    },
    "/more": params => {
        loadMoreData(params);
    }
};

export default function startRouter() {
    // 防止 Hash 监听重复触发
    let isHashUpdating = false;

    //console.log("路由启动ing");

    async function loadPage(path, params = {}, addToHistory = true) {
        const container = document.getElementById("Dynamic_Content_Area");
        if (!container) return;

        container.innerHTML = `<div class="data__loading">正在加载中...</div>`;
        const url = routes[path] || routes["/home"];

        try {
            const response = await fetch(url);
            const html = await response.text();
            container.innerHTML = html;

            // 添加到历史记录
            if (addToHistory) {
                isHashUpdating = true; // 临时锁
                const query = new URLSearchParams(params).toString();
                location.hash = `${path}?${query}`;
                setTimeout(() => (isHashUpdating = false), 50); // 50ms 后解锁
            }

            const initFn = pageInits[path];
            if (initFn) initFn(params);

        } catch (e) {
            console.error("页面加载失败：", e);
        }
    }

    // 点击跳转（事件绑定）
    document.addEventListener("click", e => {
        const link = e.target.closest("[data-page]");
        if (!link) return;
        e.preventDefault();

        const page = link.dataset.page;
        const type = link.dataset.type;
        const id = link.dataset.id ? link.dataset.id : null;

        loadPage(page, { type, id });
    });

    // hash 变化监听
    window.addEventListener("hashchange", () => {
        if (isHashUpdating) return;
        const hash = location.hash.slice(1);
        const [pathPart, queryPart] = hash.split("?");
        const path = pathPart || "/home";
        const params = queryPart ? Object.fromEntries(new URLSearchParams(queryPart)) : {};
        loadPage(path, params, false);
    });

    // 初始化加载 (判断 DOM 是否已加载
    const init = () => {
        const hash = location.hash.slice(1);
        const [pathPart, queryPart] = hash.split("?");
        const path = pathPart || "/home";
        const params = queryPart ? Object.fromEntries(new URLSearchParams(queryPart)) : {};
        loadPage(path, params, false);
    };
    if (document.readyState === "loading") {
        // DOM 未加载完成时放进执行队列
        window.addEventListener("DOMContentLoaded", init);
    } else {
        init(); // DOM 已加载时主动执行
    }
}
