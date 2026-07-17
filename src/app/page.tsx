import Image from "next/image";
import {
  ArrowDown,
  Clock3,
  Film,
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
          src="/media/leisure-hero.webp"
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
            Imagens ilustrativas nesta versão. As fotos reais do espaço serão
            adicionadas em seguida.
          </p>
        </div>

        <div className={styles.galleryGrid}>
          <figure className={styles.galleryMain}>
            <Image
              alt="Piscina e área de convivência em uma imagem ilustrativa"
              fill
              sizes="(max-width: 900px) 100vw, 66vw"
              src="/media/leisure-pool.webp"
            />
            <figcaption>
              <Images aria-hidden="true" size={18} />
              Piscina e área externa
            </figcaption>
          </figure>

          <figure className={styles.galleryTall}>
            <Image
              alt="Espaço com churrasqueira em uma imagem ilustrativa"
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
              src="/media/leisure-barbecue.webp"
            />
            <figcaption>
              <UtensilsCrossed aria-hidden="true" size={18} />
              Espaço para reunir
            </figcaption>
          </figure>

          <div className={styles.videoPlaceholder}>
            <div className={styles.videoMark}>
              <Film aria-hidden="true" size={26} />
            </div>
            <div>
              <p>Vídeo do espaço</p>
              <span>Em breve, um passeio completo por cada ambiente.</span>
            </div>
          </div>
        </div>
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

      <footer className={styles.footer}>
        <p>Área de Lazer Guarujá</p>
        <p>Um espaço para reunir, descansar e celebrar.</p>
      </footer>
    </main>
  );
}
