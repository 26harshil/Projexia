import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


const projectTypes = [
  { name: 'Capstone Project', description: 'Final year comprehensive major project.' },
  { name: 'Mini Project', description: 'Short-term exploratory projects for junior semesters.' },
  { name: 'Research Thesis', description: 'Deep theoretical research and documentation.' },
  { name: 'Industrial Internship', description: 'Research or development under a faculty member.' },
  { name: 'Software Development', description: 'Full-stack application development or system design.' },
  { name: 'Hardware Prototype', description: 'Physical builds involving IoT, Arduino, or Robotics.' },
  { name: 'Data Analytics Study', description: 'In-depth analysis of existing industry problems.' },
  { name: 'Machine Learning Model', description: 'Data training, neural networks, or predictive analytics.' },
  { name: 'Cybersecurity Audit', description: 'Security analysis and auditing.' },
  { name: 'Open Source Contribution', description: 'Contributing to or building public software repositories.' },
];

export async function GET() {
  try {
    const results = [];
    for (const pt of projectTypes) {
      const existing = await prisma.projecttype.findUnique({
        where: { projecttypename: pt.name }
      });

      if (existing) {
        const updated = await prisma.projecttype.update({
          where: { projecttypeid: existing.projecttypeid },
          data: { description: pt.description }
        });
        results.push(`Updated project type: ${pt.name}`);
      } else {
        await prisma.projecttype.create({
          data: {
            projecttypename: pt.name,
            description: pt.description
          }
        });
        results.push(`Created project type: ${pt.name}`);
      }
    }
    return NextResponse.json({ success: true, message: 'Project types seeded successfully', results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
