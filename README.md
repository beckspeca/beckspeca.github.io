# JAEWON.LOG

Astro와 Markdown으로 만든 개인 개발 블로그입니다. GitHub Pages 자동 배포가 설정되어 있습니다.

## 글 작성

`src/content/blog` 폴더에 Markdown 파일을 추가합니다. 기존 글의 frontmatter 형식을 복사하면 됩니다.

## 개인 정보 변경

사이트 제목, 작성자 이름, GitHub 주소는 `src/consts.ts`에서 변경합니다.

## 로컬 실행

```sh
npm install
npm run dev
```

## 배포

GitHub에서 `내아이디.github.io` 저장소를 만든 뒤 이 프로젝트를 푸시합니다. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택하면 이후 `main` 브랜치에 푸시할 때 자동 배포됩니다.
