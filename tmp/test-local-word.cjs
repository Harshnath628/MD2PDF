const fs=require("fs");
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
await page.locator('#file').setInputFiles('outputs/export-comparison/image-fixture/images.md'); await page.locator('#folder-input').setInputFiles(require('path').resolve('outputs/export-comparison/image-fixture')); await page.waitForFunction(()=>document.querySelector('#folder-status').textContent.startsWith('Folder connected')); await page.waitForFunction(()=>!document.querySelector('#print').disabled); await page.locator('#markdown').focus(); await page.locator('#markdown').press('Control+End'); await page.evaluate(async base64=>{const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));const transfer=new DataTransfer();transfer.items.add(new File([bytes],'clipboard-check.png',{type:'image/png'}));document.querySelector('#markdown').dispatchEvent(new ClipboardEvent('paste',{clipboardData:transfer,bubbles:true,cancelable:true}));},fs.readFileSync('outputs/export-comparison/image-fixture/images/chart.png').toString('base64')); await page.waitForFunction(()=>document.querySelector('#markdown').value.includes('/__md2pdf_image__/')&&!document.querySelector('#print').disabled); const result=page.waitForEvent('download',{timeout:90000});
await page.locator('#word').click();
const download=await result; await download.saveAs('outputs/export-comparison/local-images.docx');
console.log('DOWNLOAD',download.suggestedFilename());
console.log(await page.locator('footer').innerText());
}catch(e){console.error(e);process.exitCode=1}finally{await browser?.close();server.kill();}
})();


