/****************************************************************
 * 삽입된 스크립트에서 공통으로 사용될 함수들을 모아놓은 파일입니다.
 *****************************************************************/

/**
 * 주어진 시간(밀리초)만큼 대기하는 Promise를 만들어 반환합니다.
 *
 * @param t 대기할 시간(밀리초)
 */
async function sleep(t) {
  return await new Promise(resolve => setTimeout(resolve, t));
}

/**
 * 주어진 Window에서 특정 키가 눌렸을 때에 수행할 동작을 지정합니다.
 *
 * @param keyPressListeningWindow 어떤 window에서 발생한 키 이벤트에 대해 동작을 수행할까요?
 * @param key 어떠한 키가 눌렸을 때에 동작을 수행할까요?
 * @param action 키가 눌렸을 때, 어떤 동작을 수행할까요?
 */
function onPressKey(keyPressListeningWindow, key, action) {
  window.addEventListener('load', function () {
    console.log('Window의 load 이벤트가 발생하였습니다.');

    keyPressListeningWindow.addEventListener('keypress', async function (e) {
      if (e.key === key) {
        console.log(`${keyPressListeningWindow.name}에서 ${key} 키가 눌렸습니다.`);
        action();
      }
    }, false);

    console.log(`이제 ${keyPressListeningWindow.name}에서 ${key} 키가 눌리면 반응할 것입니다.`);
  });
}

function filterTextNonZero() {
  return Number.parseInt($(this).text()) !== 0
}

function extractText() {
  return $(this).text();
}
