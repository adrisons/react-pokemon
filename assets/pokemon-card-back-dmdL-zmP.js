import{r as i,R as d}from"./index-CiLvJqY1.js";const Y={bug:"#729f3f",dark:"#707070",dragon:"#53a4cf",electric:"#eed535",fairy:"#fdb9e9",fighting:"#d56723",fire:"#fd7d24",flying:"#3dc7ef",ghost:"#7b62a3",grass:"#9bcc50",ground:"#f7de3f",ice:"#51c4e7",normal:"#a4acaf",poison:"#b97fc9",psychic:"#f366b9",rock:"#a38c21",steel:"#9eb7b8",water:"#4592c4"};/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=(...t)=>t.filter((e,o,n)=>!!e&&e.trim()!==""&&n.indexOf(e)===o).join(" ").trim();/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,o,n)=>n?n.toUpperCase():o.toLowerCase());/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=t=>{const e=T(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var b={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},M=i.createContext({}),O=()=>i.useContext(M),$=i.forwardRef(({color:t,size:e,strokeWidth:o,absoluteStrokeWidth:n,className:a="",children:r,iconNode:u,...c},g)=>{const{size:s=24,strokeWidth:f=2,absoluteStrokeWidth:l=!1,color:p="currentColor",className:k=""}=O()??{},P=n??l?Number(o??f)*24/Number(e??s):o??f;return i.createElement("svg",{ref:g,...b,width:e??s??b.width,height:e??s??b.height,stroke:t??p,strokeWidth:P,className:A("lucide",k,a),...!r&&!I(c)&&{"aria-hidden":"true"},...c},[...u.map(([_,L])=>i.createElement(_,L)),...Array.isArray(r)?r:[r]])});/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=(t,e)=>{const o=i.forwardRef(({className:n,...a},r)=>i.createElement($,{ref:r,iconNode:e,className:A(`lucide-${E(S(t))}`,`lucide-${t}`,n),...a}));return o.displayName=S(t),o};/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],tt=B("arrow-left",U),W=300*1e3,C=new Map,m=new Map;async function j(t,e,{ttlMs:o=W}={}){const n=Date.now(),a=C.get(t);if(a&&a.expiresAt>n)return a.value;const r=m.get(t);if(r)return r;const u=e().then(c=>(C.set(t,{value:c,expiresAt:Date.now()+o}),c)).finally(()=>{m.delete(t)});return m.set(t,u),u}function D(t){C.delete(t),m.delete(t)}const N="https://pokeapi.co/api/v2";function v(t){return t.startsWith("http")?t:`${N}${t}`}async function R(t){const e=await fetch(t);if(!e.ok)throw new Error(`HTTP error: ${e.status}`);return e.json()}function h(t,e){const o=v(t);return j(o,()=>R(o),e)}function F(t){D(v(t))}const w="/pokemon?limit=10000&offset=0",K=3600*1e3;function et(t){return h(t)}function H(){return h(w,{ttlMs:K}).then(t=>t.results)}function z(){F(w)}const y=t=>{let e;const o=new Set,n=(s,f)=>{const l=typeof s=="function"?s(e):s;if(!Object.is(l,e)){const p=e;e=f??(typeof l!="object"||l===null)?l:Object.assign({},e,l),o.forEach(k=>k(e,p))}},a=()=>e,c={setState:n,getState:a,getInitialState:()=>g,subscribe:s=>(o.add(s),()=>o.delete(s))},g=e=t(n,a,c);return c},V=(t=>t?y(t):y),Z=t=>t;function q(t,e=Z){const o=d.useSyncExternalStore(t.subscribe,d.useCallback(()=>e(t.getState()),[t,e]),d.useCallback(()=>e(t.getInitialState()),[t,e]));return d.useDebugValue(o),o}const x=t=>{const e=V(t),o=n=>q(e,n);return Object.assign(o,e),o},G=(t=>t?x(t):x),ot=G((t,e)=>({allPokemons:null,loadAllPokemons:async()=>{const o=e().allPokemons;if(o)return o;const n=await H();return t({allPokemons:n}),n},resetAllPokemons:()=>{t({allPokemons:null}),z()}}));function Q(t){var e,o,n,a;return((n=(o=(e=t.sprites)==null?void 0:e.other)==null?void 0:o.dream_world)==null?void 0:n.front_default)??((a=t.sprites)==null?void 0:a.front_default)??null}function nt(t){const e=t.split("/").filter(Boolean);return e[e.length-1]}function at(t,e,o){return{id:t.id,name:t.name,types:t.types.map(n=>({slot:n.slot,typeName:n.type.name})),movesCount:t.moves.length,imageUrl:Q(t),stats:t.stats.map(n=>({name:n.stat.name,value:n.base_stat})),abilities:e,captureRate:(o==null?void 0:o.capture_rate)??0,isLegendary:(o==null?void 0:o.is_legendary)??!1,isMythical:(o==null?void 0:o.is_mythical)??!1,isBaby:(o==null?void 0:o.is_baby)??!1}}function rt(t){return h(`/pokemon/${t}`)}function st(t){return h(`/pokemon-species/${t}`)}const J={hp:"var(--color-stat-hp)",attack:"var(--color-stat-attack)",defense:"var(--color-stat-defense)","special-attack":"var(--color-stat-special-attack)","special-defense":"var(--color-stat-special-defense)",speed:"var(--color-stat-speed)"};function ct(t){return J[t]??"var(--color-text-muted)"}const lt="/react-pokemon/assets/pokemon-card-back-Dtz_FcBQ.svg";export{tt as A,lt as a,nt as b,B as c,h as d,rt as e,G as f,et as g,at as h,st as i,ct as s,Y as t,ot as u};
//# sourceMappingURL=pokemon-card-back-dmdL-zmP.js.map
