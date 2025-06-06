<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializa Tone.js para sons (o usuário precisa interagir com a página primeiro)
            let toneJsStarted = false;
            const startTone = async () => {
                if (!toneJsStarted) {
                    await Tone.start();
                    toneJsStarted = true;
                    // console.log("Tone.js started"); 
                }
            };
            document.body.addEventListener('click', startTone, { once: true });
            document.body.addEventListener('touchstart', startTone, { once: true });


            // Sintetizadores para os sons
            const popSynth = new Tone.NoiseSynth({
                noise: { type: "white" }, 
                envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 },
                volume: -12 
            }).toDestination();
             const filterPop = new Tone.Filter(800, "lowpass").toDestination(); 
             popSynth.connect(filterPop);


            const hoverSynth = new Tone.PluckSynth({ 
                attackNoise: 0.8, 
                dampening: 3000,
                resonance: 0.7,
                volume: -18 
            }).toDestination();
            
            // Função para dividir texto em letras para animação "bounce"
            function setupInteractiveTextBounce(elements) {
                elements.forEach(element => {
                    const isIconElement = element.querySelector('i') !== null;
                    
                    if (!isIconElement && !element.dataset.lettersProcessed) { 
                        const originalText = element.textContent.trim();
                        element.innerHTML = ''; 
                        originalText.split('').forEach((char) => {
                            const charSpan = document.createElement('span');
                            charSpan.textContent = char === ' ' ? '\u00A0' : char;
                            charSpan.classList.add('letter');
                            element.appendChild(charSpan);
                        });
                        element.dataset.lettersProcessed = 'true'; 
                    }

                    element.addEventListener('mouseenter', function() {
                        if (toneJsStarted) {
                            hoverSynth.triggerAttackRelease(isIconElement ? "F5" : "D5", "16n", Tone.now() + (isIconElement ? 0 : 0.02));
                        }
                        const targets = isIconElement ? [element.querySelector('i')] : Array.from(element.querySelectorAll('.letter'));
                        targets.forEach((target, index) => {
                            target.style.animation = 'none'; 
                            void target.offsetWidth; 
                            target.style.animation = `letterBounceHover 0.6s ease-out ${index * 0.05}s`; 
                        });
                    });

                    element.addEventListener('mouseleave', () => {
                         const targets = isIconElement ? [element.querySelector('i')] : Array.from(element.querySelectorAll('.letter'));
                         targets.forEach(target => {
                            target.style.animation = 'none'; 
                            target.style.transform = ''; 
                         });
                    });
                });
            }
            
            const interactiveElements = document.querySelectorAll('.bounce-hover-effect');
            setupInteractiveTextBounce(interactiveElements); 


            // Smooth scrolling for navigation links
            const navLinks = document.querySelectorAll('header nav a[href^="#"]');
            navLinks.forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerOffset = document.getElementById('navbar').offsetHeight;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        const navList = document.getElementById('nav-list');
                        if (navList.classList.contains('active')) {
                            navList.classList.remove('active');
                            document.getElementById('mobile-menu').setAttribute('aria-expanded', 'false');
                             document.getElementById('mobile-menu').innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    }
                });
            });

            // Highlight active nav link on scroll
            const sections = document.querySelectorAll('main section');
            const headerNavLinks = document.querySelectorAll('header nav a.nav-link');
            const navbar = document.getElementById('navbar');

            window.addEventListener('scroll', () => {
                let currentSectionId = '';
                const scrollPosition = window.pageYOffset + navbar.offsetHeight + 90;

                sections.forEach(section => {
                    if (scrollPosition >= section.offsetTop) {
                        currentSectionId = section.getAttribute('id');
                    }
                });

                headerNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            });

            // Mobile menu toggle
            const menuToggle = document.getElementById('mobile-menu');
            const navList = document.getElementById('nav-list');

            menuToggle.addEventListener('click', function() {
                navList.classList.toggle('active');
                const isExpanded = navList.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isExpanded);
                if (isExpanded) {
                    menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });

            // Set current year in footer
            document.getElementById('currentYear').textContent = new Date().getFullYear();

            // Cat Image Balloon Effect
            const heroCatContainer = document.getElementById('hero-cat-container'); 
            const catImage = document.getElementById('catImage'); 
            let burstTimeout;
            let isInflating = false; 
            let hasBurst = false; 

            function createBurstParticle(container) {
                const particle = document.createElement('div');
                particle.classList.add('particle-burst');
                container.appendChild(particle); 

                const size = Math.random() * 6 + 3;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                const colors = ["var(--primary-purple)", "var(--accent-light-purple)", "#FFFFFF", "#E0B0FF"];
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                const startX = (Math.random() - 0.5) * 20; 
                const startY = (Math.random() - 0.5) * 20;
                particle.style.left = `calc(50% + ${startX}px)`;
                particle.style.top = `calc(50% + ${startY}px)`;
                particle.style.setProperty('--particle-start-x', `0px`);
                particle.style.setProperty('--particle-start-y', `0px`);

                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 120 + 80; 
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;

                particle.style.setProperty('--particle-end-x', `${endX}px`);
                particle.style.setProperty('--particle-end-y', `${endY}px`);
                particle.style.setProperty('--random-burst-rotate', `${(Math.random() -0.5) * 720}deg`);


                particle.addEventListener('animationend', function() {
                    particle.remove();
                });
            }
            
            if (heroCatContainer && catImage) {
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    heroSection.addEventListener('mousemove', function(e) {
                        if (heroCatContainer.classList.contains('inflating') || heroCatContainer.classList.contains('bursting')) return; 

                        const rect = heroSection.getBoundingClientRect();
                        const mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                        const mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

                        const translateIntensity = 12; 
                        const rotateIntensity = 3;    

                        const translateX = -mouseX * translateIntensity;
                        const translateY = -mouseY * translateIntensity;
                        
                        const rotateX = mouseY * rotateIntensity; 
                        const rotateY = -mouseX * rotateIntensity; 

                        heroCatContainer.style.transform = `translateX(${translateX}px) translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    });
                     heroSection.addEventListener('mouseleave', function() {
                        if (!heroCatContainer.classList.contains('inflating') && !heroCatContainer.classList.contains('bursting')) {
                            heroCatContainer.style.transform = 'translateX(0px) translateY(0px) rotateX(0deg) rotateY(0deg)';
                        }
                    });
                }

                heroCatContainer.addEventListener('mouseenter', function() {
                    if (hasBurst) return; 

                    heroCatContainer.classList.add('inflating');
                    isInflating = true;
                    clearTimeout(burstTimeout); 

                    burstTimeout = setTimeout(() => {
                        if (isInflating) { 
                            heroCatContainer.classList.remove('inflating');
                            heroCatContainer.classList.add('bursting');
                            hasBurst = true; 

                            if(toneJsStarted) popSynth.triggerAttackRelease("G3", "16n", Tone.now()); 

                            for (let i = 0; i < 70; i++) { 
                                createBurstParticle(heroCatContainer);
                            }
                        }
                    }, 1000); 
                });

                heroCatContainer.addEventListener('mouseleave', function() { 
                    clearTimeout(burstTimeout);
                    isInflating = false; 
                    
                    if (hasBurst) {
                        setTimeout(() => {
                            heroCatContainer.classList.remove('bursting');
                            hasBurst = false; 
                        }, 700); 
                    } else {
                        heroCatContainer.classList.remove('inflating');
                    }
                });
            }

            // Animação de bounce para o nome no rodapé
            const footerNameElement = document.getElementById('footerName');
            if (footerNameElement) {
                const nameText = footerNameElement.textContent;
                footerNameElement.innerHTML = ''; 
                nameText.split('').forEach((char, index) => {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char === ' ' ? '\u00A0' : char; 
                    charSpan.classList.add('letter');
                    charSpan.style.animationDelay = `${index * 0.1}s`;
                    footerNameElement.appendChild(charSpan);
                });
            }

            // Animação de bounce para o nome no HERO
            const heroNameElement = document.getElementById('heroName');
            if (heroNameElement) {
                const heroNameText = heroNameElement.textContent;
                heroNameElement.innerHTML = ''; 
                heroNameText.split('').forEach((char, index) => {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char === ' ' ? '\u00A0' : char;
                    charSpan.classList.add('letter'); 
                    charSpan.style.animationName = 'heroNameBounce'; 
                    charSpan.style.animationDelay = `${index * 0.08}s`; 
                    heroNameElement.appendChild(charSpan);
                });
            }

            // Gemini API Integration for Service Descriptions
            const geminiButtons = document.querySelectorAll('.gemini-button');
            const messageModal = document.getElementById('messageModal');

            function showMessage(message, isError = false) {
                messageModal.textContent = message;
                messageModal.className = 'message-modal show' + (isError ? ' error' : '');
                setTimeout(() => {
                    messageModal.classList.remove('show');
                }, 3000);
            }

            geminiButtons.forEach(button => {
                button.addEventListener('click', async function() {
                    await startTone(); 
                    const serviceItem = this.closest('.service-item');
                    const serviceTitle = serviceItem.querySelector('.service-title').textContent;
                    const currentDescription = serviceItem.querySelector('.service-description').textContent;
                    const geminiDescriptionDiv = serviceItem.querySelector('.gemini-description');
                    const loadingIndicator = serviceItem.querySelector('.loading-indicator');

                    geminiDescriptionDiv.style.display = 'none';
                    loadingIndicator.style.display = 'block';
                    this.disabled = true;
                    this.textContent = 'Gerando...';


                    const prompt = `Por favor, gere uma descrição de serviço alternativa, mais criativa e focada em benefícios para um web designer. Use um tom profissional, mas engajador e um pouco divertido. A descrição deve ter no máximo 3 frases curtas. Não use emojis.
                    Serviço Atual: "${serviceTitle}"
                    Descrição Atual: "${currentDescription}"
                    Nova Descrição Criativa:`;

                    try {
                        let chatHistory = [];
                        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                        const payload = { contents: chatHistory };
                        const apiKey = ""; 
                        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                        
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            console.error('Erro da API Gemini:', errorData);
                            throw new Error(`Erro da API: ${errorData.error?.message || response.statusText}`);
                        }

                        const result = await response.json();
                        
                        if (result.candidates && result.candidates.length > 0 &&
                            result.candidates[0].content && result.candidates[0].content.parts &&
                            result.candidates[0].content.parts.length > 0) {
                            const newDescription = result.candidates[0].content.parts[0].text;
                            geminiDescriptionDiv.textContent = newDescription.trim();
                            geminiDescriptionDiv.style.display = 'block';
                        } else {
                            console.error('Resposta inesperada da API Gemini:', result);
                            throw new Error('Não foi possível gerar a descrição. Tente novamente.');
                        }
                    } catch (error) {
                        console.error('Erro ao chamar a API Gemini:', error);
                        showMessage(`Erro ao gerar descrição: ${error.message}`, true);
                        geminiDescriptionDiv.textContent = 'Não foi possível gerar uma nova descrição no momento.';
                        geminiDescriptionDiv.style.display = 'block';
                    } finally {
                        loadingIndicator.style.display = 'none';
                        this.disabled = false;
                        this.innerHTML = '✨ Gerar Descrição Criativa';
                    }
                });
            });

        });
    </script>
