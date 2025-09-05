(function () {
  "use strict";

  // Animation state tracking
  const animationState = new Map();
  const pulseAnimations = {};
  const colorGreen = "#0b3d2a";
  const colorCreem = "#fbe9ba";

  let mapSliderSwiperInstance = null;

  document.addEventListener("DOMContentLoaded", () => {
    const mapSection = document.querySelector(".dreamlab-map-section");
    if (!mapSection) return;

    initializeControls(mapSection);
    initializePulseAnimations();
    initializeMapAreas();
    initializeSliderControls();
  });

  function initializeSliderControls() {
    const closeButton = document.querySelector("#btn-close-slider");
    const body = document.querySelector("body");
    if (!closeButton) return;

    closeButton.addEventListener("click", function (e) {
      animateSlider(false); // Close the slider
      body.style.paddingRight = "";
      body.style.overflowY = "auto";
    });
  }

  function initializeControls(mapSection) {
    const controlItems = mapSection.querySelectorAll(".nav-control-item");

    controlItems.forEach((item) => {
      // Setup initial states for indicators
      // setupControlIndicators(item);  // For now don't need because I have added animation with css

      item.addEventListener("click", () => {
        activateControlItem(item, controlItems);

        // Optional: Focus corresponding map area
        const areaId = item.getAttribute("data-area");
        focusMapArea(areaId);
      });
    });
  }

  function setupControlIndicators(controlItem) {
    const indicators = controlItem.querySelectorAll(".indecators span");

    if (indicators.length > 0) {
      gsap.set(indicators, {
        scaleX: 0,
        transformOrigin: "right center",
        opacity: 0.6,
      });

      // Animate active state if item has active class
      if (controlItem.classList.contains("active")) {
        animateControlIndicators(indicators, true);
      }
    }
  }

  function activateControlItem(activeItem, allItems) {
    // Remove active class and animate indicators out
    allItems.forEach((item) => {
      item.classList.remove("active");
      // const indicators = item.querySelectorAll(".indecators span");  // For now don't need to do this because I have added animation with css
      // animateControlIndicators(indicators, false);
    });

    // Add active class and animate indicators in
    activeItem.classList.add("active");
    // const activeIndicators = activeItem.querySelectorAll(".indecators span"); // For now don't need to do this because I have added animation with css
    // animateControlIndicators(activeIndicators, true);
  }

  function animateControlIndicators(indicators, isActive) {
    if (indicators.length === 0) return;

    if (isActive) {
      gsap.to(indicators, {
        // scaleX: 1,
        opacity: 1,
        duration: 0.8,
        // stagger: 0.1,
        ease: "power2.out",
        transformOrigin: "right center",
      });
    } else {
      gsap.to(indicators, {
        // scaleX: 0.5,
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }

  function activateNavControl(pathElement) {
    if (!pathElement || !pathElement.id) return;

    const areaId = pathElement.id;
    const controlItem = document.querySelector(`[data-area="${areaId}"]`);

    if (controlItem) {
      const allControlItems = document.querySelectorAll(".nav-control-item");
      activateControlItem(controlItem, allControlItems);
    }
  }

  function focusMapArea(areaId) {
    if (!areaId) return;

    // First, remove focus from all areas
    document.querySelectorAll(".zone-area").forEach((area) => {
      if (!area.querySelector(`#${areaId}`)) {
        area.dispatchEvent(new Event("mouseleave"));
      }
    });

    const targetArea = document.querySelector(`#${areaId}`);
    if (targetArea) {
      // Add visual focus effect to the selected area
      const areaGroup = targetArea.closest(".zone-area");
      if (areaGroup) {
        // Trigger hover effect programmatically
        areaGroup.dispatchEvent(new Event("mouseenter"));
      }
    }
  }

  function initializePulseAnimations() {
    // Create default pulsing animations with stagger
    gsap.utils.toArray(".indicator .circle-puls").forEach((circle, i) => {
      pulseAnimations[i] = gsap.to(circle, {
        scale: 2,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        transformOrigin: "center center",
        delay: i * 0.4,
        ease: "power2.out",
      });
    });
  }

  function initializeMapAreas() {
    document.querySelectorAll(".zone-area").forEach((area, index) => {
      const elements = getAreaElements(area);
      if (!elements) return;

      setupInitialStates(elements, index);
      attachEventListeners(area, elements, index);
      setupIndicatorClickHandler(area, index);
    });
  }

  function initializeAreasData() {
    return [
      {
        areaName: "Midwest",
        areaImage: "https://picsum.photos/id/1043/800/400",
        guideImage: "https://picsum.photos/id/1011/100/100",
        climateInfo: "Hot summers, cold winters",
        description: "The heartland of the United States.",
      },
      {
        areaName: "Canada West",
        areaImage: "https://picsum.photos/id/1015/800/400",
        guideImage: "https://picsum.photos/id/1005/100/100",
        climateInfo: "Cold winters, mild summers",
        description: "Explore the beauty of Western Canada.",
      },
      {
        areaName: "Canada East",
        areaImage: "https://picsum.photos/id/1021/800/400",
        guideImage: "https://picsum.photos/id/1001/100/100",
        climateInfo: "Humid summers, snowy winters",
        description: "Discover Eastern Canada's rich culture.",
      },
      {
        areaName: "US West",
        areaImage: "https://picsum.photos/id/1035/800/400",
        guideImage: "https://picsum.photos/id/1006/100/100",
        climateInfo: "Warm, dry climate",
        description: "From California beaches to Nevada deserts.",
      },
      {
        areaName: "US East",
        areaImage: "https://picsum.photos/id/1052/800/400",
        guideImage: "https://picsum.photos/id/1012/100/100",
        climateInfo: "Mild climate with four seasons",
        description: "Home to New York, Washington D.C., and Boston.",
      },
    ];
  }

  function animateSlider(shouldOpen = true) {
    const mapSection = document.querySelector(".dreamlab-map-section");
    const mapArea = mapSection.querySelector(".map-area");
    const sliderArea = mapSection.querySelector(".slider-area");
    const closeButton = document.querySelector("#btn-close-slider");

    if (!mapArea || !sliderArea) return;

    // Create timeline for synchronized animations
    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power3.inOut",
      },
    });

    if (shouldOpen) {
      // Open slider with parallax effect
      gsap.to(sliderArea, {
        x: "0%",
        duration: 1.5,
        ease: "power3.inOut",
      });
      tl.to(
        mapArea,
        {
          x: "-32%",
          duration: 1.9,
          ease: "power3.inOut",
        },
        "<+=0.15"
      ) // Start slightly after slider, creates parallax effect
        .to(
          closeButton,
          {
            y: "0",
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "<+=0.3"
        ); // Start after slider movement begins, with bouncy effect

      sliderArea.classList.add("active");
    } else {
      // Close slider with parallax effect
      tl.to(closeButton, {
        y: "-10rem",
        duration: 0.4,
        ease: "power2.in",
      })
        .to(
          sliderArea,
          {
            x: "100%",
            ease: "power3.inOut",
          },
          "<+=0.2"
        ) // Start after button starts moving
        .to(
          mapArea,
          {
            x: "0%",
            ease: "power3.inOut",
          },
          "<+=0.15"
        ); // Start slightly after slider, creates parallax effect

      sliderArea.classList.remove("active");
    }

    return tl;
  }

  function setupIndicatorClickHandler(area, index) {
    const indicator = area.querySelector(".indicator");
    if (!indicator) return;

    const elements = getAreaElements(area);

    indicator.addEventListener("click", function (e) {
      e.stopPropagation();
      
      handleMouseLeave(elements, index);

      const body = document.querySelector("body");
      const sliderArea = document.querySelector(".slider-area");
      const isOpen = sliderArea?.classList.contains("active");
      const scrollbarWidth = getScrollbarWidth();

      // Only initialize swiper if it's not already initialized
      if(!mapSliderSwiperInstance) {
        initializeSwiperSlider();
      }

      // Navigate to the corresponding slide before animating
      if (mapSliderSwiperInstance) {
        mapSliderSwiperInstance.slideToLoop(index); // index from zone-area loop
      }

      // Toggle the slider state and get the GSAP timeline
      const sliderTimeline = animateSlider(!isOpen);

      body.style.paddingRight = `${scrollbarWidth}px`;
      body.style.overflow = "hidden";

      // When animation is done, start autoplay
      if(!isOpen && mapSliderSwiperInstance) {
        sliderTimeline.eventCallback("onComplete", () => {
          mapSliderSwiperInstance.autoplay.start();
        })
      }

      // sliderTimeline.then(() => {
      //   // If a swiper instance already exists, kill it and reinitialize it.
      //   if (window.mySwiperInstance) {
      //     window.mySwiperInstance.destroy(true, true);
      //   }
      // });


    });
  }

  let mapSwiperInitialized = false;

  function initializeSwiperSlider() {

    if (mapSwiperInitialized) return;
    mapSwiperInitialized = true;

    mapSliderSwiperInstance = new Swiper(".swiper", {
      
      direction: "horizontal",
      loop: true,
      speed: 2000,
      mousewheel: true,
      simulateTouch: true,
      grabCursor: true,
      autoplay: {
        delay: 1800,
        disableOnInteraction: false,
      },
      watchSlidesProgress: true,
      effect: "creative",
      creativeEffect: {
        prev: {
          translate: ["-100%", 0, 0],
          opacity: 1,
        },
        next: {
          translate: ["100%", 0, 0],
          opacity: 1,
        },
      },
      on: {
        init: function () {
          // Stop autoplay on init
          this.autoplay.stop();

          const slides = this.slides;
          const activeIndex = this.activeIndex;
          const activeSlide = slides[activeIndex];

          const prevIndex = this.previousIndex;
          const prevSlide = slides[prevIndex];

          const sliderWrapper = document.getElementById("map-swiper-wrapper");
          sliderWrapper.style.setProperty("--total-slide", slides.length);

          slides.forEach((slide) => {
            const originalIndex = parseInt(slide.dataset.swiperSlideIndex, 10);
            slide.style.setProperty("--slide-index", originalIndex);

            setTotalSlideNumber(slides.length, slide);
          });

          setCurrentSlideNumber(this.realIndex, activeSlide);
          
          animateSlideElements(
            activeSlide,
            prevSlide,
            slides[activeIndex + 1],
            activeIndex,
            this.previousIndex
          );
        },

        slideChange: function () {
          const slides = this.slides;
          const activeIndex = this.activeIndex;
          const activeSlide = slides[activeIndex];

          setCurrentSlideNumber(this.realIndex, activeSlide);
        },

        slideChangeTransitionStart: function () {
          const slides = this.slides;
          const activeIndex = this.activeIndex;
          const prevIndex = this.previousIndex;
          const nextSlide = slides[activeIndex + 1];

          const activeSlide = slides[activeIndex];
          const prevSlide = slides[prevIndex];

          animateSlideElements(
            activeSlide,
            prevSlide,
            nextSlide,
            activeIndex,
            prevIndex
          );
        },
      },
    });

    return mapSliderSwiperInstance;
  }

  function getAreaElements(area) {
    const path = area.querySelector("path");
    const circlePuls = area.querySelector(".circle-puls");
    const baseCircle = area.querySelector(".circle");
    const plusIcon = area.querySelector(".plus-icon");
    const zoomableCircle = area.querySelector(".circle-zoom");
    const text = area.querySelector(".text");
    const lines = area.querySelectorAll("line");

    // Return null if essential elements are missing
    if (!path || !baseCircle || !zoomableCircle) {
      console.warn("Essential elements missing in zone-area", area);
      return null;
    }

    return {
      path,
      circlePuls,
      baseCircle,
      plusIcon,
      zoomableCircle,
      text,
      lines,
    };
  }

  function setupInitialStates(elements, index) {
    const { zoomableCircle, text, lines } = elements;

    // Set initial states
    gsap.set(zoomableCircle, {
      scale: 0,
      transformOrigin: "center center",
    });

    if (text) {
      gsap.set(text, {
        opacity: 0,
        rotation: 0,
      });
    }

    if (lines.length > 0) {
      gsap.set(lines, {
        strokeDashoffset: 12,
      });
    }

    // Initialize animation state
    animationState.set(index, {
      isHovered: false,
      activeAnimations: [],
    });
  }

  function attachEventListeners(area, elements, index) {
    let hoverTimeout;
    const { zoomableCircle, text } = elements;
    let isIndicatorHovered = false;

    // Main area hover events
    area.addEventListener("mouseenter", function (e) {
      // Clear any pending leave animations
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      // Prevent animation conflicts
      if (animationState.get(index)?.isHovered) return;

      // First, remove focus from all other areas
      document
        .querySelectorAll(".zone-area")
        .forEach((otherArea, otherIndex) => {
          if (otherIndex !== index) {
            otherArea.dispatchEvent(new Event("mouseleave"));
          }
        });

      // Activate corresponding nav control
      activateNavControl(elements.path);

      handleMouseEnter(elements, index);
    });

    area.addEventListener("mouseleave", function (e) {
      // Check if we're moving to the indicator
      const toElement = e.relatedTarget;
      if (
        toElement &&
        toElement.closest(".indicator") === area.querySelector(".indicator")
      ) {
        return;
      }

      // If indicator is hovered, don't trigger leave
      if (isIndicatorHovered) return;

      // Small delay to prevent flickering on quick mouse movements
      hoverTimeout = setTimeout(() => {
        handleMouseLeave(elements, index);
      }, 50);
    });

    // Additional hover events for indicator
    if (zoomableCircle) {
      zoomableCircle.addEventListener("mouseenter", function (e) {
        e.stopPropagation(); // Prevent event bubbling
        isIndicatorHovered = true;

        // Clear any pending leave animations
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }

        // Ensure the area is in hovered state when directly hovering the indicator
        if (!animationState.get(index)?.isHovered) {
          area.dispatchEvent(new Event("mouseenter"));
        }

        // Always scale up and change color when hovering indicator
        gsap.to(zoomableCircle, {
          scale: 2,
          duration: 0.4,
          ease: "power2.out",
          transformOrigin: "center center",
        });

        if (text) {
          text.style.fill = colorGreen; // Change to the dark green color
        }
      });

      zoomableCircle.addEventListener("mouseleave", function (e) {
        e.stopPropagation(); // Prevent event bubbling
        isIndicatorHovered = false;

        // Check if we're moving to another part of the same area
        const toElement = e.relatedTarget;
        if (toElement && toElement.closest(".zone-area") === area) {
          gsap.to(zoomableCircle, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            transformOrigin: "center center",
          });

          if (text) {
            text.style.fill = colorCreem; // Restore original color
          }
          return;
        }

        // If we're leaving the area completely
        handleMouseLeave(elements, index);
      });
    }
  }

  function handleMouseEnter(elements, index) {
    const state = animationState.get(index);
    state.isHovered = true;

    // Kill all existing animations for this area
    killAreaAnimations(elements, index);

    const { path, text, lines, plusIcon, baseCircle, zoomableCircle } =
      elements;

    // Apply fill effect with proper scaling
    if (path && path.id) {
      const bbox = path.getBBox();
      const patternId = `${path.id}-img`;
      const pattern = document.getElementById(patternId);
      const patternImg = document.getElementById(`${path.id}-clip-img`);
      const pathPoints = path.getAttribute("d");

      if (pattern) {
        // Calculate scale to fit the path's bounding box
        const scale = Math.max(bbox.width, bbox.height);
        const width = Math.floor(bbox.width) * 1.2;
        const height = Math.floor(bbox.height) * 1.25;
        // Set pattern transform to scale and position relative to the path
        pattern.setAttribute(
          "patternTransform",
          `translate(${bbox.x},${bbox.y}) scale(${scale})`
        );

        // patternImg.setAttribute(
        //   "transform",
        //   `translate(${bbox.x},${bbox.y})`
        // );

        // patternImg.setAttribute("width", `${width}`)
        // patternImg.setAttribute("height", `${height}`)

        path.setAttribute("fill", `url(#${patternId})`);
      }
    }

    // Create enter animations
    const enterAnimations = [];

    if (text) {
      enterAnimations.push(
        gsap.to(text, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        }),
        gsap.to(text, {
          rotation: "+=360",
          duration: 25,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        })
      );
    }

    if (lines.length > 0) {
      lines.forEach((line) => {
        enterAnimations.push(
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: "power3.out",
          })
        );
      });
    }

    if (plusIcon) {
      enterAnimations.push(
        gsap.to(plusIcon, {
          rotation: -90,
          duration: 0.5,
          ease: "power3.out",
          transformOrigin: "center center",
        })
      );
    }

    enterAnimations.push(
      gsap.to(baseCircle, {
        scale: 0,
        duration: 0.2,
        ease: "power2.out",
        transformOrigin: "center center",
      }),
      gsap.to(zoomableCircle, {
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
        transformOrigin: "center center",
      })
    );

    // Store animations for cleanup
    state.activeAnimations = enterAnimations;
  }

  function handleMouseLeave(elements, index) {
    const state = animationState.get(index);
    if (!state.isHovered) return;

    state.isHovered = false;

    // Kill all existing animations for this area
    killAreaAnimations(elements, index);

    const { path, text, lines, plusIcon, baseCircle, zoomableCircle } =
      elements;

    // Remove fill effect
    if (path) {
      path.setAttribute("fill", "#0b3d2a");
    }

    // Create leave animations
    const leaveAnimations = [];

    if (text) {
      text.style.fill = colorCreem; // Restore original color

      leaveAnimations.push(
        gsap.to(text, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        }),
        gsap.set(text, {
          rotation: 0,
          delay: 0.5,
        })
      );
    }

    if (lines.length > 0) {
      lines.forEach((line) => {
        leaveAnimations.push(
          gsap.to(line, {
            strokeDashoffset: 12,
            duration: 0.5,
            ease: "power2.out",
          })
        );
      });
    }

    if (plusIcon) {
      leaveAnimations.push(
        gsap.to(plusIcon, {
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
          transformOrigin: "center center",
        })
      );
    }

    leaveAnimations.push(
      gsap.to(zoomableCircle, {
        scale: 0,
        duration: 0.7,
        ease: "power2.out",
        transformOrigin: "center center",
      }),
      gsap.to(baseCircle, {
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
        transformOrigin: "center center",
        delay: 0.1,
      })
    );

    // Store animations for cleanup
    state.activeAnimations = leaveAnimations;
  }

  function killAreaAnimations(elements, index) {
    const state = animationState.get(index);

    // Kill stored animations
    if (state.activeAnimations) {
      state.activeAnimations.forEach((animation) => {
        if (animation && animation.kill) {
          animation.kill();
        }
      });
      state.activeAnimations = [];
    }

    // Kill any animations on specific elements
    const { text, lines, plusIcon, baseCircle, zoomableCircle } = elements;

    gsap.killTweensOf([text, plusIcon, baseCircle, zoomableCircle]);

    if (lines.length > 0) {
      gsap.killTweensOf(lines);
    }
  }

  // Utility function for color contrast (if needed)
  function getContrastColor(hex) {
    if (!hex || hex.length !== 7) return colorCreem;

    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? colorCreem : colorGreen;
  }

  // Get scrollbar width
  let _cachedScrollbarWidth = null;
  function getScrollbarWidth() {
    if (_cachedScrollbarWidth !== null) return _cachedScrollbarWidth;

    const div = document.createElement("div");
    Object.assign(div.style, {
      position: "absolute",
      top: "-9999px",
      width: "100px",
      height: "100px",
      overflow: "scroll",
    });
    document.body.appendChild(div);
    _cachedScrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    return _cachedScrollbarWidth;
  }

  // Cleanup function (call this if you need to destroy the map)
  function cleanup() {
    // Kill all pulse animations
    Object.values(pulseAnimations).forEach((animation) => {
      if (animation && animation.kill) {
        animation.kill();
      }
    });

    // Kill all area animations
    animationState.forEach((state, index) => {
      if (state.activeAnimations) {
        state.activeAnimations.forEach((animation) => {
          if (animation && animation.kill) {
            animation.kill();
          }
        });
      }
    });

    // Kill all control animations
    const allIndicators = document.querySelectorAll(".indecators span");
    gsap.killTweensOf(allIndicators);

    // Clear state
    animationState.clear();
  }

  function animateSlideElements(
    activeSlide,
    prevSlide,
    nextSlide,
    activeIndex,
    prevIndex
  ) {
    // if (!activeSlide) return;

    const activeBg = activeSlide.querySelector(".slide-bg");
    const activeRotatingText = activeSlide.querySelector("text.text");
    const activeContent = activeSlide.querySelector(".slide-content");

    const prevBg = prevSlide?.querySelector(".slide-bg");
    const prevContent = prevSlide?.querySelector(".slide-content");

    const nextBg = nextSlide?.querySelector(".slide-bg");
    const nextContent = nextSlide?.querySelector(".slide-content");

    if (activeSlide) {
      gsap.to(activeRotatingText, {
        rotation: "+=360",
        duration: 25,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
    }

    const direction = activeIndex > prevIndex ? "forward" : "backward";

    const tl = gsap.timeline({
      defaults: { duration: 1.3, ease: "power3.inOut" },
    });

    if (direction === "forward") {
      // Active slide enters from right (x: 24 → 0)
      tl.fromTo(activeBg, { x: -32 }, { x: -64, delay: 0.2 }, 0).fromTo(
        activeContent,
        { x: 24 },
        { x: -24, duration: 1.5, delay: 0.3 },
        0
      );

      tl.fromTo(
        nextBg,
        {
          x: -64,
        },
        {
          x: 0,
          duration: 0.3,
          delay: 0.6,
          ease: "power3.inOut",
        }
      ).fromTo(
        nextContent,
        {
          x: -48,
        },
        {
          x: 24,
          duration: 0.5,
          delay: 0.7,
        }
      );

      // Previous slide exits to left (x: 0 → -24)
      if (prevSlide) {
        tl.to(prevBg, { x: -64, duration: 0.8 }, 0).to(
          prevContent,
          { x: -96, duration: 1 },
          0
        );
      }
    } else if (direction === "backward") {
      // Active slide enters from left (x: -24 → 0)
      tl.fromTo(activeBg, { x: -64 }, { x: -32, delay: 0.2 }, 0).fromTo(
        activeContent,
        { x: -96 },
        { x: -24, duration: 1.5, delay: 0.3 },
        0
      );

      tl.fromTo(
        nextBg,
        {
          x: -64,
        },
        {
          x: 0,
          duration: 0.3,
          delay: 0.6,
          ease: "power3.inOut",
        }
      ).fromTo(
        nextContent,
        {
          x: -48,
        },
        {
          x: 24,
          duration: 0.5,
          delay: 0.7,
        }
      );

      // Previous slide exits to right (x: 0 → 24)
      if (prevSlide) {
        tl.to(prevBg, { x: 0, duration: 1.2 }, 0).to(
          prevContent,
          { x: 24, duration: 1.5 },
          0
        );
      }
    }

    return tl;
  }

  // Set current slide number with padding if it's below 10
  function setCurrentSlideNumber(indx, activeSlide) {
    const paddedIndex = indx + 1 < 10 ? `0${indx + 1}` : indx + 1;
    activeSlide.querySelector(".slider-counter .current").textContent =
      paddedIndex;
  }

  // Set total slide number with padding if it's below 10
  function setTotalSlideNumber(total, slide) {
    const paddedTotal = total < 10 ? `0${total}` : total;
    slide.querySelector(".slider-counter .total").textContent =
      paddedTotal;
  }

  // Public API
  window.InteractiveMap = {
    cleanup,
    activateNavControl,
    focusMapArea,
    getContrastColor,
  };
})();