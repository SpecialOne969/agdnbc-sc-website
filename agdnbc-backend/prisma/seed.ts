import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ── Courses from Excel: "AGDN Courses & Codes.xlsx" ──────────────────────────

const year1Courses = [
  { code: 'SPF101', name: 'Spiritual Formation', semester: '1st' },
  { code: 'ESM102', name: 'Essentials of Supportive Ministry', semester: '1st' },
  { code: 'HMT103', name: 'Hermeneutics', semester: '1st' },
  { code: 'PPS104', name: 'Prayer Principles', semester: '1st' },
  { code: 'ECC105', name: 'Ecclesiology', semester: '1st' },
  { code: 'MSG106', name: 'Missiology', semester: '1st' },
  { code: 'BLG107', name: 'Bible Language (Greek)', semester: '2nd' },
  { code: 'PTM108', name: 'Practical Theology of Ministry', semester: '2nd' },
  { code: 'BLH109', name: 'Bible Language (Hebrew)', semester: '2nd' },
  { code: 'MNE110', name: 'Ministerial Ethics/Etiquettes', semester: '2nd' },
  { code: 'BBF111', name: 'Biblical Faith', semester: '2nd' },
  { code: 'CAL112', name: 'Church Admin/Leadership', semester: '2nd' },
  { code: 'FMM113', name: 'Family, Marriage, and Ministry', semester: '2nd' },
  { code: 'FOG114', name: 'Fundamentals of GEWC', semester: '2nd' },
  { code: 'KDH115', name: 'Kingdom Honour', semester: '2nd' },
]

const year2Courses = [
  { code: 'PNM201', name: 'Pneumatology', semester: '1st' },
  { code: 'RMG202', name: 'Research Methodology', semester: '1st' },
  { code: 'WRS203', name: 'World Religions', semester: '1st' },
  { code: 'STG204', name: 'Systematic Theology', semester: '1st' },
  { code: 'APG205', name: 'Apologetics', semester: '1st' },
  { code: 'CHT206', name: 'Church History', semester: '1st' },
  { code: 'HML207', name: 'Homiletics', semester: '1st' },
  { code: 'OTL208', name: 'Old Testament Literature', semester: '1st' },
  { code: 'NTL209', name: 'New Testament Literature', semester: '2nd' },
  { code: 'APE210', name: 'Apocalypse/Eschatology', semester: '2nd' },
  { code: 'ECP211', name: 'Essentials of Christian Perfection', semester: '2nd' },
  { code: 'CHC212', name: 'Christian Counselling', semester: '2nd' },
  { code: 'IRM213', name: 'Itinerant Ministry', semester: '2nd' },
  { code: 'TYM214', name: 'Teens/Youth Ministry', semester: '2nd' },
  { code: 'WSM215', name: 'Worship Ministry', semester: '2nd' },
  { code: 'PJM216', name: 'Project Management', semester: '2nd' },
  { code: 'PNP217', name: 'Pioneering Principles', semester: '2nd' },
  { code: 'EFM218', name: 'Excellence in Facilities and Management', semester: '2nd' },
]

// ── Students from Excel: "Copy of AGDN_BC Students ID Info.xlsx" ──────────────
// All are Year 2 (200 level), enrolled 2024. Full ID: AGDNBCSC/2024/<idSuffix>

