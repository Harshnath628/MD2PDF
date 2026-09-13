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
await page.locator('#markdown').fill('# My saved draft'); await page.waitForFunction(()=>JSON.parse(localStorage.getItem('md2pdf.draft.v1')).text==='# My saved draft'); await page.reload(); await page.waitForFunction(()=>!document.querySelector('#print').disabled); if(!(await page.locator('#markdown').inputValue()).startsWith('# Formatting reference')) throw Error('Sample not loaded'); if(await page.evaluate(()=>JSON.parse(localStorage.getItem('md2pdf.draft.v1')).text)!=='# My saved draft') throw Error('Draft overwritten'); await page.locator('#restore-draft').click(); if(await page.locator('#markdown').inputValue()!=='# My saved draft') throw Error('Restore failed'); console.log('PASS: reload opens sample; draft preserved; restore works.');
}catch(e){console.error(e);process.exitCode=1}finally{await browser?.close();server.kill();}
})();


