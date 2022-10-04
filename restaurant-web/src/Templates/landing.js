import React, { useEffect } from "react";
import '../assets/animate/animate.min.css'
import '../assets/boxicons/css/boxicons.min.css'
import '../assets/glightbox/css/glightbox.min.css'
import '../styles/landing.css'
import { DishListView } from '../dishes'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import GLightbox from 'glightbox';
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper"
export function LandingPage() {
    useEffect(() => {
         /**
         * Easy selector helper function
         */
        const select = (el, all = false) => {
            el = el.trim()
            if (all) {
                return [...document.querySelectorAll(el)]
            } else {
                return document.querySelector(el)
            }
        }

        /**
         * Easy event listener function
         */
        const on = (type, el, listener, all = false) => {
            let selectEl = select(el, all)
            if (selectEl) {
                if (all) {
                    selectEl.forEach(e => e.addEventListener(type, listener))
                } else {
                    selectEl.addEventListener(type, listener)
                }
            }
        }

        /**
         * Easy on scroll event listener 
         */
        const onscroll = (el, listener) => {
            el.addEventListener('scroll', listener)
        }

        /**
         * Navbar links active state on scroll
         */
        let navbarlinks = select('#navbar .scrollto', true)
        const navbarlinksActive = () => {
            let position = window.scrollY + 200
            navbarlinks.forEach(navbarlink => {
                if (!navbarlink.hash) return
                let section = select(navbarlink.hash)
                if (!section) return
                if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                    navbarlink.classList.add('active')
                } else {
                    navbarlink.classList.remove('active')
                }
            })
        }
        window.addEventListener('load', navbarlinksActive)
        onscroll(document, navbarlinksActive)

        /**
         * Scrolls to an element with header offset
         */
        const scrollto = (el) => {
            let header = select('#header')
            let offset = header.offsetHeight

            let elementPos = select(el).offsetTop
            window.scrollTo({
                top: elementPos - offset,
                behavior: 'smooth'
            })
        }

        /**
         * Toggle .header-scrolled class to #header when page is scrolled
         */
        let selectHeader = select('#header')
        let selectTopbar = select('#topbar')
        if (selectHeader) {
            const headerScrolled = () => {
                if (window.scrollY > 100) {
                    selectHeader.classList.add('header-scrolled')
                    if (selectTopbar) {
                        selectTopbar.classList.add('topbar-scrolled')
                    }
                } else {
                    selectHeader.classList.remove('header-scrolled')
                    if (selectTopbar) {
                        selectTopbar.classList.remove('topbar-scrolled')
                    }
                }
            }
            window.addEventListener('load', headerScrolled)
            onscroll(document, headerScrolled)
        }
        /**
        * Back to top button
        **/
        let backtotop = select('.back-to-top')
        if (backtotop) {
            const toggleBacktotop = () => {
                if (window.scrollY > 100) {
                    backtotop.classList.add('active')
                } else {
                    backtotop.classList.remove('active')
                }
            }
            window.addEventListener('load', toggleBacktotop)
            onscroll(document, toggleBacktotop)
        }
        /**
        * Scrool with ofset on links with a class name .scrollto
        **/
        on('click', '.scrollto', function (e) {
            if (select(this.hash)){
                e.preventDefault()
                let navbar = select('#navbar')
                if (navbar.classList.contains('navbar-mobile')) {
                    navbar.classList.remove('navbar-mobile')
                    let navbarToggle = select('.mobile-nav-toggle')
                    navbarToggle.classList.toggle('bi-list')
                    navbarToggle.classList.toggle('bi-x')
                }
                scrollto(this.hash)
            }
        }, true)

        /**
         * Scroll with ofset on page load with hash links in the url
         */
        window.addEventListener('load', () => {
            if (window.location.hash) {
                if (select(window.location.hash)) {
                    scrollto(window.location.hash)
                }
            }
        });
        /**
         * Mobile nav toggle
         */
         on('click', '.mobile-nav-toggle', function (e) {
            select('#navbar').classList.toggle('navbar-mobile')
            this.classList.toggle('bi-list')
            this.classList.toggle('bi-x')
        })

        /**
         * Mobile nav dropdowns activate
         */
        on('click', '.navbar .dropdown > a', function (e) {
            if (select('#navbar').classList.contains('navbar-mobile')) {
                e.preventDefault()
                this.nextElementSibling.classList.toggle('dropdown-active')
            }
        }, true)
    })
    return (
        <div>
            <section id="topbar" className="d-flex align-items-center fixed-top topbar-transparent">
                <div className="container-fluid container-xl d-flex align-items-center justify-content-center justify-content-lg-start">
                    <i className="bi bi-phone d-flex align-items-center"><span>+1 5589 55488 55</span></i>
                    <i className="bi bi-clock ms-4 d-none d-lg-flex align-items-center"><span>Mon-Sun: 5:30 PM - 10:00 PM</span></i>
                </div>
            </section>
            <header id="header" className="fixed-top d-flex align-items-center ">
                <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
                    <div className="logo me-auto">
                        <h1><a href="#hero">Restaurant</a></h1>
                        {/* If I want to use a image logo instead then I can use the bottom part --> */}
                        {/* <!-- <a href="index.html"><img src="landing/logo.png'%}" alt="" className="img-fluid"></a>--> */}
                    </div>
                    <nav id="navbar" className="navbar order-last order-lg-0">
                        <ul>
                            <li><a className="nav-link scrollto active" href="#hero">Home</a></li>
                            <li><a className="nav-link scrollto" href="#menu">Menu</a></li>
                            <li><a className="nav-link scrollto" href="#events">Events</a></li>
                            <li><a className="nav-link scrollto" href="#gallery">Gallery</a></li>
                            <li><a className="nav-link scrollto" href="#contact">Contact</a></li>
                        </ul>
                        <i className="bi bi-list mobile-nav-toggle"></i>
                    </nav>
                    <Link className="login-btn" to='login'>Log In</Link>
                    {/*<a className="login-btn" href="login" role="button">Log in</a>*/}
                </div>
            </header>
            {/* <!-- End Header --> */}
            {/* <!-- Main Slide Section --> */}
            <section id="hero">
                <Swiper
                    centeredSlides={true}
                    loop={true}
                    spaceBetween={30}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    effect={"fade"}
                    speed={2000}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className="carousel-item active" style={{ background: `url(static/landing/slide/view1.jpeg)` }}>
                            <div className="carousel-container">
                                <div className="carousel-content">
                                    <h2 className="animate__animated animate__fadeInDown"><span>Restaurant</span></h2>
                                    <p className="animate__animated animate__fadeInUp">Ut velit est quam dolor ad a aliquid qui aliquid. Sequi
                                        ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias dolorem mollitia ut. Similique ea
                                        voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore modi architecto.</p>
                                    <div>
                                        <a href="#menu" className="btn-menu animate__animated animate__fadeInUp scrollto">Our Menu</a>
                                        <a href="#book-a-table" className="btn-book animate__animated animate__fadeInUp scrollto">Book a Table</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="carousel-item active" style={{ background: `url(static/landing/slide/view2.jpeg)` }}>
                            <div className="carousel-container">
                                <div className="carousel-content">
                                    <h2 className="animate__animated animate__fadeInDown">Lorem Ipsum Dolor</h2>
                                    <p className="animate__animated animate__fadeInUp">Ut velit est quam dolor ad a aliquid qui aliquid. Sequi
                                        ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias dolorem mollitia ut. Similique ea
                                        voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore modi architecto.</p>
                                    <div>
                                        <a href="#menu" className="btn-menu animate__animated animate__fadeInUp scrollto">Our Menu</a>
                                        <a href="#book-a-table" className="btn-book animate__animated animate__fadeInUp scrollto">Book a Table</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="carousel-item active" style={{ background: `url(static/landing/slide/view3.jpeg)` }}>
                            <div className="carousel-background"><img src="static/landing/slide/view3.jpeg" alt="" /></div>
                            <div className="carousel-container">
                                <div className="carousel-content">
                                    <h2 className="animate__animated animate__fadeInDown">Sequi ea ut et est quaerat</h2>
                                    <p className="animate__animated animate__fadeInUp">Ut velit est quam dolor ad a aliquid qui aliquid. Sequi
                                        ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias dolorem mollitia ut. Similique ea
                                        voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore modi architecto.</p>
                                    <div>
                                        <a href="#menu" className="btn-menu animate__animated animate__fadeInUp scrollto">Our Menu</a>
                                        <a href="#book-a-table" className="btn-book animate__animated animate__fadeInUp scrollto">Book a Table</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </section>

            <main id="main">

                {/* <!-- ======= Why our system MAKE GRADIENRT COLOR ======= --> */}
                <section id="why-us" className="why-us">
                    <div className="container">

                        <div className="section-title">
                            <h2><span>Our Restaurant</span></h2>
                            <p>Features why you can confidently choose us can be summarized in the following:</p>
                        </div>

                        <div className="row row-landing">

                            <div className="col-lg-4">
                                <div className="box">
                                    <span>01</span>
                                    <h4>Amazing Views</h4>
                                    <p>Our restaurant posseses natural and carefully worked areas to give you the best views and relaxing feel.  </p>
                                </div>
                            </div>

                            <div className="col-lg-4 mt-4 mt-lg-0">
                                <div className="box">
                                    <span>02</span>
                                    <h4>Excellent Service</h4>
                                    <p>Our staff has years of experience and training to provide the best service possible where you can feel comfortable
                                        and welcomed.</p>
                                </div>
                            </div>

                            <div className="col-lg-4 mt-4 mt-lg-0">
                                <div className="box">
                                    <span>03</span>
                                    <h4>Outstanding food and drinks</h4>
                                    <p>With our excellent chefs and kitchen staff the result is food that is extraordinary. We go beyong with our fantastic deserts and menu options which you can find
                                        below our most popular options.</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>
                {/* <!-- End Why Section --> */}

                {/* <!--MENU SECTION--> */}
                <DishListView />
                {/* <!-- End Menu Section --> */}

                {/* <!-- ======= Events Section ======= --> */}
                <section id="events" className="events" style={{ backgroundImage: `url(static/landing/events/events-b.jpeg)` }}>
                    <div className="container">

                        <div className="section-title">
                            <h2>Organize Your <span>Events</span> in our Restaurant</h2>
                        </div>

                        <div className=" swiper-container">
                            <div className="">
                                <Swiper
                                    centeredSlides={true}
                                    loop={true}
                                    spaceBetween={30}
                                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                                    pagination={{ clickable: true }}
                                    navigation={true}
                                    modules={[Navigation, Pagination, Autoplay]}
                                    speed={2000}
                                    className="mySwiper"
                                >
                                    <SwiperSlide>
                                        <div className="swiper-slide">
                                            <div className="row event-item row-landing">
                                                <div className="col-lg-6">
                                                    <img src="static/landing/events/events-3.jpeg" className="img-fluid" alt="" />
                                                </div>
                                                <div className="col-lg-6 pt-4 pt-lg-0 content">
                                                    <h3>Birthday Parties</h3>
                                                    <div className="price">
                                                        <p><span>$189</span></p>
                                                    </div>
                                                    <p className="fst-italic">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                                        et dolore
                                                        magna aliqua.
                                                    </p>
                                                    <ul>
                                                        <li><i className="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                                        <li><i className="bi bi-check-circle"></i> Duis aute irure dolor in reprehenderit in voluptate velit.
                                                        </li>
                                                        <li><i className="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                                    </ul>
                                                    <p>
                                                        Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                                                        voluptate
                                                        velit esse cillum dolore eu fugiat nulla pariatur
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="swiper-slide">
                                            <div className="row event-item row-landing">
                                                <div className="col-lg-6">
                                                    <img src="static/landing/events/events-2.jpeg" className="img-fluid" alt="" />
                                                </div>
                                                <div className="col-lg-6 pt-4 pt-lg-0 content">
                                                    <h3>Private Parties</h3>
                                                    <div className="price">
                                                        <p><span>$290</span></p>
                                                    </div>
                                                    <p className="fst-italic">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                                        et dolore
                                                        magna aliqua.
                                                    </p>
                                                    <ul>
                                                        <li><i className="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                                        <li><i className="bi bi-check-circle"></i> Duis aute irure dolor in reprehenderit in voluptate velit.
                                                        </li>
                                                        <li><i className="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                                    </ul>
                                                    <p>
                                                        Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                                                        voluptate
                                                        velit esse cillum dolore eu fugiat nulla pariatur
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="swiper-slide">
                                            <div className="row event-item row-landing">
                                                <div className="col-lg-6">
                                                    <img src="static/landing/events/events-1.jpeg" className="img-fluid" alt="" />
                                                </div>
                                                <div className="col-lg-6 pt-4 pt-lg-0 content">
                                                    <h3>Custom Parties</h3>
                                                    <div className="price">
                                                        <p><span>$99</span></p>
                                                    </div>
                                                    <p className="fst-italic">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                                        et dolore
                                                        magna aliqua.
                                                    </p>
                                                    <ul>
                                                        <li><i className="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                                        <li><i className="bi bi-check-circle"></i> Duis aute irure dolor in reprehenderit in voluptate velit.
                                                        </li>
                                                        <li><i className="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                                    </ul>
                                                    <p>
                                                        Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                                                        voluptate
                                                        velit esse cillum dolore eu fugiat nulla pariatur
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>

                                </Swiper>
                            </div>
                            <div className="swiper-pagination"></div>
                        </div>

                    </div>
                </section>
                {/* <!-- END EVENTS SECTION--> */}



                {/* <!-- GALLERY SECTION --> */}
                <section id="gallery" className="gallery">
                    <div className="container-fluid">

                        <div className="section-title">
                            <h2><span>Gallery</span></h2>
                            <p>Ut possimus qui ut temporibus culpa velit eveniet modi omnis est adipisci expedita at voluptas atque vitae
                                autem.</p>
                        </div>

                        <div className="row no-gutters row-landing">

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="static/landing/gallery/gallery-1.jpeg" className="gallery-lightbox">
                                        <img src="static/landing/gallery/gallery-1.jpeg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="static/landing/gallery/gallery-2.jpeg" className="gallery-lightbox">
                                        <img src="static/landing/gallery/gallery-2.jpeg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="static/landing/gallery/gallery-3.jpeg" className="gallery-lightbox">
                                        <img src="static/landing/gallery/gallery-3.jpeg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="static/landing/gallery/gallery-4.jpeg" className="gallery-lightbox">
                                        <img src="static/landing/gallery/gallery-4.jpeg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="static/landing/gallery/gallery-5.jpeg" className="gallery-lightbox">
                                        <img src="static/landing/gallery/gallery-5.jpeg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="static/landing/gallery/gallery-6.jpeg" className="gallery-lightbox">
                                        <img src="static/landing/gallery/gallery-6.jpeg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="static/landing/gallery/gallery-7.jpeg" className="gallery-lightbox">
                                        <img src="static/landing/gallery/gallery-7.jpeg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="static/landing/gallery/gallery-8.jpeg" className="gallery-lightbox">
                                        <img src="static/landing/gallery/gallery-8.jpeg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>
                {/* <!-- END GALLERY--> */}

                {/* <!-- STAFF AND CHEF SECTION--> */}
                <section id="management" className="management" style={{ backgroundImage: `url(static/landing/chefs/kitchen-1.jpeg)` }}>
                    <div className="container">

                        <div className="section-title">
                            <h2><span>Kitchen Staff</span></h2>
                            <p>Meet the people behind every amazing dish and desert that is served to our dear customers. Years of experience and dedication
                                has resulted in a world class staff.</p>
                        </div>

                        <div className="row row-landing">

                            <div className="col-lg-4 col-md-6">
                                <div className="member">
                                    <div className="pic"><img src="static/landing/chefs/chef-1.jpeg" className="img-fluid" alt="" /></div>
                                    <div className="member-info">
                                        <h4>Michael Goodman</h4>
                                        <span>Master Chef</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="member">
                                    <div className="pic"><img src="static/landing/chefs/chef-3.jpeg" className="img-fluid" alt="" /></div>
                                    <div className="member-info">
                                        <h4>Federick Miller</h4>
                                        <span>Chef Assistant</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="member">
                                    <div className="pic"><img src="static/landing/chefs/chef-2.jpeg" className="img-fluid" alt="" /></div>
                                    <div className="member-info">
                                        <h4>Sarah Davis</h4>
                                        <span>Deserts Cook</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>
                {/* <!--END STAFF AND CHEFS SECTION--> */}

                {/* <!-- REVIEWS SECTION --> */}
                <section id="reviews" className="reviews" style={{ backgroundImage: `url(static/landing/reviews/reviews-b.jpeg)` }}>
                    <div className="container position-relative">

                        <div className="reviews-slider swiper-container" data-aos="fade-up" data-aos-delay="100">
                            <div className="swiper-wrapper">
                                <Swiper
                                    centeredSlides={true}
                                    loop={true}
                                    spaceBetween={30}
                                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                                    pagination={{ clickable: true }}
                                    navigation={true}
                                    modules={[Navigation, Pagination, Autoplay]}
                                    speed={2000}
                                    className="mySwiper" >
                                    <SwiperSlide>
                                        <div className="swiper-slide">
                                            <div className="reviews-item">
                                                <img src="static/landing/reviews/profile-1.jpeg" className="reviews-img" alt="" />
                                                <h3>Hamza Raja</h3>
                                                <h4>Business Owner</h4>
                                                <div className="stars">
                                                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i
                                                        className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                                </div>
                                                <p>
                                                    <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                                    Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium
                                                    quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.
                                                    <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="swiper-slide">
                                            <div className="reviews-item">
                                                <img src="static/landing/reviews/profile-2.jpeg" className="reviews-img" alt="" />
                                                <h3>Adeline Jon</h3>
                                                <h4>Software Designer</h4>
                                                <div className="stars">
                                                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i
                                                        className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                                </div>
                                                <p>
                                                    <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                                    Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis
                                                    quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.
                                                    <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="swiper-slide">
                                            <div className="reviews-item">
                                                <img src="static/landing/reviews/profile-3.jpeg" className="reviews-img" alt="" />
                                                <h3>Elizabeth Russel</h3>
                                                <h4>Store Owner</h4>
                                                <div className="stars">
                                                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i
                                                        className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                                </div>
                                                <p>
                                                    <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                                    Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim
                                                    tempor labore quem eram duis noster aute amet eram fore quis sint minim.
                                                    <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="swiper-slide">
                                            <div className="reviews-item">
                                                <img src="static/landing/reviews/profile-4.jpeg" className="reviews-img" alt="" />
                                                <h3>Sean Goldberg</h3>
                                                <h4>Freelancer</h4>
                                                <div className="stars">
                                                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i
                                                        className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                                </div>
                                                <p>
                                                    <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                                    Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit
                                                    minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.
                                                    <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="swiper-slide">
                                            <div className="reviews-item">
                                                <img src="static/landing/reviews/profile-5.jpeg" className="reviews-img" alt="" />
                                                <h3>John Smith</h3>
                                                <h4>Accountant</h4>
                                                <div className="stars">
                                                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i
                                                        className="bi bi-star-fill"></i><i className="bi bi-star-half"></i>
                                                </div>
                                                <p>
                                                    <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                                    Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa
                                                    labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid.
                                                    <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <div className="swiper-pagination"></div>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <!-- END OF REVIEWS SECTION--> */}

                {/* <!-- START OF CONTACT SECTION --> */}
                <section id="contact" className="contact">
                    <div className="container">
                        <div className="section-title">
                            <h2><span>Reach Us</span></h2>
                            <p>Ut possimus qui ut temporibus culpa velit eveniet modi omnis est adipisci expedita at voluptas atque vitae
                                autem.</p>
                        </div>
                    </div>
                    <div className="container mt-5">
                        <div className="info-wrap">
                            <div className="row row-landing">
                                <div className="col-lg-3 col-md-6 info">
                                    <i className="bi bi-geo-alt"></i>
                                    <h4>Location:</h4>
                                    <p>Street Name Id<br />City Name, NY </p>
                                </div>

                                <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
                                    <i className="bi bi-clock"></i>
                                    <h4>Open Hours:</h4>
                                    <p>Monday-Sunday:<br />5:30 PM - 10:00 PM</p>
                                </div>

                                <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
                                    <i className="bi bi-envelope"></i>
                                    <h4>Email:</h4>
                                    <p>emailaddress@restaurant.com<br />contact@restaurant.com</p>
                                </div>

                                <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
                                    <i className="bi bi-phone"></i>
                                    <h4>Call:</h4>
                                    <p>+1 (123)-456-7890<br />+1 (456)-789-1234</p>
                                </div>
                            </div>
                        </div>

                        <form action="forms/contact.php" method="post" className="php-email-form">
                            <div className="row row-landing">
                                <div className="col-md-6 form-group">
                                    <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
                                </div>
                                <div className="col-md-6 form-group mt-3 mt-md-0">
                                    <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                                </div>
                            </div>
                            <div className="form-group mt-3">
                                <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required />
                            </div>
                            <div className="form-group mt-3">
                                <textarea className="form-control" name="message" rows="5" placeholder="Message" required></textarea>
                            </div>
                            <div className="my-3">
                                <div className="loading">Loading</div>
                                <div className="error-message"></div>
                                <div className="sent-message">Your message has been sent. Thank you!</div>
                            </div>
                            <div className="text-center"><button type="submit">Send Message</button></div>
                        </form>

                    </div>
                </section>
                {/* <!-- End Contact Section --> */}
            </main>
            {/* <!-- End #main --> */}

            {/* <!-- ======= Footer ======= --> */}
            <footer id="footer">
                <div className="container">
                    <h3>Restaurant</h3>
                    <p>Et aut eum quis fuga eos sunt ipsa nihil. Labore corporis magni eligendi fuga maxime saepe commodi placeat.</p>
                    <div className="copyright">
                        &copy; Copyright <strong><span></span></strong>.
                    </div>
                    <div className="credits">
                    </div>
                </div>
            </footer>
            {/* <!-- End Footer --> */}

            <a href="#hero" className="back-to-top d-flex align-items-center justify-content-center scrollto"><i
                className="bi bi-arrow-up-short"></i></a>
        </div>
    )
}
