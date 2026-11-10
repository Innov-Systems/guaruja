import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Clock3,
  Images,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Trees,
  UtensilsCrossed,
  UsersRound,
  Waves,
} from "lucide-react";
import logo from "./icon.png";
import styles from "./page.module.css";

const galleryPhotos = [
  {
    "src": "/media/imagens/WhatsApp Image 2026-11-08 at 21.27.15.jpeg",
    "alt": "Piscina e área externa"
  },
  {
    "src": "/media/imagens/WhatsApp Image 2026-11-08 at 21.26.22 (1).jpeg",
    "alt": "Churrasqueira e balcão"
  },
  {
    "src": "/media/imagens/WhatsApp Image 2026-11-08 at 21.31.41.jpeg",
    "alt": "Piscina vista de perto"
  },
  {
    "src": "/media/imagens/WhatsApp Image 2026-11-08 at 21.26.27 (2).jpeg",
    "alt": "Mesa de sinuca"
  },
  {
    "src": "/media/imagens/WhatsApp Image 2026-11-08 at 21.26.26 (2).jpeg",
    "alt": "Mesa de tênis de mesa"
  },
  {
    "src": "/media/imagens/WhatsApp Image 2026-11-08 at 21.27.14.jpeg",
    "alt": "Área de convivência"
  },
  {
    "src": "/media/imagens/WhatsApp Image 2026-11-08 at 21.26.20 (2).jpeg",
    "alt": "Cozinha de apoio"
  },
  {
    "src": "/media/imagens/WhatsApp Image 2026-11-08 at 21.33.12.jpeg",
    "alt": "Quarto de apoio"
  },
  {
    "src": "/media/imagens/WhatsApp Image 2026-11-08 at 21.26.25.jpeg",
    "alt": "Piscina e iluminação à noite"
  }
];

const highlights = [
  {
    icon: SunMedium,
    title: "Um dia para aproveitar",
    description:
      "Tempo de qualidade, conversa boa e espaço para viver o dia sem pressa.",
  },
  {
    icon: UsersRound,
    title: "Ambiente reservado",
    description:
      "Uma experiência mais tranquila para reunir família e pessoas queridas.",
  },
  {
    icon: Sparkles,
    title: "Momentos especiais",
    description:
      "O cenário certo para encontros, comemorações e finais de semana leves.",
  },
];

const structure = [
  {
    icon: Waves,
    title: "Área de piscina",
    description:
      "Um convite para se refrescar, descansar e aproveitar os dias de sol.",
  },
  {
    icon: UtensilsCrossed,
    title: "Espaço para reunir",
    description:
      "Área de convivência para servir, compartilhar refeições e ficar à vontade.",
  },
  {
    icon: Trees,
    title: "Ambiente ao ar livre",
    description:
      "Verde, luz natural e espaço aberto para deixar o dia mais gostoso.",
  },
  {
    icon: ShieldCheck,
    title: "Uso exclusivo",
    description:
      "Privacidade para que o seu grupo aproveite cada ambiente com tranquilidade.",
  },
];

