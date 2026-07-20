document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Menu Interactivity
    const menuBtn = document.getElementById('menu-btn');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const sidebarClose = document.getElementById('sidebar-close');

    if (menuBtn && sidebarMenu && sidebarClose) {
        // Toggle Sidebar
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuBtn.classList.toggle('active');
            sidebarMenu.classList.toggle('active');
        });

        // Close Sidebar
        const closeSidebar = () => {
            menuBtn.classList.remove('active');
            sidebarMenu.classList.remove('active');
        };

        sidebarClose.addEventListener('click', closeSidebar);

        // Close when clicking sidebar links
        document.querySelectorAll('.sidebar-links a').forEach(link => {
            link.addEventListener('click', closeSidebar);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebarMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                closeSidebar();
            }
        });
    }

    // 2. Sticky Navbar Background on Scroll
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 3. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        const revealOnScrollFallback = () => {
            const windowHeight = window.innerHeight;
            const revealPoint = 100;
            revealElements.forEach(el => {
                const revealTop = el.getBoundingClientRect().top;
                if (revealTop < windowHeight - revealPoint) {
                    el.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', revealOnScrollFallback);
        revealOnScrollFallback();
    }

    // 4. Skills Tabs Switcher
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // 5. Interactive Cursor Glow Follower
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
        document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; });
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    // 6. Search Overlay Interactivity & Page-Wide Search Engine
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchBtn && searchOverlay && searchClose && searchInput && searchResults) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
        });

        const closeSearch = () => {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        };

        searchClose.addEventListener('click', closeSearch);

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
        });

        // Search engine logic
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            searchResults.innerHTML = '';

            if (query.length < 2) return;

            // Search in headings and cards
            const searchableElements = [
                { selector: '#about .about-left', title: 'Kimman? / Men haqimda', desc: 'Samariddin Mansurov haqidagi asosiy ma\'lumotlar.' },
                { selector: '#about .about-right', title: 'Professional Profil', desc: 'Ishlash sohalari, tajriba va mas\'uliyatlar.' },
                { selector: '#programming', title: 'Dasturlash ko\'nikmalari', desc: 'JavaScript, C++, Python, OOP, Asinxron dasturlash va boshqalar.' },
                { selector: '#ecommerce', title: 'Veb & E-commerce ko\'nikmalari', desc: 'Shopify, Amazon Marketplace, Raqamli marketing va SEO.' },
                { selector: '#business', title: 'Biznes ko\'nikmalari', desc: 'Savdo boshqaruvi, B2B, B2C va muzokara olib borish.' },
                { selector: '#tools', title: 'Ishchi vositalar', desc: 'Git, GitHub, Visual Studio Code va Visual Studio.' },
                { selector: '#directions', title: 'Faoliyat Yo\'nalishlarim', desc: 'Veb ilovalar, avtomatlashtirish va sun\'iy intellekt tizimlari.' },
                { selector: '#principles', title: 'Ishlash Tamoyillarim', desc: 'Sifat, mas\'uliyat, halollik, intizom va doimiy rivojlanish.' },
                { selector: '#goals', title: 'Maqsad va Shior', desc: 'Kelajakdagi maqsadlar va shaxsiy shior.' }
            ];

            const matches = searchableElements.filter(item => {
                const el = document.querySelector(item.selector);
                const text = el ? el.textContent.toLowerCase() : '';
                return text.includes(query) || item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
            });

            if (matches.length === 0) {
                searchResults.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 1rem;">Hech narsa topilmadi...</p>';
                return;
            }

            matches.forEach(match => {
                const item = document.createElement('a');
                item.href = match.selector;
                item.className = 'search-result-item';
                item.innerHTML = `
                    <h4>${match.title}</h4>
                    <p>${match.desc}</p>
                `;
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeSearch();
                    const targetEl = document.querySelector(match.selector);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
                searchResults.appendChild(item);
            });
        });
    }

    // 7. Contact Form Submit Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Yuborilmoqda...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Muvaffaqiyatli yuborildi!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                btn.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
                
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // 8. Dual Language Switcher (UZ <-> EN)
    const langBtn = document.getElementById('lang-btn');
    let currentLang = 'uz';

    const langData = {
        uz: {
            langName: 'English',
            navHome: 'Asosiy', navAbout: 'Men haqimda', navSkills: 'Ko\'nikmalar', navDir: 'Faoliyat', navPrin: 'Tamoyillar', navGoal: 'Maqsad & Shior', navContact: 'Aloqa',
            greeting: '<i class="ri-shake-hands-line"></i> Assalomu alaykum',
            role: 'Full Stack Dasturchi & <span class="highlight">E-commerce Mutaxassisi</span>',
            summary: 'Insonlar va bizneslar uchun foydali, zamonaviy hamda ishonchli raqamli yechimlarni yaratish tarafdoriman. Dasturlashni muammolarni tahlil qilish va ularga samarali yechim topish san\'ati deb bilaman.',
            btnContact: '<i class="ri-mail-send-line"></i> Aloqaga Chiqish',
            btnProfile: '<i class="ri-user-line"></i> Profilni Ko\'rish',
            
            aboutTitle: 'Men haqimda & Profil',
            aboutLeftHead: 'Kimman?',
            aboutLeftP1: 'Men <strong>Samariddin Mansurov</strong> — zamonaviy texnologiyalar, dasturlash, elektron tijorat (E-commerce) va raqamli marketing yo‘nalishlariga qiziqadigan mutaxassisman.',
            aboutLeftP2: 'Mening asosiy maqsadim — insonlar va bizneslar uchun foydali, zamonaviy hamda ishonchli raqamli yechimlarni yaratishdir.',
            aboutLeftP3: 'Doimiy ravishda yangi texnologiyalarni o‘rganish, tajribamni oshirish va o‘zimni rivojlantirishga intilaman. Har bir loyiha men uchun yangi tajriba va yangi imkoniyat hisoblanadi.',
            
            aboutRightHead: 'Professional Profil',
            aboutRightP1: 'Dasturiy ta\'minot ishlab chiqish, elektron tijorat va biznes jarayonlarini optimallashtirish yo‘nalishlarida faoliyat yuritaman.',
            aboutRightP2: 'Texnik bilimlarimni biznes tajribasi bilan uyg‘unlashtirib, foydalanuvchilar uchun qulay, tezkor va sifatli mahsulotlar yaratishga e\'tibor beraman.',
            aboutRightP3: 'Har qanday vazifaga mas\'uliyat, aniqlik va kreativ yondashuv bilan yondashaman. Mening fikrimcha, muvaffaqiyatning eng muhim omillari — intizom, doimiy o‘rganish va sifatga bo‘lgan e\'tibordir.',

            skillsTitle: 'Asosiy Ko\'nikmalar',
            skillsSubtitle: 'Bilim va tajribalarim yo\'nalishlar bo\'yicha',
            tabProg: '<i class="ri-code-box-line"></i> Dasturlash',
            tabEcom: '<i class="ri-shopping-cart-2-line"></i> Veb & E-commerce',
            tabBus: '<i class="ri-line-chart-line"></i> Biznes',
            tabTools: '<i class="ri-tools-line"></i> Ishchi Vositalar',

            dirTitle: 'Faoliyat Yo\'nalishlarim',
            dirSubtitle: 'Men ishlash va rivojlanishni maqsad qilgan asosiy sohalar',
            dirCard1H: 'Veb ilovalar yaratish', dirCard1P: 'Zamonaviy, tezkor va xavfsiz Frontend hamda Backend tizimlarini loyihalash.',
            dirCard2H: 'Avtomatlashtirish tizimlari', dirCard2P: 'Biznes va kundalik ishlarni yengillashtirish uchun scriptlar va tizimlar yaratish.',
            dirCard3H: 'Elektron tijorat platformalari', dirCard3P: 'Shopify, Amazon va maxsus onlayn do\'konlar orqali savdoni boshqarish va integratsiya qilish.',
            dirCard4H: 'Sun\'iy intellekt texnologiyalari', dirCard4P: 'AI yordamida ishlarni jadallashtirish va aqlli yechimlarni biznesga joriy qilish.',
            dirCard5H: 'Biznesni raqamlashtirish', dirCard5P: 'An\'anaviy biznes jarayonlarini avtomatlashtirish va raqamli bozorga olib chiqish.',
            dirCard6H: 'Dasturiy mahsulotlar', dirCard6P: 'Foydalanuvchilar ehtiyojlaridan kelib chiqqan holda maxsus dasturiy ta\'minotlar ishlab chiqish.',
            dirCard7H: 'Zamonaviy IT yechimlari', dirCard7P: 'Eng so\'nggi texnologik standartlarga mos ravishda arxitektura va xizmatlarni yo\'lga qo\'yish.',

            prinTitle: 'Ishlash Tamoyillarim',
            prinSubtitle: 'Mening kasbiy va shaxsiy faoliyatim asoslangan qadriyatlar',
            prinCard1H: 'Sifat', prinCard1P: 'Har bir loyihada eng yuqori sifat standartlariga rioya qilish.',
            prinCard2H: 'Mas\'uliyat', prinCard2P: 'Topshirilgan vazifalarni o\'z vaqtida va to\'liq yakunlash.',
            prinCard3H: 'Halollik', prinCard3P: 'Mijozlar, hamkorlar va jamoa a\'zolari bilan shaffof munosabat.',
            prinCard4H: 'Intizom', prinCard4P: 'Muntazam mehnat, rejalashtirish va tizimli ishlash.',
            prinCard5H: 'Doimiy rivojlanish', prinCard5P: 'Har kuni yangi bilim va ko\'nikmalarni o\'rganib borish.',
            prinCard6H: 'Innovatsion fikrlash', prinCard6P: 'Muammolarga nostandart va ijodiy yondashuvlarni topish.',
            prinCard7H: 'Jamoa bilan samarali ishlash', prinCard7P: 'Birgalikdagi g\'oyalar va fikr almashish orqali yuqori natijalar.',
            prinCard8H: 'Natijaga yo‘naltirilganlik', prinCard8P: 'Faqatgina jarayon emas, balki aniq va o\'lchanadigan muvaffaqiyatga intilish.',

            goalsLeftHead: 'Qiziqishlarim',
            goalInt1: '<i class="ri-boxing-line"></i> Boks bilan shug\'ullanish',
            goalInt2: '<i class="ri-robot-line"></i> Sun\'iy intellekt va yangi texnologiyalar',
            goalInt3: '<i class="ri-book-open-line"></i> Biznes va startaplar haqida mutolaa',
            goalInt4: '<i class="ri-graduation-cap-line"></i> Dasturlash bo‘yicha yangi bilimlarni egallash',
            
            goalsRightHead: 'Mening Maqsadim',
            goalP1: 'Kelajakdagi asosiy maqsadim — xalqaro darajadagi malakali dasturiy ta\'minot muhandisi va zamonaviy texnologiyalar sohasida muvaffaqiyatli tadbirkor bo‘lish.',
            goalP2: 'Innovatsion g‘oyalarni amaliyotga tatbiq etish, insonlar va bizneslar uchun foydali bo‘lgan raqamli mahsulotlar yaratish hamda bilim va tajribamni doimiy ravishda oshirib borishni o\'z oldimga maqsad qilganman.',
            goalP3: 'Texnologiyalar yordamida murakkab muammolarni sodda va samarali yechimlarga aylantirish, zamonaviy dasturiy mahsulotlar ishlab chiqish va xalqaro miqyosdagi loyihalarda ishtirok etish mening uzoq muddatli maqsadlarimdan biridir.',
            
            mottoTitle: '— Shiorim',
            mottoText: '"Bilim — imkoniyatlarni ochadigan kalit, intizom esa ularni muvaffaqiyatga aylantiradigan kuchdir."',

            contactTitle: 'Bog\'lanish',
            contactText: 'Yangi loyihalar, hamkorlik yoki biznesni raqamlashtirish bo‘yicha savollaringiz bo‘lsa, xabar qoldiring. Tez orada siz bilan bog\'lanaman.',
            inputName: 'Ismingiz',
            inputMsg: 'Xabaringiz...',
            btnSubmit: '<i class="ri-send-plane-fill"></i> Xabarni Yuborish',
            searchInput: 'Saytdan qidirish...'
        },
        en: {
            langName: 'O\'zbekcha',
            navHome: 'Home', navAbout: 'About Me', navSkills: 'Skills', navDir: 'Activities', navPrin: 'Principles', navGoal: 'Goals & Motto', navContact: 'Contact',
            greeting: '<i class="ri-shake-hands-line"></i> Welcome',
            role: 'Full Stack Developer & <span class="highlight">E-commerce Specialist</span>',
            summary: 'I focus on building functional, modern, and reliable digital solutions for people and businesses. I see programming as the art of analyzing problems and delivering highly efficient answers.',
            btnContact: '<i class="ri-mail-send-line"></i> Contact Me',
            btnProfile: '<i class="ri-user-line"></i> View Profile',

            aboutTitle: 'About Me & Profile',
            aboutLeftHead: 'Who am I?',
            aboutLeftP1: 'I am <strong>Samariddin Mansurov</strong> — a professional interested in modern technology, programming, E-commerce, and digital marketing.',
            aboutLeftP2: 'My core goal is to establish useful, state-of-the-art, and trustworthy digital solutions for individuals and enterprises.',
            aboutLeftP3: 'I continuously strive to learn new frameworks, enrich my skill set, and achieve personal growth. Every project represents an invaluable learning curve.',

            aboutRightHead: 'Professional Profile',
            aboutRightP1: 'I specialize in software development, e-commerce management, and business process automation.',
            aboutRightP2: 'By merging technical expertise with business acumen, I target creating user-friendly, optimized, and premium-quality products.',
            aboutRightP3: 'I approach tasks with absolute responsibility, precision, and creativity. For me, key success factors are discipline, continuous learning, and attention to quality.',

            skillsTitle: 'Primary Skills',
            skillsSubtitle: 'My technical expertise and capabilities by domain',
            tabProg: '<i class="ri-code-box-line"></i> Programming',
            tabEcom: '<i class="ri-shopping-cart-2-line"></i> Web & E-commerce',
            tabBus: '<i class="ri-line-chart-line"></i> Business',
            tabTools: '<i class="ri-tools-line"></i> Work Tools',

            dirTitle: 'Fields of Activity',
            dirSubtitle: 'Key directions where I actively build and grow my career',
            dirCard1H: 'Web App Development', dirCard1P: 'Engineering scalable, responsive, and secure frontend and backend structures.',
            dirCard2H: 'Automation Systems', dirCard2P: 'Writing scripts and software services to streamline everyday business processes.',
            dirCard3H: 'E-commerce Platforms', dirCard3P: 'Managing and integrating shops via Shopify, Amazon, and customized gateways.',
            dirCard4H: 'AI & Data Integration', dirCard4P: 'Harnessing modern artificial intelligence modules to empower business logic.',
            dirCard5H: 'Business Digitization', dirCard5P: 'Transitioning conventional operations into modern automated digital portals.',
            dirCard6H: 'Software Product Dev', dirCard6P: 'Crafting tailored desktop or network applications targeted at solving specific user needs.',
            dirCard7H: 'State-of-the-Art Solutions', dirCard7P: 'Establishing architectures aligned with the latest global technological standards.',

            prinTitle: 'Core Principles',
            prinSubtitle: 'Key values that steer my professional and personal workflow',
            prinCard1H: 'Quality', prinCard1P: 'Adhering to high-quality code and design benchmarks in all assignments.',
            prinCard2H: 'Responsibility', prinCard2P: 'Completing assignments with absolute punctuality and complete delivery.',
            prinCard3H: 'Transparency', prinCard3P: 'Maintaining honest, clear, and open relationships with clients and partners.',
            prinCard4H: 'Discipline', prinCard4P: 'Sustaining a consistent work schedule, structured planning, and system logic.',
            prinCard5H: 'Constant Evolution', prinCard5P: 'Pursuing learning paths and training modules to upgrade skills daily.',
            prinCard6H: 'Innovative Mentality', prinCard6P: 'Brainstorming creative and out-of-the-box approaches to solve problems.',
            prinCard7H: 'Team Collaboration', prinCard7P: 'Synthesizing ideas with group members to yield stellar project products.',
            prinCard8H: 'Result-Oriented', prinCard8P: 'Aiming not just at starting activities, but finishing them with measurable milestones.',

            goalsLeftHead: 'My Interests',
            goalInt1: '<i class="ri-boxing-line"></i> Boxing & physical fitness',
            goalInt2: '<i class="ri-robot-line"></i> AI developments & gadgets',
            goalInt3: '<i class="ri-book-open-line"></i> Reading startup & business case studies',
            goalInt4: '<i class="ri-graduation-cap-line"></i> Learning advanced software paradigms',

            goalsRightHead: 'My Main Goal',
            goalP1: 'My primary long-term milestone is to become a top-tier international software engineer and a tech entrepreneur.',
            goalP2: 'I focus on transforming innovative concepts into functional tools, building user-friendly systems, and evolving my skills continuously.',
            goalP3: 'Solving challenging tasks through neat, structured logic and working on high-impact global projects are key parts of my roadmap.',

            mottoTitle: '— My Motto',
            mottoText: '"Knowledge is the key that opens opportunities, while discipline is the power that turns them into success."',

            contactTitle: 'Get in Touch',
            contactText: 'If you have ideas for new projects, partnerships, or business digitization plans, leave a message. I will contact you shortly.',
            inputName: 'Your Name',
            inputMsg: 'Your Message...',
            btnSubmit: '<i class="ri-send-plane-fill"></i> Send Message',
            searchInput: 'Search site...'
        }
    };

    const translatePage = (lang) => {
        const dict = langData[lang];
        
        // Lang button label
        langBtn.querySelector('span').textContent = dict.langName;

        // Navbar Links inside Sidebar
        const sidebarLinks = document.querySelectorAll('.sidebar-links a');
        if (sidebarLinks.length >= 7) {
            sidebarLinks[0].textContent = dict.navHome;
            sidebarLinks[1].textContent = dict.navAbout;
            sidebarLinks[2].textContent = dict.navSkills;
            sidebarLinks[3].textContent = dict.navDir;
            sidebarLinks[4].textContent = dict.navPrin;
            sidebarLinks[5].textContent = dict.navGoal;
            sidebarLinks[6].textContent = dict.navContact;
        }

        // Hero Section
        document.querySelector('.hero-text .greeting').innerHTML = dict.greeting;
        document.querySelector('.hero-text h2').innerHTML = dict.role;
        document.querySelector('.hero-text .summary').textContent = dict.summary;
        document.querySelector('.hero-text .cta-group a:nth-child(1)').innerHTML = dict.btnContact;
        document.querySelector('.hero-text .cta-group a:nth-child(2)').innerHTML = dict.btnProfile;

        // About Section
        document.querySelector('#about .section-title').textContent = dict.aboutTitle;
        document.querySelector('#about .about-left h3').textContent = dict.aboutLeftHead;
        const leftPs = document.querySelectorAll('#about .about-left p');
        leftPs[0].innerHTML = dict.aboutLeftP1;
        leftPs[1].innerHTML = dict.aboutLeftP2;
        leftPs[2].innerHTML = dict.aboutLeftP3;

        document.querySelector('#about .about-right h3').textContent = dict.aboutRightHead;
        const rightPs = document.querySelectorAll('#about .about-right p');
        rightPs[0].innerHTML = dict.aboutRightP1;
        rightPs[1].innerHTML = dict.aboutRightP2;
        rightPs[2].innerHTML = dict.aboutRightP3;

        // Skills Section
        document.querySelector('#skills .section-title').textContent = dict.skillsTitle;
        document.querySelector('#skills .section-subtitle').textContent = dict.skillsSubtitle;
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons[0].innerHTML = dict.tabProg;
        tabButtons[1].innerHTML = dict.tabEcom;
        tabButtons[2].innerHTML = dict.tabBus;
        tabButtons[3].innerHTML = dict.tabTools;

        // Directions Section
        document.querySelector('#directions .section-title').textContent = dict.dirTitle;
        document.querySelector('#directions .section-subtitle').textContent = dict.dirSubtitle;
        const dirCards = document.querySelectorAll('.direction-card');
        dirCards[0].querySelector('h3').textContent = dict.dirCard1H;
        dirCards[0].querySelector('p').textContent = dict.dirCard1P;
        dirCards[1].querySelector('h3').textContent = dict.dirCard2H;
        dirCards[1].querySelector('p').textContent = dict.dirCard2P;
        dirCards[2].querySelector('h3').textContent = dict.dirCard3H;
        dirCards[2].querySelector('p').textContent = dict.dirCard3P;
        dirCards[3].querySelector('h3').textContent = dict.dirCard4H;
        dirCards[3].querySelector('p').textContent = dict.dirCard4P;
        dirCards[4].querySelector('h3').textContent = dict.dirCard5H;
        dirCards[4].querySelector('p').textContent = dict.dirCard5P;
        dirCards[5].querySelector('h3').textContent = dict.dirCard6H;
        dirCards[5].querySelector('p').textContent = dict.dirCard6P;
        dirCards[6].querySelector('h3').textContent = dict.dirCard7H;
        dirCards[6].querySelector('p').textContent = dict.dirCard7P;

        // Principles Section
        document.querySelector('#principles .section-title').textContent = dict.prinTitle;
        document.querySelector('#principles .section-subtitle').textContent = dict.prinSubtitle;
        const prinCards = document.querySelectorAll('.principle-card');
        prinCards[0].querySelector('h3').textContent = dict.prinCard1H;
        prinCards[0].querySelector('p').textContent = dict.prinCard1P;
        prinCards[1].querySelector('h3').textContent = dict.prinCard2H;
        prinCards[1].querySelector('p').textContent = dict.prinCard2P;
        prinCards[2].querySelector('h3').textContent = dict.prinCard3H;
        prinCards[2].querySelector('p').textContent = dict.prinCard3P;
        prinCards[3].querySelector('h3').textContent = dict.prinCard4H;
        prinCards[3].querySelector('p').textContent = dict.prinCard4P;
        prinCards[4].querySelector('h3').textContent = dict.prinCard5H;
        prinCards[4].querySelector('p').textContent = dict.prinCard5P;
        prinCards[5].querySelector('h3').textContent = dict.prinCard6H;
        prinCards[5].querySelector('p').textContent = dict.prinCard6P;
        prinCards[6].querySelector('h3').textContent = dict.prinCard7H;
        prinCards[6].querySelector('p').textContent = dict.prinCard7P;
        prinCards[7].querySelector('h3').textContent = dict.prinCard8H;
        prinCards[7].querySelector('p').textContent = dict.prinCard8P;

        // Goals & Interests Section
        document.querySelector('#goals .interests-box h3').textContent = dict.goalsLeftHead;
        const intLis = document.querySelectorAll('.interests-list li');
        intLis[0].innerHTML = dict.goalInt1;
        intLis[1].innerHTML = dict.goalInt2;
        intLis[2].innerHTML = dict.goalInt3;
        intLis[3].innerHTML = dict.goalInt4;

        document.querySelector('#goals .goal-box h3').textContent = dict.goalsRightHead;
        const goalPs = document.querySelectorAll('.goal-box p');
        goalPs[0].textContent = dict.goalP1;
        goalPs[1].textContent = dict.goalP2;
        goalPs[2].textContent = dict.goalP3;

        // Motto Banner
        document.querySelector('.motto-banner blockquote').textContent = dict.mottoText;
        document.querySelector('.motto-banner cite').textContent = dict.mottoTitle;

        // Contact Section
        document.querySelector('#contact .section-title').textContent = dict.contactTitle;
        document.querySelector('#contact .contact-text').textContent = dict.contactText;
        document.querySelector('#name').placeholder = dict.inputName;
        document.querySelector('#message').placeholder = dict.inputMsg;
        document.querySelector('#contact-form button').innerHTML = dict.btnSubmit;

        // Search Input placeholder
        document.getElementById('search-input').placeholder = dict.searchInput;
    };

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'uz' ? 'en' : 'uz';
            translatePage(currentLang);
        });
    }
});
