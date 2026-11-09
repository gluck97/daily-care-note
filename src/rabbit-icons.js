(()=>{'use strict';
const el=(t,cl)=>{const e=document.createElement(t);if(cl)e.className=cl;return e;};
function sprite(kind,index){const s=el('span','rabbit-sprite '+(kind==='food'?'food-rabbit':'symptom-rabbit')),cols=kind==='food'?5:4;s.style.backgroundPosition=(index%cols)*100/(cols-1)+'% '+Math.floor(index/cols)*100/3+'%';s.setAttribute('aria-hidden','true');return s;}
const body='<g stroke="#647d61" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="32" cy="57" rx="17" ry="16" fill="#fffefa"/><ellipse cx="23" cy="72" rx="8" ry="4" fill="#fffefa"/><ellipse cx="42" cy="72" rx="8" ry="4" fill="#fffefa"/><path d="M22 24C10 5 17-1 23 6L29 20C31 1 42 0 42 10L38 24C49 27 51 37 45 44C39 50 23 50 17 43C11 35 14 27 22 24Z" fill="#fffefa"/><path d="m20 8 5 13M37 8l-3 12" stroke="#efb9ad" stroke-width="3"/><circle cx="24" cy="34" r="1.8" fill="#47603f" stroke="none"/><circle cx="37" cy="34" r="1.8" fill="#47603f" stroke="none"/><path d="M28 40q4 3 7-1M15 52l9 8M48 53l-8 7" fill="none"/></g>';
const signs={
reflux:'<path d="M29 49v6q-9-1-10 7q0 9 12 8q12-1 10-13q-1-6-7-5v-3" fill="#f5d8ba" stroke="#ba9673" stroke-width="2"/><path d="M30 62q7-5 2-14V43m-4 4 4-4 4 4" fill="none" stroke="#cf8c64" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
toilet:'<path d="M8 60h48q-2 12-24 13Q10 72 8 60Z" fill="#dbe9de" stroke="#79917d" stroke-width="2"/><path d="M26 73v5h16" fill="none" stroke="#79917d" stroke-width="3"/>',
pee:'<path d="M44 48h17l-2 24H46Z" fill="#f4f5e7" stroke="#889b7f" stroke-width="2"/><path d="M46 59h13l-1 11H47Z" fill="#e7d09c"/>',
vomit:'<path d="M35 40q10 5 12 11" stroke="#a7b78a" stroke-width="3" fill="none"/><path d="M37 58h26q-3 13-13 13q-11 0-13-13Z" fill="#dae5c7" stroke="#82966a" stroke-width="2"/>',
sleep:'<path d="M8 62q21-7 48 0v14H8Z" fill="#dbe5c9" stroke="#8b9b77" stroke-width="2"/><path d="M47 15h11l-10 9h11" stroke="#ac9b79" stroke-width="2" fill="none"/>',
clock:'<circle cx="49" cy="60" r="13" fill="#fff8e6" stroke="#929f7e" stroke-width="2"/><path d="M49 51v9l7 4" fill="none" stroke="#929f7e" stroke-width="2"/>',
gas:'<path d="M5 56h15q12 0 10-7q-2-5-6-2M3 63h18" fill="none" stroke="#9bb5b0" stroke-width="3" stroke-linecap="round"/>',
fever:'<path d="M52 41v20a7 7 0 1 0 7 0V41q-4-6-7 0Z" fill="#f5eee2" stroke="#8b9d8d" stroke-width="2"/><path d="M55 48v19" stroke="#d4a68c" stroke-width="3"/><circle cx="55" cy="67" r="3" fill="#d4a68c"/>',
chest:'<path d="M31 53q-8-10-12-2q-2 6 12 13q14-8 12-14q-4-7-12 3Z" fill="#dda99c" stroke="#ba8b80" stroke-width="1.5"/>',
breath:'<path d="M43 38q11-4 16 1M43 44q14 0 18 5M43 49q11 4 13 9" fill="none" stroke="#9bbcc1" stroke-width="2.5" stroke-linecap="round"/>',
blood:'<path d="M52 46q-12 17 0 19q12-2 0-19Z" fill="#cf9386"/>',
swelling:'<ellipse cx="44" cy="70" rx="12" ry="8" fill="#f0c5b2" stroke="#ab9c7e" stroke-width="2"/>',
dizzy:'<path d="M15 22q-10-14 0-14q13 2 2 9q-7 2-4-5M48 13q10-8 13 1" fill="none" stroke="#afac8e" stroke-width="2.5"/>',
speech:'<path d="M42 2h20v20H50l-7 6v-6h-1Z" fill="#edf1e2" stroke="#829579" stroke-width="2"/><path d="M47 8h10M47 14h7" stroke="#a0b08d" stroke-width="2"/>',
scale:'<rect x="8" y="68" width="48" height="12" rx="4" fill="#d6e3d1" stroke="#8a9e80" stroke-width="2"/><path d="m27 72 10 0-5 5Z" fill="#fffdf4"/>',
bp:'<rect x="42" y="46" width="18" height="13" rx="4" fill="#d7e5d4" stroke="#79917d" stroke-width="2"/><path d="M59 52q7 5 0 10" fill="none" stroke="#79917d" stroke-width="2"/>',
foodCount:'<circle cx="16" cy="58" r="4" fill="#d3dbb9"/><circle cx="32" cy="58" r="4" fill="#d3dbb9"/><circle cx="48" cy="58" r="4" fill="#d3dbb9"/>',
};
function signal(key){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 68 82');s.setAttribute('class','care-icon rabbit-signal');s.setAttribute('aria-hidden','true');s.innerHTML=body+(signs[key]||signs.clock);return s;}
window.RabbitIcons={sprite,signal};})();
