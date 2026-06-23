import { initChipScene } from "./chipScene.js";
import { initClockWaveBackground } from "./clockWaveBackground.js";
import { featuredProjects, resume } from "./data.js";

initChipScene("#chip-canvas");
initClockWaveBackground("#clock-wave-background");
renderResume();
renderProjects();
initAnchorNavigation();
initActiveNavigation();
initKrxProcessVisualizer();

function renderResume() {
  const root = document.querySelector("#resume-content");
  if (!root) return;

  root.innerHTML = `
    <div class="resume-column resume-overview">
      <article class="resume-block">
        <div class="block-heading">
          <span class="mono-label">Education</span>
        </div>
        ${resume.education
          .map(
            (item) => `
              <div class="resume-row">
                <div>
                  <h3>${item.school}</h3>
                  <p>${item.degree}</p>
                  <p class="muted">${item.details.join(" · ")}</p>
                </div>
                <span class="row-meta">${item.location} · ${item.date}</span>
              </div>
            `
          )
          .join("")}
      </article>

      <article class="resume-block">
        <div class="block-heading">
          <span class="mono-label">Skills</span>
        </div>
        ${resume.skills
          .map(
            (group) => `
              <div class="skill-group">
                <h3>${group.label}</h3>
                <div class="tag-cloud">
                  ${group.items.map((item) => `<span>${item}</span>`).join("")}
                </div>
              </div>
            `
          )
          .join("")}
      </article>

      <article class="resume-block">
        <div class="block-heading">
          <span class="mono-label">Leadership / Honors</span>
        </div>
        <div class="honors-list">
          ${resume.honors.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </article>
    </div>

    <div class="resume-column">
      <article class="resume-block">
        <div class="block-heading">
          <span class="mono-label">Experience</span>
        </div>
        ${resume.experience.map(renderRole).join("")}
      </article>

      <article class="resume-block">
        <div class="block-heading">
          <span class="mono-label">Resume Projects</span>
        </div>
        ${resume.projects.map(renderResumeProject).join("")}
      </article>
    </div>
  `;
}

