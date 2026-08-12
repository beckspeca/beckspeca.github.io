---
title: 'Astro로 빠른 정적 블로그 만들기'
description: '서버 없이도 빠르고 관리하기 쉬운 개발 블로그를 구성한 이유를 정리합니다.'
pubDate: '2026-08-10'
tags: ['Astro', 'GitHub Pages']
---

Astro는 콘텐츠 중심 웹사이트를 만들기에 잘 맞습니다. 기본적으로 필요한 JavaScript만 브라우저에 보내기 때문에 가볍고, Markdown 파일을 곧바로 글로 사용할 수 있습니다.

## 이 구성의 장점

1. 글이 Git 저장소에 함께 보관됩니다.
2. Markdown만 알면 새로운 글을 쓸 수 있습니다.
3. GitHub Pages에서 무료로 운영할 수 있습니다.
4. RSS와 사이트맵을 빌드할 때 자동 생성합니다.

새 글은 `src/content/blog` 폴더에 Markdown 파일을 하나 추가하면 됩니다.
