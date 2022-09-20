<script lang="ts">
  import { afterUpdate, tick } from "svelte";

  export let cover: number = 1;
  export let scheme: number | null = null;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let width: number;
  let winHeight: number;
  let height: number = 500;
  let prevDim: number = 9000;
  let pattern: Array<{x:number, y:number, r:number, c:string, o:string, x2:number, y2:number, r2:number}> = [];
  let curves: Array<{start:number, slope:number, wls:number, wlc:number, as:number, ac:number, step:number, nSteps:number}> = [];

  const colors = [
    ["#002B66", "#006BA6", "#D81159", "#0496FF", "#94003D"],
    ["#B30047", "#E34E29", "#F27A11", "#F7B211", "#48A19E"], // schemecolor.com/wild-retro.php
    ["#E40055", "#FF1A72", "#E84000", "#EB6123", "#F1B111"], // schemecolor.com/halloween-kiss-color-scheme.php
    ["#0B3D6F", "#0081C7", "#FFEA48", "#FABB01", "#F25930"], // schemecolor.com/retro-summer-2.php
    ["#100E2C", "#131B60", "#333D94", "#D41E79", "#F45A5C"], // schemecolor.com/retro-night.php
    ["#D41E79", "#F45A5C", "#131B60", "#333D94", "#F9C403"], // schemecolor.com/retro-night.php
    ["#300350", "#94167F", "#E93479", "#F62E97", "#F9AC53"], // schemecolor.com/vaporwave.php
    ["#530D18", "#BF230E", "#911E32", "#E4A507", "#F0C002"], // schemecolor.com/leaf-colours.php
    //["#22B3B5", "#B2D732", "#66B032", "#347B98", "#092834"], // schemecolor.com/analogous.php
    //["#8A00BA", "#ED229D", "#FF617B", "#FF853B", "#FFDF00"], // schemecolor.com/neon-city.php
    //["#1B03A3", "#213586", "#2D9A4D", "#33CD31", "#39FF14"], // schemecolor.com/.php
  ];
  if (scheme === null) scheme = rnd(colors.length);
  const blobs = 12;
  const lines = 3;

  function rnd(max: number, min=0) { return Math.floor(Math.random() * max + min) };
  function createPattern() {
    pattern = [];
    let i = 0;
    do {
      pattern.push({
        x: rnd(width),
        y: rnd(height),
        r: width > height ? rnd(width/2, width/3) : rnd(height/2, height/3),
        c: colors[scheme][rnd(3)],
        o: (Math.round(Math.log(blobs-i+1)/Math.log(blobs+1)*255)).toString(16).padStart(2,"0"),
        x2: rnd(100, -100),
        y2: rnd(100, -100),
        r2: width > height ? rnd(width/4, 20) : rnd(height/4, 20),
      });
      i++;
    } while (i < blobs);

    i = 0;
    const step = 10;
    const nSteps = Math.ceil(width/step)+1;
    do {
      const start = rnd(height);
      const slope = start < height/3 ? rnd(5, 3)/10
      : start < height*.6 ? rnd(6, -1)/10 : rnd(-2, -2)/10;

      curves.push({
        slope, start,
        wls: rnd(50, 40),
        wlc: rnd(30, 20),
        as: rnd(20)/1000,
        ac: rnd(10)/300,
        step, nSteps
      });
      i++;
    } while (i < lines);
  };
  function draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = colors[scheme][0];
    ctx.fillRect(0, 0, width, height);


// DRAW BLOBS
    //const grad = ctx.createRadialGradient(width/3, height/2, 30, width/4+rnd(width/3), height/4+rnd(height/3), width/3 + rnd(width/3));
    //grad.addColorStop(0, colors[scheme][3])
    //grad.addColorStop(1, colors[scheme][3] +"00")
    //ctx.fillStyle = grad;
    //ctx.beginPath();
    //ctx.arc(width/3, height/2, width/2, 0, Math.PI * 2);
    //ctx.fill();

    let i = 0;
    do {
      const grad = ctx.createRadialGradient(pattern[i].x, pattern[i].y, 20, pattern[i].x + pattern[i].x2, pattern[i].y + pattern[i].y2, pattern[i].r - pattern[i].r2);
      grad.addColorStop(0, pattern[i].c + pattern[i].o)
      grad.addColorStop(1, pattern[i].c +"00")
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pattern[i].x, pattern[i].y, pattern[i].r, 0, Math.PI * 2);
      ctx.fill();

      i++;
    } while (i < blobs);

// DRAW GRID
    if (cover === 1) {
      //const space = 30;
      const w = width/2;
      const h = height/2;
      let x = w;
      do {
        let y = h;
        let ang = 1;
        do {
          ctx.moveTo(x, y);
          ctx.lineTo(x+Math.acos(ang)*4, y+Math.asin(ang)*4);
          y+= 30; ang-= .12;
        } while (y < height && ang > -1)
        //ctx.moveTo(w-h, x);
        //ctx.lineTo(w, x);
        x+= 30;
      } while (x < width)
      x = w;
      ctx.strokeStyle = colors[scheme][4];
      ctx.stroke();

      //const space = 30;
      //let x = width/2;
      //const minY = height/2;
      //ctx.fillStyle = "#ffffffa0";
      //let y = minY;
      //do {
      //  do {
      //    //ctx.fillRect(x, y, 1.5, 1.5);
      //    y += space;
      //  } while (y < height);
      //  y = minY;
      //  x += space;
      //} while (x < width);
    }

// PLOT WAVE
    i = 0;
ctx.strokeStyle = colors[scheme][rnd(5)] + "40";
ctx.lineWidth = 4;
    do {
      const linG = ctx.createLinearGradient(rnd(width/2), rnd(height*.6), width, height);
      const c = rnd(3, 1);
      linG.addColorStop(0, colors[scheme][c] + rnd(40, 40));
      linG.addColorStop(1, colors[scheme][c] + "00");
      ctx.fillStyle = linG;

      let j = 0;
      ctx.beginPath();
      ctx.moveTo(0, curves[i].start);
      do {
        const X = j*curves[i].step;
        ctx.lineTo(j*10, curves[i].start + ( curves[i].wls *Math.sin(X*curves[i].as)
        + curves[i].wlc*Math.cos(X*curves[i].ac) + X*curves[i].slope ));
        j++;
      } while (j < curves[i].nSteps)
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      i++;
    } while (i < lines)

  };

  afterUpdate(async () => {
    ctx = <CanvasRenderingContext2D> canvas?.getContext('2d');
    height = Math.max(winHeight / cover, 200);
    canvas.width = width;
    canvas.height = height;
    await tick()
    const currDim = Math.round(width*height);
    if (currDim/prevDim > 2) {
      createPattern();
      prevDim = currDim;
    }
    draw(ctx);
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={winHeight}/>

<div style="background-color: black;">
  <canvas bind:this={canvas} {width} {height} ></canvas>
</div>

