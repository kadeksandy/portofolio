(function ($) {
    "use strict";

    $(function () {
        // =============================
        // BUBBLE BACKGROUND
        // =============================
        const bubbleContainer = document.querySelector(".bubble-bg");
        if (bubbleContainer && !bubbleContainer.children.length) {
            const colors = [
                "#182789", "#70a1ff", "#70ffbf", "#033eff",
                "#c070ff", "#6e6e6e", "#7655ef", "#74b9ff"
            ];

            for (let i = 0; i < 12; i++) {
                const ball = document.createElement("div");
                ball.className = "ball";
                const size = Math.floor(Math.random() * 70) + 40;

                ball.style.width = `${size}px`;
                ball.style.height = `${size}px`;
                ball.style.setProperty("--ball-color", colors[Math.floor(Math.random() * colors.length)]);
                ball.style.setProperty("--start-x", `${Math.random() * 100}vw`);
                ball.style.setProperty("--start-y", `${Math.random() * 100}vh`);
                ball.style.setProperty("--end-x", `${Math.random() * 100}vw`);
                ball.style.setProperty("--end-y", `${Math.random() * 100}vh`);
                ball.style.setProperty("--speed", `${Math.random() * 10 + 8}s`);

                bubbleContainer.appendChild(ball);
            }
        }

        if (typeof WOW === "function") new WOW().init();

        // =============================
        // NAVBAR — BECOMES FIXED AFTER ITS NATURAL POSITION
        // =============================
        const navbar = document.getElementById("navbar");
        let navbarSpacer = null;
        let navbarStart = 0;
        let navbarFlowParent = null;

        if (navbar) {
            navbarFlowParent = navbar.parentNode;
            navbarSpacer = document.createElement("div");
            navbarSpacer.className = "navbar-placeholder";
            navbarFlowParent.insertBefore(navbarSpacer, navbar);

            const returnNavbarToFlow = () => {
                if (navbar.parentNode !== navbarFlowParent) {
                    navbarFlowParent.insertBefore(navbar, navbarSpacer.nextSibling);
                }
                navbar.classList.remove("nav-fixed");
                navbarSpacer.classList.remove("is-active");
                navbarSpacer.style.height = "0px";
            };

            const dockNavbar = () => {
                if (navbar.parentNode !== document.body) {
                    document.body.appendChild(navbar);
                }
                navbar.classList.add("nav-fixed");
                navbarSpacer.classList.add("is-active");
                navbarSpacer.style.height = `${navbar.getBoundingClientRect().height}px`;
            };

            const calculateNavbarStart = () => {
                const wasDocked = navbar.parentNode === document.body;
                if (wasDocked) returnNavbarToFlow();

                navbarStart = navbar.getBoundingClientRect().top + window.scrollY;
                navbarSpacer.style.height = `${navbar.offsetHeight}px`;

                if (wasDocked || window.scrollY >= navbarStart - 1) {
                    dockNavbar();
                }
            };

            const updateNavbar = () => {
                if (window.scrollY >= navbarStart - 1) {
                    dockNavbar();
                } else {
                    returnNavbarToFlow();
                }
            };

            calculateNavbarStart();
            updateNavbar();

            $(window).on("scroll", updateNavbar);
            $(window).on("resize", calculateNavbarStart);
        }

        // =============================
        // NAVBAR ACTIVE STATE / SCROLL SPY
        // =============================
        // Keep the active navigation item synchronized with the section
        // currently occupying the viewport. This replaces the old
        // click-only behavior so the state also changes while scrolling.
        const updateActiveNav = () => {
            const navLinks = Array.from(document.querySelectorAll("#navbar .nav-link"));
            if (!navLinks.length) return;

            const sections = navLinks
                .map((link) => {
                    const href = link.getAttribute("href") || "";
                    if (!href.startsWith("#")) return null;

                    const id = href.slice(1);
                    const section = document.getElementById(id);
                    return section ? { link, section } : null;
                })
                .filter(Boolean);

            if (!sections.length) return;

            // For a page that is not the homepage, links such as
            // index.html#tentang do not become scroll-spy targets here.
            const currentPage = window.location.pathname.split("/").pop() || "index.html";
            if (currentPage !== "index.html") return;

            const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
            const marker = window.scrollY + navHeight + 90;

            let current = sections[0];

            sections.forEach((item) => {
                const top = item.section.getBoundingClientRect().top + window.scrollY;
                if (top <= marker) {
                    current = item;
                }
            });

            navLinks.forEach((link) => link.classList.remove("active"));
            current.link.classList.add("active");
        };

        let activeNavTicking = false;
        const requestActiveNavUpdate = () => {
            if (activeNavTicking) return;

            activeNavTicking = true;
            requestAnimationFrame(() => {
                updateActiveNav();
                activeNavTicking = false;
            });
        };

        $(window).on("scroll", requestActiveNavUpdate);
        $(window).on("resize", requestActiveNavUpdate);
        updateActiveNav();

        // =============================
        // SMOOTH NAVIGATION
        // =============================
        $(document).on("click", ".nav-link[href^='#'], .nav-link[href*='index.html#']", function (e) {
            const href = this.getAttribute("href");
            const hashIndex = href.indexOf("#");
            if (hashIndex === -1) return;

            const hash = href.slice(hashIndex);
            const target = document.querySelector(hash);
            if (!target) return;

            // On detail pages, normal navigation to index.html#... should continue.
            if (href.includes("index.html#") && !window.location.pathname.endsWith("index.html")) return;

            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight + 10 : 65;
            $("html, body").stop().animate({ scrollTop: $(target).offset().top - offset }, 700, "easeInOutExpo");
            $(".nav-link").removeClass("active");
            $(this).addClass("active");
            closeMobileMenu();
        });

        // =============================
        // BACK TO TOP
        // =============================
        $(window).on("scroll", function () {
            $(".back-to-top").toggle($(this).scrollTop() > 500);
        });

        $(document).on("click", ".back-to-top", function () {
            $("html, body").stop().animate({ scrollTop: 0 }, 700, "easeInOutExpo");
            return false;
        });

        // =============================
        // TYPED HEADLINE
        // =============================
        if ($(".typed-text-output").length && typeof Typed === "function") {
            const typedStrings = $(".typed-text").text().trim();
            new Typed(".typed-text-output", {
                strings: typedStrings.split(", "),
                typeSpeed: 70,
                backSpeed: 35,
                backDelay: 1300,
                smartBackspace: true,
                loop: true,
                showCursor: false
            });
        }

        // =============================
        // FOOTER REVEAL
        // =============================
        const pageWrapper = document.querySelector(".page-wrapper.wrapper, .wrapper.blog_area");
        if (pageWrapper) {
            const updateFooterReveal = () => {
                const doc = document.documentElement;
                const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 18;
                document.body.classList.toggle("tight", atBottom);
            };

            $(window).on("scroll resize", updateFooterReveal);
            updateFooterReveal();

            $(document).on("click", "body.tight .page-wrapper.wrapper, body.tight .wrapper.blog_area", function (e) {
                if ($(e.target).closest("a, button, input, textarea, select").length) return;
                $("html, body").stop().animate({
                    scrollTop: Math.max(0, document.documentElement.scrollHeight - window.innerHeight - 120)
                }, 500, "easeInOutExpo");
            });
        }

        // =============================
        // MOBILE / TABLET FLOATING MENU
        // =============================
        function closeMobileMenu() {
            const openNavbar = $(".navbar.menu-open");
            openNavbar.removeClass("menu-open");
            openNavbar.find(".nav-items").scrollTop(0);
            openNavbar.find(".nav-mobile-toggle").attr({
                "aria-expanded": "false",
                "aria-label": "Buka menu navigasi"
            });
            $("body").removeClass("nav-open");
        }

        $(document).on("click", ".nav-mobile-toggle", function () {
            const currentNavbar = $(this).closest(".navbar");
            const open = currentNavbar.toggleClass("menu-open").hasClass("menu-open");
            if (open) {
                const menu = currentNavbar.find(".nav-items");
                menu.scrollTop(0);
                requestAnimationFrame(() => menu.scrollTop(0));
            }

            $(this).attr({
                "aria-expanded": open ? "true" : "false",
                "aria-label": open ? "Tutup menu navigasi" : "Buka menu navigasi"
            });
            $("body").toggleClass("nav-open", open);
        });

        $(document).on("click", ".nav-menu-close, .nav-backdrop", closeMobileMenu);

        $(document).on("keydown", function (e) {
            if (e.key === "Escape") closeMobileMenu();
        });

        // =============================
        // CINEMATIC HERO PROJECT SHOWCASE
        // =============================
        const slides = document.querySelectorAll(".project-slide-v2");
        const counter = document.querySelector(".hero-project-meta .counter");

        if (slides.length > 1) {
            let current = 0;

            const show = (index) => {
                slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
                if (counter) {
                    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
                }
            };

            show(0);
            setInterval(() => {
                current = (current + 1) % slides.length;
                show(current);
            }, 5200);
        }
    });
})(jQuery);
