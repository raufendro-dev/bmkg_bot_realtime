const { Builder, By,Key, until } = require('selenium-webdriver');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options()
.setChromeBinaryPath('/usr/bin/google-chrome')
options.addArguments('--headless');
options.addArguments('--disable-gpu');
const startUrl = 'https://www.bmkg.go.id/gempabumi/gempabumi-realtime.bmkg';


// const username = '';
// const password = '';
const token = 'Telegram Token kalian'
const chatId = ['chatid kalian']


const bot = new TelegramBot(token, { polling: false });

// Create a function to send a message to the bot
function sendTelegramMessage(chatid, message) {

    bot.sendMessage(chatid, message)
    .then(() => console.log(`Message sent: ${message}`))
    .catch((error) => console.error(`Error sending message: ${error}`));

}

async function bkmkg(){
  const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

  const driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  try {
    await driver.get(startUrl);



    
    
    const waktu = await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Wilayah'])[1]/following::td[2]")).getText();
    const lintang = await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Wilayah'])[1]/following::td[3]")).getText();
    const bujur = await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Wilayah'])[1]/following::td[4]")).getText();
    const magnitudo = await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Wilayah'])[1]/following::td[5]")).getText();
    const kedalaman = await driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Wilayah'])[1]/following::td[6]")).getText();
    const lokasi = await driver.findElement(By.xpath("//td[7]/a")).getText();


    

    var file = fs.readFileSync("/home/raufendro/bmkg_bot/log.txt", "utf8");
    var gmaps_link = 'https://www.google.com/maps/search/?api=1&query='+lintang+','+bujur;
    var pesan = 'Gempa Terdeteksi\n'+'Waktu (UTC): '+waktu+'\n'+'Lintang : '+lintang+'\n'+'Bujur : '+bujur+'\n'+'Kedalaman : '+kedalaman+'\n'+'Magnitudo : '+magnitudo+'\n'+'Lokasi : '+lokasi+'\n'+gmaps_link;
    
    
    if(pesan==file){
      console.log('Masih Sama');
    } else {
      console.log(pesan);
    
      fs.writeFile("/home/raufendro/bmkg_bot/log.txt", pesan, function (err) {

        // Checks if there is an error
        if (err) return console.log(err);
      });
      for(var i = 0; i<chatId.length;i++){
        await sleep(3000);
        await sendTelegramMessage(chatId[i],pesan);
        await sleep(2000);
        
      }
    }
   
  } finally {
    await driver.quit();
  }
}
setInterval(bkmkg, 30000);

