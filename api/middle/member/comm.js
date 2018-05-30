const config = require('../../config')
const jwtService = require('../../service.js')
const jwtExpress = require('express-jwt')
const superagent = require('superagent')

const { redisFetching, } = require('../redisHandler')

const debug = require('debug')('READR:api:member:comm')
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const sendEmail = ({ email, content, cb, subject, token, }) => {
  debug('About to send email')
  debug('>>>', subject)
  debug('>>>', email)
  superagent
  .post(`${apiHost}/mail`)
  .send({
    receiver: [ email, ],
    bcc: config.EMAIL_BCC || [],
    subject,
    content,
  })
  .end((err, res) => {
    debug('Sending done.')
    cb && cb(err, res, token)
  })
}
const sendActivationMail = ({ id, email, role, type, }, cb) => {
  const tokenForActivation = jwtService.generateActivateAccountJwt({
    id, role, type,
  })
  sendEmail({
    email,
    subject: 'READr 新聞媒體實驗邀請函',
    token: tokenForActivation,
    cb,
    content: `<p>親愛的朋友您好，</p><br>
    <p>首先，感謝您報名參與此次 READr 的封測活動。</p><br>
    <p>在資訊傳播容易且方向多元的這個網路世代，READr 希望能將單向傳播的「新聞」產製過程開放，讓新聞的產製由「Reporter」、「Engineer」、「Audience」及「Designer」一起共同完成，更期許能透過讀者的參與，讓新聞內容更加完善，也希望更透明的編輯室能讓新聞傳播有更多元的方向。</p><br>
    <p>這裏，我們誠摯地邀請您成為第一批 READr 的使用者，參與封測活動，</p>
    <p>請點擊以下的連結開通您的帳號並設定密碼：</p><br>
    <a href="${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}">${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}</a><br>
    <p>期待您來與我們一同參與  READr 新聞媒體實驗。</p>
    <p>感謝。</p><br>
    <p>READr 團隊 敬上</p>
    <p>此電子郵件由系統自動發出，請勿直接回覆，謝謝您。</p>`,
  })
}
const sendRecoverPwdEmail = ({ email, }, cb) => {
  const token = jwtService.generateResetToken({
    id: email,
    type: 'email',
  })
  sendEmail({
    email,
    subject: 'READr 重設密碼通知',
    token,
    cb,
    content: `<p>親愛的會員：</p><br>
    <p>我們已收到您更改密碼之要求，</p>
    <p>請點擊以下連結重新設定密碼：</p>
    <a href="${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/recoverpwd/${token}">${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/recoverpwd/${token}</a><br>
    <p>READr 團隊 敬上</p>
    <p>此電子郵件由系統自動發出，請勿直接回覆，謝謝您。</p>`,
  })
}
const sendInvitationEmail = ({ id, email, role, type, inviter, }) => {
  return new Promise(resolve => {
    const tokenForActivation = jwtService.generateActivateAccountJwt({
      id, role, type,
    })
    sendEmail({
      email,
      subject: 'READr 新聞媒體實驗邀請函',
      token: tokenForActivation,
      cb: (e, r) => resolve({ error: e, response: r, }),
      content: `<p>親愛的朋友您好，</p><br>
      <p>您的朋友 <span class="font-weight: bold;">${inviter || ''}</span> 為您報名參與此次 READr 的封測活動。</p>
      <p>在資訊傳播容易且方向多元的這個網路世代，READr 希望能將單向傳播的「新聞」產製過程開放，讓新聞的產製由「Reporter」、「Engineer」、「Audience」及「Designer」一起共同完成，更期許能透過讀者的參與，讓新聞內容更加完善，也希望更透明的編輯室能讓新聞傳播有更多元的方向。</p>
      <p>我們誠摯地邀請您參與 READr 封測活動，</p>
      <p>請點擊以下的連結開通您的帳號並設定密碼：</p><br>
      <a href="${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}">${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}</a><br>
      <p>期待您來與我們一同參與  READr 新聞媒體實驗。</p>
      <p>感謝。</p><br>
      <p>READr 團隊 敬上</p>
      <p>此電子郵件由系統自動發出，請勿直接回覆，謝謝您。</p>`,
    })  
  })
}
const sendInitializingSuccessEmail = ({ email, }) => {
  return new Promise(resolve => {
    sendEmail({
      email,
      subject: 'READr 計畫給先行者的一封信',
      cb: (e, r) => resolve({ error: e, response: r, }),
      content: `<p>親愛的朋友您好，</p><br>
      <p>我是簡信昌，READr （音同：reader）計畫的主要發起人，是一個從網路業工程師轉入新聞媒體業的二年級生。<br>
      我投身開源社群多年，也是零時政府（g0v）的參與者，但在 2014 年 g0v 因為太陽花運動而爆紅時，看到媒體荒<br>
      謬地編造這個公民科技組織的故事，心中便種下了改變的念頭。在偶然的機會下，一路從報導者到鏡傳媒，踏入了新聞<br>媒體圈。</p>
      <p>在這兩年多來，看著圈內的大家為了爭取讀者的眼球煞費苦心，整體廣告市場卻越來越差。許多優秀的新聞人才慢<br>
      慢離開了這個領域，我開始思考，為什麼在網路發達的這個時代，新聞在某種程度上卻越來越邊緣？</p>
      <p>在思考與實作的過程中，我心中媒體樣貌也漸漸成形。READr 計畫來自鏡週刊程式設計中心團隊，過去一年多，<br>
      我們嘗試做了不少<a href="https://www.mirrormedia.mg/story/2017visual-review/">數位專題</a>，<br>
      與其他新聞團隊不同的是，是由記者、設計師、工程師同時貢獻各自的專長所產出，而非單獨由一方主導。</p>
      <p>我們發現，其他同事常常帶來不同的問題意識與觀點，讓專題的面向變得更多元。有時候是工程師提出的網頁呈現<br>
      恰好切中新聞核心、有時候是設計師提到視覺互動的方法，產製過程中少了「新聞」的框架制肘，反而讓新聞變得更有<br>
      趣了。不過，誰說新聞只能有一種面貌呢？</p>
      <p>那麼，新聞的內容只能由傳統編輯台來決定嗎？如果讓讀者同時參與新聞產製，會發生什麼事？若在新聞產製時就敞開<br>
      大門，讓同樣身懷各種專長的讀者一起參與，題目會不會更有可看性？「開放編輯室」能不能不再只是口號？</p>
      <p>去年，我們做了政治獻金的報導。在台灣，選舉時政治獻金的明細只以紙本形式被典藏在監察院，根本沒有應用的價值。<br>
      團隊便在手工數位化之後、正式撰寫報導之前，就將資料在網路上公開，讓各方人馬可以運用這份資料，嘗試更多的應用。</p>
      <p>當時，除了媒體之外，也有許多資料科學家、鄉民，看到了我們忽略的角度，做出有趣的成果。倘若能真正的「開放」，<br>
      新聞的產品就不再只會有最終的報導，還能從過程中長出更多的應用、或在這份基礎上繼續茁壯。</p>
      <p>在這個沒有人能壟斷資訊的時代，新聞媒體該扮演什麼樣的角色？又該提供什麼樣的資訊給讀者？READr 是我們為了解<br>
      答問題而進行的實驗。每個人都有自己的資訊來源跟同溫層，READr 想做的不是取代，而是補充，再更進一步將這些互動帶<br>
      進編輯室裡。</p>
      <p>我們每週會邀請活躍於不同領域的客座總編，跟讀者分享他們最近關心的事。讀者對這些議題的關切程度也將成為編輯室選題<br>
      的重要指標。背後的計算不會只是瀏覽次數這麼簡單，還包括新聞事件背後的議題、事件與事件的關聯性等等。例如我們會看到農<br>
      地違建的新聞，也有一些人關心山上的非法民宿，看起來雖然都像是獨立事件，但它們都指向了國土計畫這個重大議題。</p>
      <p>因此，讀者的討論與互動會影響接下來進行專題的方向。議題形成後，記者會不定時公布報導進行的進度，也會在不影響報導<br>
      的原則下，公布取得的資料及素材。而參與開放編輯室的讀者可以隨時參與討論，記者會評估讀者提供的方向或資料，進行調查。<br>
      在專題發布完成之後，開放編輯室的內容與討論也會完全公開。</p>
      <p>信任是媒體存在的前提，現在卻成為我們努力追回的目標。當這個時代各種資訊真假難辨，我們希望透過更開放的報導製程，<br>
      嘗試尋回讀者的信任。這個社群或許有機會擺脫點閱率迷思，凝聚更多關心議題的使用者，對新聞供需兩方都會產生正向的循環。<br>
      公開透明在新聞編輯室能做到多大的程度？透明與參與會是找回信任的方法嗎？如果你也在乎這些問題，我們想邀請你一起來尋找<br>
      答案。</p>
      <p>目前網站正在進行封閉測試，若有使用上有任何問題，請來這裡回報：</p>
      <p><a href="https://goo.gl/forms/zkoPKdjxacxjKAKr2">https://goo.gl/forms/zkoPKdjxacxjKAKr2</a></p>
      <br>
      <p>READr 簡信昌 敬上</p>`,
    })  
  })
}

