<script>
  import { interpret } from "$lib/evalutor";

  export let curve;
  export let w,h;
  export let params;
  export let pageParams;
  export let grid;
  export let focus = false;
  export let highlight;

  const dasharray = {S: "0", D: `${curve.w} ${2*curve.w}`, d: `.5 ${3*curve.w}`};
  function getPoints(params, page) {
    const dl = interpret(curve.domain[0], params, page, 0)
    const dr = interpret(curve.domain[1], params, page, 0)
    const gridDom = (grid.r - grid.l);
    const funcDomStartPct = (dl - grid.l)/gridDom;
    const funcDomLength = (dr - dl)/gridDom;
    const gridRng = (grid.t - grid.b);
    let domPctX, mathX, mathY, percentX, percentY;
    let points = "";
    for (let i = 0; i < curve.res; i++) {
      domPctX = i / (curve.res - 1);
      percentX = funcDomStartPct + (domPctX * funcDomLength);
      mathX = grid.l + percentX * gridDom;
      mathY = interpret(curve.f, params, page, mathX);
      percentY = (mathY - grid.b) / gridRng;
      points = points + `${percentX*w}, ${h - percentY*h} `
    }
    return points;
  };
  $: points = getPoints(params, pageParams);
</script>

<polyline points={points} fill="none" stroke={curve.color}
  stroke-dasharray={dasharray[curve.stroke]} stroke-linejoin="round" stroke-linecap="round"
  stroke-width={focus ? curve.w + 2 : curve.w}
/>
<polyline class="cpt" points={points} fill="none" stroke-width="20" stroke="#00000000"
on:click={() => highlight({id: curve.id, label: curve.label, type: "curve", color: curve.color})}
/>
<!--on:mouseenter={() => isHovered = true} on:mouseout={() => isHovered = false} on:blur={() => isHovered = false} -->
