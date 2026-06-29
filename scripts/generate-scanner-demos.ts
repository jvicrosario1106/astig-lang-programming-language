// import { writeFileSync } from 'fs';
// import { join } from 'path';

// const outputDirectory = join(__dirname, '..', 'demo-examples');
// const repeatCount = 250;

// const demoPrograms: Record<string, string> = {
//   'scanner-demo-1.stg': `
// fHUncTH!0Ns mHA1Ns() {
//   c0hNsTz nH4mH3s:sTRh1Ngz = "Astig";
//   lH3tsz cH0uHNtHs:iHNtSZ = 5;
//   pHR!HNTs(nH4mH3s);
//   !HFs(cH0uHNtHs >= 5) { pHR!HNTs("high"); } eHLSEs { pHR!HNTs("low"); }
// }
// `.trim(),

//   'scanner-demo-2.stg': `
// fHUncTH!0Ns mHA1Ns() {
//   vH4rs cH0uHNtHs:iHNtSZ = 10;
//   cH0uHNtHs += 1;
//   cH0uHNtHs -= 1;
//   pHR!HNTs((cH0uHNtHs + 10) * 2);
// }
// `.trim(),

//   'scanner-demo-3.stg': `
// fHUncTH!0Ns mHA1Ns() {
//   vH4rs cH0uHNtHs:iHNtSZ = 0;
//   wH1lEs(cH0uHNtHs < 10) { cH0uHNtHs += 1; }
//   dH0s { cH0uHNtHs -= 1; } wH1lEs(cH0uHNtHs > 0);
//   fH0rs(vH4rs iH1s:iHNtSZ = 0; iH1s < 5; iH1s = iH1s + 1) { pHR!HNTs(iH1s); }
// }
// `.trim(),

//   'scanner-demo-4.stg': `
// iHNcHLuHD3s libHs.stg

// rH3cH0rHDz gH4mH3s {
//   sH0rH3s:iHNtSZ,
//   nH4mH3s:sTRh1Ngz
// }

// eHXpH0RTz fHUncTH!0Ns dHD1SPL4Ys(nH4mH3s:sTRh1Ngz) {
//   pHR!HNTs(nH4mH3s);
//   rH3tHUrns;
// }

// fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
//   rH3tHUrns xH1s + yH2s;
// }

// fHUncTH!0Ns mHA1Ns() {
//   vH4rs yH2s:gH4mH3s = nHEWs gH4mH3s { sH0rH3s = aHDs(7, -2), nH4mH3s = "Astig" };
//   pHR!HNTs(yH2s.sH0rH3s);
//   pHR!HNTs(yH2s.nH4mH3s);
//   pHR!HNTs(tRueHz);
//   pHR!HNTs(gH4s());
// }
// `.trim(),
// };

// for (const [fileName, programBlock] of Object.entries(demoPrograms)) {
//   const repeatedBody = Array.from({ length: repeatCount }, () => programBlock).join('\n\n');
//   writeFileSync(join(outputDirectory, fileName), `${repeatedBody}\n`, 'utf8');
// }

// console.log(`Generated ${Object.keys(demoPrograms).length} scanner demo files.`);
