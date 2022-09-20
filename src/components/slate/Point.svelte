<script>
  import { interpret } from "$lib/evalutor";

  export let point;
  export let w,h;
  export let params;
  export let pageParams;
  export let grid;
  export let sizeX=1,sizeY=1;
  export let focus;
  export let highlight;

  function setHighlight() {
    highlight({id: point.id, label: point.label, type: "point", color: point.color})
  }

  function dasharray(pattern, w) {
    switch (pattern) {
      case "S": return "0";
      case "D": return `${w} ${2*w}`;
      case "d": return `.5 ${3*w}`;
    }
  };
  const wPct = w/(grid.r - grid.l);
  const hPct = h/(grid.t - grid.b);
  const x0 = -grid.l * wPct;
  const y0 = h + (grid.b) * hPct;
  function getP(params, page) {
    const x = interpret(point.x, params, page, 0);
    const y = interpret(point.y, params, page, x);
    const X = (x - grid.l) * wPct;
    const Y = (y - grid.b) * hPct;
    return [String(X), String(h - Y)];
  };
  $: [x, y] = getP(params, pageParams);
</script>

{#if point.markX}
  <line x1={x} y1={y} x2={x} y2={y0} stroke={point.xC} stroke-width={point.xW}
    stroke-dasharray={dasharray(point.xS, point.xW)} stroke-linecap="round" />
{/if}
{#if point.markY}
  <line x1={x} y1={y} x2={x0} y2={y} stroke={point.yC} stroke-width={point.yW}
    stroke-dasharray={dasharray(point.yS, point.yW)} stroke-linecap="round" />
{/if}

{#if point.xL}
  <foreignObject {x} y={y0} width="10rem" height="{sizeX*1.5}rem" class="usn" style="transform:translateX(-5rem)">
    <div class="tac" style="font-size:{sizeX}rem;color:{point.xC}">{@html point.xL}</div>
  </foreignObject>
{/if}
{#if point.yL}
  <foreignObject x={-y} y={x0-sizeY*20} width="10rem" height="{sizeY*2}rem" class="usn" style="transform:rotate(-90deg) translateX(-5rem)">
    <div class="tac" style="font-size:{sizeY}rem;color:{point.yC}">{@html point.yL}</div>
  </foreignObject>
{/if}

<circle cx={x} cy={y} r={point.r+4}  fill="#fff" stroke={point.color} stroke-width="2" opacity="{focus?.6:0}" />
<circle cx={x} cy={y} r={point.r}  fill={point.show ? point.color : "none"} style="pointer-events:none"
  stroke-width={point.w} stroke={point.circ ? point.sC : "none"}/>
<circle class="cpt" cx={x} cy={y} r="12"  fill={point.color} stroke="none" on:click={setHighlight} opacity="0" />