const whatsappUrl =
  "https://wa.me/5543996729860?text=Ola%2C%20vim%20pelo%20site%20da%20Area%20de%20Lazer%20Guaruja%20e%20gostaria%20de%20mais%20informacoes.";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          alt=""
          className={styles.heroImage}
          fill
          priority
          sizes="100vw"
          src="/media/imagens/WhatsApp Image 2026-11-08 at 21.27.14.jpeg"
        />
        <div className={styles.heroShade} />

        <header className={styles.header}>
          <a className={styles.brand} href="#inicio" aria-label="Voltar ao início">
            <Image
              alt=""
              className={styles.brandLogo}
              height={56}
              priority
              src={logo}
              width={56}
            />
            <span>
              <strong>Guarujá</strong>
              <small>Área de lazer</small>
            </span>
          </a>

          <nav aria-label="Navegação principal" className={styles.navigation}>
            <a href="#espaco">O espaço</a>
            <a href="#estrutura">Estrutura</a>
            <a href="#galeria">Galeria</a>
          </nav>
        </header>

        <div className={styles.heroContent} id="inicio">
          <p className={styles.eyebrow}>Lazer, descanso e bons encontros</p>
          <h1>Área de Lazer Guarujá</h1>
          <p className={styles.heroText}>
            Um lugar para desacelerar, reunir quem importa e transformar um dia
            comum em uma lembrança especial.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#espaco">
              Conheça o espaço
              <ArrowDown aria-hidden="true" size={18} />
            </a>
            <a
              aria-label="Falar com a Area de Lazer Guaruja pelo WhatsApp"
              className={styles.whatsappAction}
              href={whatsappUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" size={18} />
              Falar no WhatsApp
            </a>
            <a className={styles.secondaryAction} href="#galeria">
              Ver galeria
            </a>
          </div>
        </div>

        <div className={styles.heroFooter}>
          <span>
            <Clock3 aria-hidden="true" size={17} />
            Feito para curtir o dia inteiro
          </span>
          <span>Ambiente familiar e acolhedor</span>
        </div>
      </section>

      <section className={styles.intro} id="espaco">
        <div className={styles.sectionLabel}>O espaço</div>
        <div className={styles.introCopy}>
          <h2>Seu próximo dia bom começa aqui.</h2>
          <p>
            A Área de Lazer Guarujá foi pensada para quem quer trocar a correria
            por um dia de piscina, comida compartilhada e boas conversas. Um
            ambiente simples, bonito e reservado para o seu grupo aproveitar de
            verdade.
          </p>
        </div>
      </section>

      <section aria-label="Destaques do espaço" className={styles.highlights}>
        {highlights.map(({ description, icon: Icon, title }) => (
          <article className={styles.highlightItem} key={title}>
            <Icon aria-hidden="true" size={22} />
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.structureSection} id="estrutura">
        <div className={styles.structureHeading}>
          <div>
            <p className={styles.sectionLabel}>Estrutura</p>
            <h2>Tudo no mesmo lugar, do mergulho ao almoço.</h2>
          </div>
          <p>
            Ambientes que se completam para deixar o encontro mais confortável,
            espontâneo e fácil de aproveitar.
          </p>
        </div>

        <div className={styles.structureGrid}>
          {structure.map(({ description, icon: Icon, title }, index) => (
            <article className={styles.structureItem} key={title}>
              <span className={styles.structureNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <Icon aria-hidden="true" size={24} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.gallerySection} id="galeria">
        <div className={styles.galleryHeading}>
          <div>
            <p className={styles.sectionLabel}>Galeria</p>
            <h2>Um pouco do clima que espera por você.</h2>
          </div>
          <p className={styles.mediaNotice}>
            Conheça a área de lazer em fotos reais e veja o vídeo do espaço.
          </p>
        </div>

        <div className={styles.galleryGrid}>
          {galleryPhotos.map((photo) => (
            <figure className={styles.galleryPhoto} key={photo.src}>
              <a href={photo.src} target="_blank" rel="noreferrer"
                aria-label={`Ver foto ampliada: ${photo.alt}`}>
                <Image
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                  src={photo.src}
                />
              </a>
              <figcaption>
                <Images aria-hidden="true" size={18} />
                {photo.alt}
              </figcaption>
            </figure>
          ))}
        </div>

        <figure className={styles.galleryVideo}>
          <video
            aria-label="Vídeo da área de lazer"
            controls
            playsInline
            preload="none"
            poster={galleryPhotos[0].src}
          >
            <source src="/media/videos/video1.mp4" type="video/mp4" />
            Seu navegador não suporta este vídeo.
            <a href="/media/videos/video1.mp4">Baixar vídeo do espaço</a>
          </video>
          <figcaption>Conheça o espaço em vídeo</figcaption>
        </figure>
      </section>

      <section className={styles.closing}>
        <Image
          alt=""
          className={styles.closingLogo}
          height={128}
          src={logo}
          width={128}
        />
        <p>Um dia inteiro para colecionar bons momentos.</p>
        <h2>Guarde a data. O resto acontece por aqui.</h2>
        <a
          aria-label="Falar com a Area de Lazer Guaruja pelo WhatsApp"
          href={whatsappUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <MessageCircle aria-hidden="true" size={18} />
          Falar no WhatsApp
        </a>
      </section>

      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerContent}>
          <div className={styles.footerAbout}>
            <a className={styles.footerBrand} href="#inicio">
              <Image alt="" height={56} src={logo} width={56} />
              <span>Área de Lazer Guarujá</span>
            </a>
            <p>Um espaço para reunir, descansar e celebrar.</p>
          </div>

          <nav aria-labelledby="footer-navigation" className={styles.footerGroup}>
            <h2 id="footer-navigation">Explore</h2>
            <a href="#espaco">O espaço</a>
            <a href="#estrutura">Estrutura</a>
            <a href="#galeria">Galeria</a>
          </nav>

          <div className={styles.footerGroup}>
            <h2>Reservas</h2>
            <a href={whatsappUrl} rel="noopener noreferrer" target="_blank">
              <MessageCircle aria-hidden="true" size={17} />
              Falar no WhatsApp
            </a>
            <a href="#inicio">
              <ArrowUp aria-hidden="true" size={17} />
              Voltar ao início
            </a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Área de Lazer Guarujá</p>
          <p>
            Site desenvolvido pela{" "}
            <a
              className={styles.footerCredit}
              href="https://primesolves.vercel.app/"
              rel="noopener noreferrer"
              target="_blank"
            >
              PrimeSolves
              <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
