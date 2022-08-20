/****************************************************************
 * 좌석 선택 화면에서 실행될 스크립트입니다.
 *****************************************************************/

/**
 * 페이지에서 oneStopFrame을 찾아와주는 함수입니다.
 *
 * @returns {Window} 찾아온 oneStopFrame
 */
function theFrame() {
  if (window._theFrameInstance == null) {
    window._theFrameInstance = document.getElementById('oneStopFrame').contentWindow;
  }

  return window._theFrameInstance;
}

/**
 * 페이지와 프레임을 준비하는 함수입니다.
 * 새 변수를 정의하며, 기존 함수를 오버라이드합니다.
 */
function prepare() {
  /** 제어 플래그 */
  window.keepRunning = false;

  /** 적대적 함수 오버라이드 */
  parent.rsrvPopupClose = function () {
    console.log('원래라면 팝업을 닫아야 하지만, 무시합니다.');
  }

  /** 로딩 세마포어 */
  window.finishLoading = () => {
    console.warn('지금 이 타이밍에 이게 실행되면 안 됩니다 ㅠㅡㅠ');
  };
  window.loadingPromise = Promise.resolve();

  /** 로딩 함수 오버라이드 */
  theFrame().setLoading = function (isLoading) {
    if (isLoading) {
      window.loadingPromise = new Promise((res) => {
        window.finishLoading = res;
      });

      loadingOpen(' ');
    } else {
      window.finishLoading();

      setTimeout(function () {
        loadingClose();
      }, 500);
    }
  }
}

/**
 * 빈 자리를 찾아 존재하면 결제 창으로 넘어갑니다.
 *
 * 주어진 구역 중, 빈 자리가 하나 이상 있는 첫 번째 구역의
 * 첫 번째 자리를 선택 후 결제창으로 넘어갑니다.
 *
 * @returns {Promise<boolean>}
 */
async function doSeatMagic() {
  const targetSections = ['VIP', 'R', 'S', '현장수령', 'A'];

  /** 새로고침 후 로딩이 끝날 때까지 기다립니다. */
  theFrame().$('#btnReloadSchedule').click();
  await window.loadingPromise;

  /** 좌석 구역을 다 펼칩니다. */
  for (const section of targetSections) {
    theFrame().$(`#divGradeSummary tr:contains("${section}")`).first().click();
  }

  /** 좌석 구역 중 자리가 있는 것을 가져옵니다.. */
  const availableSections = theFrame().$(`#divGradeSummary li span.seat_residual`).filter(filterTextNonZero);

  if (availableSections.length === 0) {
    console.log('빈 자리가 있는 구역이 없습니다.');

    return true;
  } else {
    console.log(`빈 자리가 있는 구역이 발견되었습니다: ${availableSections.map(extractText)}`)

    /** 빈 자리가 있는 첫 번째 좌석 구역을 확장합니다. */
    availableSections.first().click();
    await sleep(50);

    /** 첫 번째 예매 가능한 좌석을 찍습니다. */
    theFrame().$('#ez_canvas svg rect[fill!="#DDDDDD"]').get(1/*0은 전체 사각형 그 자체*/).dispatchEvent(new Event('click'));
    await sleep(50);

    /** 가격 선택 화면으로 넘어갑니다. */
    theFrame().$('#nextTicketSelection').click();

    return false;
  }
}

/**
 * 빈 자리를 찾아 결제창으로 넘어가는 동작을 반복하거나 반복을 멈춥니다.
 *
 * @returns {Promise<void>}
 */
async function runOrStop() {
  window.keepRunning = !window.keepRunning;
  console.log(keepRunning ? '좌석 찾는 루프를 시작합니다.' : '좌석 찾는 루프를 멈춥니다.');

  theFrame().$('#viewAll').click();

  await sleep(500);

  while (window.keepRunning) {
    try {
      const keep = await doSeatMagic();
      if (!keep) {
        console.log('이제 좌석 찾는 루프를 멈춰도 됩니다.');
        break;
      }
    } catch (e) {
      console.error('좌석을 찾는 도중에 에러가 발생하였습니다:', e);
    }

    await sleep(100);
  }
}

try {
  prepare();
  onPressKey(theFrame(), '/', () => runOrStop());
  onPressKey(window, '/', () => runOrStop());
} catch (e) {
  alert(`스크립트를 준비하는 중에 문제가 발생하였습니다: ${e.message}`);
  throw e;
}
