/**
 * 회차 선택 화면에서 실행될 스크립트입니다.
 */

async function doScheduleMagic() {
  const config = {
    날짜: '03일'
  };

  const sleep = (t) => new Promise(resolve => setTimeout(resolve, t));

  /** 날짜를 선택합니다. */
  $(`#list_date li.item_date:contains("${config.날짜}")`).click()

  await sleep(200);

  /** 예매 창으로 넘어갑니다. */
  $('#ticketReservation_Btn').click();
}

window.addEventListener('load', function () {
  console.log('행동 개시!');

  window.addEventListener('keypress', async function (e) {
    if (e.key === '/') {
      doScheduleMagic();
    }
  }, false);

  console.log('준비 완료 >_<');
});

