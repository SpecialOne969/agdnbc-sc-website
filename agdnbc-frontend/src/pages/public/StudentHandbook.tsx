import { Link } from 'react-router-dom'
import { ArrowRight, AlertCircle } from 'lucide-react'

// Content transcribed from the AGDNBC Satellite Campus Student Handbook.
type Section = {
  n: string
  title: string
  intro?: string
  bullets?: string[]
  cards?: [string, string][]
  note?: { label: string; text: string }
}

const sections: Section[] = [
  {
    n: '1',
    title: 'Core Values',
    intro: 'The following values represent the heartbeat of the Bible College:',
    cards: [
      ['The Fear of God', 'Every student must prioritise reverence for God and obedience to His Word. The commandments of God as given in Scripture are to be upheld at all times.'],
      ['Respect for Constituted Authority', 'Respect for the leadership of the Bible College is mandatory. Disobedience, insolence, or disregard for authority will not be tolerated.'],
      ['Mutual Respect Among Students', 'Students are to interact with one another in love, humility, and brotherhood. Foul or abusive language is strictly prohibited. Quarrelling, fighting, or bullying of any form will attract disciplinary measures.'],
    ],
  },
  {
    n: '2',
    title: 'Student Conduct',
    intro: 'Students are expected to live with integrity and conduct themselves with dignity both within and outside the school premises.',
    bullets: [
      'Uphold honesty in academics, finances, and relationships.',
      'Avoid behaviours that contradict the biblical values and mission of the College.',
    ],
    note: { label: 'Penalty for misconduct', text: 'Suspension and possible expulsion from the College.' },
  },
  {
    n: '3',
    title: 'Dress Code',
    intro: 'Indecent dressing is prohibited. Students must not wear clothes that expose their private parts — breasts, chest, armpits, stomach, and laps.',
    bullets: [
      'On class days: dress in formal corporate wear or decent African native wear.',
      'Strictly prohibited on campus: palm or bathroom slippers, Crocs, and flip-flops.',
    ],
    note: { label: 'Note', text: 'Failure to adhere to the dress code will attract disciplinary action.' },
  },
  {
    n: '4',
    title: 'Tuition & Payment Requirements',
    bullets: [
      'Students must pay at least 50% of tuition fees before being admitted into classes.',
      'The remaining 50% balance must be paid within the first 3 months of lectures.',
      'Failure to pay on time attracts a 15% late-payment fine.',
    ],
  },
  {
    n: '5',
    title: 'Attendance & Examinations',
    cards: [
      ['Class Attendance', 'Students must attend all classes and complete assignments, classwork, and projects. To qualify for examinations, a student must not miss more than 4 hours of any particular course. Exceeding this limit results in a carryover of the course.'],
      ['Examinations', 'Students are expected to sit for all examinations as scheduled. Missing examinations without valid approval will result in a carryover.'],
    ],
  },
  {
    n: '6',
    title: 'Academic Structure',
    intro: 'Diploma in Theology — Duration: 2 years.',
    cards: [
      ['Level 1', 'Year One'],
      ['Level 2', 'Year Two'],
    ],
    note: {
      label: 'Failure Policy',
      text: 'If a student fails any course or misses an exam in Level 2, they must undertake an extra year of study. The tuition fee for the extra year is 30% of the current tuition fee applicable at the time of enrollment for the extra year.',
    },
  },
  {
    n: '7',
    title: 'Typical Class Weekend',
    intro: 'A typical class weekend runs from Friday to Saturday of the designated dates.',
    bullets: [
      'Fridays: 4:00 PM – 6:50 PM.',
      'Saturdays: 8:00 AM – 6:50 PM.',
      'Intermittent 10-minute breaks per hour, plus a one-hour lunch break (12 noon – 1 PM) on Saturdays.',
      'Eating or drinking during lectures is prohibited — only water is allowed in class.',
      'Attendance is taken at the start and end of each class. Students may not leave while lectures are ongoing or before the end of class for the day.',
    ],
    note: {
      label: 'Prayer School',
      text: 'Prayer School holds every Saturday of a class weekend at 8:00 AM and is mandatory for all students. Missing it without prior approval forfeits the first one hour of lectures.',
    },
  },
  {
    n: '8',
    title: 'Disciplinary Measures',
    intro: 'The Bible College takes discipline seriously as a tool for shaping character. Students found violating rules, values, or policies will face disciplinary actions, which may include:',
    bullets: [
      'Warning.',
      'Suspension.',
      'Expulsion (in cases of repeated or severe misconduct).',
    ],
  },
]

export default function StudentHandbook() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1b2473] to-[#16213e] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-[#c49a1a]">Equipping Soldiers for Christ</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Student Handbook</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Welcome to Apostle Geoffrey Dabibi Numbere Bible College — Satellite Campus. This
            institution was established to raise, equip, and release men and women of God into
            effective ministry and service in the Body of Christ. Every student is expected to
            familiarise themselves with and abide by the policies herein.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {sections.map((s) => (
            <div key={s.n} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 shrink-0 bg-[#1b2473] rounded-xl flex items-center justify-center text-white font-extrabold">
                  {s.n}
                </div>
                <h2 className="text-xl font-bold text-[#1b2473]">{s.title}</h2>
              </div>

              {s.intro && <p className="text-gray-600 leading-relaxed mb-4">{s.intro}</p>}

              {s.bullets && (
                <ul className="space-y-2 mb-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-[#c49a1a]" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {s.cards && (
                <div className="grid sm:grid-cols-2 gap-4 mt-2">
                  {s.cards.map(([label, desc]) => (
                    <div key={label} className="bg-[#f7f9fc] rounded-xl p-4 border-l-4 border-[#c49a1a]">
                      <div className="font-semibold text-[#1b2473] text-sm">{label}</div>
                      <div className="text-xs text-gray-500 leading-relaxed mt-1">{desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {s.note && (
                <div className="mt-4 flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>{s.note.label}:</strong> {s.note.text}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Conclusion */}
          <div className="bg-[#1b2473] text-white rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-3">Conclusion</h2>
            <p className="text-blue-200 leading-relaxed">
              Every student of Apostle Geoffrey Dabibi Numbere Bible College — Satellite Campus is
              called to be an example of godliness, humility, and discipline. Adhering to the rules
              and guidelines in this handbook will not only ensure your academic success but also
              shape you for effective ministry in the Body of Christ.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center px-4">
        <h2 className="section-title">Ready to Begin?</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          Review the requirements above, then take the next step toward your training at AGDNBC.
        </p>
        <Link to="/admissions" className="btn-accent">
          Apply for Admission <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
