/**
 * 좌석 선택 화면에서 실행될 스크립트입니다.
 */

function doSeatMagic() {
  const f = document.getElementById('oneStopFrame').contentWindow;

  const config = {
    좌석등급: '현장수령', /*현장수령S석(2회차), 노란색*/
    좌석구역: 'Floor 층 17 구역', /*98석 잔여*/
  };

  /** 좌석 등급을 선택합니다. */
  f.$(`#divGradeSummary tr:contains("${config.좌석등급}")`).click();

  /** 좌석 구역을 선택합니다. */
  f.$(`#divGradeSummary li:contains("${config.좌석구역}")`).click();

  /** 첫 번째 예매 가능한 좌석을 찍습니다. */
  f.$('#ez_canvas svg rect[fill!="#DDDDDD"]').get(1/*0은 전체 사각형 그 자체*/).dispatchEvent(new Event('click'));

  /** 가격 선택 화면으로 넘어갑니다. */
  f.$('#nextTicketSelection').click();
}

window.addEventListener('load', function () {
  console.log('행동 개시!');

  document.getElementById('oneStopFrame').contentWindow.addEventListener('keypress', function (e) {
    if (e.key === '/') {
      doSeatMagic();
    }
  }, false);

  window.addEventListener('keypress', function (e) {
    if (e.key === '/') {
      doSeatMagic();
    }
  }, false);

  console.log('준비 완료 >_<');
});
