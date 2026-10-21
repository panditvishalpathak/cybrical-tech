import { Link } from "react-router-dom";
import "./Works.css";

function Works() {
  const projects = [
    {
      number: "01",
      category: "AI • WEB • AUTOMATION",
      title: "AI Business Assistant",
      description:
        "An intelligent digital assistant designed to help businesses automate workflows, manage information and improve everyday productivity.",
      tech: ["React", "Node.js", "AI", "MongoDB"],
      type: "ai",
    },
    {
      number: "02",
      category: "WEB DEVELOPMENT",
      title: "Modern Business Platform",
      description:
        "A high-performance business website with a modern interface, scalable architecture and conversion-focused user experience.",
      tech: ["React", "Vite", "Node.js", "API"],
      type: "web",
    },
    {
      number: "03",
      category: "SEO • DIGITAL GROWTH",
      title: "Organic Growth System",
      description:
        "A complete search growth strategy combining technical SEO, content planning, keyword research and performance tracking.",
      tech: ["SEO", "Analytics", "Content", "Strategy"],
      type: "seo",
    },
    {
      number: "04",
      category: "UI/UX • BRANDING",
      title: "Digital Brand Experience",
      description:
        "A distinctive visual identity and digital experience created to make a growing brand more recognizable and memorable.",
      tech: ["UI/UX", "Branding", "Design", "Research"],
      type: "design",
    },
    {
      number: "05",
      category: "E-COMMERCE • WEB",
      title: "E-Commerce Experience",
      description:
        "A modern shopping experience focused on product discovery, smooth navigation and a simple conversion journey.",
      tech: ["React", "Commerce", "API", "UX"],
      type: "commerce",
    },
    {
      number: "06",
      category: "AI • RAG • GENAI",
      title: "Knowledge AI System",
      description:
        "A knowledge-based AI solution that connects intelligent language models with private business information.",
      tech: ["Python", "RAG", "LLM", "Vector DB"],
      type: "rag",
    },
  ];

  return (
    <main className="works-page">

      {/* HERO */}
      <section className="works-hero">
        <div className="works-hero-bg">
          <div className="works-orb works-orb-one"></div>
          <div className="works-orb works-orb-two"></div>
          <div className="works-orb works-orb-three"></div>
          <div className="works-grid"></div>
        </div>

        <div className="works-container works-hero-content">
          <div className="works-hero-copy">
            <div className="works-badge">
              <span></span>
              SELECTED WORK
            </div>

            <h1>
              Ideas
              <br />
              built into
              <br />
              <span>experiences.</span>
            </h1>

            <p>
              A selection of digital experiences, products,
              growth systems and intelligent solutions we
              create for ambitious businesses.
            </p>

            <div className="works-hero-stats">
              <div>
                <strong>50+</strong>
                <span>Projects</span>
              </div>

              <div>
                <strong>20+</strong>
                <span>Clients</span>
              </div>

              <div>
                <strong>6+</strong>
                <span>Capabilities</span>
              </div>
            </div>
          </div>

          <div className="works-hero-visual">
            <div className="works-ring ring-a"></div>
            <div className="works-ring ring-b"></div>
            <div className="works-ring ring-c"></div>

            <div className="works-core">
              <div className="works-core-inner">
                <span>C</span>
                <small>CYBRICAL</small>
                <strong>WORKS</strong>
              </div>
            </div>

            <div className="works-floating works-float-one">
              <span>01</span>
              <div>
                <small>BUILD</small>
                <strong>CREATE</strong>
              </div>
            </div>

            <div className="works-floating works-float-two">
              <span>✦</span>
              <div>
                <small>SMART</small>
                <strong>DIGITAL</strong>
              </div>
            </div>

            <i className="works-dot works-dot-one"></i>
            <i className="works-dot works-dot-two"></i>
            <i className="works-dot works-dot-three"></i>
          </div>
        </div>

        <div className="works-scroll">
          <span>SCROLL TO EXPLORE</span>
          <b>↓</b>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="works-projects">
        <div className="works-container">

          <div className="works-section-label">
            <span>01</span>
            SELECTED PROJECTS
          </div>

          <div className="works-intro">
            <h2>
              Digital work
              <br />
              with a
              <span> purpose.</span>
            </h2>

            <p>
              Every project starts with a business problem.
              We combine strategy, design and technology to
              create solutions that are useful, scalable and
              built for real-world impact.
            </p>
          </div>

          <div className="works-project-grid">

            {projects.map((project) => (
              <article
                className={`works-project-card project-${project.type}`}
                key={project.number}
              >

                <div className="project-visual">

                  <div className="project-grid"></div>

                  <div className="project-glow"></div>

                  {project.type === "ai" && (
                    <div className="visual-ai">
                      <span>AI</span>
                      <div></div>
                    </div>
                  )}

                  {project.type === "web" && (
                    <div className="visual-browser">
                      <div className="browser-top">
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>

                      <div className="browser-content">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}

                  {project.type === "seo" && (
                    <div className="visual-chart">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}

                  {project.type === "design" && (
                    <div className="visual-design">
                      <div></div>
                      <div></div>
                      <span>UX</span>
                    </div>
                  )}

                  {project.type === "commerce" && (
                    <div className="visual-commerce">
                      <div className="commerce-bag">
                        <span>+</span>
                      </div>
                      <small>SHOP</small>
                    </div>
                  )}

                  {project.type === "rag" && (
                    <div className="visual-rag">
                      <div className="rag-node node-1">R</div>
                      <div className="rag-node node-2">A</div>
                      <div className="rag-node node-3">G</div>

                      <i></i>
                      <i></i>
                    </div>
                  )}

                  <span className="project-number">
                    {project.number}
                  </span>
                </div>

                <div className="project-info">

                  <div className="project-category">
                    {project.category}
                  </div>

                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <div className="project-tech">
                    {project.tech.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <button className="project-view">
                    View project
                    <span>↗</span>
                  </button>

                </div>

              </article>
            ))}

          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="works-approach">
        <div className="works-container">

          <div className="works-section-label">
            <span>02</span>
            OUR APPROACH
          </div>

          <div className="approach-heading">
            <h2>
              We don't just
              <br />
              make things
              <span> look good.</span>
            </h2>

            <p>
              We think about the business, the people using
              the product and the technology behind it.
            </p>
          </div>

          <div className="approach-grid">

            <div className="approach-item">
              <span>01</span>

              <div>
                <h3>Understand</h3>

                <p>
                  We start by understanding your business,
                  audience, goals and challenges.
                </p>
              </div>
            </div>

            <div className="approach-item">
              <span>02</span>

              <div>
                <h3>Design</h3>

                <p>
                  We transform ideas into clear,
                  engaging and intuitive experiences.
                </p>
              </div>
            </div>

            <div className="approach-item">
              <span>03</span>

              <div>
                <h3>Build</h3>

                <p>
                  We use modern technologies to build
                  scalable and reliable digital products.
                </p>
              </div>
            </div>

            <div className="approach-item">
              <span>04</span>

              <div>
                <h3>Improve</h3>

                <p>
                  We measure, learn and continuously
                  improve the experience after launch.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="works-tech">
        <div className="works-container">

          <div className="works-section-label">
            <span>03</span>
            TECHNOLOGY
          </div>

          <div className="tech-content">

            <div>
              <h2>
                Built with
                <br />
                <span>modern technology.</span>
              </h2>

              <p>
                From modern frontend frameworks to AI and
                cloud technologies, we choose tools based
                on what the product actually needs.
              </p>
            </div>

            <div className="tech-cloud">
              <span>React</span>
              <span>Node.js</span>
              <span>Python</span>
              <span>MongoDB</span>
              <span>AI</span>
              <span>GenAI</span>
              <span>RAG</span>
              <span>SEO</span>
              <span>Figma</span>
              <span>APIs</span>
              <span>Automation</span>
              <span>Analytics</span>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="works-final">
        <div className="works-final-orb final-one"></div>
        <div className="works-final-orb final-two"></div>

        <div className="works-container works-final-content">

          <span>HAVE A PROJECT?</span>

          <h2>
            Let's build
            <br />
            <strong>your next idea.</strong>
          </h2>

          <p>
            Tell us what you're thinking. We'll help
            turn it into something real.
          </p>

          <Link
            to="/contact"
            className="works-final-button"
          >
            Start a project
            <span>↗</span>
          </Link>

        </div>
      </section>

    </main>
  );
}



export default Works;