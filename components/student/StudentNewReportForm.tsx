'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  createProjectFile,
  createReport,
  getCurrentStudentProjectGroups,
} from '@/app/actions/reportActions';
import { Upload, X } from 'lucide-react';

interface ProjectGroup {
  projectgroupid: number;
  projectgroupname: string;
}

export function StudentNewReportForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);
  const [formData, setFormData] = useState({
    reporttitle: '',
    reporttype: 'proposal',
    projectgroupid: '',
  });

  // Fetch project groups on mount
  const fetchProjectGroups = async () => {
    try {
      const groups = await getCurrentStudentProjectGroups();
      setProjectGroups(groups as ProjectGroup[]);
    } catch (error) {
      console.error('Error fetching project groups:', error);
    }
  };

  useEffect(() => {
    fetchProjectGroups();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploadProgress(0);
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setFileUrl(data.secure_url);
        }
      });

      xhr.addEventListener('error', () => {
        alert('Upload failed');
        setFile(null);
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formDataToSend);
    } catch (error) {
      console.error('Error uploading file:', error);
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reporttitle) {
      alert('Please enter a report title');
      return;
    }

    if (!formData.projectgroupid) {
      alert('Please select a project group');
      return;
    }

    if (file && !fileUrl) {
      alert('Please complete file upload before submitting');
      return;
    }

    try {
      setLoading(true);

      // Get file ID if file was uploaded
      let fileId: number | undefined;
      if (fileUrl) {
        const fileData = await createProjectFile({
          filename: file!.name,
          fileurl: fileUrl,
          filetype: file!.type,
          filesize: file!.size,
          projectgroupid: parseInt(formData.projectgroupid),
        });
        fileId = fileData.fileid;
      }

      // Create report
      await createReport({
        fileid: fileId,
        projectgroupid: parseInt(formData.projectgroupid),
        reporttitle: formData.reporttitle,
        reporttype: formData.reporttype,
      });

      // Redirect to reports page
      router.push('/student/reports');
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to create report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Submit New Report</CardTitle>
            <CardDescription>
              Upload your project report with status tracking
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Report Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Project Proposal - AI Chatbot"
                  value={formData.reporttitle}
                  onChange={(e) =>
                    setFormData({ ...formData, reporttitle: e.target.value })
                  }
                  required
                />
              </div>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={formData.reporttype}
                  onChange={(e) =>
                    setFormData({ ...formData, reporttype: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="proposal">Proposal</option>
                  <option value="midterm">Mid-Term Report</option>
                  <option value="final">Final Report</option>
                </select>
              </div>

              {/* Project Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Group
                </label>
                <select
                  value={formData.projectgroupid}
                  onChange={(e) =>
                    setFormData({ ...formData, projectgroupid: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a project group</option>
                  {projectGroups.map((group) => (
                    <option key={group.projectgroupid} value={group.projectgroupid}>
                      {group.projectgroupname}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach File (PDF, Image, or Document)
                </label>

                {!file ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <label className="cursor-pointer block">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Click to upload or drag and drop
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, PNG, JPG, DOC up to 50MB
                      </p>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFileUrl(null);
                          setUploadProgress(0);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {!fileUrl && (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={uploadFile}
                          disabled={uploadProgress > 0 && uploadProgress < 100}
                          className="w-full"
                        >
                          {uploadProgress === 0
                            ? 'Upload File'
                            : uploadProgress === 100
                              ? 'Upload Complete'
                              : `Uploading... ${Math.round(uploadProgress)}%`}
                        </Button>
                      </>
                    )}

                    {fileUrl && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                        ✓ File uploaded successfully
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                Initial status is set to Pending review by faculty by default.
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
