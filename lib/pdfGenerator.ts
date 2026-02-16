// /lib/pdfGenerator.ts
"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ================= PDF GENERATION FUNCTIONS =================

interface GroupData {
    id: number;
    name: string;
    title: string | null;
    area: string | null;
    description: string | null;
    projectType: string | null;
    convener?: { staffname: string; email: string | null } | null;
    expert?: { staffname: string; email: string | null } | null;
    members: {
        name: string | undefined;
        email: string | null | undefined;
        phone: string | null | undefined;
        isLeader: boolean | null;
        cgpa: number | null;
    }[];
}

interface MeetingData {
    id: number;
    datetime: Date;
    purpose: string | null;
    location: string | null;
    status: string | null;
    groupName: string | undefined;
    projectTitle: string | null | undefined;
    attendees: {
        name: string | undefined;
        present: boolean | null;
        remarks: string | null;
    }[];
}

interface ReportData {
    groupId: number;
    groupName: string;
    projectTitle: string | null;
    leaderName: string | null;
    memberCount: number;
    totalMeetings: number;
    completedMeetings: number;
    pendingMeetings: number;
}

// Helper to add header to PDF
function addPdfHeader(doc: jsPDF, title: string, subtitle?: string) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header background
    doc.setFillColor(6, 78, 59); // Deep Emerald
    doc.rect(0, 0, pageWidth, 45, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 22);

    // Subtitle
    if (subtitle) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(subtitle, 14, 32);
    }

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, pageWidth - 14, 22, { align: "right" });

    // Reset text color
    doc.setTextColor(30, 41, 59);

    return 55; // Return Y position after header
}

// Helper to add footer
function addPdfFooter(doc: jsPDF) {
    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
        );
        doc.text(
            "Student Project Management System",
            14,
            pageHeight - 10
        );
    }
}

// ================= GROUP REPORT PDF =================

export function generateGroupReportPDF(group: GroupData): void {
    const doc = new jsPDF();

    let yPos = addPdfHeader(doc, "Group Report", group.title || group.name);

    // Group Info Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 78, 59); // Deep Emerald
    doc.text("Group Information", 14, yPos);
    yPos += 8;

    // Group details table
    const groupDetails = [
        ["Group Name", group.name],
        ["Project Title", group.title || "N/A"],
        ["Project Area", group.area || "N/A"],
        ["Project Type", group.projectType || "N/A"],
        ["Convener", group.convener?.staffname || "N/A"],
        ["Expert", group.expert?.staffname || "N/A"],
    ];

    autoTable(doc, {
        startY: yPos,
        head: [],
        body: groupDetails,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40, textColor: [100, 116, 139] },
            1: { cellWidth: 100 },
        },
        margin: { left: 14 },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    // Description
    if (group.description) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(6, 78, 59); // Deep Emerald
        doc.text("Project Description", 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        const splitDescription = doc.splitTextToSize(group.description, 180);
        doc.text(splitDescription, 14, yPos);
        yPos += splitDescription.length * 5 + 10;
    }

    // Team Members Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 78, 59); // Deep Emerald
    doc.text("Team Members", 14, yPos);
    yPos += 8;

    const memberData = group.members.map((m, index) => [
        (index + 1).toString(),
        m.name || "N/A",
        m.email || "N/A",
        m.phone || "N/A",
        m.cgpa?.toFixed(2) || "N/A",
        m.isLeader ? "✓ Leader" : "Member",
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [["#", "Name", "Email", "Phone", "CGPA", "Role"]],
        body: memberData,
        theme: "striped",
        headStyles: { fillColor: [6, 78, 59], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 10 },
            5: { cellWidth: 25 },
        },
        margin: { left: 14 },
    });

    addPdfFooter(doc);
    doc.save(`Group_Report_${group.name.replace(/\s+/g, "_")}.pdf`);
}

// ================= MEETING REPORT PDF =================

export function generateMeetingReportPDF(meetings: MeetingData[], title: string = "Meeting Report"): void {
    const doc = new jsPDF();

    let yPos = addPdfHeader(doc, title, `Total Meetings: ${meetings.length}`);

    // Summary
    const completed = meetings.filter(m => m.status === "Completed").length;
    const scheduled = meetings.filter(m => m.status === "Scheduled").length;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("Summary", 14, yPos);
    yPos += 8;

    autoTable(doc, {
        startY: yPos,
        head: [],
        body: [
            ["Total Meetings", meetings.length.toString()],
            ["Completed", completed.toString()],
            ["Scheduled", scheduled.toString()],
        ],
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40 },
        },
        margin: { left: 14 },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    // Meetings List
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("Meeting Details", 14, yPos);
    yPos += 8;

    const meetingData = meetings.map((m, index) => [
        (index + 1).toString(),
        new Date(m.datetime).toLocaleDateString("en-IN"),
        new Date(m.datetime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        m.purpose || "N/A",
        m.groupName || "N/A",
        m.location || "N/A",
        m.status || "N/A",
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [["#", "Date", "Time", "Purpose", "Group", "Location", "Status"]],
        body: meetingData,
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 22 },
            2: { cellWidth: 18 },
        },
        margin: { left: 14 },
    });

    addPdfFooter(doc);
    doc.save(`Meeting_Report_${new Date().toISOString().split("T")[0]}.pdf`);
}

