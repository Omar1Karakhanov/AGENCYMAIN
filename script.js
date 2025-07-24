
document.addEventListener('DOMContentLoaded', () => {

    // ================================
    // FULLY UPGRADED SPA NAVIGATOR with History API
    // ================================
    const SpaNavigator = {
        elements: {
            navLinks: document.querySelectorAll('.nav-link'),
            pageViews: document.querySelectorAll('.page-view'),
            mainContentView: document.getElementById('main-content-view'),
            body: document.body
        },
        scrollObserver: null,

        init() {
            this._bindEvents();
            this._setupScrollSpy();
            this._handleInitialLoad();
        },

        _bindEvents() {
            document.addEventListener('click', (e) => {
                const navLink = e.target.closest('.nav-link');
                if (!navLink) return;

                const targetId = navLink.hash;

                // Only prevent default for internal SPA links, not external ones
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const isMobileClick = e.target.closest('.mobile-nav-links');

                    if (isMobileClick && this.elements.body.classList.contains('mobile-nav-is-open')) {
                        closeMobileMenu();
                        setTimeout(() => this.switchView(targetId), 400);
                    } else {
                        this.switchView(targetId);
                    }
                }
            });

            window.addEventListener('popstate', (e) => {
                const targetId = e.state ? e.state.target : '#hero';
                this.switchView(targetId, true);
            });
        },

        switchView(targetId, isPopState = false) {
            if (!isPopState) {
                if(window.location.hash !== targetId) {
                   history.pushState({ target: targetId }, '', targetId);
                }
            }

            const isPageView = targetId.includes('-page');

            this.elements.pageViews.forEach(view => view.classList.remove('active'));
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active-link'));

            if (isPageView) {
                this.elements.body.classList.add('virtual-page-active');
                const targetView = document.getElementById(targetId.substring(1) + '-view');
                if (targetView) targetView.classList.add('active');
                window.scrollTo(0, 0);
            } else {
                this.elements.body.classList.remove('virtual-page-active');
                this.elements.mainContentView.classList.add('active');
                this.elements.mainContentView.classList.add('hidden');

                setTimeout(() => {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                         const headerOffset = document.querySelector('header').offsetHeight;
                         const elementPosition = targetSection.getBoundingClientRect().top;
                         const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                         window.scrollTo({
                             top: offsetPosition,
                             behavior: 'auto'
                         });
                    }
                    this.elements.mainContentView.classList.remove('hidden');
                }, 50);
            }

             document.querySelectorAll(`.nav-link[href="${targetId}"]`).forEach(link => link.classList.add('active-link'));
        },

        _setupScrollSpy() {
            const sections = this.elements.mainContentView.querySelectorAll('section[id]');
            const observerOptions = {
                rootMargin: "-20% 0px -50% 0px", 
                threshold: 0.01 
            };

            this.scrollObserver = new IntersectionObserver((entries) => {
                if (this.elements.body.classList.contains('virtual-page-active')) return;

                let activeEntry = null;
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        if (!activeEntry || entry.intersectionRatio > activeEntry.intersectionRatio) {
                            activeEntry = entry;
                        }
                    }
                }

                if (activeEntry) {
                    const activeSectionId = activeEntry.target.id;
                    const newHash = `#${activeSectionId}`;
                    
                    if (window.location.hash !== newHash) {
                       history.replaceState({ target: newHash }, '', newHash);
                    }
                    
                    document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
                        const isActive = link.hash === newHash;
                        link.classList.toggle('active-link', isActive);
                    });
                }
            }, observerOptions);

            sections.forEach(section => this.scrollObserver.observe(section));
        },

        _handleInitialLoad() {
            const initialHash = window.location.hash || '#hero';
            this.switchView(initialHash, true);
        }
    };

    // ================================
    // AOS INIT
    // ================================
    AOS.init({ duration: 800, once: true, offset: 50 });

    // ================================
    // MOBILE NAVIGATION
    // ================================
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const bodyEl = document.body;

    const openMobileMenu = () => bodyEl.classList.add('mobile-nav-is-open');
    const closeMobileMenu = () => bodyEl.classList.remove('mobile-nav-is-open');

    document.getElementById('hamburger-menu')?.addEventListener('click', openMobileMenu);
    document.getElementById('close-mobile-menu')?.addEventListener('click', closeMobileMenu);
    mobileNavOverlay?.addEventListener('click', closeMobileMenu);

    // ================================
    // LANGUAGE AND CURRENCY SWITCHER
    // ================================
    const translations = {
        en: {
            pageTitle: "OSGWeb.ge - Websites That Grow Your Business",
            navServices: "Services",
            navPortfolio: "Portfolio",
            navTestimonials: "Testimonials",
            navPricing: "Pricing",
            navContact: "Contact",
            heroTitle: "Your Business,<br><span class='gradient-text'>Digitally</span>",
            heroSubtitle: "Websites That Work For You",
            heroButton: "Start a Project",
            servicesTitle: "Our Goal Is Your Success",
            service1Title: "Design",
            service1Desc: "A technically sound website is not enough — the visual impression decides whether the user stays. The design should be modern, easy to understand, and tailored to the brand.",
            service2Title: "Security",
            service2Desc: "User trust begins with website security. Modern protection mechanisms ensure defense against hacking attacks, data leaks, and other threats.",
            service3Title: "Easy Management",
            service3Desc: "An intuitive system lets you easily change texts, add images, and customize the site to your needs — without coding knowledge.",
            portfolioTitle: "Featured Works",
            portfolio1Title: "'The Golden Fork' - Restaurant Website",
            portfolio2Title: "'The Trim House' - Barbershop Branding",
            portfolio3Title: "'Olio & Sale' - Cafe Online Website",
            testimonialsTitle: "Reviews and Testimonials",
            contactTitle: "Contact Us",
            contactInfoTitle: "Contact Information",
            contactInfoDesc: "Have a project or question? Write to us, call us, or fill out the form.",
            reviewPromptText: "Have you worked with us? We’d love to hear your feedback.",
            contactInfoLocation: "Tbilisi, Georgia",
            formNamePlaceholder: "Your Name",
            formEmailPlaceholder: "Your Email",
            formMessagePlaceholder: "Your Message",
            formSendButton: "Send",
            formInterestMessage: "Hello, I am interested in the {planName} package.", // New
            footerAbout: "Innovative digital experience for brand success.",
            footerContactTitle: "Contact Us",
            footerSocialTitle: "Follow Us",
            footerCopyright: "© 2025 OSGWeb.ge. All rights reserved.",
            reviewPageTitle: "Leave a Review",
            reviewPageSubtitle: "Your feedback helps us become even better.",
            reviewFormSubmitButton: "Submit Review",
            reviewSuccessTitle: "Thank You!",
            reviewPendingMessage: "Your review will be published after we confirm your project.",
            pricingTitle: "Simple, Transparent Pricing",
            pricingStarterTitle: "Starter",
            pricingStarterPrice: "$21.99",
            pricingStarterFeature1: "3-page website: Home, Menu, Contact",
            pricingStarterFeature2: "Fully responsive design",
            pricingStarterFeature3: "Clear and attractive design",
            pricingStarterFeature4: "SEO Basics",
            pricingStarterFeature5: "Fast Loading Speed",
            pricingProTitle: "Pro",
            pricingProPrice: "$36.99",
            pricingProFeature1: "5 pages: Includes Starter Pack pages +",
            pricingProFeature2: "Reservation functions",
            pricingProFeature3: "Reservation page",
            pricingProFeature4: "Admin panel",
            pricingProFeature5: "CMS Integration",
            pricingProFeature6: "Advanced Analytics",
            pricingPremiumTitle: "Premium",
            pricingPremiumPrice: "$42.99",
            pricingPremiumFeature1: "Up to 10 Pages & Custom Design",
            pricingPremiumFeature2: "Advanced CMS & Admin Panel",
            pricingPremiumFeature3: "E-commerce or Booking System",
            pricingPremiumFeature4: "Full SEO & Performance Optimization",
            pricingPremiumFeature5: "Priority Support & Training",
            pricingPremiumFeature6: "3 Months Post-Launch Maintenance",
            pricingMostPopular: "Most Popular",
            pricingGetStarted: "Get Started",
            pricingBookACall: "Book a Call",
            whatsappMessage: "Hello! I'd like to book a call to discuss your web services." // New
        },
        ge: {
            pageTitle: "OSGWeb.ge - ვებსაიტები, რომელიც ბიზნესს ზრდის",
            navServices: "სერვისები",
            navPortfolio: "პორტფოლიო",
            navTestimonials: "შეფასებები",
            navPricing: "ფასები",
            navContact: "კონტაქტი",
            heroTitle: "შენი ბიზნესი,<br><span class='gradient-text'>ციფრულად</span>",
            heroSubtitle: "ვებსაიტები, რომლებიც მუშაობენ თქვენთვის",
            heroButton: "პროექტის დაწყება",
            servicesTitle: "ჩვენი მიზანია შენი წარმატება",
            service1Title: "დიზაინი",
            service1Desc: "ტექნიკურად გამართული საიტი საკმარისი არაა — ვიზუალური შთაბეჭდილება გადაწყვიტავს, დარჩება თუ არა მომხმარებელი. დიზაინი უნდა იყოს თანამედროვე, მარტივად აღსაქმელი და ბრენდზე მორგებული.",
            service2Title: "უსაფრთხოება",
            service2Desc: "მომხმარებლის ნდობა იწყება საიტის უსაფრთხოებით. თანამედროვე დაცვით მექანიზმებს უზრუნველყოფს ჰაკერული თავდასხმების, მონაცემთა გაჟონვის და სხვა საფრთხეებისგან დაცვას.",
            service3Title: "მარტივი მართვა",
            service3Desc: "ინტუიციური სისტემა საშუალებას გაძლევთ მარტივად შეცვალოთ ტექსტები, დაამატოთ სურათები და მოარგოთ საიტი თქვენს საჭიროებებს — კოდის ცოდნის გარეშე.",
            portfolioTitle: "გამორჩეული ნამუშევრები",
            portfolio1Title: "'The Golden Fork' - რესტორნის ვებსაიტი",
            portfolio2Title: "'The Trim House' - ბარბერშოპის ბრენდინგი",
            portfolio3Title: "'Olio & Sale' - კაფეს ონლაინ ვებსაიტი",
            testimonialsTitle: "მიმოხილვები და შეფასებები",
            reviewPromptText: "გვითანამშრომლია? სიამოვნებით მოვისმენთ თქვენს აზრს.",
            contactTitle: "დაგვიკავშირდით",
            contactInfoTitle: "საკონტაქტო ინფორმაცია",
            contactInfoDesc: "გაქვთ პროექტი ან შეკითხვა? მოგვწერეთ, დაგვირეკეთ, ან შეავსეთ ფორმა.",
            contactInfoLocation: "თბილისი, საქართველო",
            formNamePlaceholder: "თქვენი სახელი",
            formEmailPlaceholder: "თქვენი ელ.ფოსტა",
            formMessagePlaceholder: "თქვენი შეტყობინება",
            formSendButton: "გაგზავნა",
            formInterestMessage: "გამარჯობა, დაინტერესებული ვარ {planName} პაკეტით.", // New
            footerAbout: "ინოვაციური ციფრული გამოცდილება ბრენდის წარმატებისთვის.",
            footerContactTitle: "კონტაქტი",
            footerSocialTitle: "გამოგვყევით",
            footerCopyright: "© 2025 OSGWeb.ge. ყველა უფლება დაცულია.",
            reviewPageTitle: "შეფასების დატოვება",
            reviewPageSubtitle: "თქვენი გამოხმაურება გვეხმარება გავხდეთ უკეთესები.",
            reviewFormSubmitButton: "შეფასების გაგზავნა",
            reviewSuccessTitle: "გმადლობთ!",
            reviewPendingMessage: "თქვენი შეფასება გამოქვეყნდება პროექტის დადასტურების შემდეგ.",
            pricingTitle: "მარტივი, გამჭვირვალე ფასები",
            pricingStarterTitle: "Starter",
            pricingStarterPrice: "59.9₾",
            pricingStarterFeature1: "3-გვერდიანი ვებსაიტი: მთავარი, მენიუ, კონტაქტი",
            pricingStarterFeature2: "სრულად ადაპტური დიზაინი",
            pricingStarterFeature3: "ნათელი და საუკეთესო დიზაინი",
            pricingStarterFeature4: "SEO საფუძვლები",
            pricingStarterFeature5: "ჩატვირთვის სწრაფი სიჩქარე",
            pricingProTitle: "Pro",
            pricingProPrice: "99.9₾",
            pricingProFeature1: "5 გვერდი: მოიცავს Starter პაკეტის გვერდებს +",
            pricingProFeature2: "დაჯავშნის ფუნქციები",
            pricingProFeature3: "დაჯავშნის გვერდი",
            pricingProFeature4: "ადმინისტრატორის პანელი",
            pricingProFeature5: "CMS ინტეგრაცია",
            pricingProFeature6: "გაფართოებული ანალიტიკა",
            pricingPremiumTitle: "Premium",
            pricingPremiumPrice: "119.9₾",
            pricingPremiumFeature1: "10-მდე გვერდი და უნიკალური დიზაინი",
            pricingPremiumFeature2: "გაფართოებული CMS და ადმინ. პანელი",
            pricingPremiumFeature3: "ელ.კომერციის ან დაჯავშნის სისტემა",
            pricingPremiumFeature4: "სრული SEO და წარმადობის ოპტიმიზაცია",
            pricingPremiumFeature5: "პრიორიტეტული მხარდაჭერა და ტრენინგი",
            pricingPremiumFeature6: "გაშვების შემდგომი 3 თვიანი მხარდაჭერა",
            pricingMostPopular: "ყველაზე პოპულარული",
            pricingGetStarted: "დაწყება",
            pricingBookACall: "ზარის დაჯავშნა",
            whatsappMessage: "გამარჯობა, მსურს ზარის დაჯავშნა თქვენს ვებ-გვერდის სერვისებზე სასაუბროდ." // New
        },
        ru: { 
            pageTitle: "OSGWeb.ge - Сайты, развивающие ваш бизнес",
            navServices: "Услуги",
            navPortfolio: "Портфолио",
            navTestimonials: "Отзывы",
            navPricing: "Цены",
            navContact: "Контакты",
            heroTitle: "Ваш бизнес,<br><span class='gradient-text'>в цифре</span>",
            heroSubtitle: "Сайты, которые работают на вас",
            heroButton: "Начать проект",
            servicesTitle: "Наша цель – ваш успех",
            service1Title: "Дизайн",
            service1Desc: "Технически совершенного сайта недостаточно — визуальное впечатление решает, останется ли пользователь. Дизайн должен быть современным, понятным и адаптированным под бренд.",
            service2Title: "Безопасность",
            service2Desc: "Доверие пользователей начинается с безопасности сайта. Современные механизмы защиты обеспечивают отражение хакерских атак, утечек данных и других угроз.",
            service3Title: "Простое управление",
            service3Desc: "Интуитивно понятная система позволяет легко изменять тексты, добавлять изображения и настраивать сайт под свои нужды — без знаний кодирования.",
            portfolioTitle: "Избранные работы",
            portfolio1Title: "'Золотая Вилка' - Сайт ресторана",
            portfolio2Title: "'Дом Стрижки' - Брендинг барбершопа",
            portfolio3Title: "'Олио и Сале' - Онлайн-сайт кафе",
            testimonialsTitle: "Отзывы и рекомендации",
            contactTitle: "Свяжитесь с нами",
            contactInfoTitle: "Контактная информация",
            contactInfoDesc: "Есть проект или вопрос? Напишите нам, позвоните или заполните форму.",
            reviewPromptText: "Работали с нами? Мы будем рады вашему отзыву.",
            contactInfoLocation: "Тбилиси, Грузия",
            formNamePlaceholder: "Ваше имя",
            formEmailPlaceholder: "Ваш email",
            formMessagePlaceholder: "Ваше сообщение",
            formSendButton: "Отправить",
            formInterestMessage: "Здравствуйте, я заинтересован в пакете {planName}.", // New
            footerAbout: "Инновационный цифровой опыт для успеха бренда.",
            footerContactTitle: "Свяжитесь с нами",
            footerSocialTitle: "Подпишитесь на нас",
            footerCopyright: "© 2025 OSGWeb.ge. Все права защищены.",
            reviewPageTitle: "Оставить отзыв",
            reviewPageSubtitle: "Ваш отзыв помогает нам стать еще лучше.",
            reviewFormSubmitButton: "Отправить отзыв",
            reviewSuccessTitle: "Спасибо!",
            reviewPendingMessage: "Ваш отзыв будет опубликован после подтверждения вашего проекта.",
            pricingTitle: "Простые, прозрачные цены",
            pricingStarterTitle: "Стартовый",
            pricingStarterPrice: "2924.99₽",
            pricingStarterFeature1: "3-страничный сайт: Главная, Меню, Контакты",
            pricingStarterFeature2: "Полностью адаптивный дизайн",
            pricingStarterFeature3: "Чистый и крутой дизайн",
            pricingStarterFeature4: "Основы SEO",
            pricingStarterFeature5: "Быстрая скорость загрузки",
            pricingProTitle: "Профессиональный",
            pricingProPrice: "3309.99₽",
            pricingProFeature1: "5 страниц: включает страницы стартового пакета +",
            pricingProFeature2: "Функции бронирования",
            pricingProFeature3: "Страница бронирования",
            pricingProFeature4: "Панель администратора",
            pricingProFeature5: "Интеграция CMS",
            pricingProFeature6: "Расширенная аналитика",
            pricingPremiumTitle: "Премиум",
            pricingPremiumPrice: "3509.99₽",
            pricingPremiumFeature1: "До 10 страниц и индивидуальный дизайн",
            pricingPremiumFeature2: "Расширенная CMS и панель администратора",
            pricingPremiumFeature3: "Система электронной коммерции или бронирования",
            pricingPremiumFeature4: "Полная SEO и оптимизация производительности",
            pricingPremiumFeature5: "Приоритетная поддержка и обучение",
            pricingPremiumFeature6: "3 месяца поддержки после запуска",
            pricingMostPopular: "Самый популярный",
            pricingGetStarted: "Начать",
            pricingBookACall: "Заказать звонок",
            whatsappMessage: "Здравствуйте, я хотел бы заказать звонок, чтобы обсудить ваши услуги по веб-разработке." // New
        }
    };

    let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('ka') ? 'ge' : (navigator.language.startsWith('ru') ? 'ru' : 'en'));

    const applyTranslations = (lang) => {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.getAttribute('data-lang-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-lang-meta]').forEach(element => {
            const key = element.getAttribute('data-lang-meta');
            if (translations[lang] && translations[lang][key]) {
                element.setAttribute('content', translations[lang][key]);
            }
        });

        // NEW: Update "Book a Call" WhatsApp link
        const bookACallLink = document.getElementById('book-a-call-link');
        if (bookACallLink && translations[lang] && translations[lang].whatsappMessage) {
            const phoneNumber = '995591929081';
            const message = encodeURIComponent(translations[lang].whatsappMessage);
            bookACallLink.href = `https://wa.me/${phoneNumber}?text=${message}`;
        }
    };

    const updateLanguageSelector = (lang) => {
        const currentLangBtn = document.getElementById('current-lang-btn');
        if (currentLangBtn) {
            currentLangBtn.textContent = lang.toUpperCase();
        }
    };

    document.querySelectorAll('.language-options a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = e.target.getAttribute('data-lang-value');
            localStorage.setItem('lang', newLang);
            currentLang = newLang;
            applyTranslations(newLang);
            updateLanguageSelector(newLang);
            document.getElementById('language-options').classList.remove('active');
        });
    });

    document.querySelectorAll('.mobile-lang-switcher button').forEach(button => {
        button.addEventListener('click', (e) => {
            const newLang = e.target.getAttribute('data-lang-value');
            localStorage.setItem('lang', newLang);
            currentLang = newLang;
            applyTranslations(newLang);
            updateLanguageSelector(newLang);
            closeMobileMenu();
        });
    });

    document.getElementById('current-lang-btn')?.addEventListener('click', function() {
        const options = document.getElementById('language-options');
        options.classList.toggle('active');
        this.setAttribute('aria-expanded', options.classList.contains('active'));
    });

    document.addEventListener('click', (e) => {
        const currentLangBtn = document.getElementById('current-lang-btn');
        const languageOptions = document.getElementById('language-options');
        if (currentLangBtn && languageOptions && !currentLangBtn.contains(e.target) && !languageOptions.contains(e.target)) {
            languageOptions.classList.remove('active');
            currentLangBtn.setAttribute('aria-expanded', false);
        }
    });

    applyTranslations(currentLang);
    updateLanguageSelector(currentLang);


    // ================================
    // NEW: "GET STARTED" BUTTON LOGIC
    // ================================
    document.querySelectorAll('.get-started-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const plan = button.getAttribute('data-plan'); // 'Starter', 'Pro', or 'Premium'
            let planTitleKey;
            switch(plan) {
                case 'Starter': planTitleKey = 'pricingStarterTitle'; break;
                case 'Pro': planTitleKey = 'pricingProTitle'; break;
                case 'Premium': planTitleKey = 'pricingPremiumTitle'; break;
            }
            
            const planName = translations[currentLang][planTitleKey] || plan;
            const messageTemplate = translations[currentLang].formInterestMessage;

            const finalMessage = messageTemplate.replace('{planName}', planName);
            
            const contactTextarea = document.getElementById('contact-message');
            if (contactTextarea) {
                contactTextarea.value = finalMessage;
            }

            SpaNavigator.switchView('#contact-page');

            setTimeout(() => {
                contactTextarea?.focus();
            }, 100);
        });
    });


    // ================================
    // REVIEW FORM
    // ================================
    const reviewForm = document.getElementById('review-form');
    //... (Rest of the review form code remains the same, it is omitted for brevity)


    // Initialize SPA Navigator
    SpaNavigator.init();
});

