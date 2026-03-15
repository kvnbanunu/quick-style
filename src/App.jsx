const projects = [
  {
    title: "Project One",
    description:
      "Write one sentence about a small project you built or are learning from.",
    stack: "React, CSS",
  },
  {
    title: "Project Two",
    description:
      "Use this space to explain the problem, what you made, or one result you are proud of.",
    stack: "JavaScript, API",
  },
];

const skills = ["HTML", "CSS", "JavaScript", "React"];

function App() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-24">
      <section className="text-center space-y-4 pt-20">
        <p className="uppercase tracking-widest text-xs font-bold text-accent">
          Super amazing real developer
        </p>
        <h1 className="text-5xl font-bold text-heading tracking-tight">
          Bhavnoor Saroya
        </h1>
        <p className="max-w-xl mx-auto text-brand-text text-lg">
          I&apos;m a developer learning how to build clean, useful projects with
          modern build and deployment tooling.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-heading text-white rounded hover:opacity-90 transition-opacity"
          >
            My Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-brand-border bg-surface rounded hover:bg-surface-strong transition-colors"
          >
            Contact Me
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <article
          className="p-8 bg-surface rounded-xl border bg-red-500"
          id="about"
        >
          <p className="text-xs uppercase font-bold text-muted mb-2">
            About Me
          </p>
          <h2 className="text-2xl font-bold text-heading mb-4">Who Am I</h2>
          <p className="text-brand-text">
            I started CST right after prison. (Testing content persistence!)
          </p>
        </article>

        <article className="p-8 bg-surface rounded-xl border border-brand-border bg-green-500">
          <p className="text-xs uppercase font-bold text-muted mb-2">Skills</p>
          <h2 className="text-2xl font-bold text-heading mb-4">Tools I use</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm bg-surface-strong border border-brand-border rounded text-brand-text shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="space-y-8" id="projects">
        <div className="border-l-4 border-accent pl-4">
          <p className="text-xs uppercase font-bold text-muted">Projects</p>
          <h2 className="text-3xl font-bold text-heading">
            A couple of example builds
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <article
              key={project.title}
              className="p-6 bg-surface-strong rounded-xl border border-brand-border group hover:border-accent transition-colors bg-purple-600"
            >
              <p className="text-xs font-mono text-accent mb-2">
                {project.stack}
              </p>
              <h3 className="text-xl font-bold text-heading">
                {project.title}
              </h3>
              <p className="text-muted mt-2">{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="p-10 bg-heading rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-8"
        id="contact"
      >
        <div className="text-center md:text-left">
          <p className="text-xs uppercase font-bold text-accent mb-2">
            Contact
          </p>
          <h2 className="text-3xl font-bold mb-2">How to reach me</h2>
          <p className="opacity-70">Let's build something together.</p>
        </div>
        <div className="space-y-4 w-full md:w-auto">
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <p className="text-xs uppercase opacity-50 font-bold">Email</p>
            <a
              href="mailto:reece@email.com"
              className="text-accent hover:underline"
            >
              developer@email.com
            </a>
          </div>
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <p className="text-xs uppercase opacity-50 font-bold">GitHub</p>
            <a href="https://github.com/reece" className="hover:underline">
              github.com/developer
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;

