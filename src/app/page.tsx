import Image from "next/image";
import { WorkTimeline } from "./workTimeline";

export default function Home() {
  return (
    <div>
      <header>
            <div id="heading-blurb">
                <h1>Hi, I'm Adam</h1>
                <h2>Senior Software Engineer @ Fanatics</h2>
                <span id="social-media-icons-row">
                    <a href="https://github.com/abeziou">
                        GithHub
                    </a>
                    |
                    <a href="https://www.linkedin.com/in/adam-beziou-312717147">
                        LinkedIn
                    </a>
                    |
                    <a href="mailto:adam.beziou@gmail.com">
                        Email
                    </a>
                    |
                    <a href="/resume.pdf" type="application/pdf" target="_blank">
                        Resume
                    </a>
                </span>
            </div>
            <img src="/portrait.jpg" id="portrait" />
        </header>
        <main className="aboutme-sections">
            <section>
                <h3>Work Experience</h3>
                <WorkTimeline />
            </section>
            <section>
                <h3>Projects</h3>
                <div className="coming-soon">Coming soon!</div>
            </section>
        </main>
    </div>
  );
}
