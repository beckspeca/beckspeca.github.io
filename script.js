// 스크롤 시 네비게이션 바 스타일 변경
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.backgroundColor = '#1a1a1a';
        header.style.boxShadow = 'none';
    }
});

// 부드러운 스크롤 효과
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 게임 카드 호버 효과
const gameCards = document.querySelectorAll('.game-card');
gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
}); 

function applyGlitchEffect() {
    const glitchEl = document.querySelector('.glitch-text');
    if (!glitchEl) return;

    glitchEl.classList.add('glitch');

    // 300ms ~ 600ms 랜덤 지속
    const duration = Math.random() * 300 + 300;

    setTimeout(() => {
        glitchEl.classList.remove('glitch');
    }, duration);
}

// 6초 간격으로 랜덤 글리치 발동
setInterval(() => {
    applyGlitchEffect();
}, 6000);

// 초기 한 번 실행
window.addEventListener('DOMContentLoaded', applyGlitchEffect);

// 피드백 폼 처리
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        const feedbackData = {
            name: formData.get('name'),
            email: formData.get('email'),
            game: formData.get('game'),
            feedbackType: formData.get('feedback-type'),
            message: formData.get('message')
        };

        try {
            // 여기에 실제 서버 엔드포인트로 데이터를 전송하는 코드를 추가할 수 있습니다
            console.log('피드백 데이터:', feedbackData);
            
            // 성공 메시지 표시
            alert('피드백이 성공적으로 제출되었습니다. 감사합니다!');
            feedbackForm.reset();
        } catch (error) {
            console.error('피드백 제출 중 오류 발생:', error);
            alert('피드백 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
}
