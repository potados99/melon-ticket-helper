/**
 * 좌석 선택 화면에서 실행될 스크립트입니다.
 */

/** 제어 플래그 */
keep = false;

/** 적대적 함수 오버라이드 */
parent.rsrvPopupClose = function () { console.log('팝업을 닫어?? 눈도 깜짝 안한다!'); }

/** 로딩 세마포어 */
finishLoading = () => {};
loadingPromise = Promise.resolve();

async function doMagic(f/**frame*/) {
  /** 새로고침 전에 코드를 조금 바꿔줍니다. */
  f.setLoading = function (isloading) {
    if (isloading) {
      loadingPromise = new Promise((res, rej) => {
        finishLoading = res;
        // do nothing...
      });

      loadingOpen(" ");
    }else {
      finishLoading();

      setTimeout(function(){
        loadingClose();
      }, 500);
    }
  }

  /** 새로고침 합니다. */
  f.$('#btnReloadSchedule').click();
  await loadingPromise;

  /** 좌석 구역을 다 펼칩니다. */
  f.$(`#divGradeSummary tr:contains("VIP")`).first().click();
  f.$(`#divGradeSummary tr:contains("R")`).first().click();
  f.$(`#divGradeSummary tr:contains("S")`).first().click();
  f.$(`#divGradeSummary tr:contains("현장수령")`).first().click();
  f.$(`#divGradeSummary tr:contains("A")`).first().click();

  /** 좌석 구역 중 자리가 있는 것을 가져옵니다.. */
  const availableSections = f.$(`#divGradeSummary li span.seat_residual`).filter(function () { return Number.parseInt($(this).text()) !== 0 });
  if (availableSections.length === 0) {
    /** 없으면 다음 번에 시도합니다. */
    console.log('빙빙 돌아가는~ 회전목마처럼~');
    return true; /*keep going*/
  }

  /** 첫 번째 좌석 구역을 선택합니다. */
  availableSections.first().click();

  /** 첫 번째 예매 가능한 좌석을 찍습니다. */
  f.$('#ez_canvas svg rect[fill!="#DDDDDD"]').get(1/*0은 전체 사각형 그 자체*/).dispatchEvent(new Event('click'));

  /** 가격 선택 화면으로 넘어갑니다. */
  f.$('#nextTicketSelection').click();

  /** 작업을 멈춥니다. */
  console.log('끝나!');
  return false;
}

async function runOrStop() {
  keep = !keep;
  console.log(keep ? '시작해!' : '멈춰!');

  const f = document.getElementById('oneStopFrame').contentWindow;
  const sleep = (t) => new Promise(resolve => setTimeout(resolve, t));

  f.$('#viewAll').click();

  await sleep(500);

  while (keep) {
    try {
      const needMore = await doMagic(f);
      if (!needMore) {
        console.log('>_< 예ㅔ에ㅔㅔ!!!');
        break;
      }
    } catch (e) {
      console.error('아아악!');
    }

    await sleep(500);
  }
}

window.addEventListener('load', function () {
  console.log('행동 개시!');

  document.getElementById('oneStopFrame').contentWindow.addEventListener('keypress', function (e) {
    if (e.key === '/') {
      runOrStop();
    }
  }, false);

  window.addEventListener('keypress', function (e) {
    if (e.key === '/') {
      runOrStop();
    }
  }, false);

  console.log('준비 완료 >_<');
});
