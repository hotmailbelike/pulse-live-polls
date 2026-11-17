const STEPS = [
  { title: 'Ask', body: 'Write a question with up to six answers and pick how long voting stays open.' },
  { title: 'Share', body: 'Put the presenter view on screen. People scan the QR code, no sign-up or app.' },
  { title: 'Watch', body: 'Bars move as votes land, synced in real time through Cloud Firestore.' },
];

export function HowItWorks() {
  return (
    <section className="how-it-works" aria-labelledby="how-heading">
      <h2 id="how-heading" className="section-heading">
        How it works
      </h2>
      <ol className="steps">
        {STEPS.map((step, index) => (
          <li key={step.title} className="card step">
            <span className="step__number" aria-hidden="true">
              {index + 1}
            </span>
            <h3 className="step__title">{step.title}</h3>
            <p className="step__body">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
