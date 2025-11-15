// 轮播图初始化及逻辑设定
export function initBanner() {
    const banner = document.querySelector(".banner");
    if (!banner) return; // 若页面无 banner 区则直接退出

    const slides = document.querySelector(".banner__slides");
    const slideItems = document.querySelectorAll(".banner__slide:not(.clone)");
    const allSlideItems = document.querySelectorAll(".banner__slide");
    const dots = document.querySelectorAll(".banner__dots span");

    // 索引管理
    let currentIndex = 1;
    const total = slideItems.length;
    const totalWithClones = allSlideItems.length;

    // 状态控制
    let autoPlayInterval;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isTransitioning = false;

    // 更新圆点状态
    function updateBanner(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === (index - 1 + total) % total);
        });
    }

    // 自动轮播
    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(goToNextSlide, 4000);
    }
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // 下一张
    function goToNextSlide() {
        if (isTransitioning) return;
        stopAutoPlay();
        isTransitioning = true;

        currentIndex++;
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateBanner(currentIndex);

        if (currentIndex === totalWithClones - 1) {
            setTimeout(() => {
                currentIndex = 1;
                slides.style.transition = 'none';
                slides.style.transform = `translateX(-${currentIndex * 100}%)`;
                slides.offsetHeight; // 触发重绘
                slides.style.transition = 'transform 0.3s ease-out';
                isTransitioning = false;
                startAutoPlay();
            }, 300);
        } else {
            setTimeout(() => {
                isTransitioning = false;
                startAutoPlay();
            }, 300);
        }
        prevTranslate = -currentIndex * 100;
    }

    // 上一张
    function goToPrevSlide() {
        if (isTransitioning) return;
        stopAutoPlay();
        isTransitioning = true;

        currentIndex--;
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateBanner(currentIndex);

        if (currentIndex === 0) {
            setTimeout(() => {
                currentIndex = totalWithClones - 2;
                slides.style.transition = 'none';
                slides.style.transform = `translateX(-${currentIndex * 100}%)`;
                slides.offsetHeight;
                slides.style.transition = 'transform 0.3s ease-out';
                isTransitioning = false;
                startAutoPlay();
            }, 300);
        } else {
            setTimeout(() => {
                isTransitioning = false;
                startAutoPlay();
            }, 300);
        }
        prevTranslate = -currentIndex * 100;
    }

    // 拖拽操作
    const getPositionX = (e) => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

    const dragStart = (e) => {
        if (isDragging || isTransitioning) return;
        stopAutoPlay();
        isDragging = true;
        startPos = getPositionX(e);
        prevTranslate = -currentIndex * 100;
        currentTranslate = prevTranslate;
    };

    const drag = (e) => {
        if (!isDragging) return;
        const currentPosition = getPositionX(e);
        const dragDistance = currentPosition - startPos;
        currentTranslate = prevTranslate + (dragDistance * 100) / slides.offsetWidth;
        slides.style.transform = `translateX(${currentTranslate}%)`;
    };

    const dragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -20) goToNextSlide();
        else if (movedBy > 20) goToPrevSlide();
        else {
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            startAutoPlay();
        }
    };

    // 点击圆点
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            if (isTransitioning) return;
            stopAutoPlay();
            currentIndex = i + 1;
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateBanner(currentIndex);
            prevTranslate = -currentIndex * 100;
            startAutoPlay();
        });
    });

    // 事件绑定
    slides.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragEnd);

    slides.addEventListener('touchstart', dragStart);
    window.addEventListener('touchmove', drag);
    window.addEventListener('touchend', dragEnd);

    slides.addEventListener('dragstart', (e) => e.preventDefault());

    // 初始化状态
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateBanner(currentIndex);
    startAutoPlay();
}
