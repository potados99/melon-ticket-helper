/****************************************************************
 * 회차 선택 화면에서 실행될 스크립트입니다.
 *****************************************************************/

/**
 * 회차를 바꾸고 싶다면 여기에서!
 *
 * @type {{containingThisText: string}}
 */
const scheduleSelectionConfig = {
  containingThisText: '2022.9.18'
}

/**
 * 정해진 설정대로 주어진 회차를 선택하고 좌석 선택 화면으로 넘어갑니다.
 *
 * @returns {Promise<void>}
 */
async function doScheduleMagic() {
  /** 대문짝만한 "예매하기" 버튼을 누릅니다.  */
  $('#buttonArea .box_full_btn a').click();

  /** 잠깐 쉬어 줍니다. 목록이 뜰 때까지 기다려야 하거든요. */
  await sleep(3000);

  /** 정해진 회차를 찾아줍니다. */
  const theWantedSchedule = $(`.schedule_datalist_Btn:contains("${scheduleSelectionConfig.containingThisText}")`);
  if (theWantedSchedule.length === 0) {
    alert(`앗, 텍스트 "${scheduleSelectionConfig.containingThisText}"를 포함하는 회차가 없어요! :(`);
    return;
  }

  /** 찾은 회차를 눌러줍니다. */
  theWantedSchedule.click();
}

try {
  onPressKey(window, '/', () => doScheduleMagic());
} catch (e) {
  alert(`스크립트를 준비하는 중에 문제가 발생하였습니다: ${e.message}`);
  throw e;
}
