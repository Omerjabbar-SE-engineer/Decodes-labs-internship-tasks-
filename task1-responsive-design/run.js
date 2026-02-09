const pages = document.querySelectorAll('.page');
const links = document.querySelectorAll('.navbar a');
const startBtn = document.getElementById('startBtn');

function showPage(pageName) {
    pages.forEach(page => page.classList.remove('active'));
    document.querySelector(`.${pageName}`).classList.add('active');
}

links.forEach(link => {
    link.addEventListener('click', () => {
        showPage(link.dataset.page);
    });
});

startBtn.addEventListener('click', () => {
    showPage('about');
});
