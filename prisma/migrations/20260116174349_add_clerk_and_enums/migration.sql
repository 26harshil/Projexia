-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FACULTY', 'STUDENT');

-- CreateTable
CREATE TABLE "projectgroup" (
    "projectgroupid" SERIAL NOT NULL,
    "projectgroupname" VARCHAR(150) NOT NULL,
    "projecttypeid" INTEGER NOT NULL,
    "guidestaffname" VARCHAR(150),
    "projecttitle" VARCHAR(200),
    "projectarea" VARCHAR(150),
    "projectdescription" TEXT,
    "averagecpi" DECIMAL(4,2),
    "convenerstaffid" INTEGER,
    "expertstaffid" INTEGER,
    "description" TEXT,
    "created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6),

    CONSTRAINT "projectgroup_pkey" PRIMARY KEY ("projectgroupid")
);

-- CreateTable
CREATE TABLE "projectgroupmember" (
    "projectgroupmemberid" SERIAL NOT NULL,
    "projectgroupid" INTEGER NOT NULL,
    "studentid" INTEGER NOT NULL,
    "isgroupleader" BOOLEAN NOT NULL DEFAULT false,
    "studentcgpa" DECIMAL(4,2),
    "description" TEXT,
    "created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6),

    CONSTRAINT "projectgroupmember_pkey" PRIMARY KEY ("projectgroupmemberid")
);

-- CreateTable
CREATE TABLE "projectmeeting" (
    "projectmeetingid" SERIAL NOT NULL,
    "projectgroupid" INTEGER NOT NULL,
    "guidestaffid" INTEGER NOT NULL,
    "meetingdatetime" TIMESTAMP(6) NOT NULL,
    "meetingpurpose" VARCHAR(200),
    "meetinglocation" VARCHAR(150),
    "meetingnotes" TEXT,
    "meetingstatus" VARCHAR(30),
    "meetingstatusdescription" TEXT,
    "meetingstatusdatetime" TIMESTAMP(6),
    "description" TEXT,
    "created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6),

    CONSTRAINT "projectmeeting_pkey" PRIMARY KEY ("projectmeetingid")
);

-- CreateTable
CREATE TABLE "projectmeetingattendance" (
    "projectmeetingattendanceid" SERIAL NOT NULL,
    "projectmeetingid" INTEGER NOT NULL,
    "studentid" INTEGER NOT NULL,
    "ispresent" BOOLEAN NOT NULL,
    "attendanceremarks" VARCHAR(100),
    "description" TEXT,
    "created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6),

    CONSTRAINT "projectmeetingattendance_pkey" PRIMARY KEY ("projectmeetingattendanceid")
);

-- CreateTable
CREATE TABLE "projecttype" (
    "projecttypeid" SERIAL NOT NULL,
    "projecttypename" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6),

    CONSTRAINT "projecttype_pkey" PRIMARY KEY ("projecttypeid")
);

-- CreateTable
CREATE TABLE "staff" (
    "staffid" SERIAL NOT NULL,
    "staffname" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(150),
    "description" TEXT,
    "created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6),
    "userid" INTEGER,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("staffid")
);

-- CreateTable
CREATE TABLE "student" (
    "studentid" SERIAL NOT NULL,
    "studentname" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(150),
    "description" TEXT,
    "created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6),
    "userid" INTEGER,

    CONSTRAINT "student_pkey" PRIMARY KEY ("studentid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "clerkid" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "isactive" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_group_student" ON "projectgroupmember"("projectgroupid", "studentid");

-- CreateIndex
CREATE UNIQUE INDEX "uq_meeting_student" ON "projectmeetingattendance"("projectmeetingid", "studentid");

-- CreateIndex
CREATE UNIQUE INDEX "projecttype_projecttypename_key" ON "projecttype"("projecttypename");

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_userid_key" ON "staff"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_userid_key" ON "student"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkid_key" ON "users"("clerkid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "projectgroup" ADD CONSTRAINT "fk_convener" FOREIGN KEY ("convenerstaffid") REFERENCES "staff"("staffid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectgroup" ADD CONSTRAINT "fk_expert" FOREIGN KEY ("expertstaffid") REFERENCES "staff"("staffid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectgroup" ADD CONSTRAINT "fk_projecttype" FOREIGN KEY ("projecttypeid") REFERENCES "projecttype"("projecttypeid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectgroupmember" ADD CONSTRAINT "fk_group" FOREIGN KEY ("projectgroupid") REFERENCES "projectgroup"("projectgroupid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectgroupmember" ADD CONSTRAINT "fk_student" FOREIGN KEY ("studentid") REFERENCES "student"("studentid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectmeeting" ADD CONSTRAINT "fk_meeting_group" FOREIGN KEY ("projectgroupid") REFERENCES "projectgroup"("projectgroupid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectmeeting" ADD CONSTRAINT "fk_meeting_guide" FOREIGN KEY ("guidestaffid") REFERENCES "staff"("staffid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectmeetingattendance" ADD CONSTRAINT "fk_attendance_meeting" FOREIGN KEY ("projectmeetingid") REFERENCES "projectmeeting"("projectmeetingid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectmeetingattendance" ADD CONSTRAINT "fk_attendance_student" FOREIGN KEY ("studentid") REFERENCES "student"("studentid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE SET NULL ON UPDATE CASCADE;
