/**
 * 페이지에 주어진 src의 스크립트를 삽입하여
 * 해당 스크립트가 페이지 context 내에서 실행될 수 있도록 도와줍니다.
 *
 * 이는 크롬 확장의 보안 정책으로 인해 content script가
 * 기존 페이지의 자바스크립트 영역에 접근할 수 없는 문제를 해결하기 위해 고안된 것입니다.
 *
 * @param src 삽입할 스크립트의 url
 */
function injectCode(src) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = function () {
    console.log(`${src} 스크립트가 삽입되었습니다.`);
    this.remove();
  };

  const nonNull = (v) => {
    if (v == null) throw new Error('주어진 값이 null입니다!');
    return v;
  }

  // 이 스크립트는 <head> 요소가 생성되기 전에 실행됩니다.
  // 따라서 스크립트를 <html>에 추가하여 줍니다.
  nonNull(document.head || document.documentElement).appendChild(script);
}
