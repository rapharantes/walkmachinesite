/* Pulsewave cinematic intro film: WebGL waveform shader on #webglLayer
   plus a looping GSAP timeline that animates the hero stage, titles,
   phone mockup and media cards. Requires GSAP to be loaded first. */
function initPulsewave() {
  if (!window.gsap) {
    setTimeout(initPulsewave, 50);
    return;
  }
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.getElementById("webglLayer");
  const gl = canvas ? canvas.getContext("webgl", { antialias: false, alpha: true, powerPreference: "high-performance" }) : null;

  let webglTime = 0;
  let webglRunning = false;

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  }

  let renderWebGL = function () {};

  if (gl) {
    const vertexSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;

      float line(vec2 uv, float y, float thickness) {
        float d = abs(uv.y - y);
        return smoothstep(thickness, 0.0, d);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= resolution.x / resolution.y;

        float wave1 = sin((p.x * 2.2) + time * 1.15) * 0.18 + sin((p.x * 4.5) - time * 0.72) * 0.055;
        float wave2 = sin((p.x * 2.05) - time * 0.92 + 1.8) * 0.2 + sin((p.x * 5.0) + time * 0.68) * 0.045;
        float wave3 = sin((p.x * 2.8) + time * 1.55 + 3.2) * 0.13;

        float ribbonA = line(p, wave1 - 0.18, 0.035) + line(p, wave1 - 0.24, 0.014);
        float ribbonB = line(p, wave2 + 0.08, 0.032) + line(p, wave2 + 0.16, 0.013);
        float ribbonC = line(p, wave3 - 0.42, 0.042);

        float centerGlow = 1.0 - smoothstep(0.0, 1.25, length(vec2(p.x * 0.75, p.y + 0.06)));
        float sweep = smoothstep(-1.2, 0.45, p.x + sin(time * 0.4) * 0.25) * smoothstep(1.25, -0.2, p.x);

        vec3 lime = vec3(0.72, 1.0, 0.26);
        vec3 violet = vec3(0.86, 0.36, 1.0);
        vec3 cyan = vec3(0.1, 0.72, 1.0);

        vec3 color = vec3(0.0);
        color += lime * ribbonA * (0.85 + sweep * 0.55);
        color += violet * ribbonB * 1.15;
        color += cyan * ribbonC * 0.42;
        color += vec3(0.58, 0.18, 0.95) * centerGlow * 0.12;

        float alpha = clamp((ribbonA + ribbonB + ribbonC) * 0.75 + centerGlow * 0.14, 0.0, 0.92);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolutionUniform = gl.getUniformLocation(program, "resolution");
    const timeUniform = gl.getUniformLocation(program, "time");

    renderWebGL = function (now) {
      if (!webglRunning) return;
      webglTime = now * 0.001;
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, webglTime);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(renderWebGL);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
  }

  const stage = document.getElementById("filmStage");
  const introWord = document.getElementById("introWord");
  const mainTitle = document.getElementById("mainTitle");
  const altTitle = document.getElementById("altTitle");
  const resolveTitle = document.getElementById("resolveTitle");
  const phoneWrap = document.getElementById("phoneWrap");
  const phone = document.getElementById("phone");
  const cards = gsap.utils.toArray(".mediaCard");
  const flash = document.getElementById("flash");
  const metaRail = document.getElementById("metaRail");
  const sequenceLabel = document.getElementById("sequenceLabel");
  const abstractBase = document.getElementById("abstractBase");

  if (prefersReduced) {
    if (gl) {
      webglRunning = true;
      requestAnimationFrame(renderWebGL);
    }
    gsap.set([introWord, altTitle], { opacity: 0 });
    gsap.set(mainTitle, { opacity: 1 });
    gsap.set(phoneWrap, { opacity: 1, y: 0, scale: 1 });
    gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
    gsap.set(metaRail, { opacity: 1 });
    gsap.set(abstractBase, { opacity: 0.35 });
  } else {
    if (gl) {
      webglRunning = true;
      requestAnimationFrame(renderWebGL);
    }

    gsap.set(stage, { scale: 0.985 });
    gsap.set(".titleChunk", { yPercent: 70, opacity: 0, filter: "blur(1rem)" });
    gsap.set(phoneWrap, { y: 120, scale: 0.78, rotation: -3, filter: "blur(.75rem)" });
    gsap.set(cards, { y: 160, scale: 0.72, filter: "blur(.7rem)" });
    gsap.set(abstractBase, { opacity: 0, scale: 1.35 });
    gsap.set(resolveTitle, { scale: 1.35, filter: "blur(1rem)" });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: "power3.out" } });

    tl.to(stage, { scale: 1, duration: 1.4, ease: "power2.out" }, 0)
      .to(metaRail, { opacity: 1, y: -4, duration: 0.9 }, 0.2)
      .to(introWord, { opacity: 1, y: -8, scale: 1, duration: 1.1 }, 0.25)
      .to(introWord, { opacity: 0.3, scale: 1.12, duration: 1.4, ease: "power2.inOut" }, 1.3)
      .to(mainTitle, { opacity: 1, duration: 0.1 }, 1.15)
      .to(".titleChunk", { yPercent: 0, opacity: 1, filter: "blur(0rem)", duration: 0.85, stagger: 0.07, ease: "back.out(1.35)" }, 1.18)
      .to(sequenceLabel, { opacity: 1, duration: 0.45 }, 1.25)
      .to(phoneWrap, { opacity: 1, y: 0, scale: 1, rotation: 0, filter: "blur(0rem)", duration: 1.15, ease: "expo.out" }, 2.05)
      .to(phone, { y: -10, rotationZ: 0.8, duration: 2.2, yoyo: true, repeat: 1, ease: "sine.inOut" }, 2.8)
      .to(cards, { opacity: 1, y: 0, scale: 1, filter: "blur(0rem)", duration: 0.9, stagger: { each: 0.08, from: "center" }, ease: "back.out(1.5)" }, 3.1)
      .to(cards, { x: (i) => [-38, -18, 0, 18, 38][i] || 0, y: (i) => [6, -12, 10, -8, 8][i] || 0, rotation: (i) => [-8, 4, -2, 3, 8][i] || 0, duration: 2.4, ease: "sine.inOut" }, 4.1)
      .to(mainTitle, { scale: 1.08, y: -22, duration: 2.1, ease: "power2.inOut" }, 4.2)
      .to(phoneWrap, { scale: 1.08, y: 18, duration: 2.1, ease: "power2.inOut" }, 4.2)
      .to(flash, { opacity: 0.78, duration: 0.08, ease: "none" }, 6.45)
      .to(flash, { opacity: 0, duration: 0.45, ease: "power2.out" }, 6.53)
      .set(sequenceLabel.querySelector("span:last-child"), { textContent: "Sequência 02" }, 6.52)
      .to(mainTitle, { opacity: 0, scale: 1.45, filter: "blur(.6rem)", duration: 0.7, ease: "power3.in" }, 6.5)
      .to(introWord, { opacity: 0, duration: 0.4 }, 6.5)
      .to(abstractBase, { opacity: 0.44, scale: 1.14, filter: "blur(.25rem)", duration: 1.1 }, 6.6)
      .to(altTitle, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "expo.out" }, 6.82)
      .fromTo(altTitle, { y: 50, filter: "blur(.75rem)" }, { y: 0, filter: "blur(0rem)", duration: 0.8 }, 6.82)
      .to(cards, { scale: 1.22, y: -50, x: (i) => [-110, -54, 0, 54, 110][i] || 0, duration: 1.4, ease: "power2.inOut" }, 7.15)
      .to(phoneWrap, { scale: 0.72, y: 170, opacity: 0.62, filter: "blur(.12rem)", duration: 1.3, ease: "power2.inOut" }, 7.15)
      .to(cards, { x: (i) => [-210, -92, 0, 92, 210][i] || 0, y: (i) => [-26, 16, -12, 20, -24][i] || 0, rotation: (i) => [-12, 8, 0, -6, 12][i] || 0, duration: 2.6, ease: "sine.inOut" }, 8.45)
      .to(altTitle, { scale: 1.16, y: -20, duration: 2.6, ease: "sine.inOut" }, 8.45)
      .set(sequenceLabel.querySelector("span:last-child"), { textContent: "Sequência 03" }, 10.65)
      .to(flash, { opacity: 0.5, duration: 0.08 }, 10.65)
      .to(flash, { opacity: 0, duration: 0.35 }, 10.73)
      .to(altTitle, { opacity: 0, y: -80, scale: 1.35, filter: "blur(.8rem)", duration: 0.75, ease: "power3.in" }, 10.72)
      .to(phoneWrap, { opacity: 1, y: -10, scale: 1.2, filter: "blur(0rem)", duration: 1.1, ease: "expo.out" }, 10.78)
      .to(cards, { opacity: 0.82, scale: 0.92, y: 70, x: 0, rotation: 0, duration: 1.1, stagger: { each: 0.04, from: "edges" }, ease: "power3.out" }, 10.8)
      .to(phoneWrap, { x: -8, rotation: -1.2, duration: 0.18, repeat: 7, yoyo: true, ease: "power1.inOut" }, 12.1)
      .to(cards, { filter: "blur(.25rem)", opacity: 0.5, duration: 1.2 }, 12.25)
      .to(abstractBase, { opacity: 0.18, scale: 1.25, duration: 1.8 }, 12.3)
      .set(sequenceLabel.querySelector("span:last-child"), { textContent: "Resolução" }, 14.15)
      .to(flash, { opacity: 0.85, duration: 0.09 }, 14.15)
      .to(flash, { opacity: 0, duration: 0.5 }, 14.24)
      .to([phoneWrap, cards], { opacity: 0, scale: 0.7, y: 160, filter: "blur(1rem)", duration: 0.85, ease: "power3.in" }, 14.2)
      .to(resolveTitle, { opacity: 1, scale: 1, filter: "blur(0rem)", duration: 1.05, ease: "expo.out" }, 14.65)
      .to(resolveTitle, { scale: 1.04, duration: 2.7, ease: "sine.inOut" }, 15.8)
      .to(metaRail, { opacity: 0.55, duration: 1.2 }, 15.8)
      .to(resolveTitle, { opacity: 0, scale: 1.28, filter: "blur(.8rem)", duration: 0.9, ease: "power3.in" }, 19.0)
      .to(abstractBase, { opacity: 0, duration: 0.8 }, 19.0)
      .to(metaRail, { opacity: 0, duration: 0.5 }, 19.2)
      .to(stage, { scale: 0.985, duration: 0.9, ease: "power2.inOut" }, 19.1);
  }
}
initPulsewave();
