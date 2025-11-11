// === 程序入口 ===

(async () => {
    // console.log("初始化启动ing");

    // === 全局样式 ===
    const styles = [
        "/css/basicCSS/reset.css",       // 重置样式
        "/css/basicCSS/style.css",       // 通用样式
        "/css/basicCSS/header.css",      // 页头样式
        "/css/basicCSS/footer.css",      // 页脚样式
        "/css/basicCSS/responsive.css",  // 响应式
    ];

    // === 动态加载 CSS ===
    async function loadStyle(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            link.onload = resolve;
            link.onerror = () => reject(new Error(`样式加载失败：${href}`));
            document.head.appendChild(link);
        });
    }

    // === 加载提示 ===
    const loading = document.createElement("div");
    loading.id = "global-loading";
    loading.textContent = "资源加载中...";
    loading.style.cssText = `
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        color: #888;
        background: rgba(255,255,255,0.85);
        z-index: 9999;
    `;
    document.body.appendChild(loading);

    try {
        // === 先加载 CSS 样式 ===
        for (const style of styles) {
            await loadStyle(style);
            // console.log(`已加载样式：${style}`);
        }

        // === 懒加载路由模块 ===
        const { default: startRouter } = await import("./js/router/index.js");
        // console.log("路由模块加载完成");

        // === 初始化路由逻辑 ===
        startRouter();

        // console.log("页面初始化完成！");
    } catch (err) {
        console.error("初始化失败：", err);
        document.body.innerHTML = `
            <div style="padding:2rem;text-align:center;color:#c00;">
                <h2>加载失败</h2>
                <p>${err.message}</p>
            </div>
        `;
    } finally {
        // === 移除加载提示 ===
        loading.remove();
    }
})();