const studentData = [
  { name: 'Hope Maxwell Kalio', campus: 'Port Harcourt', idSuffix: '031PH' },
  { name: 'John Iwokiri', campus: 'Port Harcourt', idSuffix: '032PH' },
  { name: 'Richard Hart', campus: 'Port Harcourt', idSuffix: '033PH' },
  { name: 'Sarah Abayomi', campus: 'Port Harcourt', idSuffix: '034PH' },
  { name: 'Lawrence Hart', campus: 'Port Harcourt', idSuffix: '035PH' },
  { name: 'Honour Kanam', campus: 'Port Harcourt', idSuffix: '036PH' },
  { name: 'Baridakara N. C. Kpani', campus: 'Port Harcourt', idSuffix: '037PH' },
  { name: 'Steve Oparaodu', campus: 'Port Harcourt', idSuffix: '038PH' },
  { name: 'Duudee S. Lucky', campus: 'Port Harcourt', idSuffix: '039PH' },
  { name: 'Azubuike Success Chinyere', campus: 'Port Harcourt', idSuffix: '040PH' },
  { name: 'Marian Ohuoba', campus: 'Port Harcourt', idSuffix: '041PH' },
  { name: 'Otonye Africanus Ikpaki', campus: 'Port Harcourt', idSuffix: '042PH' },
  { name: 'Beatrice Nnenna Ewa', campus: 'Port Harcourt', idSuffix: '043PH' },
  { name: 'Moses Ijeh', campus: 'Port Harcourt', idSuffix: '046PH' },
  { name: 'Imeh E. Akpan', campus: 'Port Harcourt', idSuffix: '048PH' },
  { name: 'Favour Enyeribe', campus: 'Port Harcourt', idSuffix: '049PH' },
  { name: 'Imiedubamo John Otini', campus: 'Bayelsa', idSuffix: '050BY' },
  { name: 'Dieozubida N. Igwele', campus: 'Bayelsa', idSuffix: '051BY' },
  { name: 'Ikpitibo Ebi Mathew', campus: 'Bayelsa', idSuffix: '052BY' },
  { name: 'Otobo Dina Walton', campus: 'Bayelsa', idSuffix: '053BY' },
  { name: 'Isaac Green', campus: 'Bayelsa', idSuffix: '054BY' },
  { name: 'Otiti Akiebo', campus: 'Bayelsa', idSuffix: '056BY' },
  { name: 'Ebizimo Pioyeinperekumo', campus: 'Bayelsa', idSuffix: '057BY' },
  { name: 'Christian Njoku', campus: 'Bayelsa', idSuffix: '058BY' },
  { name: 'Ebitimi Torugbene', campus: 'Bayelsa', idSuffix: '059BY' },
  { name: 'Barafiai Ziwaribotua', campus: 'Bayelsa', idSuffix: '060BY' },
  { name: 'Abbey Dike', campus: 'Bayelsa', idSuffix: '061BY' },
  { name: 'Ibim Alabraba', campus: 'Bayelsa', idSuffix: '062BY' },
  { name: 'Gilbert Daziba Evans', campus: 'Bayelsa', idSuffix: '064BY' },
  { name: 'Sarah Daniel', campus: 'Bayelsa', idSuffix: '065BY' },
  { name: 'Ebiwari Igodo', campus: 'Bayelsa', idSuffix: '069BY' },
  { name: 'Dankaba Monovie', campus: 'Bayelsa', idSuffix: '070BY' },
  { name: 'Kings Livinus Godswil', campus: 'Bayelsa', idSuffix: '071BY' },
  { name: 'Izibeniwulun Taribo', campus: 'Bayelsa', idSuffix: '073BY' },
  { name: 'Ogboin MacDonald Meekness', campus: 'Bayelsa', idSuffix: '074BY' },
  { name: 'Okeke Boniface', campus: 'Bayelsa', idSuffix: '075BY' },
  { name: 'Grace Green', campus: 'Bayelsa', idSuffix: '076BY' },
  { name: 'Victor James', campus: 'Bayelsa', idSuffix: '077BY' },
  { name: 'Letura Fred Nkookoo', campus: 'Port Harcourt', idSuffix: '078PH' },
  { name: 'Orinaba Mammy Johnwill Otobo', campus: 'Port Harcourt', idSuffix: '079PH' },
  { name: 'Nwanwa Joy Omolayo', campus: 'Port Harcourt', idSuffix: '080PH' },
  { name: 'Prince B. Baloga', campus: 'Port Harcourt', idSuffix: '081PH' },
  { name: 'Daniel Daniel Timothy', campus: 'Port Harcourt', idSuffix: '082PH' },
  { name: 'Peace Akioma Odeodi', campus: 'Port Harcourt', idSuffix: '083PH' },
  { name: 'Fiito Lekia', campus: 'Port Harcourt', idSuffix: '084PH' },
  { name: 'Chioma E. Dickey', campus: 'Port Harcourt', idSuffix: '086PH' },
  { name: 'Mercy Furo-Awokumaka', campus: 'Port Harcourt', idSuffix: '087PH' },
  { name: 'Ijeoma Achese-Amadi', campus: 'Port Harcourt', idSuffix: '088PH' },
  { name: 'Achese Amadi', campus: 'Port Harcourt', idSuffix: '089PH' },
  { name: 'Cheta Friday', campus: 'Port Harcourt', idSuffix: '090PH' },
  { name: 'Maeke Obed Barilumene', campus: 'Port Harcourt', idSuffix: '091PH' },
  { name: 'Felix Igisi Koromo', campus: 'Port Harcourt', idSuffix: '092PH' },
  { name: 'Tamunobubelebara Otonye', campus: 'Port Harcourt', idSuffix: '093PH' },
  { name: 'Kabia Blessing Gbirigbe', campus: 'Port Harcourt', idSuffix: '094PH' },
  { name: 'Patricia Reuben', campus: 'Port Harcourt', idSuffix: '095PH' },
  { name: 'Joseph Zorasi', campus: 'Port Harcourt', idSuffix: '096PH' },
  { name: 'Matthew Loveday', campus: 'Port Harcourt', idSuffix: '098PH' },
  { name: 'Joseph Gift Sokari', campus: 'Port Harcourt', idSuffix: '099PH' },
  { name: 'Beatrice Otti', campus: 'Bayelsa', idSuffix: '100BY' },
  { name: 'Amanda Boma Oruye', campus: 'Bayelsa', idSuffix: '101BY' },
  { name: 'Ozue Oghenemaro Fidelis', campus: 'Bayelsa', idSuffix: '102BY' },
  { name: 'Beauty John Africa', campus: 'Port Harcourt', idSuffix: '103PH' },
  { name: 'Dickey Gloria Ngozi', campus: 'Port Harcourt', idSuffix: '104PH' },
  { name: 'Lucky Wariboko', campus: 'Bayelsa', idSuffix: '106BY' },
  { name: 'Etu-Okpara Chikaodiri', campus: 'Bayelsa', idSuffix: '107BY' },
  { name: 'Greatman Badom', campus: 'Port Harcourt', idSuffix: '108PH' },
]

