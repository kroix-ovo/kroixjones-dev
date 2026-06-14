export const profile = {
  name: "Kroix Jones",
  email: "kroixjones@gmail.com",
  linkedin: "https://www.linkedin.com/in/kroix-jones",
  github: "https://github.com/kroix-ovo",
};

export const resume = {
  education: [
    {
      school: "Howard University",
      degree: "B.S. Electrical Engineering, Minor in Mathematics",
      location: "Washington, DC",
      date: "May 2028",
      details: ["GPA: 3.77", "Relevant coursework: Digital Systems, Advanced Digital Systems, Circuit Theory, Engineering Programming, PCB Design"],
    },
  ],
  skills: [
    {
      label: "Languages",
      items: ["Python", "SystemVerilog", "VHDL", "Verilog", "C/C++", "Java", "Kotlin", "Go", "MATLAB", "Bash"],
    },
    {
      label: "ML / Data",
      items: ["PyTorch", "scikit-learn", "NumPy", "pandas", "SBERT", "recommendation systems", "cosine similarity", "MMR", "FastAPI", "evaluation pipelines", "GPU-aware optimization"],
    },
    {
      label: "Hardware / Systems",
      items: ["RTL design", "RTL verification", "testbenches", "assertions", "FPGA", "Vivado", "analog circuits", "embedded systems", "UART/serial", "KiCad", "Multisim", "PSPICE", "Git", "Linux/UNIX", "Cloud APIs"],
    },
  ],
  experience: [
    {
      role: "Hardware Systems Engineering Intern",
      org: "Abbott",
      location: "Alameda, CA",
      date: "May 2026-Aug 2026",
      bullets: [
        "Support medical-device hardware and systems efforts for PCBA- and ASIC-related Abbott Diabetes Care platforms, including analog circuit evaluation, oscilloscope-based signal inspection, and hardware debug workflow development.",
        "Contribute Go code to cloud API services connecting healthcare providers, patients, and Abbott administrators, translating device and data workflow needs into backend service requirements.",
        "Built Python automation to analyze ~7.46M multichannel sensor readings from 19 lab tests, replacing manual Plotly graph review with structured event detection and reporting, reducing inspection time by ~80%.",
        "Implemented multi-channel phenomenon logic for spikes, data loss, bias/align states, and long/short anomalies, helping separate isolated sensor behavior from synchronized system-wide signal movement.",
      ],
    },
    {
      role: "Implementation Automation Engineer",
      org: "M6IT Consulting",
      location: "Remote / Manhattan, NY",
      date: "Sep 2025-Apr 2026",
      bullets: [
        "Built backend APIs, cloud API integrations, and automation tools for NDA-protected client software systems using Java, Kotlin, SQL, and Python.",
        "Developed Java/Python backend fixes, debugging utilities, and data-processing scripts to improve reliability, feature delivery, and operational turnaround.",
        "Supported ML/data automation using Python, including preprocessing, model prototyping, and algorithm optimization for client-facing solutions totaling $2+ million in company revenue.",
      ],
    },
    {
      role: "Process Engineering Intern",
      org: "Abbott",
      location: "Altavista, VA",
      date: "May 2025-Aug 2025",
      bullets: [
        "Built a data-driven engineering presentation delivered to the North America VP of Nutrition after collecting input from engineering, maintenance, lab, and plant leadership.",
        "Conducted field inspections and test work to prioritize 95% of plant inspection systems, supporting reliability planning and maintenance decisions.",
      ],
    },
  ],
  projects: [
    {
      name: "KRX Music",
      descriptor: "Research-Driven Music Recommendation Engine",
      stack: "Python, ML, FastAPI, SBERT",
      date: "Mar 2022-Present",
      bullets: [
        "Built a 4-year research-driven recommendation engine that maps music taste using perceptual audio analysis, 384-dimensional SBERT embeddings, vector similarity, metadata-aware ranking, and diversity optimization.",
        "Designed a multimodal ranking pipeline comparing signal-level audio behavior and text context to rank up to 220 candidate tracks per query across relevance, novelty, and taste alignment.",
        "Developed Taste Neighborhoods, a live learned taste-graph interface where neural-network output groupings update after likes/dislikes and expose user-conditioned genre topology, confidence, purity, stability, label evidence, and taxonomy.",
        "Ran a 30-day private alpha with 24 testers receiving 10 recommendations per day; 100% agreed KRX was more relevant than their usual music provider, with 92% strongly agreeing.",
      ],
    },
    {
      name: "RV32I RISC-V CPU Core + SystemVerilog Verification Suite",
      descriptor: "Modular Single-Cycle CPU",
      stack: "SystemVerilog, RTL, FPGA",
      date: "May 2026-Present",
      bullets: [
        "Building a modular single-cycle RV32I CPU with PC, instruction/data memory, decoder, control unit, register file, immediate generator, ALU, branch/jump logic, and writeback.",
        "Writing module-level and CPU-level SystemVerilog testbenches, directed instruction tests, assertions, waveform-debug notes, and a verification plan for FPGA deployment.",
        "Implementing Python-assisted simulation workflows and regression checks to validate instruction behavior, isolate RTL bugs, and improve repeatable CPU-level verification before FPGA deployment.",
      ],
    },
    {
      name: "XIAO Scope Studio",
      descriptor: "Desktop Oscilloscope + Signal Generator",
      stack: "Python, Serial, Embedded Tools",
      date: "Apr 2026-May 2026",
      bullets: [
        "Built and open-sourced a working oscilloscope/signal-generator app for Seeed Studio XIAO SAMD21 hardware with serial handling, waveform capture, AWG generation, pin-map viewing, autosave, and packaged .exe distribution.",
        "Implemented live breadboard waveform capture, AWG signal generation, serial-device handling, runtime recovery, autosave history, pin map viewing, and a student-ready launcher workflow for Howard EE/CpE curriculum use beginning Fall 2026.",
      ],
    },
  ],
  honors: [
    "Howard University Achievers Scholar",
    "Dean's List",
    "IEEE Hands On PCB Engineering Chair",
    "Sigma Phi Delta Programming Chair",
    "Apple Next Generation Innovators",
    "Ballet and Books Social Media Director",
    "NSBE",
    "PEPCO Scholar 2025-2026",
  ],
};

