// === 分页配置 ===
const ITEMS_PER_PAGE = 15;

// === 加载“更多”页数据 ===
export async function loadMoreData({ type }) {
    const moreContainer = document.getElementById("more-content");
    const paginationContainer = document.getElementById("pagination");

    if (!type) {
        moreContainer.innerHTML = "<p>无效的请求参数</p>";
        return;
    }

    try {
        const url = `https://119.45.252.203/zzu/info/get/list.php?type=${type}`;
        const response = await fetch(url);
        const data = await response.json();

        // 调试
        console.log("请求的 URL：", url);
        console.log("更多页数据：", data);

        // 校验返回数据
        if (data.status !== 'success' || !Array.isArray(data.data)) {
            moreContainer.innerHTML = '<p>暂无数据可显示</p>';
            return;
        }

        const items = data.data;
        let currentPage = 1;
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

        // === 渲染当前页内容 ===
        const renderPage = (pageNum) => {
            const start = (pageNum - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentItems = items.slice(start, end);

            const itemsHTML = currentItems
                .map(item => `
                    <a href="#" class="more-item" data-page="/detail" data-type="${type}" data-id="${item.id}">
                        <div class="more-item-title">${item.title}</div>
                        <span class="more-arrow">➜</span>
                    </a>
                `)
                .join('');

            moreContainer.innerHTML = itemsHTML;
            renderPagination(pageNum);
        };

        // === 渲染分页导航 ===
        const renderPagination = (page) => {
            let html = `<span class="page-info">共${items.length}条</span>`;

            // 上一页按钮
            html += `<button class="page-btn" ${page === 1 ? "disabled" : ""
                } data-pageNum="${page - 1}">上页</button>`;

            // 页码按钮（最多显示5个）
            const visiblePages = 5;
            let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
            let endPage = Math.min(totalPages, startPage + visiblePages - 1);
            if (endPage - startPage < visiblePages - 1) {
                startPage = Math.max(1, endPage - visiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                html += `<button class="page-number ${i === page ? "active" : ""
                    }" data-pageNum="${i}">${i}</button>`;
            }

            // 下一页按钮
            html += `<button class="page-btn" ${page === totalPages ? "disabled" : ""
                } data-pageNum="${page + 1}">下页</button>`;

            paginationContainer.innerHTML = html;

            // 绑定点击事件
            paginationContainer.querySelectorAll("button").forEach((btn) => {
                if (!btn.disabled) {
                    btn.addEventListener("click", () => {
                        const targetPage = parseInt(btn.dataset.pageNum);
                        currentPage = targetPage;
                        renderPage(currentPage);
                    });
                }
            });
        };

        // 初次渲染第一页
        renderPage(currentPage);
    } catch (err) {
        console.error("加载失败:", err);
        moreContainer.innerHTML = `<p style="color:red;">加载数据失败，请稍后重试。</p>`;
    }
}
