import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_HOSTS = ["res.cloudinary.com"];

function isAllowedFileUrl(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === "https:" && ALLOWED_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[\\/:*?"<>|\r\n]+/g, "_").trim() || "download";
}

function parseCloudinaryAsset(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    // Expected pattern: /<cloud>/<resource_type>/upload/(transformations/)?v1234/<public_id>.<ext>
    const match = parsed.pathname.match(
      /^\/[^/]+\/(image|video|raw)\/upload\/(?:.*\/)?v\d+\/(.+)\.(\w+)$/i
    );

    if (!match) return null;

    return {
      resourceType: match[1].toLowerCase() as "image" | "video" | "raw",
      publicId: match[2],
      format: match[3].toLowerCase(),
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");
  const filenameParam = request.nextUrl.searchParams.get("filename") || "download";

  if (!urlParam) {
    return NextResponse.json({ error: "Missing file URL" }, { status: 400 });
  }

  if (!isAllowedFileUrl(urlParam)) {
    return NextResponse.json({ error: "File URL is not allowed" }, { status: 400 });
  }

  try {
    const safeName = sanitizeFileName(filenameParam);
    let upstream = await fetch(urlParam, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });

    // Some Cloudinary assets (especially PDFs) are protected and require a signed URL.
    if (upstream.status === 401 || upstream.status === 403) {
      const parsedAsset = parseCloudinaryAsset(urlParam);

      if (parsedAsset) {
        const signedUrl = cloudinary.utils.private_download_url(
          parsedAsset.publicId,
          parsedAsset.format,
          {
            resource_type: parsedAsset.resourceType,
            type: "upload",
            attachment: true,
            expires_at: Math.floor(Date.now() / 1000) + 120,
          }
        );

        upstream = await fetch(signedUrl, {
          method: "GET",
          redirect: "follow",
          cache: "no-store",
        });
      }
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Unable to fetch file from storage (status ${upstream.status})` },
        { status: 502 }
      );
    }

    // const fileBuffer = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Transfer-Encoding": "binary",
        "Content-Disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Download proxy failed:", error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}
