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

        const navLinks = Array.from(
            document.querySelectorAll("#navbar .nav-link")
        );

        const normalizePath = (path) => {
            if (path === "/") return "/";
            return path.replace(/\/+$/, "");
        };

        const currentPath = normalizePath(
            window.location.pathname
        );

        const homePaths = ["/", "/index.html"];

        const isHomePage = homePaths.includes(currentPath);

        const isKaryaPage =
            currentPath === "/karya.html";

        const updateActiveNav = () => {
            if (!navLinks.length) return;

            // Reset active state
            navLinks.forEach((link) => {
                link.classList.remove("active");
            });

            // =============================
            // HALAMAN KARYA
            // =============================
            // Karya tetap active selama berada di karya.html.

            if (isKaryaPage) {
                const karyaLink = navLinks.find((link) => {
                    const url = new URL(
                        link.getAttribute("href"),
                        window.location.origin
                    );

                    return normalizePath(url.pathname) ===
                        "/karya.html";
                });

                if (karyaLink) {
                    karyaLink.classList.add("active");
                }

                return;
            }

            // =============================
            // HOMEPAGE
            // =============================

            if (!isHomePage) return;

            const sections = navLinks
                .map((link) => {
                    const url = new URL(
                        link.getAttribute("href"),
                        window.location.origin
                    );

                    // Hanya link menuju section homepage.
                    if (!homePaths.includes(
                        normalizePath(url.pathname)
                    )) {
                        return null;
                    }

                    // Beranda menggunakan "/" tanpa hash.
                    if (!url.hash) {
                        return {
                            link,
                            section: document.getElementById("home"),
                            isHome: true
                        };
                    }

                    const id = decodeURIComponent(
                        url.hash.slice(1)
                    );

                    const section =
                        document.getElementById(id);

                    return section
                        ? { link, section, isHome: false }
                        : null;
                })
                .filter((item) => item && item.section);

            if (!sections.length) return;

            const navHeight = document
                .getElementById("navbar")
                ?.getBoundingClientRect().height || 0;

            const marker =
                window.scrollY + navHeight + 90;

            let current = sections[0];

            sections.forEach((item) => {
                const top =
                    item.section.getBoundingClientRect().top +
                    window.scrollY;

                if (top <= marker) {
                    current = item;
                }
            });

            // Section terakhir aktif saat mencapai dasar halaman.
            const pageBottom =
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight - 5;

            if (pageBottom) {
                current = sections[sections.length - 1];
            }

            current.link.classList.add("active");
        };

        // =============================
        // PERFORMANCE: REQUEST ANIMATION FRAME
        // =============================

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

        window.addEventListener(
            "hashchange",
            requestActiveNavUpdate
        );

        window.addEventListener(
            "pageshow",
            requestActiveNavUpdate
        );

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
