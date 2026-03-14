'use client';

import { motion } from "framer-motion";
import { 
  Users, 
  Mail,
  Phone,
  Award,
  MapPin,
  Calendar,
  Crown
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Member {
  memberId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  isLeader: boolean;
  cgpa?: string;
  joinedAt: string;
}

interface ProjectGroup {
  groupId: number;
  groupName: string;
  projectTitle: string;
  projectArea?: string;
  projectDescription?: string;
  averageCPI?: string;
  projectStatus: string;
  projectType?: string;
  guideFaculty?: string;
  guideFacultyEmail?: string;
  expertFaculty?: string;
  createdAt: string;
  members: Member[];
}

interface GroupProps {
  projectGroups: any[];
  error: string | null;
}

export default function GroupContent({ projectGroups, error }: GroupProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Filter to show only groups where the user is the leader
  const leaderGroups = projectGroups.filter((group: any) => group.isGroupLeader);

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-pink-100/40 via-white to-white pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            My{" "}
            <span className="bg-linear-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              Groups
            </span>
          </h1>
          <p className="text-slate-500">Manage and lead your project teams</p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 rounded-2xl border border-red-100 p-6 text-center mb-8"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Groups or Empty State */}
        {leaderGroups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              <div className="bg-linear-to-br from-pink-50 to-rose-50 p-8 rounded-2xl mb-6">
                <Users className="h-20 w-20 text-pink-300 mx-auto" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Groups to Lead</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              You are not the leader of any project groups. Once you become a group leader, you can manage your team here.
            </p>
            
            {/* Placeholder Team Avatars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Avatar className="h-12 w-12 border-2 border-dashed border-slate-200">
                    <AvatarFallback className="bg-slate-50 text-slate-300">?</AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {leaderGroups.map((group: any, index: number) => (
              <motion.div
                key={group.projectGroup.groupId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow border-slate-100">
                  {/* Header */}
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                          {group.projectGroup.groupName}
                        </h2>
                        <p className="text-slate-600 text-sm mb-3">
                          {group.projectGroup.projectTitle}
                        </p>
                      </div>
                      <Badge className={getStatusColor(group.projectGroup.projectStatus)}>
                        {group.projectGroup.projectStatus}
                      </Badge>
                    </div>
                    
                    {/* Project Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      {group.projectGroup.projectArea && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-pink-600" />
                          {group.projectGroup.projectArea}
                        </div>
                      )}
                      {group.projectGroup.projectType && (
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-pink-600" />
                          {group.projectGroup.projectType}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-pink-600" />
                        Formed {new Date(group.projectGroup.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Guide Faculty Info */}
                  {group.projectGroup.guideFaculty && (
                    <div className="mb-6 pb-6 border-b border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">Guide Faculty</h3>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-pink-100 text-pink-700 font-medium">
                            {getInitials(group.projectGroup.guideFaculty)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{group.projectGroup.guideFaculty}</p>
                          {group.projectGroup.guideFacultyEmail && (
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {group.projectGroup.guideFacultyEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team Members Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Members ({group.projectGroup.members.length})
                    </h3>
                    
                    <div className="space-y-3">
                      {group.projectGroup.members.map((member: any) => (
                        <motion.div 
                          key={member.memberId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-linear-to-r from-slate-50 to-slate-50 rounded-lg hover:shadow-md transition-shadow border border-slate-100"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Avatar className="h-12 w-12 shrink-0">
                              <AvatarFallback className="bg-linear-to-br from-pink-100 to-rose-100 text-slate-700 font-semibold">
                                {getInitials(member.studentName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                  {member.studentName}
                                </p>
                                {member.isLeader && (
                                  <Badge className="bg-yellow-100 text-yellow-700 text-xs whitespace-nowrap">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Leader
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 truncate">{member.studentEmail}</p>
                            </div>
                          </div>

                          {/* Contact Info Column */}
                          <div className="ml-4 flex items-center gap-3 text-slate-600 text-xs shrink-0">
                            {member.studentPhone && (
                              <a 
                                href={`tel:${member.studentPhone}`}
                                className="flex items-center gap-1 hover:text-pink-600 transition-colors"
                              >
                                <Phone className="h-3 w-3" />
                                <span className="hidden sm:inline">{member.studentPhone}</span>
                              </a>
                            )}
                            <a 
                              href={`mailto:${member.studentEmail}`}
                              className="flex items-center gap-1 hover:text-pink-600 transition-colors"
                            >
                              <Mail className="h-3 w-3" />
                              <span className="hidden sm:inline">Email</span>
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