async function main() {
  console.log('Seeding database...')

  // ── Programmes ────────────────────────────────────────────────────────────
  const prog1 = await prisma.programme.upsert({
    where: { name: 'Year 1 – Biblical Studies' },
    update: {},
    create: { name: 'Year 1 – Biblical Studies', duration: '1 year', level: 'Year 1' },
  })

  const prog2 = await prisma.programme.upsert({
    where: { name: 'Year 2 – Biblical Studies' },
    update: {},
    create: { name: 'Year 2 – Biblical Studies', duration: '1 year', level: 'Year 2' },
  })

  // ── Courses ───────────────────────────────────────────────────────────────
  console.log('Creating Year 1 courses...')
  for (const c of year1Courses) {
    await prisma.course.upsert({
      where: { code: c.code },
      update: { name: c.name },
      create: { code: c.code, name: c.name, programmeId: prog1.id, semester: c.semester, credits: 3 },
    })
  }

  console.log('Creating Year 2 courses...')
  for (const c of year2Courses) {
    await prisma.course.upsert({
      where: { code: c.code },
      update: { name: c.name },
      create: { code: c.code, name: c.name, programmeId: prog2.id, semester: c.semester, credits: 3 },
    })
  }

  // ── Admin account ─────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin@2024!', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@agdnbc-sc.edu.ng' },
    update: {},
    create: {
      name: 'AGDNBC Admin',
      email: 'admin@agdnbc-sc.edu.ng',
      passwordHash: adminHash,
      role: 'super_admin',
    },
  })

  // ── Students (Year 2 — enrolled 2024) ────────────────────────────────────
  console.log(`Creating ${studentData.length} student accounts...`)
  const defaultHash = await bcrypt.hash('agdnbc1', 10)
  const year2CourseRecords = await prisma.course.findMany({
    where: { code: { in: year2Courses.map(c => c.code) } },
  })

  for (const s of studentData) {
    const schoolId = `AGDNBCSC/2024/${s.idSuffix}`
    const student = await prisma.student.upsert({
      where: { schoolId },
      update: { name: s.name },
      create: {
        schoolId,
        name: s.name,
        passwordHash: defaultHash,
        programme: 'Biblical Studies',
        level: 'Year 2',
        admissionYear: '2024',
        session: '2024/2025',
        status: 'active',
        // Grant portal access until end of 2026/2027 session
        portalAccessExpiry: new Date('2027-07-31'),
        firstLogin: true,
      },
    })

    // Enrol in all Year 2 courses
    for (const course of year2CourseRecords) {
      await prisma.studentCourse.upsert({
        where: {
          studentId_courseId_semester_year: {
            studentId: student.id,
            courseId: course.id,
            semester: course.semester,
            year: '2025',
          },
        },
        update: {},
        create: {
          studentId: student.id,
          courseId: course.id,
          semester: course.semester,
          year: '2025',
        },
      })
    }
  }

  console.log(`✓ Seeded ${year1Courses.length} Year 1 courses`)
  console.log(`✓ Seeded ${year2Courses.length} Year 2 courses`)
  console.log(`✓ Seeded ${studentData.length} student accounts`)
  console.log('✓ Admin account: admin@agdnbc-sc.edu.ng / Admin@2024!')
  console.log('✓ Default student password: agdnbc1')
  console.log('Done.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
