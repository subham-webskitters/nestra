
// Rotating Text Animation - Hero Section

$(function(){
  const ANIM=500, PAUSE=2000, BUF=4;
  const $w=$(".rotating-text"); if(!$w.length) return;
  if(!$w.find(".rotating-text-inner").length) $w.children("span").wrapAll('<div class="rotating-text-inner"></div>');
  const $inner=$w.find(".rotating-text-inner");

  const copyProps = ["font-family","font-size","font-weight","font-style","letter-spacing","word-spacing","text-transform","line-height","padding-left","padding-right","box-sizing"];
  function measure($el){
    const cs=window.getComputedStyle($el[0]);
    const $t=$el.clone().css({position:"absolute",visibility:"hidden",whiteSpace:"nowrap",display:"inline-block",boxSizing:"border-box"}).appendTo("body");
    copyProps.forEach(p=>{ try{$t.css(p,cs.getPropertyValue(p));}catch(e){} });
    const w=Math.ceil($t[0].getBoundingClientRect().width); $t.remove(); return w;
  }
  function rowH(){ const $f=$inner.children("span").first(); const $t=$f.clone().css({position:"absolute",visibility:"hidden",whiteSpace:"nowrap",display:"inline-block",boxSizing:"border-box"}).appendTo("body"); try{$t.css("font-size",getComputedStyle($f[0]).fontSize);$t.css("line-height",getComputedStyle($f[0]).lineHeight);}catch(e){}; const h=Math.ceil($t[0].getBoundingClientRect().height); $t.remove(); return h; }

  let H=rowH();
  function apply($el){ const w=measure($el)+BUF; $w.css("width",w+"px"); $inner.css("width",w+"px"); }

  apply($inner.children("span").first());
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(()=>{ H=rowH(); apply($inner.children("span").first()); }).catch(()=>{});

  let rt;
  function rotate(){
    const $all=$inner.children("span"); if($all.length<=1) return;
    const $cur=$all.eq(0), $next=$all.eq(1);
    apply($next);
    requestAnimationFrame(()=> $inner.css("transform","translateY(-"+H+"px)"));
    $inner.one("transitionend",(e)=>{ if(e.originalEvent && e.originalEvent.propertyName!=="transform") return;
      $inner.append($cur);
      const prev=$inner.css("transition"); $inner.css("transition","none").css("transform","translateY(0)"); $inner[0].offsetHeight; $inner.css("transition",prev||("transform "+ANIM+"ms cubic-bezier(.78,0,.13,1)"));
      const final=measure($inner.children("span").first())+BUF; const pW=$w.css("transition"); $w.css("transition","none").css("width",final+"px"); $w[0].offsetHeight; $w.css("transition",pW||"width 320ms cubic-bezier(.2,.8,.2,1)");
    });
  }
  rt=setInterval(rotate,PAUSE);
  $w.data("rotator",{pause:()=>{clearInterval(rt);rt=null;},resume:()=>{if(!rt) rt=setInterval(rotate,PAUSE);}});
  $(window).on("resize",(()=>{ let t; return ()=>{ clearTimeout(t); t=setTimeout(()=>{ H=rowH(); apply($inner.children("span").first()); },160); }; })());
});

// Rotating Text Animation - Hero Section - End






// Rotating Text Animation - Use Anywhere

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".rotating-text-animation").forEach(wrapper => {

        const spans = Array.from(wrapper.querySelectorAll("span"));
        if (spans.length <= 1) return;

        // Create inner wrapper
        const inner = document.createElement("div");
        inner.className = "rotating-text-animation-inner";

        spans.forEach(span => inner.appendChild(span));
        wrapper.innerHTML = "";
        wrapper.appendChild(inner);

        const lineHeight = spans[0].offsetHeight;

        setInterval(() => {

            // STEP 1: Animate UP by one item
            inner.style.transition = "transform 800ms cubic-bezier(0.78, 0, 0.13, 1)";
            inner.style.transform = `translateY(-${lineHeight}px)`;

            // STEP 2: After animation finishes
            setTimeout(() => {

                // Move first item to bottom
                inner.appendChild(inner.children[0]);

                // Instantly reset position (NO animation)
                inner.style.transition = "none";
                inner.style.transform = "translateY(0)";

            }, 600);

        }, 2500);

    });

});

// Rotating Text Animation - Use Anywhere End Here



