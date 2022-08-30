// noinspection JSJQueryEfficiency

/****************************************************************
 * 좌석 선택 화면에서 실행될 스크립트입니다.
 *****************************************************************/

const seatSelectionConfig = {
  amongTheseSections: ['VIP', 'R', 'S', '현장수령', 'A'],
  // amongTheseSections: ['A'],
}

/**
 * 페이지와 프레임을 준비하는 함수입니다.
 * 새 변수를 정의하며, 기존 함수를 오버라이드합니다.
 */
function prepare() {
  const declarations = {
    runStates: {
      keepRunning: false,
      toggleKeepRunning: () => {
        runStates.keepRunning = !runStates.keepRunning;
      }
    },

    loadingStates: {
      loadingPromise: Promise.resolve(),
      finishLoading: () => {
        console.warn('지금 이 타이밍에 이게 실행되면 안 됩니다 ㅠㅡㅠ');
      },
    },

    get frame() {
      if (window._theFrameInstance == null) {
        window._theFrameInstance = document.getElementById('oneStopFrame').contentWindow;
      }

      return window._theFrameInstance;
    }
  };

  const overrides = {
    getLoadingPage: function (bShow) {
      if (bShow === true) {
        loadingStates.loadingPromise = new Promise((res) => {
          loadingStates.finishLoading = res;
        });

        if ($('body').find('#loading_layer').length === 0) {
          var _ds = [];
          _ds.push('<div class="layer_comm loading full_h" id="loading_layer">');
          _ds.push('<div class="bg"></div>');
          _ds.push('<div class="inner">');
          _ds.push('<span class="rotate"></span>');
          _ds.push('<span class="bounce"></span>');
          _ds.push('</div>');
          _ds.push('</div>');
          $('body').append($(_ds.join('')));
        } else {
          $('body').find('#loading_layer').css('display', '');
        }
      } else {
        window.finishLoading();

        $('#loading_layer').css('display', 'none');
      }
    }
  };

  Object.assign(window, declarations, overrides);

  $('#btnComplete').click(function () {
    $(this).trigger('touchend');
  })
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
  /** 새로고침 후 로딩이 끝날 때까지 기다립니다. */
  frame.$('#btnReloadSchedule').click();
  await loadingStates.loadingPromise;

  for (const section of seatSelectionConfig.amongTheseSections) {
    /** 구역 열기 */
    frame.$(`#div_grade_summary li`).filter(function () {
      return $(this).text().startsWith(section)
    }).get(0).dispatchEvent(new Event('click'));

    await sleep(50);

    /** 좌석 구역 중 자리가 있는 것을 가져옵니다. */
    const availableSections = frame.$('#div_block_summary li').filter(function () {
      return Number.parseInt($(this).find('span.seat_residual strong').text()) !== 0;
    });

    await sleep(50);

    if (availableSections.length === 0) {
      console.log('빈 자리가 있는 구역이 없습니다.');
      continue;
    }

    console.log(`빈 자리가 있는 구역이 발견되었습니다: ${availableSections.map(extractText).get().join(', ')}`);

    availableSections.first().click();

    await sleep(50);

    frame.$('#nextTicketSelection').click();

    await sleep(1000);

    frame.$('#ez_canvas svg rect[fill!="#DDDDDD"]').get(1/*0은 전체 사각형 그 자체*/).dispatchEvent(new Event('click'));

    await sleep(50);

    frame.$('#nextTicketSelection').click();

    return false;
  }

  return true;
}

/**
 * 빈 자리를 찾아 결제창으로 넘어가는 동작을 반복하거나 반복을 멈춥니다.
 *
 * @returns {Promise<void>}
 */
async function runOrStop() {
  window.keepRunning = !window.keepRunning;
  console.log(keepRunning ? '좌석 찾는 루프를 시작합니다.' : '좌석 찾는 루프를 멈춥니다.');

  frame.$('#viewAll').click();

  await sleep(500);

  while (keepRunning) {
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
  onPressKey(frame, '/', () => runOrStop());
  onPressKey(window, '/', () => runOrStop());
} catch (e) {
  alert(`스크립트를 준비하는 중에 문제가 발생하였습니다: ${e.message}`);
  throw e;
}
