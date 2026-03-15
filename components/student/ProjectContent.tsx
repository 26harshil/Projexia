'use client';

import { motion } from "framer-motion";
import { 
  FolderKanban, 
  Search,
  Filter,
  LayoutGrid,
  List,
  Users,
  MapPin,
  Calendar,
  Award,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  createdAt: string;
  members: Member[];
}

interface ProjectContentProps {
  projectGroups: any[];
  error: string | null;
}

export default function ProjectContent({ projectGroups, error }: ProjectContentProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-blue-500/15 text-cyan-400';
      case 'completed':
        return 'bg-blue-500/15 text-blue-700';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-white/5 text-slate-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#050A14]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-[#050A14] to-[#050A14] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            My{" "}
            <span className="bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-slate-500">Manage and track your project progress</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10 bg-white border-blue-500/20 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-blue-500/20">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="icon" className="border-blue-500/20">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-blue-500/20">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 rounded-2xl border border-red-500/20 p-6 text-center mb-8"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Projects List or Empty State */}
        {projectGroups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 p-12 shadow-sm text-center"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block"
            >
              <div className="bg-linear-to-br from-purple-50 to-pink-50 p-8 rounded-2xl mb-6">
                <FolderKanban className="h-20 w-20 text-purple-300 mx-auto" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              You haven&apos;t been assigned to any projects yet. Contact your faculty or wait for project assignments.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {projectGroups.map((group: any, index: number) => (
              <motion.div
                key={group.projectGroup.groupId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow border-blue-500/15">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-white">
                          {group.projectGroup.projectTitle}
                        </h2>
                        <Badge className={getStatusColor(group.projectGroup.projectStatus)}>
                          {group.projectGroup.projectStatus}
                        </Badge>
                        {group.isGroupLeader && (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <Award className="h-3 w-3 mr-1" />
                            Group Leader
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-300 mb-3">{group.projectGroup.projectDescription}</p>
                      
                      {/* Project Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                        {group.projectGroup.projectArea && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-purple-600" />
                            {group.projectGroup.projectArea}
                          </div>
                        )}
                        {group.projectGroup.projectType && (
                          <div className="flex items-center gap-1">
                            <FolderKanban className="h-4 w-4 text-purple-600" />
                            {group.projectGroup.projectType}
                          </div>
                        )}
                        {group.projectGroup.averageCPI && (
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-purple-600" />
                            Avg CPI: {group.projectGroup.averageCPI}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          Created {new Date(group.projectGroup.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guide Faculty */}
                  {group.projectGroup.guideFaculty && (
                    <div className="mb-6 pb-6 border-b border-blue-500/20">
                      <h3 className="text-sm font-semibold text-slate-200 mb-2">Guide Faculty</h3>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                            {getInitials(group.projectGroup.guideFaculty)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">{group.projectGroup.guideFaculty}</p>
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

                  {/* Team Members */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Members ({group.projectGroup.members.length})
                    </h3>
                    <div className="space-y-3">
                      {group.projectGroup.members.map((member: any) => (
                        <div 
                          key={member.memberId}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-linear-to-br from-purple-100 to-pink-100 text-slate-200 text-sm font-medium">
                                {getInitials(member.studentName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {member.studentName}
                                {member.isLeader && <span className="ml-2 text-xs font-semibold text-yellow-600">(Leader)</span>}
                              </p>
                              <p className="text-xs text-slate-500 truncate">{member.studentEmail}</p>
                            </div>
                          </div>
                          {member.studentPhone && (
                            <p className="text-xs text-slate-500 ml-2">{member.studentPhone}</p>
                          )}
                        </div>
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