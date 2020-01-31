export function createPointsIntroContent (memberCenter = 'member') {
  return [
    `
      <h1>為什麼有 READr 點數？</h1>
      <p>READr 團隊在封測時，聽到好多讀者說明想要贊助以及小額付款加入編輯室。</p>
      <p>因此我們想到最簡單的小額付款方式，就是採用「READr 點數」來作為消費紀錄，並且讓支持 READr 的你，可以先消費後付款，無負擔的閱讀體驗。</p>
    `,
    `
      <h1>READr 點數是什麼？</h1>
      <p>在 READr 你可以使用點數，閱讀「編輯室專屬」的資料，也可以給予使用「贊助」功能，給予所認同的編輯室實質鼓勵。幫助 READr 新聞編輯室進行更多深入追蹤報導。</p>
    `,
    `
      <h1>什麼時候需要 READr 點數呢？</h1>
      <p>READr 會在不同情境發送點數，例如新會員的你，是否有發現會員中心已經有 100 點了呢？（沒錯，這就是專屬你的歡迎禮！）</p>
      <p class="more-margin">READr 點數 1 點 = 新台幣 1 元，並採取先使用、後付款制度。</p>
      <p>當你有點數時，可以盡情使用。當你沒有點數（點數少於 0 ）的時候，READr 提供貼心服務，讓你繼續使用，直到點數少於 -300 時，才需要結清付款，付完款即歸零重新計算。</p>
      <p>這個設計希望可以提供支持 READr 的你，友善的小額付款體驗，不需要頻繁的加值或付款。</p>
      <h2><span>舉例說明</span></h2>
      <p class="more-margin bold">小 R 贊助了<a href="https://www.readr.tw/series/dollclaw-machine" target="_blank">《夾娃娃崛起》</a>的專題 100 點，此時 小 R 剩餘點數為 0 點，此時不需要付款，仍可以繼續使用點數，贊助專題或是加入編輯室。</p>
      <p class="more-margin bold">當小 R 持續使用點數到剩餘點數為 -266 點時，看到<a href="https://www.readr.tw/series/rent2" target="_blank">《入不敷租》</a>報導，很想贊助 。</p>
      <p class="more-margin bold">如果小 R ，想贊助 20 點，則剩餘點數為 -286 點，不需要結清。</p>
      <p class="more-margin bold">如果小 R 想要贊助<a href="https://www.readr.tw/series/rent2" target="_blank">《入不敷租》</a> 100 點，則剩餘點數將變成 -366 點，少於 -300 點。此時，小 R 須一次結清 366 點，支付 366 點。在支付 366 點（366元台幣）後，點數會歸 0，小 R 又可以繼續使用點數了，直到剩餘點數再次小於 -300 時。</p>
    `,
    `
      <h1>要如何進行結清呢？</h1>
      <p>當你點數使用到小於 -300 點時，系統會自動跳出通知，請你結清付款。也就是說，沒有通知就不用付款啦！</p>
    `,
    `
      <h1>如何使用 READr 點數呢？</h1>
      <h2><span>加入編輯室</span></h2>
      <p>READr 點數可用來加入 READr 各專題的編輯室，加入後，即可看到所有編輯室內容，包含編輯筆記、專題使用的數據資料等。</p>
      <p>使用的步驟為：</p>
      <p>1.點選有「<img class="lock-icon" src="/public/icons/lock.png">編輯室專屬」內容</p>
      <p>2.確認需要點數</p>
      <p>3.完成點數支付</p>
      <p>4.成功加入編輯室，閱讀編輯室內容</p>
      <h2><span>贊助內容</span></h2>
      <p>READr 點數可以用來贊助專題、筆記，只要看到「贊助<img class="donate-icon" src="/public/icons/donate.png">」的內容，都是可以贊助的，幫助編輯室產生更多好內容！</p>
      <p>1.按下<img class="donate-icon" src="/public/icons/donate.png">按鈕</p>
      <p>2.填寫想要贊助的點數</p>
      <p>3.確認贊助點數明細</p>
      <p>4.完成贊助</p>
      <p>備註：會員單筆最低贊助額為 30 點（新台幣 30 元），最高金額上限為 2000 點（新台幣 2000 元）。</p>
    `,
    `
      <h1>如何查詢 READr 點數餘額？</h1>
      <p>您可進入<a href="/${memberCenter}">會員中心</a>，點選<a href="/${memberCenter}/records/point-manager">點數記錄</a>，即可看到剩餘點數、加入過的編輯室、贊助過的專題。</p>
    `,
    `
      <h1>點數結清後，還可以退費嗎？</h1>
      <p>一旦任一會員選擇使用贊助功能的同時，本公司即推定該會員係民法上之成年人而具有完全行為能力，訂單一旦成立後，該交易即生效不得撤銷，且會員完成贊助交易後不論任何事由皆不得退款。</p>
    `
  ]
}

export const FOOTER_MESSAGE = `<p>如果除了以上有其他問題，都歡迎來信 <a href="mailto:readr@readr.tw">&lt;readr@readr.tw&gt;</a> 討論喔！</p>`
