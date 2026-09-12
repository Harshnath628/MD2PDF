const fs=require('fs');
const { chromium } = require('C:/Users/Harsh Nath Tripathi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {spawn}=require('node:child_process');
(async()=>{
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5176'],{cwd:process.cwd(),windowsHide:true,stdio:'ignore'});
let browser;
try{
browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe'});
const page=await browser.newPage({acceptDownloads:true});
page.on('console',m=>console.log('CONSOLE',m.text()));
setInterval(async()=>console.log('STATUS',await page.locator('footer').innerText().catch(()=>'')),10000).unref();
page.on('pageerror',e=>console.log('PAGE ERROR',e.message));
for(let i=0;i<40;i++){try{await fetch('http://127.0.0.1:5176');break}catch{await new Promise(r=>setTimeout(r,250))}} await page.goto('http://127.0.0.1:5176');
await page.locator('#print').waitFor();
await page.waitForFunction(()=>!document.querySelector('#print').disabled);
await page.locator('#markdown').fill(fs.readFileSync('outputs/export-comparison/capabilities.md','utf8')); await page.waitForFunction(()=>!document.querySelector('#print').disabled); const result=page.waitForEvent('download',{timeout:90000});
await page.locator('#word').click();
const download=await result; await download.saveAs('outputs/export-comparison/capabilities.docx');
await page.evaluate(()=>{window.print=()=>{}}); await page.locator('#print').click(); await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('Print dialog opened')); await page.pdf({path:'outputs/export-comparison/capabilities.pdf',printBackground:true,preferCSSPageSize:true}); console.log('DOWNLOAD',download.suggestedFilename());
console.log(await page.locator('footer').innerText());
}catch(e){console.error(e);process.exitCode=1}finally{await browser?.close();server.kill();}
})();


