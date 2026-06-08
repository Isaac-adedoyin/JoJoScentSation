import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = (file as any).type || 'application/octet-stream';
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mime};base64,${base64}`;

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ success: false, error: 'Cloudinary not configured' }, { status: 500 });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Cloudinary upload starting');
    console.log({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      mime,
      size: buffer.length
    });

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'jojoscentSation/products',
      use_filename: true,
      unique_filename: false,
      resource_type: 'image'
    });

    return NextResponse.json({ success: true, url: uploadResult.secure_url, publicId: uploadResult.public_id });
  } catch (error: any) {
    console.error('Cloudinary upload error FULL:', error);
    console.error('Message:', error?.message);
    console.error('Stack:', error?.stack);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Upload failed'
      },
      { status: 500 }
    );
  }
}