function renderRole(item) {
  return `
    <div class="experience-item">
      <div class="resume-row">
        <div>
          <h3>${item.role}</h3>
          <p>${item.org}</p>
        </div>
        <span class="row-meta">${item.location} · ${item.date}</span>
      </div>
      <ul>
        ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderResumeProject(item) {
  return `
    <div class="experience-item">
      <div class="resume-row">
        <div>
          <h3>${item.name}</h3>
          <p>${item.descriptor}</p>
        </div>
        <span class="row-meta">${item.stack} · ${item.date}</span>
      </div>
      <ul>
        ${item.bullets.slice(0, 2).map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderProjects() {
  const root = document.querySelector("#project-list");
  if (!root) return;

  root.innerHTML = featuredProjects
    .map((project) => {
      const cardClass = project.feature ? "project-card-feature" : "project-card-system";
      return `
        <article class="project-card ${cardClass}">
          <div class="project-main">
            <p class="mono-label">${project.name}</p>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <div class="tag-cloud">
              ${project.stack.map((item) => `<span>${item}</span>`).join("")}
            </div>
          </div>
          <div class="project-diagram project-diagram-${project.diagram}" aria-hidden="true">
            ${renderProjectDiagram(project.diagram)}
          </div>
          <div class="project-signal" aria-label="${project.name} proof points">
            ${project.proof.map((item) => `<span>${item}</span>`).join("")}
          </div>
          <div class="project-actions">
            ${renderProjectActions(project)}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderProjectActions(project) {
  return [
    project.primaryAction,
    project.github ? { label: "GitHub", href: project.github, external: true } : null,
    project.external ? { ...project.external, external: true } : null,
    project.statusAction ? { label: project.statusAction, status: true } : null,
  ]
    .filter(Boolean)
    .map(renderAction)
    .join("");
}

function renderAction(action) {
  if (action.status) return `<span class="action-muted">${action.label}</span>`;
  if (!action?.href) return `<span class="action-muted">${action.label}</span>`;
  const externalAttrs = action.external ? ` target="_blank" rel="noreferrer"` : "";
  return `<a class="project-link" href="${action.href}"${externalAttrs}>${action.label}</a>`;
}

function renderProjectDiagram(type) {
  const diagrams = {
    krx: `
      <div class="diagram-wave">
        ${[48, 76, 58, 96, 68, 118, 82, 54, 104, 72, 92, 50, 110, 64, 86, 44]
          .map((height, index) => `<i style="--h:${height}px; --delay:${index * -120}ms"></i>`)
          .join("")}
      </div>
      <div class="diagram-flow">
        <span>audio</span><b></b><span>hash</span><b></b><span>vector</span><b></b><span>taste graph</span>
      </div>
    `,
    riscv: `
      <div class="diagram-shell">
        <div class="diagram-head"><span>RV32I datapath</span><b>data / control</b></div>
        <svg class="diagram-svg cpu-svg" viewBox="0 0 920 300" aria-hidden="true">
          <defs>
            <marker id="cpu-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" class="svg-arrow-blue" />
            </marker>
            <marker id="cpu-arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" class="svg-arrow-amber" />
            </marker>
          </defs>
          <rect class="svg-node" x="26" y="126" width="72" height="44" />
          <text class="svg-text" x="62" y="153">PC</text>
          <rect class="svg-node" x="134" y="126" width="92" height="44" />
          <text class="svg-text" x="180" y="148">I-MEM</text>
          <rect class="svg-node" x="270" y="126" width="112" height="44" />
          <text class="svg-text" x="326" y="153">DECODER</text>
          <rect class="svg-node" x="426" y="116" width="106" height="64" />
          <text class="svg-text" x="479" y="148">REG FILE</text>
          <rect class="svg-node svg-node-amber" x="284" y="36" width="104" height="50" />
          <text class="svg-text" x="336" y="61">CTRL</text>
          <rect class="svg-node" x="442" y="34" width="92" height="48" />
          <text class="svg-text" x="488" y="58">IMM GEN</text>
          <rect class="svg-node svg-node-amber" x="626" y="34" width="76" height="42" />
          <text class="svg-small" x="664" y="55">FLAGS</text>
          <text class="svg-tiny" x="664" y="70">Z N C V</text>
          <polygon class="svg-node" points="600,104 682,128 682,172 600,196" />
          <text class="svg-text" x="636" y="154">ALU</text>
          <rect class="svg-node" x="728" y="126" width="98" height="44" />
          <text class="svg-text" x="777" y="148">D-MEM</text>
          <rect class="svg-node" x="850" y="126" width="58" height="44" />
          <text class="svg-small" x="879" y="148">WB MUX</text>
          <path class="svg-line" marker-end="url(#cpu-arrow-blue)" d="M98 148 H134" />
          <path class="svg-line" marker-end="url(#cpu-arrow-blue)" d="M226 148 H270" />
          <path class="svg-line" marker-end="url(#cpu-arrow-blue)" d="M382 148 H426" />
          <path class="svg-line" marker-end="url(#cpu-arrow-blue)" d="M532 148 H600" />
          <path class="svg-line" marker-end="url(#cpu-arrow-blue)" d="M682 148 H728" />
          <path class="svg-line" marker-end="url(#cpu-arrow-blue)" d="M826 148 H850" />
          <path class="svg-line" marker-end="url(#cpu-arrow-blue)" d="M879 170 V238 H479 V180" />
          <path class="svg-line" marker-end="url(#cpu-arrow-blue)" d="M488 82 V116" />
          <path class="svg-line" marker-end="url(#cpu-arrow-blue)" d="M664 76 V108" />
          <path class="svg-control" marker-end="url(#cpu-arrow-amber)" d="M336 86 V106 H326 V126" />
          <path class="svg-control" marker-end="url(#cpu-arrow-amber)" d="M388 92 H575 V128" />
          <path class="svg-control" marker-end="url(#cpu-arrow-amber)" d="M388 72 H424 V58 H442" />
          <path class="svg-control" marker-end="url(#cpu-arrow-amber)" d="M702 55 H760 V126" />
          <path class="svg-line svg-legend-line" d="M332 268 H382" />
          <text class="svg-caption svg-left" x="394" y="268">DATA PATH</text>
          <path class="svg-control svg-legend-line" d="M530 268 H580" />
          <text class="svg-caption svg-left svg-caption-amber" x="592" y="268">CONTROL</text>
        </svg>
      </div>
    `,
    scope: `
      <div class="diagram-shell">
        <div class="diagram-head"><span>capture studio</span><b>serial / AWG</b></div>
        <svg class="diagram-svg scope-svg" viewBox="0 0 920 300" aria-hidden="true">
          <defs>
            <marker id="scope-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" class="svg-arrow-blue" />
            </marker>
          </defs>
          <rect class="scope-screen" x="24" y="38" width="612" height="210" />
          <g class="scope-grid">
            <path d="M84 38 V248 M144 38 V248 M204 38 V248 M264 38 V248 M324 38 V248 M384 38 V248 M444 38 V248 M504 38 V248 M564 38 V248" />
            <path d="M24 80 H636 M24 122 H636 M24 164 H636 M24 206 H636" />
          </g>
          <path class="scope-trace-blue" d="M32 108 C55 62 79 62 102 108 S149 154 172 108 S219 62 242 108 S289 154 312 108 S359 62 382 108 S429 154 452 108 S499 62 522 108 S569 154 628 108" />
          <path class="scope-trace-amber" d="M32 184 H102 V154 H140 V184 H204 V154 H242 V184 H306 V154 H344 V184 H408 V154 H446 V184 H510 V154 H548 V184 H628" />
          <path class="svg-control" d="M352 42 V246" />
          <circle class="scope-sample" cx="352" cy="108" r="5" />
          <circle class="scope-sample scope-sample-amber" cx="352" cy="184" r="5" />
          <text class="svg-small svg-left" x="40" y="70">CH1  1.00V/div</text>
          <text class="svg-small svg-left svg-amber-text" x="40" y="144">CH2  500mV/div</text>
          <text class="svg-caption" x="330" y="274">TIME 500us/div</text>
          <text class="svg-caption svg-left" x="330" y="30">trigger</text>
          <rect class="svg-node" x="716" y="98" width="112" height="82" />
          <text class="svg-text scope-device-label" x="772" y="143">XIAO SAMD21</text>
          <path class="svg-line" marker-end="url(#scope-arrow-blue)" d="M660 116 H716" />
          <path class="svg-line" marker-end="url(#scope-arrow-blue)" d="M828 118 H882" />
          <path class="svg-line" marker-end="url(#scope-arrow-blue)" d="M828 154 H882" />
          <path class="svg-line" marker-end="url(#scope-arrow-blue)" d="M772 180 V226" />
          <text class="svg-text svg-left" x="888" y="124">CH1</text>
          <text class="svg-text svg-left svg-amber-text" x="888" y="160">CH2</text>
          <text class="svg-caption" x="772" y="254">USB / SERIAL</text>
          <path class="scope-awg" d="M866 224 C876 198 888 198 898 224 S920 250 930 224" />
          <text class="svg-caption svg-left" x="846" y="206">AWG OUT</text>
        </svg>
      </div>
    `,
    asteroids: `
      <div class="diagram-shell">
        <div class="diagram-head"><span>arcade state loop</span><b>VGA / collision</b></div>
        <svg class="diagram-svg asteroids-svg" viewBox="0 0 920 300" aria-hidden="true">
          <defs>
            <marker id="asteroids-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" class="svg-arrow-blue" />
            </marker>
            <marker id="asteroids-arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" class="svg-arrow-amber" />
            </marker>
          </defs>
          <rect class="playfield" x="24" y="38" width="348" height="218" />
          <text class="svg-small svg-left" x="42" y="70">SCORE: 012345</text>
          <text class="svg-small svg-left" x="252" y="70">LIVES: 03</text>
          <polygon class="ship-mark" points="118,166 156,148 128,184 132,162" />
          <path class="laser-mark" d="M160 154 H246" />
          <circle class="shot-mark" cx="222" cy="184" r="3" />
          <circle class="shot-mark" cx="240" cy="184" r="3" />
          <path class="asteroid-mark" d="M286 92 l20 -10 22 8 10 22 -14 20 -25 5 -20 -13 -8 -18 z" />
          <path class="asteroid-mark asteroid-small" d="M286 198 l18 -13 22 4 12 18 -7 22 -22 10 -20 -7 -11 -18 z" />
          <path class="asteroid-mark asteroid-ghost" d="M68 104 l10 -8 14 4 7 13 -8 13 -14 4 -12 -8 -4 -12 z" />
          <path class="star-streak" d="M54 170 l-34 -10 M94 126 l-24 8 M184 118 l-16 18 M252 130 l24 -8 M96 204 l-40 26" />
          <rect class="svg-node" x="446" y="42" width="94" height="44" />
          <text class="svg-text" x="493" y="70">IDLE</text>
          <rect class="svg-node" x="596" y="42" width="98" height="44" />
          <text class="svg-text" x="645" y="70">SPAWN</text>
          <rect class="svg-node" x="750" y="42" width="98" height="44" />
          <text class="svg-text" x="799" y="70">PLAY</text>
          <rect class="svg-node" x="434" y="126" width="120" height="58" />
          <text class="svg-small" x="494" y="156">SPRITES</text>
          <rect class="svg-node" x="586" y="126" width="124" height="58" />
          <text class="svg-small" x="648" y="156">COLLISION</text>
          <rect class="svg-node" x="744" y="126" width="118" height="58" />
          <text class="svg-small" x="803" y="156">SCORE</text>
          <rect class="svg-node svg-node-amber" x="432" y="226" width="370" height="44" />
          <text class="svg-small" x="617" y="254">VGA DRIVER  640x480 @ 60Hz</text>
          <rect class="svg-node" x="834" y="204" width="74" height="52" />
          <text class="svg-small" x="871" y="232">INPUT</text>
          <path class="svg-line" marker-end="url(#asteroids-arrow-blue)" d="M540 64 H596" />
          <path class="svg-line" marker-end="url(#asteroids-arrow-blue)" d="M694 64 H750" />
          <path class="svg-control" marker-end="url(#asteroids-arrow-amber)" d="M799 86 V126" />
          <path class="svg-control" marker-end="url(#asteroids-arrow-amber)" d="M803 184 V226" />
          <path class="svg-control" marker-end="url(#asteroids-arrow-amber)" d="M648 184 V226" />
          <path class="svg-control" marker-end="url(#asteroids-arrow-amber)" d="M494 184 V226" />
          <path class="svg-control" marker-end="url(#asteroids-arrow-amber)" d="M802 248 H834" />
          <path class="svg-control" marker-end="url(#asteroids-arrow-amber)" d="M871 204 V92 H848" />
          <path class="svg-control" marker-end="url(#asteroids-arrow-amber)" d="M744 155 H710" />
          <path class="svg-control" marker-end="url(#asteroids-arrow-amber)" d="M586 155 H554" />
          <path class="svg-line" marker-end="url(#asteroids-arrow-blue)" d="M493 86 V126" />
          <path class="svg-line" marker-end="url(#asteroids-arrow-blue)" d="M645 86 V126" />
        </svg>
      </div>
    `,
    growing: `
      <div class="diagram-shell">
        <div class="diagram-head"><span>Cocos2d-x systems</span><b>gameplay pipeline</b></div>
        <svg class="diagram-svg growing-svg" viewBox="0 0 920 300" aria-hidden="true">
          <defs>
            <marker id="growing-arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" class="svg-arrow-amber" />
            </marker>
          </defs>
          <g class="engine-icon">
            <path d="M70 78 V116 M38 116 H102 M38 116 V144 H62 V116 M102 116 V144 H126 V116 M70 78 H94 V54 H70 z" />
            <text class="svg-text" x="82" y="184">SCENE</text>
            <text class="svg-small" x="82" y="204">MANAGER</text>
          </g>
          <g class="engine-icon">
            <path d="M236 70 C260 42 304 54 298 88 C290 128 236 138 214 106 C198 82 212 54 244 48" />
            <path d="M222 122 C246 94 270 72 296 48 M214 72 C250 96 278 116 306 130" />
            <text class="svg-text" x="258" y="184">PHYSICS</text>
            <text class="svg-small" x="258" y="204">ENGINE</text>
          </g>
          <g class="engine-icon">
            <path d="M434 48 l52 30 v60 l-52 30 -52 -30 v-60 z M382 78 l52 30 52 -30 M434 108 v60" />
            <text class="svg-text" x="434" y="184">RENDER</text>
            <text class="svg-small" x="434" y="204">SHADERS</text>
          </g>
          <g class="engine-icon">
            <path d="M606 72 h78 q18 0 18 18 v36 q0 18 -18 18 h-36 l-26 24 v-24 h-16 q-18 0 -18 -18 v-36 q0 -18 18 -18 z" />
            <circle cx="626" cy="108" r="4" /><circle cx="646" cy="108" r="4" /><circle cx="666" cy="108" r="4" />
            <text class="svg-text" x="646" y="184">UI / DIALOG</text>
            <text class="svg-small" x="646" y="204">SYSTEM</text>
          </g>
          <g class="engine-icon">
            <path d="M790 112 h34 l44 -38 v110 l-44 -38 h-34 z M878 98 q26 28 0 58 M900 82 q44 52 0 92" />
            <text class="svg-text" x="838" y="184">AUDIO</text>
            <text class="svg-small" x="838" y="204">SYSTEM</text>
          </g>
          <rect class="svg-node svg-node-wide" x="114" y="236" width="570" height="42" />
          <text class="svg-text" x="399" y="262">RESOURCE MANAGER</text>
          <rect class="svg-node svg-node-amber" x="728" y="226" width="156" height="58" />
          <text class="svg-text transition-label" x="806" y="256">TRANSITIONS</text>
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M126 96 H206" />
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M314 96 H382" />
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M486 96 H588" />
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M702 110 H790" />
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M82 236 V206" />
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M258 236 V206" />
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M434 236 V206" />
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M646 236 V206" />
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M838 226 V206" />
          <path class="svg-control" marker-end="url(#growing-arrow-amber)" d="M684 257 H728" />
          <path class="motion-arc" d="M184 56 C238 18 318 18 372 56" />
          <path class="motion-arc" d="M518 54 C566 20 650 20 704 54" />
        </svg>
      </div>
    `,
    "java-engine": `
      <div class="diagram-shell">
        <div class="diagram-head"><span>LWJGL/OpenGL engine</span><b>scene graph runtime</b></div>
        <svg class="diagram-svg java-svg" viewBox="0 0 920 300" aria-hidden="true">
          <defs>
            <marker id="java-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" class="svg-arrow-blue" />
            </marker>
            <marker id="java-arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" class="svg-arrow-amber" />
            </marker>
          </defs>
          <rect class="svg-node svg-node-amber" x="386" y="36" width="148" height="58" />
          <text class="svg-text" x="460" y="62">SCENE GRAPH</text>
          <path class="graph-tree" d="M460 94 V122 M460 122 H414 M460 122 H506 M414 122 V138 M460 122 V138 M506 122 V138" />
          <rect class="svg-node" x="40" y="142" width="118" height="58" />
          <text class="svg-text" x="99" y="164">CAMERA</text>
          <text class="svg-small" x="99" y="184">SYSTEM</text>
          <rect class="svg-node" x="190" y="142" width="118" height="58" />
          <text class="svg-text" x="249" y="164">LIGHTING</text>
          <text class="svg-small" x="249" y="184">SYSTEM</text>
          <rect class="svg-node" x="342" y="142" width="118" height="58" />
          <text class="svg-text" x="401" y="164">ENTITY</text>
          <text class="svg-small" x="401" y="184">SYSTEM</text>
          <rect class="svg-node" x="496" y="142" width="118" height="58" />
          <text class="svg-text" x="555" y="164">CHUNK</text>
          <text class="svg-small" x="555" y="184">MANAGER</text>
          <rect class="svg-node" x="650" y="142" width="118" height="58" />
          <text class="svg-text" x="709" y="164">PHYSICS</text>
          <text class="svg-small" x="709" y="184">SYSTEM</text>
          <rect class="svg-node" x="802" y="134" width="92" height="74" />
          <text class="svg-text" x="848" y="158">RENDER</text>
          <text class="svg-small" x="848" y="176">OpenGL</text>
          <path class="monitor-mark" d="M824 186 h48 v28 h-48 z M840 222 h16 M832 228 h32" />
          <rect class="svg-node svg-node-wide" x="196" y="238" width="520" height="42" />
          <text class="svg-text" x="456" y="264">AUDIO MANAGER  OpenAL</text>
          <path class="svg-line" marker-end="url(#java-arrow-blue)" d="M460 94 V116 H99 V142" />
          <path class="svg-line" marker-end="url(#java-arrow-blue)" d="M460 94 V112 H249 V142" />
          <path class="svg-line" marker-end="url(#java-arrow-blue)" d="M460 94 V126 H401 V142" />
          <path class="svg-line" marker-end="url(#java-arrow-blue)" d="M460 94 V112 H555 V142" />
          <path class="svg-line" marker-end="url(#java-arrow-blue)" d="M460 94 V104 H848 V134" />
          <path class="svg-control" marker-end="url(#java-arrow-amber)" d="M99 200 V238 H196" />
          <path class="svg-control" marker-end="url(#java-arrow-amber)" d="M249 200 V238" />
          <path class="svg-control" marker-end="url(#java-arrow-amber)" d="M401 200 V238" />
          <path class="svg-control" marker-end="url(#java-arrow-amber)" d="M555 200 V238" />
          <path class="svg-control" marker-end="url(#java-arrow-amber)" d="M709 200 V238" />
          <path class="svg-control" marker-end="url(#java-arrow-amber)" d="M716 258 H802 V188" />
        </svg>
      </div>
    `,
  };

  return diagrams[type] || "";
}

function initActiveNavigation() {
  const links = [...document.querySelectorAll(".site-nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => {
        link.toggleAttribute("aria-current", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-40% 0px -48% 0px", threshold: [0.1, 0.25, 0.5] }
  );

  sections.forEach((section) => observer.observe(section));
}

function initAnchorNavigation() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const localLinks = [...document.querySelectorAll('a[href^="#"]')];

  localLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      scrollToSection(target, !reduceMotion);
      history.pushState(null, "", hash);
    });
  });

  const correctInitialHash = () => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;
    scrollToSection(target, false);
  };

  window.addEventListener("load", () => requestAnimationFrame(correctInitialHash), { once: true });
  document.fonts?.ready.then(() => requestAnimationFrame(correctInitialHash));
}

function scrollToSection(target, smooth) {
  const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: smooth ? "smooth" : "auto",
  });
}

function initKrxProcessVisualizer() {
  const canvas = document.querySelector("#krx-process-canvas");
  if (!canvas) return;
  const root = document.querySelector(".krx-process");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stageIndex = document.querySelector(".krx-stage-index");
  const stageTitle = document.querySelector(".krx-stage-title");
  const stageCopy = document.querySelector(".krx-stage-copy");
  const stepper = document.querySelector(".process-stepper");
  const stages = [
    {
      id: "wave",
      label: "01 / Audio Signal",
      navLabel: "Wave",
      title: "Moving waveform enters KRX",
      copy: "A track starts as pressure-wave motion with rhythm, dynamics, transient attacks, and texture.",
      overlay: "none",
      draw: drawWaveStage,
    },
    {
      id: "hash",
      label: "02 / Perceptual Hash",
      navLabel: "Hash",
      title: "Signal becomes binary behavior",
      copy: "Frequency, rhythm, texture, and dynamics are compressed into perceptual bit decisions.",
      overlay: "none",
      draw: drawHashStage,
    },
    {
      id: "vector",
      label: "03 / Vector Space",
      navLabel: "Vector",
      title: "The hash becomes coordinates",
      copy: "Binary structure maps into a searchable vector representation of how the song behaves.",
      overlay: "none",
      draw: drawVectorStage,
    },
    {
      id: "fusion",
      label: "04 / Fusion",
      navLabel: "Fusion",
      title: "Lyrics and metadata join the signal",
      copy: "Audio, metadata, lyric context, and artist signals fuse into one richer song identity.",
      overlay: "none",
      draw: drawFusionStage,
    },
    {
      id: "pool",
      label: "05 / Candidate Pool",
      navLabel: "Pool",
      title: "Nearby songs compete",
      copy: "KRX searches the taste space, then lets one candidate emerge from the pool.",
      overlay: "none",
      draw: drawCandidateStage,
    },
    {
      id: "card",
      label: "06 / Recommendation",
      navLabel: "Card",
      title: "A useful song card is generated",
      copy: "The output is a recommendation, explanation, confidence signal, and playback-ready context.",
      overlay: "recommendation",
      draw: drawRecommendationStage,
    },
    {
      id: "rank",
      label: "07 / Ranking Model",
      navLabel: "Rank",
      title: "A neural layer weighs the fit",
      copy: "Relevance, novelty, confidence, diversity, and dislike avoidance are scored together.",
      overlay: "recommendation",
      draw: drawNeuralStage,
    },
    {
      id: "learn",
      label: "08 / Feedback",
      navLabel: "Learn",
      title: "The user signal updates the model",
      copy: "Likes, saves, skips, and listening behavior strengthen or weaken taste regions.",
      overlay: "recommendation",
      draw: drawFeedbackStage,
    },
    {
      id: "graph",
      label: "09 / Taste Neighborhoods",
      navLabel: "Graph",
      title: "The graph learns your taste regions",
      copy: "The result reshapes user-conditioned clusters instead of flattening taste into one average.",
      overlay: "none",
      draw: drawTasteStage,
    },
  ];
  if (stepper) {
    stepper.innerHTML = stages
      .map((stage, index) => `<span${index === 0 ? ' aria-current="true"' : ""}>${stage.navLabel}</span>`)
      .join("");
  }
  const stepperItems = [...document.querySelectorAll(".process-stepper span")];
  let frame = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const { clientWidth, clientHeight } = canvas;
    canvas.width = Math.floor(clientWidth * ratio);
    canvas.height = Math.floor(clientHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const stageNumber = reduceMotion ? 0 : Math.floor((frame / 180) % stages.length);
    const progress = reduceMotion ? 0.35 : (frame % 180) / 180;
    const stage = stages[stageNumber];
    const layout = getProcessLayout(width, height, stage.overlay);

    ctx.clearRect(0, 0, width, height);
    drawProcessGrid(ctx, width, height);
    drawProcessFrame(ctx, layout, stage);

    root?.setAttribute("data-stage", stage.id);
    root?.setAttribute("data-overlay", stage.overlay);
    root?.style.setProperty("--stage-progress", progress.toFixed(3));
    if (stageIndex) stageIndex.textContent = stage.label;
    if (stageTitle) stageTitle.textContent = stage.title;
    if (stageCopy) stageCopy.textContent = stage.copy;
    stepperItems.forEach((item, index) => {
      if (index === stageNumber) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });

    stage.draw(ctx, layout, frame, progress);

    if (!reduceMotion) {
      frame += 1;
      requestAnimationFrame(draw);
    }
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw();
  });
  draw();
}

function getProcessLayout(width, height, overlay) {
  const mobile = width < 520;
  const narrow = width < 620;
  const tablet = width < 820;
  const pad = mobile ? 16 : 24;
  const stepperBottom = mobile ? 430 : tablet ? 226 : 138;
  const stepperHeight = tablet || mobile ? 102 : 34;
  const diagramTop = mobile ? 222 : tablet ? 172 : 166;
  const diagramBottom = Math.max(diagramTop + 180, height - stepperBottom - stepperHeight - (mobile ? 22 : 28));
  const outputWidth = overlay === "recommendation" && !narrow ? Math.min(214, Math.max(190, width * 0.28)) : 0;
  const outputTop = tablet ? 198 : 94;
  const outputPanel = outputWidth
    ? {
        x: width - pad - outputWidth,
        y: outputTop,
        w: outputWidth,
        h: Math.max(240, diagramBottom - outputTop),
      }
    : null;
  const mainRight = outputPanel ? outputPanel.x - 24 : width - pad;
  const main = {
    x: pad,
    y: diagramTop,
    w: Math.max(220, mainRight - pad),
    h: Math.max(180, diagramBottom - diagramTop),
  };

  return { width, height, pad, mobile, narrow, tablet, main, outputPanel };
}

function drawProcessGrid(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawProcessFrame(ctx, layout, stage) {
  drawPanel(ctx, layout.main, "rgba(10,10,12,0.28)", "rgba(79,142,247,0.16)");
  drawPanelTitle(ctx, layout.main, `${stage.label} / ${stage.navLabel}`);
  if (layout.outputPanel) {
    drawPanel(ctx, layout.outputPanel, "rgba(10,10,12,0.3)", "rgba(232,168,56,0.18)");
    drawPanelTitle(ctx, layout.outputPanel, "Output Snapshot", "amber");
  }
}

function signalGradient(ctx, width) {
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "rgba(79, 142, 247, 0.95)");
  gradient.addColorStop(0.55, "rgba(240, 240, 240, 0.72)");
  gradient.addColorStop(1, "rgba(232, 168, 56, 0.9)");
  return gradient;
}

function drawWaveStage(ctx, layout, frame) {
  const rect = insetRect(layout.main, 24);
  drawWaves(ctx, rect, frame, 4);
  drawLabelChip(ctx, "raw waveform", rect.x + 12, rect.y + 30);
  drawSignalReadout(ctx, rect, ["rhythm", "transients", "texture"], "blue");
}

function drawHashStage(ctx, layout, frame) {
  const left = sliceRect(layout.main, 0.04, 0.08, 0.42, 0.78);
  const right = sliceRect(layout.main, 0.55, 0.12, 0.36, 0.72);
  drawSubPanel(ctx, left, "signal behavior");
  drawSubPanel(ctx, right, "perceptual hash");
  drawWaves(ctx, insetRect(left, 16), frame, 3);
  drawBitMatrix(ctx, insetRect(right, 22), frame, 5, 7);
  drawArrow(ctx, left.x + left.w + 14, left.y + left.h * 0.5, right.x - 14, right.y + right.h * 0.5);
}

function drawVectorStage(ctx, layout, frame) {
  const left = sliceRect(layout.main, 0.05, 0.12, 0.32, 0.7);
  const right = sliceRect(layout.main, 0.5, 0.08, 0.44, 0.78);
  drawSubPanel(ctx, left, "binary structure");
  drawSubPanel(ctx, right, "384-dim coordinate field");
  drawBitMatrix(ctx, insetRect(left, 20), frame, 4, 7);
  drawArrow(ctx, left.x + left.w + 18, left.y + left.h * 0.5, right.x - 18, right.y + right.h * 0.5);
  drawVectorCloud(ctx, insetRect(right, 22), 30, frame, { axes: true });
}

function drawFusionStage(ctx, layout, frame) {
  const rect = insetRect(layout.main, 24);
  const sources = [
    ["audio hash", rect.x, rect.y + rect.h * 0.18, "blue"],
    ["lyrics", rect.x, rect.y + rect.h * 0.43, "amber"],
    ["metadata", rect.x, rect.y + rect.h * 0.68, "neutral"],
  ];
  const target = {
    x: rect.x + rect.w * 0.58,
    y: rect.y + rect.h * 0.22,
    w: rect.w * 0.34,
    h: rect.h * 0.56,
  };
  drawSubPanel(ctx, target, "fused song vector");
  sources.forEach(([label, x, y, tone]) => {
    const box = drawSourceBox(ctx, label, x, y, tone);
    drawArrow(ctx, box.x + box.w + 14, box.y + box.h * 0.5, target.x - 12, target.y + target.h * 0.5);
  });
  drawVector(ctx, target, frame);
}

function drawCandidateStage(ctx, layout, frame) {
  const rect = insetRect(layout.main, 22);
  drawVectorCloud(ctx, rect, 72, frame, { focus: true });
  const cx = rect.x + rect.w * 0.63 + Math.sin(frame * 0.02) * 8;
  const cy = rect.y + rect.h * 0.48 + Math.cos(frame * 0.016) * 6;
  drawRings(ctx, cx, cy, 22 + Math.sin(frame * 0.05) * 2, "amber");
  drawLabelChip(ctx, "candidate emerges", cx + 20, cy + 4, "amber");
}

function drawRecommendationStage(ctx, layout, frame) {
  const rect = insetRect(layout.main, 22);
  const left = sliceRect(rect, 0.02, 0.1, layout.outputPanel ? 0.72 : 0.55, 0.72);
  drawVectorCloud(ctx, left, 30, frame, { focus: true });
  const targetX = layout.outputPanel ? layout.outputPanel.x - 12 : rect.x + rect.w * 0.68;
  drawArrow(ctx, left.x + left.w * 0.76, left.y + left.h * 0.52, targetX, left.y + left.h * 0.52);
  drawLabelChip(ctx, "ranked output", left.x + left.w * 0.56, left.y + 26, "blue");
  if (!layout.outputPanel) {
    drawMiniRecommendation(ctx, sliceRect(rect, 0.62, 0.06, 0.34, 0.82), frame);
  }
}

function drawNeuralStage(ctx, layout, frame) {
  const rect = insetRect(layout.main, 24);
  const net = sliceRect(rect, 0.02, 0.1, 0.66, 0.78);
  const scores = sliceRect(rect, 0.73, 0.14, 0.24, 0.68);
  drawSubPanel(ctx, net, "ranking model");
  drawNeuralNetwork(ctx, insetRect(net, 24), frame);
  drawScoreStack(ctx, scores, [
    ["relevance", "94%"],
    ["novelty", "78%"],
    ["confidence", "91%"],
    ["diversity", "88%"],
  ]);
}

function drawFeedbackStage(ctx, layout, frame) {
  const rect = insetRect(layout.main, 24);
  const signals = sliceRect(rect, 0.04, 0.16, 0.34, 0.64);
  const weights = sliceRect(rect, 0.55, 0.12, 0.38, 0.7);
  drawSubPanel(ctx, signals, "user signals");
  drawSubPanel(ctx, weights, "updated weights");
  const chips = [
    ["LIKE", "+0.18", "amber"],
    ["SAVE", "+0.11", "blue"],
    ["SKIP", "-0.07", "neutral"],
  ];
  chips.forEach(([label, value, tone], index) => {
    const y = signals.y + 64 + index * 52;
    const chip = drawMetricChip(ctx, label, value, signals.x + 22, y, tone);
    drawArrow(ctx, chip.x + chip.w + 12, chip.y + chip.h * 0.5, weights.x - 14, weights.y + weights.h * (0.28 + index * 0.2));
  });
  drawWeightGrid(ctx, insetRect(weights, 26), frame);
}

function drawTasteStage(ctx, layout, frame) {
  const rect = insetRect(layout.main, 20);
  const clusters = [
    [0.2, 0.52, 48, "You", "blue"],
    [0.5, 0.28, 62, "Indie/Alt", "blue"],
    [0.72, 0.52, 50, "Alt R&B", "amber"],
    [0.42, 0.78, 38, "Texture", "violet"],
    [0.86, 0.24, 34, "Dream Pop", "blue"],
  ];
  const user = clusters[0];
  clusters.slice(1).forEach(([px, py]) => {
    drawArrow(ctx, rect.x + rect.w * user[0], rect.y + rect.h * user[1], rect.x + rect.w * px, rect.y + rect.h * py, "rgba(79,142,247,0.32)");
  });
  clusters.forEach(([px, py, radius, label, tone], index) => {
    const x = rect.x + rect.w * px;
    const y = rect.y + rect.h * py;
    const pulse = Math.sin(frame * 0.025 + index) * 3;
    drawCluster(ctx, x, y, radius + pulse, label, tone, index === 0);
  });
  drawLabelChip(ctx, "user-conditioned taste regions", rect.x + 16, rect.y + 28, "blue");
}

function drawWaves(ctx, rect, frame, layers) {
  const gradient = signalGradient(ctx, rect.x + rect.w);
  ctx.save();
  clipRect(ctx, rect);
  ctx.lineWidth = 1.7;
  ctx.strokeStyle = gradient;
  ctx.shadowColor = "rgba(79,142,247,0.7)";
  ctx.shadowBlur = 12;
  for (let layer = 0; layer < layers; layer += 1) {
    ctx.beginPath();
    for (let x = rect.x; x <= rect.x + rect.w; x += 8) {
      const phase = frame * (0.022 + layer * 0.004);
      const wave = Math.sin(x * 0.018 + phase + layer * 1.3) * (rect.h * 0.08 - layer * 2);
      const micro = Math.sin(x * 0.052 - phase * 1.5) * 5;
      const y = rect.y + rect.h * (0.24 + 0.52 * (layer / Math.max(1, layers - 1))) + wave + micro;
      if (x === rect.x) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawBitMatrix(ctx, rect, frame, rows, cols) {
  const bits = "101101001011110010100111001011001011010110";
  const cellW = rect.w / cols;
  const cellH = rect.h / rows;
  ctx.save();
  ctx.font = "13px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col;
      const bit = bits[index % bits.length];
      ctx.fillStyle = bit === "1" ? "rgba(79,142,247,0.94)" : "rgba(232,168,56,0.72)";
      ctx.fillText(bit, rect.x + col * cellW + cellW * 0.5, rect.y + row * cellH + cellH * 0.5 + Math.sin(frame * 0.025 + index) * 1.2);
    }
  }
  ctx.restore();
}

function drawVectorCloud(ctx, rect, count, frame, options = {}) {
  if (options.axes) {
    ctx.strokeStyle = "rgba(240,240,240,0.16)";
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.w * 0.14, rect.y + rect.h * 0.84);
    ctx.lineTo(rect.x + rect.w * 0.9, rect.y + rect.h * 0.84);
    ctx.moveTo(rect.x + rect.w * 0.14, rect.y + rect.h * 0.84);
    ctx.lineTo(rect.x + rect.w * 0.14, rect.y + rect.h * 0.16);
    ctx.stroke();
  }
  for (let i = 0; i < count; i += 1) {
    const angle = i * 2.399 + frame * 0.002;
    const r = Math.min(rect.w, rect.h) * (0.11 + (i % 13) * 0.023);
    const x = rect.x + rect.w * 0.5 + Math.cos(angle) * r * 1.35;
    const y = rect.y + rect.h * 0.5 + Math.sin(angle) * r * 0.82;
    ctx.fillStyle = i % 5 === 0 ? "rgba(232,168,56,0.76)" : "rgba(79,142,247,0.72)";
    ctx.beginPath();
    ctx.arc(x, y, i % 7 === 0 ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (options.focus) {
    const cx = rect.x + rect.w * 0.64 + Math.sin(frame * 0.02) * 8;
    const cy = rect.y + rect.h * 0.48 + Math.cos(frame * 0.016) * 6;
    ctx.fillStyle = "rgba(232,168,56,0.95)";
    ctx.shadowColor = "rgba(232,168,56,0.75)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawVector(ctx, rect, frame) {
  ctx.strokeStyle = "rgba(79,142,247,0.82)";
  ctx.fillStyle = "rgba(79,142,247,0.08)";
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  for (let i = 0; i < 9; i += 1) {
    ctx.fillStyle = i % 3 === 0 ? "rgba(232,168,56,0.85)" : "rgba(79,142,247,0.86)";
    ctx.beginPath();
    ctx.arc(rect.x + rect.w * (0.2 + i * 0.07), rect.y + rect.h * 0.5 + Math.sin(frame * 0.04 + i) * rect.h * 0.18, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawArrow(ctx, x1, y1, x2, y2, color = "rgba(79,142,247,0.42)") {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = "rgba(79,142,247,0.72)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 8 * Math.cos(angle - 0.45), y2 - 8 * Math.sin(angle - 0.45));
  ctx.lineTo(x2 - 8 * Math.cos(angle + 0.45), y2 - 8 * Math.sin(angle + 0.45));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPanel(ctx, rect, fill, stroke) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function drawSubPanel(ctx, rect, label) {
  drawPanel(ctx, rect, "rgba(17,17,22,0.34)", "rgba(79,142,247,0.16)");
  drawPanelTitle(ctx, rect, label);
}

function drawPanelTitle(ctx, rect, label, tone = "blue") {
  const color = tone === "amber" ? "rgba(232,168,56,0.88)" : "rgba(79,142,247,0.88)";
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "11px JetBrains Mono, monospace";
  ctx.textTransform = "uppercase";
  ctx.fillText(label.toUpperCase(), rect.x + 14, rect.y + 22);
  ctx.restore();
}

function drawLabelChip(ctx, label, x, y, tone = "blue") {
  const color = tone === "amber" ? "rgba(232,168,56,0.84)" : "rgba(79,142,247,0.84)";
  ctx.save();
  ctx.font = "12px JetBrains Mono, monospace";
  const textWidth = ctx.measureText(label).width;
  ctx.fillStyle = "rgba(10,10,12,0.82)";
  ctx.strokeStyle = tone === "amber" ? "rgba(232,168,56,0.28)" : "rgba(79,142,247,0.28)";
  ctx.fillRect(x - 8, y - 16, textWidth + 16, 24);
  ctx.strokeRect(x - 8, y - 16, textWidth + 16, 24);
  ctx.fillStyle = color;
  ctx.font = "12px JetBrains Mono, monospace";
  ctx.fillText(label, x, y);
  ctx.restore();
}

function drawSourceBox(ctx, label, x, y, tone) {
  const colors = {
    blue: "rgba(79,142,247,0.86)",
    amber: "rgba(232,168,56,0.86)",
    neutral: "rgba(240,240,240,0.62)",
  };
  const rect = { x, y, w: 132, h: 38 };
  ctx.save();
  ctx.fillStyle = "rgba(10,10,12,0.78)";
  ctx.strokeStyle = colors[tone];
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle = colors[tone];
  ctx.font = "12px JetBrains Mono, monospace";
  ctx.fillText(label, rect.x + 12, rect.y + 24);
  ctx.restore();
  return rect;
}

function drawSignalReadout(ctx, rect, labels, tone) {
  const startX = rect.x + 12;
  const startY = rect.y + rect.h - 30;
  labels.forEach((label, index) => {
    drawMetricChip(ctx, label, `${Math.round(86 - index * 9)}%`, startX + index * 126, startY, tone);
  });
}

function drawMetricChip(ctx, label, value, x, y, tone = "blue") {
  const rect = { x, y: y - 24, w: 108, h: 34 };
  const stroke = tone === "amber" ? "rgba(232,168,56,0.34)" : tone === "neutral" ? "rgba(240,240,240,0.22)" : "rgba(79,142,247,0.34)";
  const text = tone === "amber" ? "rgba(232,168,56,0.9)" : tone === "neutral" ? "rgba(240,240,240,0.72)" : "rgba(79,142,247,0.9)";
  ctx.save();
  ctx.fillStyle = "rgba(10,10,12,0.78)";
  ctx.strokeStyle = stroke;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle = text;
  ctx.font = "11px JetBrains Mono, monospace";
  ctx.fillText(label, rect.x + 10, rect.y + 14);
  ctx.fillStyle = "rgba(240,240,240,0.82)";
  ctx.fillText(value, rect.x + 10, rect.y + 28);
  ctx.restore();
  return rect;
}

function drawRings(ctx, x, y, radius, tone) {
  const stroke = tone === "amber" ? "rgba(232,168,56,0.72)" : "rgba(79,142,247,0.72)";
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i += 1) {
    ctx.globalAlpha = 0.78 - i * 0.18;
    ctx.beginPath();
    ctx.arc(x, y, radius + i * 11, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMiniRecommendation(ctx, rect, frame) {
  drawSubPanel(ctx, rect, "recommendation");
  const art = { x: rect.x + 20, y: rect.y + 42, w: Math.min(112, rect.w - 40), h: Math.min(112, rect.w - 40) };
  const gradient = ctx.createLinearGradient(art.x, art.y, art.x + art.w, art.y + art.h);
  gradient.addColorStop(0, "rgba(79,142,247,0.92)");
  gradient.addColorStop(0.58, "rgba(216,42,92,0.62)");
  gradient.addColorStop(1, "rgba(232,168,56,0.88)");
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(art.x, art.y, art.w, art.h);
  ctx.strokeStyle = "rgba(232,168,56,0.28)";
  ctx.strokeRect(art.x, art.y, art.w, art.h);
  ctx.strokeStyle = "rgba(240,240,240,0.28)";
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    for (let x = art.x + 8; x <= art.x + art.w - 8; x += 6) {
      const y = art.y + art.h * (0.45 + i * 0.08) + Math.sin(frame * 0.025 + x * 0.05 + i) * 6;
      if (x === art.x + 8) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(240,240,240,0.92)";
  ctx.font = "600 15px Space Grotesk, sans-serif";
  ctx.fillText("Glass Circuit", rect.x + 20, art.y + art.h + 34);
  ctx.fillStyle = "rgba(182,182,189,0.78)";
  ctx.font = "12px Space Grotesk, sans-serif";
  ctx.fillText("NOVA LANE", rect.x + 20, art.y + art.h + 54);
  ctx.restore();
}

function drawNeuralNetwork(ctx, rect, frame) {
  const columns = [0.1, 0.36, 0.64, 0.9];
  const nodes = columns.map((col, columnIndex) =>
    Array.from({ length: columnIndex === 0 || columnIndex === 3 ? 3 : 4 }, (_, rowIndex) => ({
      x: rect.x + rect.w * col,
      y: rect.y + rect.h * (0.18 + rowIndex * 0.21 + (columnIndex % 2) * 0.06),
    }))
  );
  ctx.save();
  ctx.strokeStyle = "rgba(79,142,247,0.26)";
  nodes.forEach((column, index) => {
    if (!nodes[index + 1]) return;
    column.forEach((node) =>
      nodes[index + 1].forEach((next) => {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      })
    );
  });
  nodes.flat().forEach((node, index) => {
    ctx.fillStyle = index % 4 === 0 ? "rgba(232,168,56,0.92)" : "rgba(79,142,247,0.92)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5 + Math.sin(frame * 0.05 + index) * 1.2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawScoreStack(ctx, rect, scores) {
  scores.forEach(([label, value], index) => {
    drawMetricChip(ctx, label, value, rect.x, rect.y + 30 + index * 42, index % 2 ? "blue" : "amber");
  });
}

function drawWeightGrid(ctx, rect, frame) {
  const cols = 5;
  const rows = 4;
  const cellW = rect.w / cols;
  const cellH = rect.h / rows;
  ctx.save();
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = rect.x + col * cellW + cellW * 0.5;
      const y = rect.y + row * cellH + cellH * 0.5;
      const active = (row + col + Math.floor(frame / 28)) % 3 === 0;
      ctx.strokeStyle = active ? "rgba(232,168,56,0.7)" : "rgba(79,142,247,0.5)";
      ctx.fillStyle = active ? "rgba(232,168,56,0.12)" : "rgba(79,142,247,0.08)";
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (col < cols - 1) {
        ctx.strokeStyle = "rgba(79,142,247,0.18)";
        ctx.beginPath();
        ctx.moveTo(x + 9, y);
        ctx.lineTo(x + cellW - 9, y + Math.sin(frame * 0.02 + row + col) * 5);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function drawCluster(ctx, x, y, radius, label, tone, active) {
  const colors = {
    blue: ["rgba(79,142,247,0.22)", "rgba(79,142,247,0.78)"],
    amber: ["rgba(232,168,56,0.16)", "rgba(232,168,56,0.72)"],
    violet: ["rgba(160,98,255,0.14)", "rgba(160,98,255,0.66)"],
  };
  const [fill, stroke] = colors[tone] || colors.blue;
  ctx.save();
  ctx.fillStyle = active ? "rgba(79,142,247,0.34)" : fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = active ? 2 : 1.2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(x, y, radius + 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(240,240,240,0.86)";
  ctx.font = "12px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
  ctx.restore();
}

function insetRect(rect, insetX, insetY = insetX) {
  return {
    x: rect.x + insetX,
    y: rect.y + insetY,
    w: Math.max(0, rect.w - insetX * 2),
    h: Math.max(0, rect.h - insetY * 2),
  };
}

function sliceRect(rect, x, y, w, h) {
  return {
    x: rect.x + rect.w * x,
    y: rect.y + rect.h * y,
    w: rect.w * w,
    h: rect.h * h,
  };
}

function clipRect(ctx, rect) {
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
}
