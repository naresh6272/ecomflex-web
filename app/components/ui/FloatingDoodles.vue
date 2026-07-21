<template>
  <div class="doodles-root" aria-hidden="true">

    <!-- Developer at desk — bottom left -->
    <div class="doodle d-dev">
      <svg viewBox="0 0 200 180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <!-- desk surface + legs -->
        <line x1="0" y1="148" x2="200" y2="148" stroke-width="2.5"/>
        <line x1="24" y1="148" x2="20" y2="178" stroke-width="2.5"/>
        <line x1="176" y1="148" x2="180" y2="178" stroke-width="2.5"/>
        <line x1="22" y1="164" x2="178" y2="164" stroke-width="1.5"/>
        <!-- laptop base -->
        <rect x="55" y="132" width="90" height="12" rx="4" stroke-width="1.8"/>
        <rect x="82" y="135" width="36" height="7" rx="2" stroke-width="1" opacity="0.4"/>
        <!-- laptop screen -->
        <path d="M60 132 L56 72 L144 72 L140 132Z" stroke-width="1.8"/>
        <path d="M65 78 L61 126 L139 126 L135 78Z" stroke-width="1" fill="currentColor" fill-opacity="0.04"/>
        <!-- code lines on screen -->
        <line x1="70" y1="88" x2="96" y2="88" stroke-width="1.6" opacity="0.55"/>
        <line x1="70" y1="97" x2="110" y2="97" stroke-width="1.6" opacity="0.55"/>
        <line x1="70" y1="106" x2="88" y2="106" stroke-width="1.6" opacity="0.55"/>
        <line x1="74" y1="115" x2="100" y2="115" stroke-width="1.6" opacity="0.55"/>
        <line x1="100" y1="114" x2="100" y2="108" stroke-width="2" class="cursor"/>
        <!-- torso behind laptop -->
        <path d="M66 132 Q62 115 68 100 Q76 86 100 84 Q124 86 132 100 Q138 115 134 132" stroke-width="2"/>
        <path d="M90 84 L100 96 L110 84" stroke-width="1.5"/>
        <!-- arms on keyboard -->
        <path d="M68 110 Q58 122 58 138 Q72 142 80 138" stroke-width="2"/>
        <path d="M132 110 Q142 122 142 138 Q128 142 120 138" stroke-width="2"/>
        <!-- head -->
        <circle cx="100" cy="56" r="22" stroke-width="2"/>
        <path d="M78 50 Q82 30 100 28 Q118 30 122 50" stroke-width="2.5" fill="currentColor" fill-opacity="0.12"/>
        <!-- glasses -->
        <rect x="84" y="49" width="13" height="10" rx="4" stroke-width="1.4" opacity="0.45"/>
        <rect x="103" y="49" width="13" height="10" rx="4" stroke-width="1.4" opacity="0.45"/>
        <line x1="97" y1="54" x2="103" y2="54" stroke-width="1.4"/>
        <!-- eyes -->
        <ellipse cx="90" cy="53" rx="2.5" ry="3" fill="currentColor"/>
        <ellipse cx="109" cy="53" rx="2.5" ry="3" fill="currentColor"/>
        <!-- eyebrows -->
        <path d="M86 46 Q90 43 94 45" stroke-width="1.6"/>
        <path d="M106 45 Q110 43 114 46" stroke-width="1.6"/>
        <!-- smile -->
        <path d="M92 68 Q100 74 108 68" stroke-width="1.8"/>
        <!-- ears -->
        <path d="M78 54 Q73 56 74 62 Q75 68 80 66" stroke-width="1.5"/>
        <path d="M122 54 Q127 56 126 62 Q125 68 120 66" stroke-width="1.5"/>
        <!-- coffee mug -->
        <rect x="155" y="120" width="26" height="30" rx="6" stroke-width="2"/>
        <path d="M181 127 Q192 127 192 136 Q192 144 181 144" stroke-width="2"/>
        <line x1="155" y1="126" x2="181" y2="126" stroke-width="1.2" opacity="0.35"/>
        <path d="M163 118 Q165 110 163 102" stroke-width="1.5" opacity="0.38"/>
        <path d="M170 116 Q172 108 170 100" stroke-width="1.5" opacity="0.38"/>
        <path d="M177 118 Q179 110 177 102" stroke-width="1.5" opacity="0.38"/>
        <!-- plant left side -->
        <line x1="14" y1="148" x2="14" y2="116" stroke-width="2"/>
        <path d="M6 148 L8 136 L20 136 L22 148Z" stroke-width="1.8"/>
        <path d="M14 116 Q4 108 6 100 Q14 96 18 104 Q14 110 14 116Z" stroke-width="1.5" fill="currentColor" fill-opacity="0.08"/>
        <path d="M14 110 Q24 102 26 94 Q18 90 14 100 Q14 106 14 110Z" stroke-width="1.5" fill="currentColor" fill-opacity="0.08"/>
      </svg>
    </div>

    <!-- Lightbulb idea person — top right -->
    <div class="doodle d-idea">
      <svg viewBox="0 0 100 220" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <!-- light rays -->
        <line x1="50" y1="18" x2="50" y2="8" stroke-width="1.5" opacity="0.45"/>
        <line x1="26" y1="28" x2="20" y2="20" stroke-width="1.5" opacity="0.45"/>
        <line x1="74" y1="28" x2="80" y2="20" stroke-width="1.5" opacity="0.45"/>
        <line x1="16" y1="50" x2="8" y2="50" stroke-width="1.5" opacity="0.45"/>
        <line x1="84" y1="50" x2="92" y2="50" stroke-width="1.5" opacity="0.45"/>
        <!-- bulb glass -->
        <path d="M36 48 Q28 56 28 66 Q28 78 38 86 L62 86 Q72 78 72 66 Q72 56 64 48 Q56 38 50 36 Q44 38 36 48Z" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
        <!-- filament -->
        <path d="M40 78 Q45 70 50 78 Q55 86 60 78" stroke-width="1.4" opacity="0.4"/>
        <!-- base -->
        <line x1="38" y1="86" x2="38" y2="94" stroke-width="2"/>
        <line x1="62" y1="86" x2="62" y2="94" stroke-width="2"/>
        <line x1="36" y1="94" x2="64" y2="94" stroke-width="2"/>
        <line x1="38" y1="98" x2="62" y2="98" stroke-width="2"/>
        <line x1="40" y1="102" x2="60" y2="102" stroke-width="2"/>
        <!-- string to hand -->
        <path d="M50 102 Q46 116 44 124" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.5"/>
        <!-- raised arm -->
        <path d="M42 152 Q28 138 34 124 Q38 116 44 124" stroke-width="2"/>
        <circle cx="46" cy="126" r="5" stroke-width="1.5"/>
        <!-- head -->
        <circle cx="50" cy="116" r="18" stroke-width="2"/>
        <path d="M32 110 Q34 94 50 92 Q66 94 68 110" stroke-width="2.5" fill="currentColor" fill-opacity="0.1"/>
        <circle cx="50" cy="91" r="6" stroke-width="1.8" fill="currentColor" fill-opacity="0.08"/>
        <!-- eyes excited -->
        <circle cx="43" cy="114" r="3.5" fill="currentColor"/>
        <circle cx="57" cy="114" r="3.5" fill="currentColor"/>
        <circle cx="44.5" cy="112.5" r="1.2" fill="white" stroke-width="0"/>
        <circle cx="58.5" cy="112.5" r="1.2" fill="white" stroke-width="0"/>
        <!-- eyebrows raised -->
        <path d="M39 107 Q43 104 47 106" stroke-width="1.6"/>
        <path d="M53 106 Q57 104 61 107" stroke-width="1.6"/>
        <!-- big smile -->
        <path d="M42 124 Q50 132 58 124" stroke-width="2"/>
        <!-- cheeks -->
        <circle cx="38" cy="122" r="4" fill="currentColor" fill-opacity="0.10" stroke-width="0"/>
        <circle cx="62" cy="122" r="4" fill="currentColor" fill-opacity="0.10" stroke-width="0"/>
        <!-- torso -->
        <path d="M34 164 Q30 150 36 140 Q42 130 50 130 Q58 130 64 140 Q70 150 66 164" stroke-width="2"/>
        <path d="M43 130 L50 140 L57 130" stroke-width="1.6"/>
        <!-- other arm down -->
        <path d="M64 150 Q78 160 76 176 Q74 184 68 184" stroke-width="2"/>
        <!-- body/legs -->
        <path d="M36 164 Q32 182 34 202 Q36 213 44 214" stroke-width="2"/>
        <path d="M64 164 Q68 182 66 202 Q64 213 56 214" stroke-width="2"/>
        <line x1="44" y1="214" x2="42" y2="218" stroke-width="2.5"/>
        <line x1="56" y1="214" x2="58" y2="218" stroke-width="2.5"/>
        <path d="M38 216 Q42 220 48 218" stroke-width="2"/>
        <path d="M52 218 Q58 220 62 216" stroke-width="2"/>
      </svg>
    </div>

    <!-- Rocket — mid right -->
    <div class="doodle d-rocket">
      <svg viewBox="0 0 70 130" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <!-- stars -->
        <circle cx="8" cy="22" r="2" fill="currentColor" opacity="0.4"/>
        <circle cx="60" cy="12" r="1.5" fill="currentColor" opacity="0.35"/>
        <circle cx="64" cy="45" r="2" fill="currentColor" opacity="0.3"/>
        <path d="M14 8 L15.5 4 L17 8 L21 9 L17 10 L15.5 14 L14 10 L10 9Z" stroke-width="1" fill="currentColor" opacity="0.35"/>
        <!-- rocket body -->
        <path d="M35 8 Q50 18 52 46 L52 92 Q44 102 35 104 Q26 102 18 92 L18 46 Q20 18 35 8Z" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
        <!-- porthole -->
        <circle cx="35" cy="56" r="12" stroke-width="2"/>
        <circle cx="35" cy="56" r="8" stroke-width="1" opacity="0.3" fill="currentColor" fill-opacity="0.05"/>
        <!-- astronaut face -->
        <circle cx="35" cy="56" r="5" stroke-width="1.2" opacity="0.5"/>
        <circle cx="33" cy="55" r="1.5" fill="currentColor" opacity="0.7"/>
        <circle cx="37" cy="55" r="1.5" fill="currentColor" opacity="0.7"/>
        <path d="M32 58 Q35 61 38 58" stroke-width="1" opacity="0.7"/>
        <!-- fins -->
        <path d="M18 70 Q5 80 9 100 L18 90" stroke-width="2"/>
        <path d="M52 70 Q65 80 61 100 L52 90" stroke-width="2"/>
        <!-- flames -->
        <path d="M24 102 Q28 116 23 126 Q30 114 35 122 Q40 114 47 126 Q42 116 46 102" stroke-width="1.8" fill="currentColor" fill-opacity="0.08"/>
        <!-- center seam -->
        <line x1="35" y1="10" x2="35" y2="104" stroke-width="1" opacity="0.2"/>
        <!-- rivets -->
        <circle cx="26" cy="42" r="1.5" fill="currentColor" opacity="0.35"/>
        <circle cx="44" cy="42" r="1.5" fill="currentColor" opacity="0.35"/>
        <!-- antenna -->
        <line x1="35" y1="8" x2="35" y2="2" stroke-width="1.5"/>
        <circle cx="35" cy="1.5" r="2" fill="currentColor" opacity="0.5"/>
      </svg>
    </div>

    <!-- Chart + celebration — bottom right -->
    <div class="doodle d-chart">
      <svg viewBox="0 0 140 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <!-- axes -->
        <line x1="20" y1="140" x2="130" y2="140" stroke-width="2"/>
        <line x1="20" y1="20" x2="20" y2="140" stroke-width="2"/>
        <path d="M16 24 L20 16 L24 24" stroke-width="1.8"/>
        <path d="M126 136 L134 140 L126 144" stroke-width="1.8"/>
        <!-- bars -->
        <rect x="30" y="115" width="18" height="25" rx="3" stroke-width="1.8" fill="currentColor" fill-opacity="0.08"/>
        <rect x="56" y="96" width="18" height="44" rx="3" stroke-width="1.8" fill="currentColor" fill-opacity="0.1"/>
        <rect x="82" y="72" width="18" height="68" rx="3" stroke-width="1.8" fill="currentColor" fill-opacity="0.12"/>
        <rect x="108" y="44" width="18" height="96" rx="3" stroke-width="1.8" fill="currentColor" fill-opacity="0.15"/>
        <!-- trend line -->
        <path d="M39 115 Q65 96 91 72 Q104 58 117 44" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.5"/>
        <circle cx="39" cy="115" r="3" fill="currentColor" opacity="0.6"/>
        <circle cx="65" cy="96" r="3" fill="currentColor" opacity="0.6"/>
        <circle cx="91" cy="72" r="3" fill="currentColor" opacity="0.6"/>
        <circle cx="117" cy="44" r="3" fill="currentColor" opacity="0.6"/>
        <!-- celebrating person on tallest bar -->
        <circle cx="117" cy="32" r="8" stroke-width="1.8"/>
        <path d="M109 28 Q111 20 117 19 Q123 20 125 28" stroke-width="1.8" fill="currentColor" fill-opacity="0.12"/>
        <circle cx="114" cy="31" r="1.5" fill="currentColor"/>
        <circle cx="120" cy="31" r="1.5" fill="currentColor"/>
        <path d="M113 37 Q117 41 121 37" stroke-width="1.5"/>
        <!-- arms raised V -->
        <path d="M117 40 L108 26" stroke-width="2"/>
        <path d="M117 40 L126 26" stroke-width="2"/>
        <line x1="117" y1="40" x2="117" y2="54" stroke-width="2"/>
        <path d="M117 54 L112 64" stroke-width="2"/>
        <path d="M117 54 L122 64" stroke-width="2"/>
        <!-- confetti dots -->
        <circle cx="100" cy="22" r="2.5" fill="currentColor" opacity="0.4"/>
        <circle cx="132" cy="28" r="2" fill="currentColor" opacity="0.35"/>
        <circle cx="106" cy="12" r="2" fill="currentColor" opacity="0.3"/>
        <circle cx="128" cy="16" r="3" fill="currentColor" opacity="0.35"/>
        <path d="M104 36 L105 33 L106 36 L109 37 L106 38 L105 41 L104 38 L101 37Z" stroke-width="1" fill="currentColor" opacity="0.4"/>
      </svg>
    </div>

    <!-- Floating sparkles -->
    <span class="sparkle sp1">✦</span>
    <span class="sparkle sp2">✦</span>
    <span class="sparkle sp3">✧</span>
    <span class="sparkle sp4">✦</span>
    <span class="sparkle sp5">✧</span>
    <span class="sparkle sp6">✦</span>

  </div>
