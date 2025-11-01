import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pincode: string }> }
) {
  try {
    const { pincode } = await params;

    // Validate pincode format (6 digits)
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: 'Invalid pincode. Must be 6 digits.' },
        { status: 400 }
      );
    }

    // Call Indian Postal API
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from postal API');
    }

    const data = await response.json();

    // Check if API returned valid data
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data found for this pincode' },
        { status: 404 }
      );
    }

    const postOfficeData = data[0];
    
    // Check if the status is success and data exists
    if (postOfficeData.Status !== 'Success' || !postOfficeData.PostOffice) {
      return NextResponse.json(
        { error: 'Invalid pincode or no data available' },
        { status: 404 }
      );
    }

    // Extract city and state from the first post office
    const postOffice = postOfficeData.PostOffice[0];
    const city = postOffice.District || postOffice.Name;
    const state = postOffice.State;

    return NextResponse.json({
      pincode,
      city,
      state,
      district: postOffice.District,
      postOffice: postOffice.Name,
      success: true
    });

  } catch {
    return NextResponse.json(
      { error: 'Failed to lookup pincode. Please try again.' },
      { status: 500 }
    );
  }
}