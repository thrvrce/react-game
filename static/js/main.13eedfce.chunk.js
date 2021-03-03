(this["webpackJsonpreact-game"]=this["webpackJsonpreact-game"]||[]).push([[0],[,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(1),a=n.n(r),c=n(7),l=n.n(c),u=(n(13),n(8)),s=n(2),i=(n(14),n(15),n(0));function o(e){var t=e.newGameHAndler,n=e.toggleFullScreen,r=e.fullScreenButtonValue;return Object(i.jsxs)("div",{className:"ControlPanel",children:[Object(i.jsx)("input",{type:"button",value:"New Game",className:" controlButton",onClick:function(){return t()}}),Object(i.jsx)("input",{type:"button",value:r,className:" controlButton",onClick:function(){n()}})]})}n(17),n(18);function d(e){return Object(i.jsxs)("div",{className:"Indicator",children:[Object(i.jsx)("div",{className:"Indicator-Name",children:e.name}),Object(i.jsx)("div",{className:"Indicator-Value",children:e.value})]})}var f="up",m="daown",v="left",j="right";function h(e){return(e<10?"0":"")+e.toString()}var b=100/85*100;function p(e){return Object(i.jsxs)("div",{className:"CurrentGameStatistics",children:[Object(i.jsx)(d,{name:"Time",value:"".concat(h(Math.floor(e.gameTime/60)),":").concat(h(e.gameTime%60||0))}),Object(i.jsx)(d,{name:"Moves",value:e.movedCells}),Object(i.jsx)(d,{name:"Merges",value:e.cellMerges}),Object(i.jsx)(d,{name:"Score",value:e.score})]})}n(19);function O(e){var t="";switch(e){case 2:t="#eee4da";break;case 4:t="#eee1c9";break;case 8:t="#f3b27a";break;case 16:t="#f69664";break;case 32:t="#f77c5f";break;case 64:t="#f75f3b";break;case 128:t="#edd073";break;case 256:t="#edcc62";break;default:t="rgba(238, 228, 218, 0.35)"}return t}function g(e,t){switch(e){case j:return t*b;case v:return-t*b;default:return 0}}function x(e,t){switch(e){case m:return t*b;case f:return-t*b;default:return 0}}function w(e){var t=e.gameCells,n=e.isCellAppearance,r=e.transitionDirection,c=e.cellAnimationEndHandler,l=e.cellTransitionEndHandler,u="".concat(100/Math.sqrt(t.length),"%"),s=a.a.useRef(null),o=a.a.useRef(!1),d=a.a.useRef(!1);return o.current=n,d.current=""!==r,Object(i.jsx)("div",{ref:s,className:"GameCanvas",onAnimationEnd:function e(){o.current&&(o.current=!1,c(),s.current&&s.current.removeEventListener("animationend",e))},onTransitionEnd:function e(){d.current&&(d.current=!1,l(),s.current&&s.current.removeEventListener("transitionend",e))},children:t.map((function(e,t){var a=r?e.prevValue:e.curValue,c=""!==r&&0!==e.path,l={color:null!==a&&a<8?"#776e65":"#f9f6f2",background:O(a),animation:n&&e.prevValue!==e.curValue&&e.curValue&&e.isUpdatedOrNew?"insertNewCells .3s linear":"",transform:c?"translate(".concat(g(r,e.path),"%, ").concat(x(r,e.path),"%)"):"",transition:c?"transform .3s":""};return Object(i.jsx)("div",{ref:s,className:"GameCanvas-CellWrapper",style:{width:u,height:u},children:Object(i.jsx)("div",{className:"GameCanvas-CellBackground",children:Object(i.jsx)("div",{className:"GameCanvas-Cell",style:l,children:a})})},t.toString())}))})}n(20);function N(e){return Math.round(10*e)/10}function C(e){return Object(i.jsxs)("div",{className:"SettingsWrapper",children:[Object(i.jsx)("div",{className:"settingsPanelName",children:"Settings:"}),Object(i.jsx)("div",{className:"Parameters",children:Object(i.jsxs)("div",{className:"Volume parameter",children:[" Volume level: ",h(10*N(e.volume)),Object(i.jsxs)("div",{className:"settingControls",children:[Object(i.jsx)("input",{type:"button",value:"+",className:"controlButton ",onClick:function(){return e.setvolume((function(e){return e<1?N(e)+.1:1}))}}),Object(i.jsx)("input",{type:"button",value:"-",className:"controlButton",onClick:function(){return e.setvolume((function(e){return e>0?N(e)-.1:0}))}}),Object(i.jsx)("input",{type:"button",value:"".concat(N(e.volume)?"OFF":"ON"),className:"controlButton",onClick:function(){return e.setvolume((function(e){return e?0:.5}))}})]})]})})]})}var V=n(4),S=n.p+"static/media/points.6a2a0b58.wav",k=n.p+"static/media/move.f1e4d610.wav",M=n.p+"static/media/click.49635200.mp3",A=n.p+"static/media/noChange.df3e968c.flac",E=[f,m,v,j];function y(e,t,n){for(var r,a=[],c=[],l=0;l<e.length;l++)null!==e[l].curValue&&c.push(l);for(var u=1;u<=t;u+=1)for(var s=!0;s;){var i=(r=Math.pow(n,2),Math.floor(Math.random()*r));c.includes(i)||(s=!1,c.push(i),a.push({indexForInsert:i,gameCell:Math.floor(10*Math.random())<9?{curValue:2,prevValue:null,isUpdatedOrNew:!0,path:0}:{curValue:4,prevValue:null,isUpdatedOrNew:!0,path:0}}))}return a.forEach((function(t){return e[t.indexForInsert]=t.gameCell})),e}function I(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:4,t=2,n=new Array(Math.pow(e,2)).fill({curValue:null,prevValue:null,isUpdatedOrNew:!1,path:0}),r=0;r<n.length;r++)n[r]={curValue:null,prevValue:null,isUpdatedOrNew:!1,path:0};return n=y(n,t,e)}function U(){var e=a.a.useState((new Date).toISOString()),t=Object(s.a)(e,2),n=t[0],r=t[1],c=a.a.useState(0),l=Object(s.a)(c,2),d=l[0],h=l[1],b=a.a.useState(0),O=Object(s.a)(b,2),g=O[0],x=O[1],N=a.a.useState(0),U=Object(s.a)(N,2),B=U[0],F=U[1],G=a.a.useState(0),T=Object(s.a)(G,2),L=T[0],R=T[1],H=a.a.useState(function(){var e=localStorage.getItem("2048game");return e?JSON.parse(e).gameCells:I()}()),q=Object(s.a)(H,2),D=q[0],J=q[1],P=a.a.useState("Open in fullscreen"),W=Object(s.a)(P,2),_=W[0],z=W[1],K=a.a.useState(!0),Q=Object(s.a)(K,2),X=Q[0],Y=Q[1],Z=a.a.useState(""),$=Object(s.a)(Z,2),ee=$[0],te=$[1],ne=a.a.useRef(!1),re=a.a.useRef(null),ae=a.a.useState(1),ce=Object(s.a)(ae,2),le=ce[0],ue=ce[1],se=Object(V.a)(S,{volume:le}),ie=Object(s.a)(se,1)[0],oe=Object(V.a)(k,{volume:le}),de=Object(s.a)(oe,1)[0],fe=Object(V.a)(M,{volume:le}),me=Object(s.a)(fe,1)[0],ve=Object(V.a)(A,{volume:le}),je=Object(s.a)(ve,1)[0],he=a.a.useCallback((function(e){if(ne.current){!function(e,t,n,r,a,c){var l={gameCells:e,score:t,cellMerges:n,movedCells:r,gameTime:a,volume:c};localStorage.setItem("2048game",JSON.stringify(l))}(D,d,g,B,L,le),ne.current=!1;var t=function(e){switch(e){case"ArrowUp":return f;case"ArrowDown":return m;case"ArrowRight":return j;case"ArrowLeft":return v;default:return""}}(e.key);if(E.includes(t)){var n=function(e,t){var n=e,r=!1,a=0,c=0,l=0,u=Math.sqrt(n.length),s=0,i=0,o=0,d=0;switch(t){case f:s=0,d=u-1,i=1,o=u;break;case m:s=n.length-u,d=n.length-1,i=1,o=-u;break;case v:s=0,d=n.length-u,i=u,o=1;break;case j:s=u-1,d=n.length-1,i=u,o=-1}n.forEach((function(e){return e.prevValue=e.curValue}));for(var h=s;h<=d;h+=i){for(var b=[],p=0;p<u;p++)b.push(h+o*p);for(var O=h+o;b.includes(O);O+=o){for(var g=0,x=!0;x;){var w=O-g*o,N=n[w],C=w-o,V=n[C];if(!N||!V||!b.includes(w)||!b.includes(C))break;N.curValue?void 0!==V&&(null===V.curValue||V.curValue===N.curValue&&!1===V.isUpdatedOrNew&&!1===N.isUpdatedOrNew)?(null===V.curValue?V.curValue=N.curValue:(V.curValue=2*V.curValue,V.isUpdatedOrNew=!0,a=+V.curValue,c+=1),N.curValue=null,n[O].path+=1,g+=1,r=!0):x=!1:g+=1}n[O].path>0&&(l+=1)}}return{isArrChanged:r,newArr:n,points:a,cellMerges:c,movedCells:l}}(D,t),r=n.isArrChanged,a=n.newArr,c=n.points,l=n.cellMerges,s=n.movedCells;r?(J(Object(u.a)(a)),te(t),h((function(e){return e+c})),x((function(e){return e+l})),F((function(e){return e+s})),c?ie():de()):(J(y(D,1,Math.sqrt(D.length))),Y(!0),je())}}}),[D,ie,de,je,D,d,g,B,L,le]);return a.a.useEffect((function(){return window.addEventListener("keydown",he),function(){return window.removeEventListener("keydown",he)}}),[he]),a.a.useEffect((function(){var e=setInterval((function(){return R((function(e){return Math.floor(e+1)}))}),1e3);return function(){return clearInterval(e)}}),[n]),Object(i.jsxs)("div",{ref:re,className:"GameField",children:[Object(i.jsx)(C,{volume:le,setvolume:ue}),Object(i.jsx)(o,{newGameHAndler:function(){me(),J(I()),Y(!0),h(0),x(0),F(0),R(0),r((new Date).toISOString())},toggleFullScreen:function(){me(),document.fullscreenElement?(document.exitFullscreen(),z("Open in fullscreen")):null!==re.current&&(re.current.requestFullscreen(),z("Close fullscreen"))},fullScreenButtonValue:_}),Object(i.jsx)(p,{score:d,cellMerges:g,movedCells:B,gameTime:L}),Object(i.jsx)(w,{gameCells:D,isCellAppearance:X,transitionDirection:ee,cellAnimationEndHandler:function(){Y(!1),J(D.map((function(e){return e.prevValue=null,e.isUpdatedOrNew=!1,e.path=0,e}))),ne.current=!0},cellTransitionEndHandler:function(){J(y(D,1,Math.sqrt(D.length))),Y(!0),te("")}})]})}n(21);var B=n.p+"static/media/rs_school_js.ad178c0d.svg",F=n.p+"static/media/github.8eebd666.png";function G(){return Object(i.jsxs)("footer",{children:[Object(i.jsx)("a",{href:"https://rs.school/js/",target:"blank",children:Object(i.jsxs)("div",{children:[Object(i.jsx)("img",{src:B,alt:"schoolLogo"}),"RSS-School"]})}),Object(i.jsx)("a",{href:"https://github.com/thrvrce/react-game",target:"blank",children:Object(i.jsxs)("div",{children:[Object(i.jsx)("img",{src:F,alt:"githubLogo"}),"Viktor Avdeev"]})}),Object(i.jsx)("div",{children:"2021"})]})}l.a.render(Object(i.jsx)(a.a.StrictMode,{children:Object(i.jsxs)("div",{className:"mainContent",children:[Object(i.jsx)(U,{}),Object(i.jsx)(G,{})]})}),document.getElementById("root"))}],[[22,1,2]]]);
//# sourceMappingURL=main.13eedfce.chunk.js.map