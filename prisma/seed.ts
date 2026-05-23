import { PrismaClient, CollegeType, DegreeType, ExamType, Category } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const colleges = [
  {
    name: 'Indian Institute of Technology Bombay',
    slug: 'iit-bombay',
    description: 'IIT Bombay is one of the premier engineering institutions in India, known for its world-class research and industry collaborations.',
    type: CollegeType.IIT,
    city: 'Mumbai',
    state: 'Maharashtra',
    established: 1958,
    website: 'https://www.iitb.ac.in',
    accreditation: 'NAAC A++',
    minFees: 200000,
    maxFees: 250000,
    totalRating: 4.8,
    reviewCount: 1200,
    courses: [
      { name: 'Computer Science and Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 220000, seats: 120 },
      { name: 'Electrical Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 210000, seats: 90 },
      { name: 'Mechanical Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 200000, seats: 80 },
      { name: 'M.Tech Computer Science', degreeType: DegreeType.MTECH, duration: 2, fees: 50000, seats: 50 },
    ],
    placements: [
      { year: 2024, avgPackage: 22.5, medianPackage: 18, highestPackage: 3.67, placementRate: 95, topRecruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'McKinsey', 'Amazon'] },
      { year: 2023, avgPackage: 20.1, medianPackage: 16, highestPackage: 2.98, placementRate: 94, topRecruiters: ['Google', 'Microsoft', 'Facebook', 'Goldman Sachs'] },
    ],
    cutoffs: [
      { exam: ExamType.JEE_ADVANCED, category: Category.GENERAL, openingRank: 1, closingRank: 67, year: 2024, courseName: 'Computer Science and Engineering' },
      { exam: ExamType.JEE_ADVANCED, category: Category.GENERAL, openingRank: 68, closingRank: 180, year: 2024, courseName: 'Electrical Engineering' },
      { exam: ExamType.JEE_ADVANCED, category: Category.OBC, openingRank: 1, closingRank: 32, year: 2024, courseName: 'Computer Science and Engineering' },
    ],
  },
  {
    name: 'Indian Institute of Technology Delhi',
    slug: 'iit-delhi',
    description: 'IIT Delhi is a public technical and research university located in New Delhi. It is widely considered to be one of the best engineering institutes in India.',
    type: CollegeType.IIT,
    city: 'New Delhi',
    state: 'Delhi',
    established: 1961,
    website: 'https://home.iitd.ac.in',
    accreditation: 'NAAC A++',
    minFees: 195000,
    maxFees: 245000,
    totalRating: 4.7,
    reviewCount: 980,
    courses: [
      { name: 'Computer Science and Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 240000, seats: 80 },
      { name: 'Electrical Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 230000, seats: 70 },
      { name: 'Civil Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 195000, seats: 75 },
    ],
    placements: [
      { year: 2024, avgPackage: 21.8, medianPackage: 17.5, highestPackage: 3.1, placementRate: 94, topRecruiters: ['Google', 'Microsoft', 'Uber', 'BCG', 'Apple'] },
      { year: 2023, avgPackage: 19.5, medianPackage: 15.5, highestPackage: 2.7, placementRate: 92, topRecruiters: ['Google', 'Amazon', 'Flipkart', 'D.E. Shaw'] },
    ],
    cutoffs: [
      { exam: ExamType.JEE_ADVANCED, category: Category.GENERAL, openingRank: 42, closingRank: 118, year: 2024, courseName: 'Computer Science and Engineering' },
      { exam: ExamType.JEE_ADVANCED, category: Category.OBC, openingRank: 20, closingRank: 55, year: 2024, courseName: 'Computer Science and Engineering' },
    ],
  },
  {
    name: 'National Institute of Technology Trichy',
    slug: 'nit-trichy',
    description: 'NIT Trichy is one of the top National Institutes of Technology in India, known for strong industry connections and placements.',
    type: CollegeType.NIT,
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    established: 1964,
    website: 'https://www.nitt.edu',
    accreditation: 'NAAC A++',
    minFees: 150000,
    maxFees: 180000,
    totalRating: 4.5,
    reviewCount: 750,
    courses: [
      { name: 'Computer Science and Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 175000, seats: 120 },
      { name: 'Electronics and Communication Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 165000, seats: 120 },
      { name: 'Mechanical Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 155000, seats: 100 },
    ],
    placements: [
      { year: 2024, avgPackage: 14.2, medianPackage: 11, highestPackage: 1.2, placementRate: 90, topRecruiters: ['TCS', 'Infosys', 'Amazon', 'Zoho', 'Qualcomm'] },
      { year: 2023, avgPackage: 13.1, medianPackage: 10.5, highestPackage: 0.98, placementRate: 88, topRecruiters: ['TCS', 'Wipro', 'Amazon', 'Samsung'] },
    ],
    cutoffs: [
      { exam: ExamType.JEE_MAIN, category: Category.GENERAL, openingRank: 2100, closingRank: 4800, year: 2024, courseName: 'Computer Science and Engineering' },
      { exam: ExamType.JEE_MAIN, category: Category.OBC, openingRank: 900, closingRank: 2200, year: 2024, courseName: 'Computer Science and Engineering' },
      { exam: ExamType.JEE_MAIN, category: Category.SC, openingRank: 450, closingRank: 980, year: 2024, courseName: 'Computer Science and Engineering' },
    ],
  },
  {
    name: 'BITS Pilani',
    slug: 'bits-pilani',
    description: 'BITS Pilani is a deemed university and one of the most prestigious private engineering colleges in India, known for its practice school program and industry exposure.',
    type: CollegeType.DEEMED,
    city: 'Pilani',
    state: 'Rajasthan',
    established: 1964,
    website: 'https://www.bits-pilani.ac.in',
    accreditation: 'NAAC A',
    minFees: 500000,
    maxFees: 600000,
    totalRating: 4.6,
    reviewCount: 1100,
    courses: [
      { name: 'Computer Science', degreeType: DegreeType.BTECH, duration: 4, fees: 580000, seats: 150 },
      { name: 'Electronics and Instrumentation', degreeType: DegreeType.BTECH, duration: 4, fees: 560000, seats: 100 },
      { name: 'Mechanical Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 540000, seats: 80 },
    ],
    placements: [
      { year: 2024, avgPackage: 18.5, medianPackage: 15, highestPackage: 2.8, placementRate: 92, topRecruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'Uber', 'Samsung'] },
      { year: 2023, avgPackage: 16.8, medianPackage: 13.5, highestPackage: 2.4, placementRate: 90, topRecruiters: ['Google', 'Sprinklr', 'Microsoft', 'Tower Research'] },
    ],
    cutoffs: [
      { exam: ExamType.JEE_MAIN, category: Category.GENERAL, openingRank: 500, closingRank: 3500, year: 2024, courseName: 'Computer Science' },
    ],
  },
  {
    name: 'Indian Institute of Technology Madras',
    slug: 'iit-madras',
    description: 'IIT Madras has been ranked the top engineering institution in India by NIRF consistently. Known for research excellence and startup ecosystem.',
    type: CollegeType.IIT,
    city: 'Chennai',
    state: 'Tamil Nadu',
    established: 1959,
    website: 'https://www.iitm.ac.in',
    accreditation: 'NAAC A++',
    minFees: 195000,
    maxFees: 250000,
    totalRating: 4.9,
    reviewCount: 1500,
    courses: [
      { name: 'Computer Science and Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 240000, seats: 80 },
      { name: 'Aerospace Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 225000, seats: 50 },
      { name: 'Engineering Physics', degreeType: DegreeType.BTECH, duration: 4, fees: 200000, seats: 30 },
    ],
    placements: [
      { year: 2024, avgPackage: 23.1, medianPackage: 18.5, highestPackage: 4.25, placementRate: 96, topRecruiters: ['Google', 'Microsoft', 'NVIDIA', 'Qualcomm', 'Intel'] },
      { year: 2023, avgPackage: 20.8, medianPackage: 17, highestPackage: 3.8, placementRate: 95, topRecruiters: ['Google', 'Microsoft', 'Intel', 'NVIDIA'] },
    ],
    cutoffs: [
      { exam: ExamType.JEE_ADVANCED, category: Category.GENERAL, openingRank: 47, closingRank: 98, year: 2024, courseName: 'Computer Science and Engineering' },
      { exam: ExamType.JEE_ADVANCED, category: Category.OBC, openingRank: 22, closingRank: 48, year: 2024, courseName: 'Computer Science and Engineering' },
    ],
  },
  {
    name: 'Vellore Institute of Technology',
    slug: 'vit-vellore',
    description: 'VIT Vellore is one of the top private engineering universities in India, known for its international collaborations and industry-ready curriculum.',
    type: CollegeType.DEEMED,
    city: 'Vellore',
    state: 'Tamil Nadu',
    established: 1984,
    website: 'https://vit.ac.in',
    accreditation: 'NAAC A++',
    minFees: 380000,
    maxFees: 480000,
    totalRating: 4.2,
    reviewCount: 2200,
    courses: [
      { name: 'Computer Science and Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 460000, seats: 1200 },
      { name: 'Information Technology', degreeType: DegreeType.BTECH, duration: 4, fees: 440000, seats: 600 },
      { name: 'Electronics and Communication', degreeType: DegreeType.BTECH, duration: 4, fees: 420000, seats: 600 },
    ],
    placements: [
      { year: 2024, avgPackage: 8.5, medianPackage: 6.5, highestPackage: 0.8, placementRate: 85, topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'HCL'] },
      { year: 2023, avgPackage: 7.8, medianPackage: 6, highestPackage: 0.72, placementRate: 83, topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Capgemini'] },
    ],
    cutoffs: [],
  },
  {
    name: 'National Institute of Technology Karnataka',
    slug: 'nit-karnataka',
    description: 'NIT Karnataka (Surathkal) is one of the premier National Institutes of Technology, especially well-known for its Computer Science program.',
    type: CollegeType.NIT,
    city: 'Surathkal',
    state: 'Karnataka',
    established: 1960,
    website: 'https://www.nitk.ac.in',
    accreditation: 'NAAC A+',
    minFees: 145000,
    maxFees: 175000,
    totalRating: 4.4,
    reviewCount: 620,
    courses: [
      { name: 'Computer Science and Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 170000, seats: 130 },
      { name: 'Information Technology', degreeType: DegreeType.BTECH, duration: 4, fees: 160000, seats: 65 },
      { name: 'Chemical Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 148000, seats: 60 },
    ],
    placements: [
      { year: 2024, avgPackage: 13.8, medianPackage: 10.5, highestPackage: 1.1, placementRate: 88, topRecruiters: ['Amazon', 'Microsoft', 'Flipkart', 'Wipro', 'TCS'] },
    ],
    cutoffs: [
      { exam: ExamType.JEE_MAIN, category: Category.GENERAL, openingRank: 3500, closingRank: 7200, year: 2024, courseName: 'Computer Science and Engineering' },
      { exam: ExamType.JEE_MAIN, category: Category.OBC, openingRank: 1400, closingRank: 3100, year: 2024, courseName: 'Computer Science and Engineering' },
    ],
  },
  {
    name: 'Delhi Technological University',
    slug: 'dtu-delhi',
    description: 'DTU (formerly DCE) is one of the oldest and most prestigious government engineering universities in Delhi, offering a wide range of engineering programs.',
    type: CollegeType.GOVERNMENT,
    city: 'New Delhi',
    state: 'Delhi',
    established: 1941,
    website: 'https://dtu.ac.in',
    accreditation: 'NAAC A+',
    minFees: 130000,
    maxFees: 160000,
    totalRating: 4.1,
    reviewCount: 890,
    courses: [
      { name: 'Computer Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 155000, seats: 180 },
      { name: 'Software Engineering', degreeType: DegreeType.BTECH, duration: 4, fees: 150000, seats: 90 },
      { name: 'Electronics and Communication', degreeType: DegreeType.BTECH, duration: 4, fees: 145000, seats: 135 },
    ],
    placements: [
      { year: 2024, avgPackage: 11.5, medianPackage: 9, highestPackage: 0.95, placementRate: 82, topRecruiters: ['Amazon', 'Paytm', 'Zomato', 'Microsoft', 'Samsung'] },
    ],
    cutoffs: [
      { exam: ExamType.JEE_MAIN, category: Category.GENERAL, openingRank: 7500, closingRank: 15000, year: 2024, courseName: 'Computer Engineering' },
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.examCutoff.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  const hashedPassword = await bcrypt.hash('password123', 12);
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Rahul Sharma', email: 'rahul@example.com', passwordHash: hashedPassword } }),
    prisma.user.create({ data: { name: 'Priya Patel', email: 'priya@example.com', passwordHash: hashedPassword } }),
    prisma.user.create({ data: { name: 'Amit Kumar', email: 'amit@example.com', passwordHash: hashedPassword } }),
  ]);

  // Seed colleges
  for (const data of colleges) {
    const { courses, placements, cutoffs, ...collegeData } = data;

    const college = await prisma.college.create({ data: collegeData });

    // Seed courses
    const createdCourses = await Promise.all(
      courses.map((c) =>
        prisma.course.create({
          data: {
            collegeId: college.id,
            name: c.name,
            degreeType: c.degreeType,
            duration: c.duration,
            fees: c.fees,
            seats: c.seats,
          },
        }),
      ),
    );

    // Seed placements
    for (const p of placements) {
      await prisma.placement.create({
        data: {
          collegeId: college.id,
          year: p.year,
          avgPackage: p.avgPackage,
          medianPackage: p.medianPackage,
          highestPackage: p.highestPackage * 100, // store in LPA
          placementRate: p.placementRate,
          topRecruiters: p.topRecruiters,
        },
      });
    }

    // Seed cutoffs
    for (const cutoff of cutoffs) {
      const course = createdCourses.find((c) => c.name === cutoff.courseName);
      await prisma.examCutoff.create({
        data: {
          collegeId: college.id,
          courseId: course?.id,
          exam: cutoff.exam,
          category: cutoff.category,
          openingRank: cutoff.openingRank,
          closingRank: cutoff.closingRank,
          year: cutoff.year,
        },
      });
    }

    // Seed reviews
    const reviewTemplates = [
      { rating: 5, title: 'Excellent college with world-class infrastructure', content: 'The faculty here are exceptional and the research opportunities are unmatched. Placements are outstanding.', pros: 'Great faculty, excellent research, top placements', cons: 'Very competitive environment, high pressure' },
      { rating: 4, title: 'Great learning environment', content: 'Solid curriculum with good industry exposure. The alumni network is incredibly helpful for placements.', pros: 'Strong alumni network, good facilities', cons: 'Bureaucratic processes, limited electives' },
      { rating: 4, title: 'Worth every penny', content: 'The quality of education and the peers you get to interact with makes this institution truly special.', pros: 'Peer quality, research labs, startup culture', cons: 'Academic pressure, limited flexibility' },
    ];

    for (let i = 0; i < Math.min(reviewTemplates.length, users.length); i++) {
      await prisma.review.create({
        data: {
          collegeId: college.id,
          userId: users[i].id,
          rating: reviewTemplates[i].rating,
          title: reviewTemplates[i].title,
          content: reviewTemplates[i].content,
          pros: reviewTemplates[i].pros,
          cons: reviewTemplates[i].cons,
        },
      });
    }

    console.log(`✓ Seeded: ${college.name}`);
  }

  // Update full-text search vector using raw SQL
  await prisma.$executeRaw`
    ALTER TABLE "College" ADD COLUMN IF NOT EXISTS "searchVector" tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(city, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(state, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'C')
    ) STORED
  `;

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "College_searchVector_idx" ON "College" USING GIN ("searchVector")
  `;

  console.log('\n✓ Search vector index created');
  console.log(`\n✅ Seeding complete! ${colleges.length} colleges added.`);
  console.log('\nTest credentials:');
  console.log('  Email: rahul@example.com | Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
