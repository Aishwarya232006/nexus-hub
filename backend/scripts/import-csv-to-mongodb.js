const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
require('dotenv').config();

const Listing = require('../modules/listings/listings-model');

async function importCSVToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing listings (optional)
    await Listing.deleteMany({});
    console.log('Cleared existing listings');
    
    const csvFilePath = path.join(__dirname, '../data/freelancer_earnings_bd.csv');
    const records = [];
    
    // Read CSV file
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => records.push(data))
      .on('end', async () => {
        console.log(`Read ${records.length} records from CSV`);
        
        // Transform and import as Listings
        const listings = records.map(record => ({
          freelancerId: record.Freelancer_ID,
          jobCategory: record.Job_Category,
          platform: record.Platform,
          experienceLevel: record.Experience_Level,
          clientRegion: record.Client_Region,
          paymentMethod: record.Payment_Method,
          jobsCompleted: parseInt(record.Job_Completed) || 0,
          earningsUSD: parseFloat(record.Earnings_USD) || 0,
          hourlyRate: parseFloat(record.Hourly_Rate) || 0,
          jobSuccessRate: parseFloat(record.Job_Success_Rate) || 0,
          clientRating: parseFloat(record.Client_Rating) || 0,
          jobDurationDays: parseInt(record.Job_Duration_Days) || 0,
          projectType: record.Project_Type,
          rehireRate: parseFloat(record.Rehire_Rate) || 0,
          marketingSpend: parseFloat(record.Marketing_Spend) || 0,
          createdBy: null // No owner for imported data
        }));
        
        await Listing.insertMany(listings);
        console.log(`Imported ${listings.length} listings to MongoDB`);
        
        mongoose.disconnect();
        console.log('Import completed! Visit http://localhost:5000/listings to see data');
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        mongoose.disconnect();
      });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

importCSVToMongoDB();