// ================= SINGLE MEETING ATTENDANCE PDF =================

export function generateMeetingAttendancePDF(meeting: MeetingData): void {
    const doc = new jsPDF();

    let yPos = addPdfHeader(doc, "Meeting Attendance Report", meeting.purpose || "Meeting Details");

    // Meeting Info
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("Meeting Information", 14, yPos);
    yPos += 8;

    const meetingDetails = [
        ["Group", meeting.groupName || "N/A"],
        ["Project", meeting.projectTitle || "N/A"],
        ["Date", new Date(meeting.datetime).toLocaleDateString("en-IN", { dateStyle: "full" })],
        ["Time", new Date(meeting.datetime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })],
        ["Location", meeting.location || "N/A"],
        ["Status", meeting.status || "N/A"],
    ];

    autoTable(doc, {
        startY: yPos,
        head: [],
        body: meetingDetails,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 35, textColor: [100, 116, 139] },
        },
        margin: { left: 14 },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    // Attendance
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("Attendance Record", 14, yPos);
    yPos += 8;

    const present = meeting.attendees.filter(a => a.present).length;
    const total = meeting.attendees.length;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(`Present: ${present}/${total} (${total > 0 ? Math.round((present / total) * 100) : 0}%)`, 14, yPos);
    yPos += 10;

    const attendanceData = meeting.attendees.map((a, index) => [
        (index + 1).toString(),
        a.name || "N/A",
        a.present ? "✓ Present" : "✗ Absent",
        a.remarks || "-",
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [["#", "Student Name", "Status", "Remarks"]],
        body: attendanceData,
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { cellWidth: 10 },
            2: { cellWidth: 30 },
        },
        didParseCell: (data) => {
            if (data.column.index === 2 && data.section === "body") {
                const cellText = data.cell.raw as string;
                if (cellText.includes("Present")) {
                    data.cell.styles.textColor = [16, 185, 129];
                } else {
                    data.cell.styles.textColor = [239, 68, 68];
                }
            }
        },
        margin: { left: 14 },
    });

    addPdfFooter(doc);
    doc.save(`Attendance_${meeting.groupName?.replace(/\s+/g, "_") || "Meeting"}_${new Date(meeting.datetime).toISOString().split("T")[0]}.pdf`);
}

// ================= COMPREHENSIVE FACULTY REPORT PDF =================

export function generateFacultyReportPDF(reports: ReportData[]): void {
    const doc = new jsPDF();

    const totalMeetings = reports.reduce((sum, r) => sum + r.totalMeetings, 0);
    const completedMeetings = reports.reduce((sum, r) => sum + r.completedMeetings, 0);
    const totalStudents = reports.reduce((sum, r) => sum + r.memberCount, 0);

    let yPos = addPdfHeader(doc, "Faculty Progress Report", `Groups: ${reports.length} | Students: ${totalStudents}`);

    // Overall Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(245, 158, 11);
    doc.text("Overall Summary", 14, yPos);
    yPos += 8;

    autoTable(doc, {
        startY: yPos,
        head: [],
        body: [
            ["Total Groups", reports.length.toString()],
            ["Total Students", totalStudents.toString()],
            ["Total Meetings", totalMeetings.toString()],
            ["Completed Meetings", completedMeetings.toString()],
            ["Completion Rate", `${totalMeetings > 0 ? Math.round((completedMeetings / totalMeetings) * 100) : 0}%`],
        ],
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 45, textColor: [100, 116, 139] },
        },
        margin: { left: 14 },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    // Groups Detail
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(245, 158, 11);
    doc.text("Group-wise Progress", 14, yPos);
    yPos += 8;

    const groupData = reports.map((r, index) => [
        (index + 1).toString(),
        r.groupName,
        r.projectTitle || "N/A",
        r.leaderName || "N/A",
        r.memberCount.toString(),
        r.totalMeetings.toString(),
        r.completedMeetings.toString(),
        `${r.totalMeetings > 0 ? Math.round((r.completedMeetings / r.totalMeetings) * 100) : 0}%`,
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [["#", "Group", "Project", "Leader", "Members", "Total", "Done", "Progress"]],
        body: groupData,
        theme: "striped",
        headStyles: { fillColor: [245, 158, 11], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 30 },
            2: { cellWidth: 35 },
            3: { cellWidth: 25 },
            4: { cellWidth: 18 },
            5: { cellWidth: 15 },
            6: { cellWidth: 15 },
            7: { cellWidth: 20 },
        },
        margin: { left: 14 },
    });

    addPdfFooter(doc);
    doc.save(`Faculty_Report_${new Date().toISOString().split("T")[0]}.pdf`);
}
