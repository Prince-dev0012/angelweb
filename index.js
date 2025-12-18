(function () {
  "use strict";

  const App = {
    init() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.onReady());
      } else {
        this.onReady();
      }
    },

    onReady() {
      this.cache();
      this.bind();
      this.a11y();
    },

    cache() {
      this.nav = document.querySelector("nav");
      this.mobileToggle = document.querySelector('button[aria-controls]');
      this.courseTrigger = document.querySelector(".static-course-trigger");
      this.courseList = document.querySelector("[data-static-course-list]");
      this.anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
    },

    bind() {
      if (this.mobileToggle && this.nav) {
        if (!this.mobileToggle.hasAttribute("aria-expanded")) {
          this.mobileToggle.setAttribute("aria-expanded", "false");
        }

        this.mobileToggle.addEventListener("click", (ev) => {
          ev.preventDefault();
          const isExpanded = this.mobileToggle.getAttribute("aria-expanded") === "true";
          this.mobileToggle.setAttribute("aria-expanded", String(!isExpanded));
          this.nav.classList.toggle("mobile-open", !isExpanded);
        });
      }

      if (this.courseTrigger && this.courseList) {
        const triggerBtn = this.courseTrigger.querySelector("button") || this.courseTrigger;

        this.courseList.setAttribute("aria-hidden", "true");
        if (!triggerBtn.hasAttribute("aria-expanded")) {
          triggerBtn.setAttribute("aria-expanded", "false");
        }

        triggerBtn.addEventListener("click", (ev) => {
          ev.preventDefault();
          const open = this.courseList.classList.toggle("is-open");
          this.courseList.setAttribute("aria-hidden", String(!open));
          triggerBtn.setAttribute("aria-expanded", String(open));
        });

        document.addEventListener("click", (ev) => {
          if (!this.courseTrigger.contains(ev.target) && !this.courseList.contains(ev.target)) {
            if (this.courseList.classList.contains("is-open")) {
              this.courseList.classList.remove("is-open");
              this.courseList.setAttribute("aria-hidden", "true");
              triggerBtn.setAttribute("aria-expanded", "false");
            }
          }
        });

        document.addEventListener("keydown", (ev) => {
          if (ev.key === "Escape" && this.courseList.classList.contains("is-open")) {
            this.courseList.classList.remove("is-open");
            this.courseList.setAttribute("aria-hidden", "true");
            triggerBtn.setAttribute("aria-expanded", "false");
          }
        });
      }

      if (this.anchorLinks.length) {
        this.anchorLinks.forEach((a) => {
          const href = a.getAttribute("href");
          if (!href) return;
          const id = href.startsWith("#") ? href.slice(1) : null;
          if (!id) return;
          const target = document.getElementById(id);
          if (!target) return;

          a.addEventListener("click", (ev) => {
            if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
            ev.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            if (history.pushState) history.pushState(null, "", "#" + id);
          });
        });
      }

      document.addEventListener("click", (ev) => {
        const t = ev.target.closest(".js-expand-toggle");
        if (!t) return;
        ev.preventDefault();
        const sel = t.getAttribute("data-target");
        if (!sel) return;
        const content = document.querySelector(sel);
        if (!content) return;
        const expanded = content.classList.toggle("expanded");
        t.setAttribute("aria-expanded", String(expanded));
        content.setAttribute("aria-hidden", String(!expanded));
      });
    },

    a11y() {
      const skip = document.querySelector('a[href="#main"], a[href="#content"], a.skip-link');
      if (skip) {
        skip.addEventListener("click", () => {
          const id = skip.getAttribute("href").replace("#", "");
          const target = document.getElementById(id);
          if (target) {
            target.tabIndex = -1;
            target.focus({ preventScroll: true });
          }
        });
      }

      document.body.classList.add("js-enabled");
    }
  };

  App.init();
})();