export const featuredProjects = [
  {
    name: "KRX Music",
    title: "Research-driven music recommendation engine",
    summary: "Maps taste through embeddings, audio context, metadata-aware ranking, and learned Taste Neighborhoods.",
    stack: ["Python", "ML", "FastAPI", "SBERT"],
    proof: ["4-year build", "384-dim embeddings", "100% alpha relevance agreement"],
    diagram: "krx",
    primaryAction: { label: "Explore KRX", href: "#krx-music" },
    statusAction: "Website coming soon",
    feature: true,
  },
  {
    name: "RV32I RISC-V CPU Core",
    title: "Single-cycle modular CPU",
    summary: "SystemVerilog RV32I core with PC, memories, decoder, control, register file, ALU, branch/jump logic, writeback, and verification workflows.",
    stack: ["SystemVerilog", "RTL", "FPGA"],
    proof: ["Directed tests", "Assertions", "FPGA-targeted"],
    diagram: "riscv",
    primaryAction: null,
    github: "https://github.com/kroix-ovo/rv32i-sv-core",
  },
  {
    name: "XIAO Scope Studio",
    title: "Desktop oscilloscope + signal generator",
    summary: "Open-sourced app for Seeed XIAO SAMD21 with waveform capture, AWG generation, serial handling, autosave, and curriculum adoption.",
    stack: ["Python", "Serial", "Embedded Tools"],
    proof: ["Open-sourced", "Howard EE/CpE Fall 2026", "Packaged desktop app"],
    diagram: "scope",
    primaryAction: null,
    github: "https://github.com/kroix-ovo/xiao-scope-studio",
  },
  {
    name: "VHDL Asteroids Game",
    title: "FPGA-style arcade game architecture",
    summary: "VHDL arcade game project with VGA-era game-state thinking, sprite movement, collision behavior, scoring, and hardware-friendly control flow.",
    stack: ["VHDL", "Digital Design", "Game Logic"],
    proof: ["Arcade loop", "Collision + scoring", "Hardware-minded design"],
    diagram: "asteroids",
    primaryAction: null,
    github: "https://github.com/kroix-ovo/VHDL-Asteroids-Game",
  },
  {
    name: "Growing Things Up - Season 1",
    title: "Commercial game systems developer",
    summary: "Developed and streamlined a Cocos2d-x-based engine for hybrid 2D/3D gameplay, real-time physics animation, rendering systems, UI flow, dialogue, audio, and smooth scene transitions.",
    stack: ["C++", "Cocos2d-x", "Physics", "Rendering Systems"],
    proof: ["Commercial release", "10,000+ copies in 48 hours", "30,000+ total users"],
    diagram: "growing",
    primaryAction: null,
    external: { label: "Steam", href: "https://store.steampowered.com/app/3910610/Growing_Things_Up__Season_1/" },
  },
  {
    name: "KRX Java Game Engine",
    title: "Custom LWJGL/OpenGL engine prototype",
    summary: "Java game engine prototype with 2D/3D rendering, scene graph architecture, shaders, textures, materials, dynamic lighting, physics, collision, audio APIs, and optimized chunk/entity workflows.",
    stack: ["Java", "LWJGL", "OpenGL", "3D Design"],
    proof: ["60+ FPS demos", "Voxel + arcade prototypes", "~30% lower frame latency"],
    diagram: "java-engine",
    primaryAction: null,
    github: "https://github.com/kroix-ovo/KRX-Java-Game-Engine",
  },
];
