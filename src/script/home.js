'use strict';

import { loadingAuth } from './utils.js';
import { login, logout, setupAuthListener, signUp } from './auth_fn.js';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const loginButton = document.querySelector('login-button');
const signUpButton = document.querySelector('sign_up-button');

///////Init
let isLogin = false;
let isloadingAuth = false;
setupAuthListener();

///////////////////////////////////////
// Fenêtre modale

const openModal = function (e) {
  e.preventDefault();

  let content;
  if (e.target.classList.contains('btn-login')) {
    isLogin = true;
    /*  <div class="error-container">
          <i class="fa-solid fa-circle-exclamation" style="color: red;"></i> 
             <p class="error-text">une erreur est survenue</p>
        </div> */
    content = `
    <label>Adresse e-mail</label>
    <input type="email" name="email" required/>
    <label>mot de passe</label>
    <input type="password" name="password" required />
    <button class="btn btn-auth" type="submit">Se connecter &rarr;</button>
   
    `;
  } else {
    isLogin = false;
    content = `<label>Prénom</label>
    <input type="text" name="prenom" required/>
    <label>Nom</label>
    <input type="text" name="nom" required/>
    <label>Adresse e-mail</label>
    <input type="email" name="email" required/>
    <label>mot de passe</label>
    <input type="password" name="password" required />
    <button class="btn btn-auth" type="submit">Créer le compte &rarr;</button>
    `;
  }

  const errorContent = document.querySelector('.error-container');
  document.querySelector('.modal__form').innerHTML = content;
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Défilement du bouton
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log(
    'Défilement actuel (X/Y)',
    window.pageXOffset,
    window.pageYOffset
  );

  console.log(
    'hauteur/largeur de la fenêtre',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Défilement
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Navigation de la page

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1. Ajouter un écouteur d'événement à l'élément parent commun
// 2. Déterminer quel élément a déclenché l'événement

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Stratégie de correspondance
  if (e.target.classList.contains('nav__link')) {
    // const id = e.target.getAttribute('href');
    // document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Composant à onglets

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Clause de protection
  if (!clicked) return;

  // Supprimer les classes actives
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activer l'onglet
  clicked.classList.add('operations__tab--active');

  // Activer la zone de contenu
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Animation de fondu du menu
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passage d'un "argument" au gestionnaire
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Navigation collante : API Intersection Observer

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Révéler les sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Chargement paresseux des images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Remplacer src par data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Curseur
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Fonctions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Diapositive suivante
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Gestionnaires d'événements
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();

/////////////////signup/////////////////

//get user infos
async function getUserData() {
  const fetchData = await fetch('./../../data.json');
  const data = await fetchData.json();
  return data.users;
}

document
  .querySelector('.modal__form')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const userData = {};

    try {
      if (isloadingAuth) return;
      isloadingAuth = true;

      if (isLogin) {
        const formData = new FormData(this);
        const email = formData.get('email');
        const password = formData.get('password');

        loadingAuth(isloadingAuth, isLogin);

        await login(email, password);
        // if (user) {
        //   window.location.href = `./src/pages/account.html?id=${user.uid}`;
        // }
      } else {
        const formData = new FormData(this);
        userData.prenom = formData.get('prenom');
        userData.nom = formData.get('nom');
        userData.email = formData.get('email');
        userData.password = formData.get('password');

        loadingAuth(isloadingAuth, isLogin);
        await signUp(userData);
      }
    } catch (e) {
    } finally {
      isloadingAuth = false;
      loadingAuth(isloadingAuth, isLogin);
    }
  });