const fetchMem = (member) => new Promise((resolve, reject) => {
  superagent
  .get(`${apiHost}/member/${member.id}`)
  .end((err, res) => {
    debug('err')
    debug(err)
    if (!err) {
      resolve({ res, })      
    } else {
      reject({ err, res, })
    }
  })
})

const verifyToken = function (req, res, next) {
  const key = req.url.split('/')[1]
  redisFetching(key, ({ error, data, }) => {
    error && console.error('Error occurred during fetching token from redis.')
    error && console.error(error)
    data && debug(data)
    if (!data) {
      jwtService.verifyToken(key, (err, decoded) => {
        if (err) {
          res.status(403).send(`Invalid token.`)
        } else {
          req.decoded = decoded
          next()
        }
      })
    } else {
      res.status(403).send(`Expired token.`)      
    }
  })
}

const authVerify = jwtExpress({
  secret: config.JWT_SECRET,
  isRevoked: (req, payload, done) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && req.headers.authorization.split(' ')[1]
    redisFetching(token, ({ error, data, }) => {
      error && console.error('Error occurred during fetching token from redis.')
      error && console.error(error)
      done(null, !!data)
    })
  },
})

module.exports = {
  authVerify,
  fetchMem,
  sendActivationMail,
  sendRecoverPwdEmail,
  sendInvitationEmail,
  sendInitializingSuccessEmail,
  verifyToken,
}
