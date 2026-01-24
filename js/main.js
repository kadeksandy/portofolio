(function ($) {
    "use strict";

    $(document).ready(function () {

        // =============================
        // BUBBLE / BALL ANIMATION
        // =============================
        const bubbleContainer = document.querySelector(".bubble-bg");
        if (bubbleContainer) {
            const colors = [
                "#182789ff", "#70a1ff", "#70ffbf", "#033effff",
                "#c070ff", "#6e6e6eff", "#7655efff", "#74b9ff"
            ];

            const ballCount = 12;

            for (let i = 0; i < ballCount; i++) {
                const ball = document.createElement("div");
                ball.classList.add("ball");

                const size = Math.floor(Math.random() * 70) + 40;
                ball.style.width = size + "px";
                ball.style.height = size + "px";

                ball.style.setProperty(
                    "--ball-color",
                    colors[Math.floor(Math.random() * colors.length)]
                );

                ball.style.setProperty("--start-x", Math.random() * 100 + "vw");
                ball.style.setProperty("--start-y", Math.random() * 100 + "vh");
                ball.style.setProperty("--end-x", Math.random() * 100 + "vw");
                ball.style.setProperty("--end-y", Math.random() * 100 + "vh");
                ball.style.setProperty("--speed", (Math.random() * 10 + 8) + "s");

                bubbleContainer.appendChild(ball);
            }
        }

        // =============================
        // WOW INIT
        // =============================
        if (typeof WOW === "function") {
            new WOW().init();
        }

        // =============================
        // SMOOTH SCROLL NAV
        // =============================
        $(".navbar-nav a").on("click", function (e) {
            if (this.hash !== "") {
                e.preventDefault();

                $("html, body").animate({
                    scrollTop: $(this.hash).offset().top - 45
                }, 1500, "easeInOutExpo");

                $(".navbar-nav .active").removeClass("active");
                $(this).addClass("active");
            }
        });

        // =============================
        // BACK TO TOP
        // =============================
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 300) {
                $(".back-to-top").fadeIn("slow");
            } else {
                $(".back-to-top").fadeOut("slow");
            }
        });

        $(".back-to-top").on("click", function () {
            $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
            return false;
        });

        // =============================
        // TYPED JS
        // =============================
        if ($(".typed-text-output").length) {
            const typedStrings = $(".typed-text").text();
            new Typed(".typed-text-output", {
                strings: typedStrings.split(", "),
                typeSpeed: 100,
                backSpeed: 20,
                smartBackspace: false,
                loop: true
            });
        }

        // =============================
        // SCROLL TIGHT MODE + ARROW
        // =============================
        $(window).on("scroll", function () {
            if ($(window).scrollTop() + $(window).height() > $(".wrapper").outerHeight()) {
                $("body").addClass("tight");
                $(".arrow").hide();
            } else {
                $("body").removeClass("tight");
                $(".arrow").show();
            }
        });

        // BACK TO PRESENTATION MODE
        $("html").on("click", "body.tight .wrapper", function () {
            $("html, body").animate({
                scrollTop: $(".wrapper").outerHeight() - $(window).height()
            }, 500);
        });

        // SCROLL TO BOTTOM
        $(".arrow").on("click", function () {
            $("html, body").animate({
                scrollTop: $(document).height()
            }, 1200);
        });

    });

})(jQuery);

