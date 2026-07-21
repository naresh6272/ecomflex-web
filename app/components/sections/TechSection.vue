<template>
  <section id="technologies" class="section-padding relative overflow-hidden bg-[var(--color-bg)]">
    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="section-label mb-5 reveal-up">Tech Stack</div>
        <h2 class="section-title mb-5 reveal-up delay-100">
          Cutting-Edge<br /><span class="text-gradient">Technologies</span>
        </h2>
        <p class="section-sub reveal-up delay-200">
          We use the right tool for the right job — modern, battle-tested, and scalable.
        </p>
      </div>

      <div class="space-y-10">
        <div v-for="(group, gi) in techGroups" :key="group.label" class="reveal-up" :class="`delay-${gi * 100}`">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-sm">
              {{ group.icon }}
            </div>
            <h3 class="font-bold text-[var(--color-text-primary)]">{{ group.label }}</h3>
          </div>
          <div class="flex flex-wrap gap-3">
            <div v-for="tech in group.techs" :key="tech.name"
              class="card px-4 py-3 flex items-center gap-2.5 hover:border-[var(--color-border-strong)] hover:shadow-md group cursor-default reveal-up">
              <div class="w-6 h-6 shrink-0 flex items-center justify-center" :class="tech.invert ? 'logo-invert' : ''">
                <img :src="tech.logo" :alt="tech.name" class="w-6 h-6 object-contain" loading="lazy" />
              </div>
              <span class="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">{{ tech.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'
const SI = 'https://cdn.simpleicons.org'
const CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons'

// Inline SVGs for logos not available in CDNs
const AWS_SVG    = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FF9900' d='M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.072.056.144.056.208 0 .09-.056.18-.176.27l-.583.39a.444.444 0 0 1-.24.08c-.096 0-.192-.048-.288-.136a2.96 2.96 0 0 1-.343-.45 7.391 7.391 0 0 1-.295-.569c-.743.876-1.678 1.314-2.805 1.314-.8 0-1.438-.229-1.906-.683-.469-.455-.704-1.064-.704-1.826 0-.808.284-1.463.856-1.955.572-.491 1.331-.737 2.295-.737.32 0 .648.028.993.076.344.048.697.124 1.068.212v-.68c0-.708-.148-1.203-.44-1.494-.296-.29-.797-.432-1.509-.432-.324 0-.656.04-.996.12a7.35 7.35 0 0 0-.996.312 2.642 2.642 0 0 1-.324.12.578.578 0 0 1-.144.02c-.128 0-.192-.092-.192-.28v-.443c0-.144.02-.252.064-.316a.659.659 0 0 1 .256-.19 6.52 6.52 0 0 1 1.128-.4A5.463 5.463 0 0 1 3.96 4.16c1.088 0 1.884.248 2.395.744.508.496.764 1.248.764 2.26v2.872zm-3.867 1.45c.308 0 .624-.056.956-.168.332-.112.628-.316.876-.6.148-.176.26-.372.316-.596.056-.224.088-.496.088-.816v-.392a7.884 7.884 0 0 0-.86-.16 7.017 7.017 0 0 0-.876-.056c-.624 0-1.082.124-1.39.376-.308.252-.46.608-.46 1.072 0 .436.112.764.34.988.224.22.54.332.952.332l.058.02zm7.484.924c-.16 0-.268-.028-.34-.088-.072-.056-.136-.184-.192-.36L7.99 6.956a1.613 1.613 0 0 1-.084-.368c0-.144.072-.224.216-.224h.88c.168 0 .28.028.344.088.072.056.128.184.184.36l1.46 5.752 1.356-5.752c.048-.18.104-.304.176-.36.072-.056.192-.088.352-.088h.716c.168 0 .28.028.352.088.072.056.136.184.176.36l1.372 5.824 1.508-5.824c.056-.18.116-.304.184-.36.072-.056.18-.088.344-.088h.836c.144 0 .22.072.22.224 0 .044-.008.092-.02.148-.012.056-.032.132-.068.236l-2.096 5.972c-.056.18-.116.304-.188.36-.072.056-.184.088-.34.088h-.772c-.168 0-.28-.028-.352-.092-.072-.06-.136-.184-.176-.368L13.5 7.596l-1.348 5.296c-.044.18-.104.308-.176.368-.072.06-.188.092-.352.092h-.772zm11.178.252c-.468 0-.936-.056-1.392-.168-.456-.112-.812-.232-1.048-.372-.144-.08-.244-.168-.276-.248a.628.628 0 0 1-.048-.24v-.46c0-.188.072-.28.208-.28.052 0 .104.008.156.024.052.016.132.052.22.088.3.132.624.236.968.308.348.072.688.108 1.036.108.548 0 .976-.096 1.276-.288.3-.192.456-.468.456-.82 0-.24-.076-.44-.228-.604-.152-.164-.44-.312-.856-.452l-1.228-.38c-.62-.196-1.08-.484-1.368-.864-.288-.376-.436-.796-.436-1.248 0-.36.08-.676.236-.948.16-.272.372-.508.636-.704.268-.196.568-.344.912-.444.344-.1.708-.148 1.092-.148.192 0 .392.012.584.036.196.024.372.056.54.096.16.036.312.08.456.128.144.048.256.096.336.148.112.072.192.144.24.22.048.072.072.168.072.284v.424c0 .188-.072.284-.208.284a.956.956 0 0 1-.348-.096 4.185 4.185 0 0 0-1.744-.352c-.5 0-.892.08-1.168.248-.276.168-.416.42-.416.764 0 .24.084.444.252.612.168.168.48.336.924.484l1.204.38c.612.192 1.056.46 1.324.808.268.344.4.74.4 1.18 0 .368-.076.7-.224.992-.152.292-.36.548-.628.76-.268.216-.588.38-.956.492-.384.12-.796.18-1.24.18l-.016-.008z'/%3E%3C/svg%3E`

const OPENAI_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.065L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.06 14.39A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.843-3.368 2.019-1.164a.076.076 0 0 1 .071 0l4.758 2.747a4.504 4.504 0 0 1-.69 8.122V12.48a.786.786 0 0 0-.315-.729zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.76-2.744a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z'/%3E%3C/svg%3E`

const PINECONE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2300B388' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.83 0 1.5.67 1.5 1.5S12.83 8 12 8s-1.5-.67-1.5-1.5S11.17 5 12 5zm4 9.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V11c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v3.5z'/%3E%3C/svg%3E`

const techGroups = [
  { icon: '🎨', label: 'Frontend', techs: [
    { name: 'Vue.js / Nuxt',    logo: `${DI}/vuejs/vuejs-original.svg` },
    { name: 'React / Next.js',  logo: `${DI}/react/react-original.svg` },
    { name: 'TypeScript',       logo: `${DI}/typescript/typescript-original.svg` },
    { name: 'Tailwind CSS',     logo: `${DI}/tailwindcss/tailwindcss-original.svg` },
    { name: 'GSAP / Framer',    logo: `${SI}/greensock/88CE02` },
    { name: 'React Native',     logo: `${DI}/react/react-original.svg` },
  ]},
  { icon: '⚙️', label: 'Backend', techs: [
    { name: 'Node.js',          logo: `${DI}/nodejs/nodejs-original.svg` },
    { name: 'Python / Django',  logo: `${DI}/python/python-original.svg` },
    { name: 'Laravel / PHP',    logo: `${DI}/laravel/laravel-original.svg` },
    { name: 'Express.js',       logo: `${DI}/express/express-original.svg`, invert: true },
    { name: 'FastAPI',          logo: `${DI}/fastapi/fastapi-original.svg` },
    { name: 'Java Spring',      logo: `${DI}/spring/spring-original.svg` },
  ]},
  { icon: '🗄️', label: 'Databases', techs: [
    { name: 'PostgreSQL',       logo: `${DI}/postgresql/postgresql-original.svg` },
    { name: 'MongoDB',          logo: `${DI}/mongodb/mongodb-original.svg` },
    { name: 'Redis',            logo: `${DI}/redis/redis-original.svg` },
    { name: 'MySQL',            logo: `${DI}/mysql/mysql-original.svg` },
    { name: 'Supabase',         logo: `${DI}/supabase/supabase-original.svg` },
    { name: 'Firebase',         logo: `${DI}/firebase/firebase-original.svg` },
  ]},
  { icon: '☁️', label: 'Cloud & DevOps', techs: [
    { name: 'AWS',              logo: AWS_SVG },
    { name: 'Google Cloud',     logo: `${DI}/googlecloud/googlecloud-original.svg` },
    { name: 'DigitalOcean',     logo: `${DI}/digitalocean/digitalocean-original.svg` },
    { name: 'Docker',           logo: `${DI}/docker/docker-original.svg` },
    { name: 'Kubernetes',       logo: `${DI}/kubernetes/kubernetes-original.svg` },
    { name: 'GitHub Actions',   logo: `${DI}/github/github-original.svg`, invert: true },
  ]},
  { icon: '🤖', label: 'AI & ML', techs: [
    { name: 'OpenAI / GPT-4',   logo: OPENAI_SVG },
    { name: 'LangChain',        logo: `${SI}/langchain/1C3C3C`, invert: true },
    { name: 'TensorFlow',       logo: `${DI}/tensorflow/tensorflow-original.svg` },
    { name: 'Hugging Face',     logo: `${SI}/huggingface/FFD21E` },
    { name: 'Pinecone',         logo: PINECONE_SVG },
    { name: 'Anthropic Claude', logo: `${SI}/anthropic/D4A27F` },
  ]},
]
</script>

<style scoped>
.logo-invert img {
  filter: invert(1) brightness(0.85);
}
</style>
