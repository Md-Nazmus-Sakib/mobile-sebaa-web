const sliderSettings = {
  slidesToShow: 4,
  cssEase: "linear",
  arrows: true,
  dots: false,
  focusOnSelect: true,
  pauseOnHover: true,
  infinite: true,
  swipeToSlide: true,
  autoplay: true,
  speed: 2500,
  autoplaySpeed: 5000,
  rows: 2,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

export default sliderSettings;