</template>

<script setup lang="ts">
// purely decorative
</script>

<style scoped>
.doodles-root {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

/* hide on mobile — characters would cover content */
@media (max-width: 767px) {
  .doodles-root { display: none; }
}

.doodle {
  position: absolute;
  color: rgba(37, 99, 235, 0.55);
  transition: opacity 0.4s;
}
:root[data-theme="dark"] .doodle {
  color: rgba(96, 165, 250, 0.18);
}

/* ── positions ── */
.d-dev {
  bottom: -8px;
  left: -10px;
  width: 200px;
  animation: float-dev 6s ease-in-out infinite;
}
.d-idea {
  top: 6%;
  right: -16px;
  width: 110px;
  animation: float-idea 7s ease-in-out infinite 1.2s;
}
.d-rocket {
  top: 38%;
  right: 3%;
  width: 68px;
  animation: rocket-float 5s ease-in-out infinite 0.5s;
}
.d-chart {
  bottom: -4px;
  right: 4%;
  width: 150px;
  animation: float-chart 7s ease-in-out infinite 2s;
}

/* hide chart on narrow viewports where it overlaps hero text */
@media (max-width: 1023px) {
  .d-chart { display: none; }
  .d-idea  { display: none; }
}
@media (max-width: 1279px) {
  .d-rocket { display: none; }
}

/* ── sparkles ── */
.sparkle {
  position: absolute;
  font-size: 14px;
  color: rgba(124, 58, 237, 0.5);
  animation: sparkle-pulse 3s ease-in-out infinite;
}
:root[data-theme="dark"] .sparkle {
  color: rgba(139, 92, 246, 0.2);
}
.sp1 { top: 18%;  left: 6%;   animation-delay: 0s;    font-size: 10px; }
.sp2 { top: 55%;  left: 8%;   animation-delay: 1.1s;  font-size: 16px; }
.sp3 { top: 28%;  right: 18%; animation-delay: 0.6s;  font-size: 12px; }
.sp4 { top: 72%;  right: 22%; animation-delay: 2s;    font-size: 10px; }
.sp5 { top: 44%;  left: 14%;  animation-delay: 1.5s;  font-size: 8px; }
.sp6 { top: 14%;  right: 28%; animation-delay: 0.3s;  font-size: 14px; }

/* ── animations ── */
@keyframes float-dev {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-14px); }
}
@keyframes float-idea {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-18px) rotate(2deg); }
}
@keyframes rocket-float {
  0%, 100% { transform: translateY(0px) rotate(-8deg); }
  50%       { transform: translateY(-22px) rotate(4deg); }
}
@keyframes float-chart {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}
@keyframes sparkle-pulse {
  0%, 100% { opacity: 0.25; transform: scale(0.8) rotate(0deg); }
  50%       { opacity: 0.9;  transform: scale(1.3) rotate(20deg); }
}

/* blinking cursor on dev's screen */
.cursor {
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
</style>
